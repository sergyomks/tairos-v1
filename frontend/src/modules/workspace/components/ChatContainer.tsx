"use client";

import React, { useState } from 'react';
import { Bot, MoreHorizontal, Send, HelpCircle } from "lucide-react";

interface Message {
  name: string;
  avatar: string;
  color?: string;
  text: string;
  isAi: boolean;
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
  {
    q: "¿Qué decidimos hace dos meses?",
    a: "Según el registro de la reunión de arquitectura del 24 de Mayo (Proyecto Alpha), decidimos implementar una base de datos vectorial local con PostgreSQL + pgvector para el RAG inicial de 10K documentos, descartando Pinecone por motivos de costo de infraestructura."
  },
  {
    q: "¿Por qué elegimos PostgreSQL?",
    a: "Elegimos PostgreSQL porque: 1) pgvector cubre el alcance vectorial sin costo extra, 2) mantiene la consistencia relacional de clientes y proyectos en el mismo motor, y 3) simplifica las copias de seguridad de la memoria organizacional en un solo volumen."
  },
  {
    q: "¿Qué aprendimos del proyecto X?",
    a: "Del proyecto Nimbus HR aprendimos que el parseo estándar de PDF con PyPDF perdía la estructura de las tablas financieras. La lección registrada en la memoria es usar siempre IBM Docling para la extracción estructurada."
  },
  {
    q: "¿Qué agentes participaron?",
    a: "En el último ciclo del Proyecto Alpha participaron 3 agentes: 1) Agente Investigador (análisis técnico), 2) Agente Arquitecto (especificaciones), y 3) Agente QA (validación de pruebas unitarias)."
  }
];

export default function ChatContainer() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = (textToSend: string) => {
    if (!textToSend.trim()) return;

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

    // Look for matching sample query
    const matched = sampleQueries.find(item => item.q.toLowerCase() === textToSend.toLowerCase());

    setTimeout(() => {
      setIsTyping(false);
      if (matched) {
        setMessages(prev => [...prev, {
          name: "Asistente RAG",
          avatar: "RAG",
          text: matched.a,
          isAi: true,
        }]);
      } else {
        setMessages(prev => [...prev, {
          name: "Asistente RAG",
          avatar: "RAG",
          text: `Buscando en la memoria organizacional: "${textToSend}"... No se encontraron registros explícitos. Recuerda que no puedo inventar respuestas fuera de los documentos indexados.`,
          isAi: true,
        }]);
      }
    }, 1200);
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
                  {msg.text}
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
