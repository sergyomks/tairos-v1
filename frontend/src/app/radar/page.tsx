"use client";

import React from 'react';
import { Eye, TrendingUp, Cpu, Activity } from "lucide-react";

const trends = [
  {
    name: "Modelos de Razonamiento o1 / o3-mini (OpenAI)",
    source: "arXiv & OpenAI DevBlog",
    impact: "Alto",
    impactColor: "text-[var(--accent-cyan)] border-[var(--accent-cyan)]/20 bg-[var(--accent-cyan)]/10",
    recommendation: "Reemplazar llamadas genéricas de GPT-4o por o3-mini en el agente de arquitectura para mejorar las decisiones de diseño estructural.",
    checkedDate: "Hoy, 10:24 AM"
  },
  {
    name: "Claude 3.5 Sonnet (Anthropic)",
    source: "LlamaIndex Benchmarks",
    impact: "Crítico",
    impactColor: "text-[var(--accent-purple)] border-[var(--accent-purple)]/20 bg-[var(--accent-purple)]/10",
    recommendation: "Mantenerlo como modelo por defecto del RAG y extractor de especificaciones estructuradas de PDFs extensos.",
    checkedDate: "Ayer, 4:15 PM"
  },
  {
    name: "Docling Parser (IBM Research)",
    source: "GitHub Trending",
    impact: "Alto",
    impactColor: "text-[var(--accent-green)] border-[var(--accent-green)]/20 bg-[var(--accent-green)]/10",
    recommendation: "Implementar en la capa de infraestructura del RAG de Tairos OS para parsear tablas complejas de PDF y convertirlas a Markdown estructurado.",
    checkedDate: "23 Julio, 2:00 PM"
  }
];

export default function RadarPage() {
  return (
    <div className="space-y-6">
      {/* Cabecera */}
      <div className="border border-[var(--border-color)] bg-[var(--bg-secondary)]/40 backdrop-blur rounded-2xl p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20 border border-purple-500/20 flex items-center justify-center">
            <Eye className="w-5 h-5 text-[var(--accent-cyan)]" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Radar Tecnológico Inteligente</h2>
            <p className="text-sm text-[var(--text-secondary)] mt-1">
              Monitoreo y análisis automatizado de tecnologías de IA para mantener la competitividad de la organización.
            </p>
          </div>
        </div>
      </div>

      {/* Grid de Tendencias */}
      <div className="space-y-4">
        {trends.map((trend, i) => (
          <div key={i} className="card p-6 space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <h3 className="text-base font-bold text-white">{trend.name}</h3>
                <span className="text-xs text-[var(--text-muted)]">Fuente: {trend.source}</span>
              </div>
              <span className={`badge ${trend.impactColor}`}>Impacto: {trend.impact}</span>
            </div>

            <div className="bg-[var(--bg-primary)]/50 border border-[var(--border-color)] rounded-xl p-4 space-y-2">
              <span className="text-[10px] font-semibold text-[var(--accent-cyan)] uppercase tracking-wider">Recomendación Arquitectónica</span>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                {trend.recommendation}
              </p>
            </div>

            <div className="flex justify-between items-center text-xs text-[var(--text-muted)] pt-2">
              <span className="flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5" /> Analizado automáticamente por Agente Radar
              </span>
              <span>{trend.checkedDate}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
