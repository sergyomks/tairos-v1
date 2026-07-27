"use client";

import React, { useState } from 'react';
import { Bot, MoreHorizontal, Send, HelpCircle, AlertCircle } from "lucide-react";
import { apiFetch } from '@/modules/core/infrastructure/api';

interface Message {
  name: string;
  avatar: string;
  color?: string;
  text: string;
  isAi: boolean;
  sources?: { document_name: string; similarity: number }[];
  isError?: boolean;
}

const initialMessages: Message[] = [
  {
    name: "Sarah L.",
    avatar: "SL",
    color: "bg-rose-500",
    text: "¿Tenemos los documentos finales de especificación de la API?",
    isAi: false,
  },
  {
    name: "Mike B.",
    avatar: "MB",
    color: "bg-blue-500",
    text: "Subiendo los últimos cambios al repositorio ahora mismo.",
    isAi: false,
  },
  {
    name: "Chloe W.",
    avatar: "CW",
    color: "bg-amber-500",
    text: "Comenzando las pruebas unitarias y de integración.",
    isAi: false,
  },
  {
    name: "Arquitecto IA",
    avatar: "AI",
    text: "Endpoints de la API refinados. El Trabajador 1 está codificando la lógica principal. El Auditor de QA está listo.",
    isAi: true,
  },
];

const sampleQueries = [
  { q: "¿Qué decidimos hace dos meses?" },
  { q: "¿Por qué elegimos PostgreSQL?" },
  { q: "¿Qué aprendimos del proyecto X?" },
  { q: "¿Qué agentes participaron?" },
];

export default function ChatContainer() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim() || isTyping) return;

    const newMsg: Message = {
      name: "Alex R.",
      avatar: "AR",
      color: "bg-teal-500",
      text: textToSend,
      isAi: false,
    };

    setMessages(prev => [...prev, newMsg]);
    setInput("");
    setIsTyping(true);

    try {
      const res = await apiFetch('/api/v1/memory/chat', {
        method: 'POST',
        body: JSON.stringify({ query: textToSend }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || 'Error al consultar la memoria organizacional.');
      }

      const data = await res.json();
      setMessages(prev => [...prev, {
        name: "Asistente RAG",
        avatar: "RAG",
        text: data.answer,
        isAi: true,
        sources: data.sources,
      }]);
    } catch (error: any) {
      setMessages(prev => [...prev, {
        name: "Asistente RAG",
        avatar: "RAG",
        text: error?.message || "No se pudo conectar con el backend. Verifica que esté corriendo y que tenga configurada la OPENAI_API_KEY.",
        isAi: true,
        isError: true,
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="card p-6 flex flex-col h-[560px] justify-between">
      <div className="space-y-4 flex-1 flex flex-col overflow-hidden">
        <div className="flex items-center justify-between shrink-0">
          <div>
            <span className="section-label">Chat Inteligente RAG (Conectado a Memoria)</span>
            <h2 className="text-lg font-bold text-white mt-1">
              Consulta de Historial y Decisiones
            </h2>
          </div>
          <MoreHorizontal className="menu-dots w-5 h-5" />
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto pr-2 space-y-4 my-2">
          {messages.map((msg, i) => (
            <div key={i} className="flex items-start gap-3">
              {msg.isAi ? (
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-500 to-teal-400 flex items-center justify-center avatar-ai shrink-0">
                  <Bot className="w-4 h-4 text-white" />
                </div>
              ) : (
                <div className={`w-9 h-9 rounded-full ${msg.color || 'bg-teal-500'} flex items-center justify-center text-xs font-bold text-white shrink-0`}>
                  {msg.avatar}
                </div>
              )}
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-[var(--text-primary)]">
                    {msg.name}
                  </span>
                  {msg.isAi && (
                    <span className="badge badge-progress text-[10px] py-0 px-2">RAG Activo</span>
                  )}
                </div>
                <div className={msg.isAi ? "chat-bubble chat-bubble-ai" : "chat-bubble chat-bubble-human"}>
                  {msg.isError && <AlertCircle className="w-3.5 h-3.5 inline-block mr-1.5 text-red-400 -mt-0.5" />}
                  {msg.text}
                  {msg.sources && msg.sources.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-[var(--border-color)]/50 flex flex-wrap gap-1.5">
                      {msg.sources.map((s, sidx) => (
                        <span key={sidx} className="text-[10px] bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-muted)] px-2 py-0.5 rounded-full">
                          📄 {s.document_name} ({Math.round(s.similarity * 100)}%)
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-500 to-teal-400 flex items-center justify-center avatar-ai shrink-0">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="space-y-1">
                <span className="text-sm font-semibold text-[var(--text-primary)]">Buscando en memoria...</span>
                <div className="chat-bubble chat-bubble-ai text-xs italic text-[var(--text-muted)]">
                  Consultando pgvector + Neo4j...
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Predefined Questions from prompts.md */}
        <div className="shrink-0 space-y-1.5 pt-2 border-t border-[var(--border-color)]">
          <p className="text-[10px] uppercase font-bold text-[var(--text-muted)] flex items-center gap-1">
            <HelpCircle className="w-3.5 h-3.5" /> Preguntas frecuentes de la memoria organizacional (MVP):
          </p>
          <div className="flex flex-wrap gap-2">
            {sampleQueries.map((item, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(item.q)}
                disabled={isTyping}
                className="text-xs bg-[var(--bg-secondary)] hover:bg-[var(--bg-card-hover)] border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-white px-2.5 py-1.5 rounded-lg transition text-left cursor-pointer"
              >
                {item.q}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 pt-4 shrink-0">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
          placeholder="Haz una pregunta sobre decisiones, reuniones o código..."
          className="flex-1 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg px-4 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-cyan)] transition"
        />
        <button
          onClick={() => handleSend(input)}
          className="bg-gradient-to-r from-cyan-500 to-teal-500 text-white p-2.5 rounded-lg hover:opacity-90 transition flex items-center justify-center cursor-pointer"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
