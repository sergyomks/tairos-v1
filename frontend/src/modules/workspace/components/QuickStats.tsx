"use client";

import React from 'react';
import { Brain, Bot, TrendingUp, FolderKanban } from "lucide-react";

export default function QuickStats() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="card p-5 flex items-center gap-4">
        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-500/20 to-teal-500/20 border border-cyan-500/20 flex items-center justify-center">
          <Brain className="w-5 h-5 text-[var(--accent-cyan)]" />
        </div>
        <div>
          <p className="metric-label">Activos de Memoria</p>
          <p className="text-xl font-bold text-white">1,247</p>
        </div>
      </div>
      <div className="card p-5 flex items-center gap-4">
        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 border border-violet-500/20 flex items-center justify-center">
          <Bot className="w-5 h-5 text-[var(--accent-purple)]" />
        </div>
        <div>
          <p className="metric-label">Agentes Activos</p>
          <p className="text-xl font-bold text-white">7</p>
        </div>
      </div>
      <div className="card p-5 flex items-center gap-4">
        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/20 flex items-center justify-center">
          <TrendingUp className="w-5 h-5 text-[var(--accent-green)]" />
        </div>
        <div>
          <p className="metric-label">Horas Ahorradas</p>
          <p className="text-xl font-bold text-white">142h</p>
        </div>
      </div>
      <div className="card p-5 flex items-center gap-4">
        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/20 flex items-center justify-center">
          <FolderKanban className="w-5 h-5 text-[var(--accent-amber)]" />
        </div>
        <div>
          <p className="metric-label">Proyectos Activos</p>
          <p className="text-xl font-bold text-white">12</p>
        </div>
      </div>
    </div>
  );
}
