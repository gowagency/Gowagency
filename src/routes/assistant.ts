import { Router, Request, Response } from "express";
import Anthropic from "@anthropic-ai/sdk";
import { claude, DEFAULT_MODEL } from "../lib/claude";

const router = Router();

// Tipos que representam os dados do seu SaaS
interface Client {
  id: string;
  name: string;
  email?: string;
  status?: string; // ex: "ativo", "inativo"
}

interface Task {
  id: string;
  title: string;
  client?: string;
  status: string; // ex: "a fazer", "em andamento", "concluído"
  due_date?: string;
}

interface Payment {
  id: string;
  client: string;
  amount: number;
  status: string; // ex: "pago", "pendente", "atrasado"
  due_date?: string;
}

interface SaasContext {
  clients?: Client[];
  tasks?: Task[];
  payments?: Payment[];
  current_user?: string; // nome do usuário logado
}

/**
 * Constrói o system prompt com os dados reais do SaaS.
 * O truque é injetar o contexto do usuário aqui — a IA passa a
 * "conhecer" os dados do sistema sem precisar de integrações complexas.
 */
function buildSystemPrompt(context: SaasContext): string {
  const lines: string[] = [
    `Você é o assistente de IA da Gowagency, ajudando ${context.current_user ?? "o usuário"}.`,
    "Responda de forma direta, clara e em português.",
    "Use os dados abaixo para responder perguntas sobre clientes, tarefas e pagamentos.",
    "Se não souber algo ou os dados não cobrirem a pergunta, diga isso claramente.",
    "",
  ];

  if (context.clients && context.clients.length > 0) {
    lines.push("## CLIENTES");
    for (const c of context.clients) {
      lines.push(`- ${c.name} (ID: ${c.id}) | Status: ${c.status ?? "não informado"} | Email: ${c.email ?? "não informado"}`);
    }
    lines.push("");
  }

  if (context.tasks && context.tasks.length > 0) {
    lines.push("## TAREFAS NO KANBAN");
    for (const t of context.tasks) {
      const due = t.due_date ? ` | Prazo: ${t.due_date}` : "";
      const client = t.client ? ` | Cliente: ${t.client}` : "";
      lines.push(`- [${t.status.toUpperCase()}] ${t.title}${client}${due}`);
    }
    lines.push("");
  }

  if (context.payments && context.payments.length > 0) {
    lines.push("## PAGAMENTOS E RECEBIMENTOS");
    for (const p of context.payments) {
      const due = p.due_date ? ` | Vencimento: ${p.due_date}` : "";
      lines.push(`- ${p.client}: R$ ${p.amount.toFixed(2)} | Status: ${p.status}${due}`);
    }
    lines.push("");
  }

  return lines.join("\n");
}

/**
 * POST /api/assistant
 * Chat com contexto — recebe os dados do SaaS e responde sobre eles.
 *
 * Body:
 *   message:  string           (pergunta do usuário)
 *   context:  SaasContext      (dados do sistema para contextualizar a IA)
 *   history?: MessageParam[]   (histórico da conversa, para multi-turn)
 */
router.post("/", async (req: Request, res: Response) => {
  const { message, context, history } = req.body as {
    message: string;
    context: SaasContext;
    history?: Anthropic.MessageParam[];
  };

  if (!message || typeof message !== "string") {
    res.status(400).json({ error: "Campo 'message' é obrigatório." });
    return;
  }

  const messages: Anthropic.MessageParam[] = [
    ...(history ?? []),
    { role: "user", content: message },
  ];

  try {
    const response = await claude.messages.create({
      model: DEFAULT_MODEL,
      max_tokens: 2048,
      system: buildSystemPrompt(context ?? {}),
      messages,
    });

    const text = response.content
      .filter((b): b is Anthropic.TextBlock => b.type === "text")
      .map((b) => b.text)
      .join("");

    res.json({
      text,
      // Retorna o histórico atualizado para o frontend manter a conversa
      history: [
        ...(history ?? []),
        { role: "user", content: message },
        { role: "assistant", content: text },
      ],
    });
  } catch (err) {
    if (err instanceof Anthropic.AuthenticationError) {
      res.status(401).json({ error: "ANTHROPIC_API_KEY inválida." });
    } else if (err instanceof Anthropic.RateLimitError) {
      res.status(429).json({ error: "Limite de requisições atingido." });
    } else if (err instanceof Anthropic.APIError) {
      res.status(502).json({ error: `Erro na API: ${err.message}` });
    } else {
      res.status(500).json({ error: "Erro interno do servidor." });
    }
  }
});

/**
 * POST /api/assistant/stream
 * Mesma coisa, com streaming SSE (resposta token a token).
 */
router.post("/stream", async (req: Request, res: Response) => {
  const { message, context, history } = req.body as {
    message: string;
    context: SaasContext;
    history?: Anthropic.MessageParam[];
  };

  if (!message || typeof message !== "string") {
    res.status(400).json({ error: "Campo 'message' é obrigatório." });
    return;
  }

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  const messages: Anthropic.MessageParam[] = [
    ...(history ?? []),
    { role: "user", content: message },
  ];

  try {
    const stream = claude.messages.stream({
      model: DEFAULT_MODEL,
      max_tokens: 2048,
      system: buildSystemPrompt(context ?? {}),
      messages,
    });

    let fullText = "";

    for await (const event of stream) {
      if (
        event.type === "content_block_delta" &&
        event.delta.type === "text_delta"
      ) {
        fullText += event.delta.text;
        res.write(`data: ${JSON.stringify({ text: event.delta.text })}\n\n`);
      }
    }

    // Envia o histórico atualizado ao final do stream
    const updatedHistory: Anthropic.MessageParam[] = [
      ...(history ?? []),
      { role: "user", content: message },
      { role: "assistant", content: fullText },
    ];

    res.write(`data: ${JSON.stringify({ done: true, history: updatedHistory })}\n\n`);
  } catch (err) {
    const message =
      err instanceof Anthropic.APIError ? err.message : "Erro interno";
    res.write(`data: ${JSON.stringify({ error: message })}\n\n`);
  } finally {
    res.end();
  }
});

export default router;
