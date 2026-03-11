"use client";

import { useState, useRef, useEffect } from "react";
import { useAssistant } from "@/hooks/useAssistant";

const SUGGESTIONS = [
  "Quais pagamentos estão em atraso?",
  "O que preciso fazer hoje?",
  "Resumo dos meus clientes",
  "Qual cliente tem mais tarefas pendentes?",
];

/**
 * Componente de chat flutuante com o assistente de IA.
 * Pode ser adicionado em qualquer página do seu SaaS.
 *
 * Uso:
 *   import { AiAssistant } from "@/components/AiAssistant";
 *   <AiAssistant />
 */
export function AiAssistant() {
  const [open, setOpen]     = useState(false);
  const [input, setInput]   = useState("");
  const { messages, isLoading, error, send, clear } = useAssistant();
  const bottomRef = useRef<HTMLDivElement>(null);

  // Scroll automático para a última mensagem
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function handleSend() {
    if (!input.trim()) return;
    send(input.trim());
    setInput("");
  }

  return (
    <>
      {/* Botão flutuante */}
      <button
        onClick={() => setOpen(o => !o)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition-colors"
        aria-label="Abrir assistente de IA"
      >
        {open ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        )}
      </button>

      {/* Painel do chat */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 flex w-96 flex-col rounded-2xl bg-white shadow-2xl border border-gray-100 overflow-hidden"
             style={{ height: "520px" }}>

          {/* Header */}
          <div className="flex items-center justify-between bg-blue-600 px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-400" />
              <span className="text-sm font-semibold text-white">Assistente Gowagency</span>
            </div>
            <button onClick={clear} className="text-xs text-blue-200 hover:text-white">
              Limpar
            </button>
          </div>

          {/* Mensagens */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.length === 0 && (
              <>
                <p className="text-center text-sm text-gray-400 mt-4">
                  Olá! Pergunte sobre seus clientes, tarefas ou pagamentos.
                </p>
                <div className="flex flex-wrap gap-2 justify-center mt-3">
                  {SUGGESTIONS.map(s => (
                    <button
                      key={s}
                      onClick={() => { send(s); }}
                      className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs text-blue-700 hover:bg-blue-100"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </>
            )}

            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm whitespace-pre-wrap leading-relaxed ${
                    msg.role === "user"
                      ? "bg-blue-600 text-white rounded-br-sm"
                      : "bg-gray-100 text-gray-800 rounded-bl-sm"
                  }`}
                >
                  {msg.content || (
                    <span className="flex gap-1 items-center text-gray-400">
                      <span className="animate-bounce">●</span>
                      <span className="animate-bounce delay-75">●</span>
                      <span className="animate-bounce delay-150">●</span>
                    </span>
                  )}
                </div>
              </div>
            ))}

            {error && (
              <p className="text-center text-xs text-red-500">{error}</p>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="border-t border-gray-100 p-3 flex gap-2">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && !e.shiftKey && handleSend()}
              placeholder="Digite sua pergunta..."
              disabled={isLoading}
              className="flex-1 rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-400 disabled:opacity-50"
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Enviar
            </button>
          </div>
        </div>
      )}
    </>
  );
}
