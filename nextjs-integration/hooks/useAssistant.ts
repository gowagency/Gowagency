"use client";

import { useState, useCallback } from "react";

export interface Message {
  role: "user" | "assistant";
  content: string;
}

interface UseAssistantReturn {
  messages:  Message[];
  isLoading: boolean;
  error:     string | null;
  send:      (text: string) => Promise<void>;
  clear:     () => void;
}

/**
 * Hook que gerencia o chat com o assistente de IA.
 * Cuida do streaming, do histórico e dos estados de loading/erro.
 *
 * Uso:
 *   const { messages, isLoading, send } = useAssistant();
 */
export function useAssistant(): UseAssistantReturn {
  const [messages, setMessages]   = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError]         = useState<string | null>(null);

  // Histórico no formato que a API espera (multi-turn)
  const [history, setHistory] = useState<{ role: string; content: string }[]>([]);

  const send = useCallback(async (text: string) => {
    if (!text.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);

    // Adiciona a mensagem do usuário imediatamente
    setMessages(prev => [...prev, { role: "user", content: text }]);

    // Reserva espaço para a resposta da IA (será preenchida via streaming)
    setMessages(prev => [...prev, { role: "assistant", content: "" }]);

    try {
      const response = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, history }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error ?? "Erro na requisição");
      }

      const reader  = response.body!.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n").filter(l => l.startsWith("data: "));

        for (const line of lines) {
          const data = JSON.parse(line.slice(6)); // remove "data: "

          if (data.error) throw new Error(data.error);

          if (data.text) {
            // Acumula o texto no último bubble (assistente)
            setMessages(prev => {
              const updated = [...prev];
              updated[updated.length - 1] = {
                role:    "assistant",
                content: updated[updated.length - 1].content + data.text,
              };
              return updated;
            });
          }

          if (data.done && data.history) {
            setHistory(data.history);
          }
        }
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erro desconhecido";
      setError(msg);
      // Remove o bubble vazio da IA em caso de erro
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  }, [history, isLoading]);

  const clear = useCallback(() => {
    setMessages([]);
    setHistory([]);
    setError(null);
  }, []);

  return { messages, isLoading, error, send, clear };
}
