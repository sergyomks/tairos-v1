"use client";

import React from 'react';
import { AlertCircle, FileText, Repeat, Heart } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Cabecera */}
      <div className="border border-[var(--border-color)] bg-[var(--bg-secondary)]/40 backdrop-blur rounded-2xl p-6">
        <h2 className="text-2xl font-bold text-white">Dashboard Ejecutivo</h2>
        <p className="text-sm text-[var(--text-secondary)] mt-1">
          Métricas clave de evolución, aprendizajes y alineación organizacional de Tairos OS.
        </p>
      </div>

      {/* Alerta de Decisiones Contradictorias */}
      <div className="card p-5 border-amber-500/20 bg-amber-500/5 flex items-start gap-4">
        <AlertCircle className="w-6 h-6 text-[var(--accent-amber)] shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-white">Alerta de Memoria: Decisiones Contradictorias</h3>
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
            El sistema detectó que el <strong>Proyecto Alpha</strong> decidió usar SQLite en el Edge para almacenamiento fuera de línea, mientras que el <strong>Proyecto Beta</strong> aprobó postgresql + pgvector para un alcance técnico idéntico. Se recomienda unificar criterios.
          </p>
        </div>
      </div>

      {/* Grid de Secciones */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Aprendizajes Clave */}
        <div className="card p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-[var(--accent-cyan)]" />
            <h3 className="font-bold text-white">Aprendizajes Clave</h3>
          </div>
          <ul className="space-y-3 text-xs text-[var(--text-secondary)]">
            <li className="bg-[var(--bg-primary)] p-3 rounded-lg border border-[var(--border-color)] leading-relaxed">
              • <strong>Base Vectorial</strong>: postgresql + pgvector es más que suficiente para indexar y buscar más de 10K documentos sin latencia.
            </li>
            <li className="bg-[var(--bg-primary)] p-3 rounded-lg border border-[var(--border-color)] leading-relaxed">
              • <strong>Orquestación</strong>: LangGraph proporciona ciclos de control mucho más estables que LangChain para agentes interactivos.
            </li>
          </ul>
        </div>

        {/* Duplicación Evitada */}
        <div className="card p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Repeat className="w-5 h-5 text-[var(--accent-purple)]" />
            <h3 className="font-bold text-white">Duplicación de Código</h3>
          </div>
          <div className="text-center py-6">
            <span className="text-4xl font-extrabold text-[var(--accent-cyan)]">85%</span>
            <p className="text-xs text-[var(--text-secondary)] mt-2">Reutilización de componentes desde la biblioteca</p>
          </div>
          <p className="text-xs text-[var(--text-muted)] text-center">
            Evitó duplicar la implementación de 14 API Connectors esta semana.
          </p>
        </div>

        {/* Rendimiento Operativo */}
        <div className="card p-6 space-y-4">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-[var(--accent-green)]" />
            <h3 className="font-bold text-white">Eficiencia en Entregas</h3>
          </div>
          <div className="text-center py-6">
            <span className="text-4xl font-extrabold text-[var(--accent-green)]">+24%</span>
            <p className="text-xs text-[var(--text-secondary)] mt-2">Velocidad de entrega (Speed Run) del Pipeline</p>
          </div>
          <p className="text-xs text-[var(--text-muted)] text-center">
            El Agente Auditor redujo el tiempo de revisión de código en un 40%.
          </p>
        </div>
      </div>
    </div>
  );
}
