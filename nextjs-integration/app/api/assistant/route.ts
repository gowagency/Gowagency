import { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
// import { db } from "@/lib/db"; // seu cliente PostgreSQL (ex: Drizzle, Prisma, pg)
// import { getServerSession } from "next-auth"; // ou seu sistema de autenticação

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
  // Descomente quando tiver autenticação configurada:
  // const session = await getServerSession();
  // if (!session) return Response.json({ error: "Não autenticado" }, { status: 401 });
  // const userId = session.user.id;
  const userId = "demo"; // remova quando tiver auth real

  // ─── 2. Busca dados reais do PostgreSQL ───────────────────────────────────
  // Substitua pelas queries reais do seu banco.
  // Exemplo com Prisma:
  //
  // const [clients, tasks, payments] = await Promise.all([
  //   db.client.findMany({ where: { userId } }),
  //   db.task.findMany({ where: { userId }, orderBy: { dueDate: "asc" } }),
  //   db.payment.findMany({ where: { userId }, orderBy: { dueDate: "asc" } }),
  // ]);
  //
  // Exemplo com pg (raw SQL):
  //
  // const { rows: clients }  = await db.query("SELECT * FROM clients WHERE user_id = $1", [userId]);
  // const { rows: tasks }    = await db.query("SELECT * FROM tasks WHERE user_id = $1 ORDER BY due_date", [userId]);
  // const { rows: payments } = await db.query("SELECT * FROM payments WHERE user_id = $1 ORDER BY due_date", [userId]);

  // Dados de exemplo — substitua pelo código acima
  const clients = [
    { id: "1", name: "Empresa Alpha", status: "ativo",   email: "alpha@empresa.com" },
    { id: "2", name: "Beta Ltda",     status: "ativo",   email: "beta@ltda.com" },
    { id: "3", name: "Gama Corp",     status: "inativo", email: null },
  ];
  const tasks = [
    { id: "t1", title: "Criar proposta comercial", client: "Empresa Alpha", status: "a fazer",        due_date: "2026-03-12" },
    { id: "t2", title: "Reunião de kickoff",        client: "Beta Ltda",     status: "em andamento",  due_date: null },
    { id: "t3", title: "Enviar relatório mensal",   client: "Empresa Alpha", status: "a fazer",        due_date: "2026-03-15" },
  ];
  const payments = [
    { id: "p1", client: "Empresa Alpha", amount: 3500, status: "pago",     due_date: "2026-03-01" },
    { id: "p2", client: "Beta Ltda",     amount: 1200, status: "atrasado", due_date: "2026-02-28" },
    { id: "p3", client: "Gama Corp",     amount: 800,  status: "pendente", due_date: "2026-03-20" },
  ];

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
