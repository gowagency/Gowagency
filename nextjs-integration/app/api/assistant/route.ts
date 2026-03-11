import { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { db } from "@/lib/db";
// import { getServerSession } from "next-auth"; // descomente quando tiver auth

const claude = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

/**
 * POST /api/assistant
 *
 * Recebe a pergunta do usuário, busca os dados reais do PostgreSQL,
 * injeta no Claude e retorna a resposta via streaming (SSE).
 *
 * Body: { message: string, history?: MessageParam[] }
 */
export async function POST(req: NextRequest) {
  const { message, history = [] } = await req.json();

  if (!message) {
    return Response.json({ error: "message é obrigatório" }, { status: 400 });
  }

  // ─── 1. Identifica o usuário logado ───────────────────────────────────────
  // const session = await getServerSession();
  // if (!session) return Response.json({ error: "Não autenticado" }, { status: 401 });
  // const userId = session.user.id;
  const userId = 1; // substitua pelo id real do usuário logado

  // ─── 2. Busca dados reais do PostgreSQL ───────────────────────────────────
  // Adapte os nomes das tabelas/colunas conforme o seu banco.
  const [
    { rows: clients },
    { rows: tasks },
    { rows: payments },
  ] = await Promise.all([
    db.query(
      `SELECT id, name, email, status
       FROM clients
       WHERE user_id = $1
       ORDER BY name`,
      [userId],
    ),
    db.query(
      `SELECT t.id, t.title, t.status, t.due_date,
              c.name AS client
       FROM tasks t
       LEFT JOIN clients c ON c.id = t.client_id
       WHERE t.user_id = $1
       ORDER BY t.due_date ASC NULLS LAST`,
      [userId],
    ),
    db.query(
      `SELECT p.id, p.amount, p.status, p.due_date,
              c.name AS client
       FROM payments p
       LEFT JOIN clients c ON c.id = p.client_id
       WHERE p.user_id = $1
       ORDER BY p.due_date ASC NULLS LAST`,
      [userId],
    ),
  ]);

  // ─── 3. Monta o system prompt com os dados ────────────────────────────────
  const system = buildSystemPrompt({ clients, tasks, payments });

  // ─── 4. Chama o Claude com streaming ─────────────────────────────────────
  const messages: Anthropic.MessageParam[] = [
    ...history,
    { role: "user", content: message },
  ];

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      let fullText = "";

      try {
        const claudeStream = claude.messages.stream({
          model: "claude-opus-4-6",
          max_tokens: 2048,
          system,
          messages,
        });

        for await (const event of claudeStream) {
          if (
            event.type === "content_block_delta" &&
            event.delta.type === "text_delta"
          ) {
            fullText += event.delta.text;
            const chunk = `data: ${JSON.stringify({ text: event.delta.text })}\n\n`;
            controller.enqueue(encoder.encode(chunk));
          }
        }

        // Envia o histórico atualizado para o frontend manter o contexto
        const updatedHistory: Anthropic.MessageParam[] = [
          ...history,
          { role: "user",      content: message },
          { role: "assistant", content: fullText },
        ];
        const done = `data: ${JSON.stringify({ done: true, history: updatedHistory })}\n\n`;
        controller.enqueue(encoder.encode(done));
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Erro interno";
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: msg })}\n\n`));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type":  "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection":    "keep-alive",
    },
  });
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

type Client  = { id: string; name: string; status?: string | null; email?: string | null };
type Task    = { id: string; title: string; client?: string | null; status: string; due_date?: string | null };
type Payment = { id: string; client: string; amount: number; status: string; due_date?: string | null };

function buildSystemPrompt({ clients, tasks, payments }: {
  clients:  Client[];
  tasks:    Task[];
  payments: Payment[];
}): string {
  const lines = [
    "Você é o assistente de IA da Gowagency.",
    "Responda de forma direta e em português. Use os dados abaixo para responder.",
    "",
    "## CLIENTES",
    ...clients.map(c =>
      `- ${c.name} (ID: ${c.id}) | Status: ${c.status ?? "?"} | Email: ${c.email ?? "não informado"}`
    ),
    "",
    "## TAREFAS NO KANBAN",
    ...tasks.map(t => {
      const due    = t.due_date ? ` | Prazo: ${t.due_date}` : "";
      const client = t.client   ? ` | Cliente: ${t.client}` : "";
      return `- [${t.status.toUpperCase()}] ${t.title}${client}${due}`;
    }),
    "",
    "## PAGAMENTOS",
    ...payments.map(p => {
      const due = p.due_date ? ` | Vencimento: ${p.due_date}` : "";
      return `- ${p.client}: R$ ${p.amount.toFixed(2)} | ${p.status}${due}`;
    }),
  ];

  return lines.join("\n");
}
