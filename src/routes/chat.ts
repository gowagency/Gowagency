import { Router, Request, Response } from "express";
import Anthropic from "@anthropic-ai/sdk";
import { claude, DEFAULT_MODEL, DEFAULT_SYSTEM } from "../lib/claude";

const router = Router();

/**
 * POST /api/chat
 * Envio de mensagem e resposta completa (sem streaming).
 *
 * Body:
 *   messages: { role: "user" | "assistant", content: string }[]
 *   system?:  string  (sobrescreve o system prompt padrão)
 *   model?:   string  (ex: "claude-opus-4-6")
 */
router.post("/", async (req: Request, res: Response) => {
  const { messages, system, model } = req.body as {
    messages: Anthropic.MessageParam[];
    system?: string;
    model?: string;
  };

  if (!Array.isArray(messages) || messages.length === 0) {
    res.status(400).json({ error: "Campo 'messages' é obrigatório." });
    return;
  }

  try {
    const response = await claude.messages.create({
      model: model ?? DEFAULT_MODEL,
      max_tokens: 4096,
      system: system ?? DEFAULT_SYSTEM,
      messages,
    });

    const text = response.content
      .filter((b): b is Anthropic.TextBlock => b.type === "text")
      .map((b) => b.text)
      .join("");

    res.json({
      text,
      usage: response.usage,
      stop_reason: response.stop_reason,
    });
  } catch (err) {
    if (err instanceof Anthropic.AuthenticationError) {
      res.status(401).json({ error: "ANTHROPIC_API_KEY inválida." });
    } else if (err instanceof Anthropic.RateLimitError) {
      res.status(429).json({ error: "Limite de requisições atingido. Tente novamente em breve." });
    } else if (err instanceof Anthropic.APIError) {
      res.status(502).json({ error: `Erro na API: ${err.message}` });
    } else {
      res.status(500).json({ error: "Erro interno do servidor." });
    }
  }
});

/**
 * POST /api/chat/stream
 * Mesma coisa, mas com streaming via Server-Sent Events (SSE).
 * Ideal para mostrar respostas token a token no frontend.
 */
router.post("/stream", async (req: Request, res: Response) => {
  const { messages, system, model } = req.body as {
    messages: Anthropic.MessageParam[];
    system?: string;
    model?: string;
  };

  if (!Array.isArray(messages) || messages.length === 0) {
    res.status(400).json({ error: "Campo 'messages' é obrigatório." });
    return;
  }

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  try {
    const stream = claude.messages.stream({
      model: model ?? DEFAULT_MODEL,
      max_tokens: 4096,
      system: system ?? DEFAULT_SYSTEM,
      messages,
    });

    for await (const event of stream) {
      if (
        event.type === "content_block_delta" &&
        event.delta.type === "text_delta"
      ) {
        res.write(`data: ${JSON.stringify({ text: event.delta.text })}\n\n`);
      }
    }

    const final = await stream.finalMessage();
    res.write(`data: ${JSON.stringify({ done: true, usage: final.usage })}\n\n`);
  } catch (err) {
    const message =
      err instanceof Anthropic.APIError ? err.message : "Erro interno";
    res.write(`data: ${JSON.stringify({ error: message })}\n\n`);
  } finally {
    res.end();
  }
});

export default router;
