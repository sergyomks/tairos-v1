"use client";

import React from 'react';
import { MoreHorizontal } from "lucide-react";

const projects = [
  {
    name: "Nimbus HR",
    type: "Plataforma SaaS",
    icon: "NH",
    iconColor: "bg-cyan-600",
    status: "En Línea",
    activeUsers: "1.4K",
    userChange: "+8%",
    uptime: "99.9%",
    conversion: "4.2%",
    revenue: "$8,560",
  },
  {
    name: "Quantum CRM",
    type: "Plataforma SaaS",
    icon: "QC",
    iconColor: "bg-violet-600",
    status: "En Línea",
    activeUsers: "980",
    userChange: "+12%",
    uptime: "100.0%",
    conversion: "3.8%",
    revenue: "$6,230",
  },
];

export default function ProjectPortfolio() {
  return (
    <div className="card p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <span className="section-label">Gestión Corporativa</span>
          <h2 className="text-lg font-bold text-white mt-1">Portafolio de Proyectos Activos</h2>
        </div>
        <MoreHorizontal className="menu-dots w-5 h-5" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((project, i) => (
          <div key={i} className="card p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl ${project.iconColor} flex items-center justify-center text-sm font-bold text-white`}>
                  {project.icon}
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">{project.name}</h3>
                  <p className="text-xs text-[var(--text-muted)]">{project.type}</p>
                </div>
              </div>
              <span className="badge badge-online">
                <span className="w-2 h-2 rounded-full bg-[var(--accent-green)] inline-block" />
                {project.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1 border border-[var(--border-color)] rounded-lg p-3">
                <p className="metric-label">Usuarios Activos</p>
                <div className="flex items-baseline gap-2">
                  <span className="metric-value">{project.activeUsers}</span>
                  <span className="metric-change-positive">{project.userChange}</span>
                </div>
              </div>
              <div className="space-y-1 border border-[var(--border-color)] rounded-lg p-3">
                <p className="metric-label">Tiempo de Actividad</p>
                <span className="metric-value">{project.uptime}</span>
              </div>
              <div className="space-y-1 border border-[var(--border-color)] rounded-lg p-3">
                <p className="metric-label">Tasa de Conversión</p>
                <span className="metric-value">{project.conversion}</span>
              </div>
              <div className="space-y-1 border border-[var(--border-color)] rounded-lg p-3">
                <p className="metric-label">Ingresos Semanales</p>
                <span className="metric-value">{project.revenue}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
