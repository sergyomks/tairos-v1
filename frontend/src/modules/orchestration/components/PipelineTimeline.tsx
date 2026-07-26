"use client";

import React from 'react';
import { CheckCircle2, Clock, MoreHorizontal } from "lucide-react";

const stages = [
  {
    name: "Arquitecto: Planificación",
    status: "Completado",
    detail: "Diseño del Sistema, Especificación de API",
    progress: 100,
  },
  {
    name: "Desarrollador 1: Codificación API",
    status: "En Progreso",
    detail: "Endpoints, Lógica de Negocio, Modelo de Datos",
    progress: 68,
  },
  {
    name: "Auditor QA: Ejecución de Pruebas",
    status: "Pendiente",
    detail: "Pruebas de Integración, Casos Límite",
    progress: 0,
  },
];

function ProgressRing({ progress, size = 32 }: { progress: number; size?: number }) {
  const strokeWidth = 3;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        className="progress-ring-bg"
        strokeWidth={strokeWidth}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        className="progress-ring-fill"
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function PipelineTimeline() {
  return (
    <div className="card p-6 flex flex-col h-[520px] justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="section-label">Flujo Activo de Agentes de IA</span>
            <h2 className="text-lg font-bold text-white mt-1">
              Línea de Tiempo del Pipeline
            </h2>
          </div>
          <MoreHorizontal className="menu-dots w-5 h-5" />
        </div>

        <div className="relative space-y-0 overflow-y-auto max-h-[380px] pr-2">
          {stages.map((stage, i) => {
            const isLast = i === stages.length - 1;
            const dotClass = stage.progress === 100
              ? "timeline-dot timeline-dot-done"
              : stage.progress > 0
              ? "timeline-dot timeline-dot-active"
              : "timeline-dot timeline-dot-pending";

            return (
              <div key={i} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className={dotClass} />
                  {!isLast && (
                    <div className="w-[3px] flex-1 min-h-[70px]"
                      style={{
                        background: stage.progress === 100
                          ? 'linear-gradient(to bottom, var(--accent-green), var(--accent-cyan))'
                          : 'var(--border-color)'
                      }}
                    />
                  )}
                </div>

                <div className={`card px-4 py-3 mb-4 flex-1 flex items-center justify-between ${
                  stage.progress > 0 && stage.progress < 100
                    ? 'border-[var(--accent-cyan)]/30'
                    : ''
                }`}>
                  <div>
                    <p className="text-sm font-semibold text-white">{stage.name}</p>
                    <p className={`text-xs mt-0.5 ${
                      stage.status === 'Completado'
                        ? 'text-[var(--accent-green)]'
                        : stage.status === 'En Progreso'
                        ? 'text-[var(--accent-cyan)]'
                        : 'text-[var(--text-muted)]'
                    }`}>
                      {stage.status}
                      {stage.progress > 0 && stage.progress < 100 && (
                        <span className="ml-4 text-[var(--text-muted)]">{stage.progress}%</span>
                      )}
                    </p>
                    <p className="text-xs text-[var(--text-muted)] mt-1 flex items-center gap-1">
                      <span className="inline-block w-1 h-1 rounded-full bg-[var(--text-muted)]" />
                      {stage.detail}
                    </p>
                  </div>
                  {stage.progress > 0 && stage.progress < 100 && (
                    <ProgressRing progress={stage.progress} />
                  )}
                  {stage.progress === 100 && (
                    <CheckCircle2 className="w-5 h-5 text-[var(--accent-green)]" />
                  )}
                  {stage.progress === 0 && (
                    <Clock className="w-5 h-5 text-[var(--text-muted)]" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
