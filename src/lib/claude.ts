import Anthropic from "@anthropic-ai/sdk";

if (!process.env.ANTHROPIC_API_KEY) {
  throw new Error("ANTHROPIC_API_KEY não definida no .env");
}

export const claude = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export const DEFAULT_MODEL = "claude-opus-4-6";

export const DEFAULT_SYSTEM = `Você é um assistente de IA da Gowagency.
Seja direto, útil e profissional. Responda sempre no idioma do usuário.`;
