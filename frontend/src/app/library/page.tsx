"use client";

import React from 'react';
import { ShieldCheck, BookOpen, Layers, GitBranch, ArrowUpRight } from "lucide-react";

const assets = [
  {
    name: "Prompt Supervisor General",
    type: "Prompt de Agente",
    version: "v1.4",
    desc: "Coordina la delegación y validación de tareas complejas en el Router IA.",
    usage: "1,240 invocaciones",
  },
  {
    name: "Pipeline de Despliegue CI/CD",
    type: "Flujo de Trabajo n8n",
    version: "v3.2",
    desc: "Automatización de builds de Docker y despliegues automáticos al quorum.",
    usage: "450 ejecuciones",
  },
  {
    name: "Componente Tarjeta Métrica",
    type: "Componente React",
    version: "v2.1",
    desc: "Diseño premium glassmorphism con visualización de tendencias y alertas.",
    usage: "88 importaciones",
  },
  {
    name: "Conector de API GitHub",
    type: "Conector / MCP",
    version: "v1.0",
    desc: "Protocolo MCP para interactuar con ramas, pull requests y comentarios de código.",
    usage: "2,150 llamadas",
  }
];

export default function LibraryPage() {
  return (
    <div className="space-y-6">
      {/* Cabecera */}
      <div className="border border-[var(--border-color)] bg-[var(--bg-secondary)]/40 backdrop-blur rounded-2xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Biblioteca Organizacional de Activos</h2>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Repositorio versionado de conocimiento, prompts, plantillas y componentes reutilizados por humanos y agentes.
          </p>
        </div>
        <button className="bg-gradient-to-r from-cyan-500 to-teal-500 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:opacity-90 transition">
          Nuevo Activo
        </button>
      </div>

      {/* Grid de Activos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {assets.map((asset, i) => (
          <div key={i} className="card p-6 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[var(--accent-cyan)]/10 border border-[var(--accent-cyan)]/20 flex items-center justify-center">
                    <BookOpen className="w-4 h-4 text-[var(--accent-cyan)]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white">{asset.name}</h3>
                    <p className="text-xs text-[var(--text-muted)]">{asset.type}</p>
                  </div>
                </div>
                <span className="badge badge-progress font-mono">{asset.version}</span>
              </div>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                {asset.desc}
              </p>
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-[var(--border-color)] text-xs">
              <span className="text-[var(--text-muted)] flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[var(--accent-green)]" /> Verificado por Supervisor
              </span>
              <span className="text-[var(--text-secondary)] font-medium">
                {asset.usage}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
