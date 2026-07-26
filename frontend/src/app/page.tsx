"use client";

import React, { useState } from 'react';
import ChatContainer from '@/modules/workspace/components/ChatContainer';
import PipelineTimeline from '@/modules/orchestration/components/PipelineTimeline';
import ProjectPortfolio from '@/modules/workspace/components/ProjectPortfolio';
import QuickStats from '@/modules/workspace/components/QuickStats';
import { 
  FileText, 
  CheckSquare, 
  MessageSquare, 
  Database, 
  Plus, 
  CheckCircle, 
  Play, 
  HelpCircle,
  FolderKanban,
  Download,
  AlertCircle
} from 'lucide-react';

const initialDocuments = [
  { name: "especificacion_api_v2.pdf", size: "1.4 MB", type: "Especificación", status: "Indexado RAG", date: "Hace 5 minutos" },
  { name: "transcripcion_reunion_mayo.md", size: "45 KB", type: "Reunión", status: "Indexado RAG", date: "Hace 20 minutos" },
  { name: "arquitectura_base_tairos.pdf", size: "3.2 MB", type: "Arquitectura", status: "Indexado RAG", date: "Hace 2 horas" },
  { name: "contrato_cliente_nimbus.docx", size: "280 KB", type: "Contrato", status: "Solo Postgres", date: "Hace 1 día" }
];

const initialTasks = [
  { title: "Desarrollar Endpoints del Módulo de Chat", assignee: "Trabajador 1 (Agente IA)", project: "Proyecto Alpha", status: "En Progreso (68%)", priority: "Alta" },
  { title: "Revisar y Validar Esquema de pgvector", assignee: "Alex R. (Humano)", project: "Proyecto Alpha", status: "Completado", priority: "Crítica" },
  { title: "Ejecutar Pruebas de Integración y Carga", assignee: "Auditor QA (Agente IA)", project: "Proyecto Alpha", status: "Pendiente", priority: "Alta" },
  { title: "Redactar Manual de Documentación de API", assignee: "Agente Documentador", project: "Nimbus HR", status: "Pendiente", priority: "Baja" }
];

// Chronological feed representing automatic ingestion of the 11 items listed in prompts.md
const memoryIngestionFeed = [
  { type: "Documento", title: "especificacion_api_v2.pdf", action: "Extraído con Docling, generado embeddings en pgvector", time: "Hace 5 min" },
  { type: "Conversación", title: "Canal Proyecto Alpha", action: "Decisión detectada: 'Usar PostgreSQL en vez de SQLite para consistencia'", time: "Hace 12 min" },
  { type: "Código", title: "Commit 4ea18d2 (API Controller)", action: "Código indexado y vinculado a Tarea #142", time: "Hace 1 hora" },
  { type: "Prompt", title: "Prompt de Supervisor v1.4", action: "Guardado versión anterior en la Biblioteca de Activos", time: "Hace 2 horas" },
  { type: "Experimento", title: "Prueba de carga de pgvector", action: "Simulación de 10K consultas exitosa. Guardado en historial", time: "Hace 4 horas" },
  { type: "Error", title: "NullPointerException en Auth", action: "Excepción indexada y vinculada a la lección de seguridad #4", time: "Hace 5 horas" },
  { type: "Reunión", title: "Grabación Sprint Review 24-Jul", action: "Llamada transcrita automáticamente e ingresada al RAG", time: "Hace 1 día" }
];

export default function WorkspacePage() {
  const [activeTab, setActiveTab] = useState<'colab' | 'docs' | 'tasks'>('colab');
  const [documents, setDocuments] = useState(initialDocuments);
  const [tasks, setTasks] = useState(initialTasks);

  return (
    <div className="space-y-6">
      {/* Cabecera */}
      <div className="border border-[var(--border-color)] bg-[var(--bg-secondary)]/40 backdrop-blur rounded-2xl p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Centro de Trabajo (Workspace)</h2>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Plataforma única de interacción entre humanos, agentes inteligentes y memoria organizacional.
          </p>
        </div>
        
        {/* Selector de pestañas */}
        <div className="flex bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl p-1 gap-1 w-full sm:w-auto">
          <button 
            onClick={() => setActiveTab('colab')}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 text-xs font-semibold px-4 py-2 rounded-lg transition ${
              activeTab === 'colab' 
                ? 'bg-gradient-to-r from-cyan-500 to-teal-500 text-white shadow-md' 
                : 'text-[var(--text-secondary)] hover:text-white hover:bg-[var(--bg-card-hover)]'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" /> Colaboración
          </button>
          <button 
            onClick={() => setActiveTab('docs')}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 text-xs font-semibold px-4 py-2 rounded-lg transition ${
              activeTab === 'docs' 
                ? 'bg-gradient-to-r from-cyan-500 to-teal-500 text-white shadow-md' 
                : 'text-[var(--text-secondary)] hover:text-white hover:bg-[var(--bg-card-hover)]'
            }`}
          >
            <Database className="w-3.5 h-3.5" /> Memoria & Documentos
          </button>
          <button 
            onClick={() => setActiveTab('tasks')}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 text-xs font-semibold px-4 py-2 rounded-lg transition ${
              activeTab === 'tasks' 
                ? 'bg-gradient-to-r from-cyan-500 to-teal-500 text-white shadow-md' 
                : 'text-[var(--text-secondary)] hover:text-white hover:bg-[var(--bg-card-hover)]'
            }`}
          >
            <CheckSquare className="w-3.5 h-3.5" /> Tareas & Proyectos
          </button>
        </div>
      </div>

      {/* --- Pestaña 1: Colaboración & Pipeline --- */}
      {activeTab === 'colab' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChatContainer />
            <PipelineTimeline />
          </div>
          <QuickStats />
        </div>
      )}

      {/* --- Pestaña 2: Documentos & Ingestión de Memoria --- */}
      {activeTab === 'docs' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Panel de Documentos */}
          <div className="card p-6 lg:col-span-2 space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-base font-bold text-white">Documentos indexados en Memoria</h3>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">Sube archivos para vectorizarlos automáticamente.</p>
              </div>
              <button className="bg-gradient-to-r from-cyan-500/10 to-teal-500/10 hover:from-cyan-500/20 hover:to-teal-500/20 text-[var(--accent-cyan)] border border-[var(--accent-cyan)]/20 px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition">
                <Plus className="w-3.5 h-3.5" /> Subir PDF/Doc
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[var(--border-color)] text-[var(--text-muted)]">
                    <th className="py-2.5 font-semibold">Nombre del Archivo</th>
                    <th className="py-2.5 font-semibold">Tipo</th>
                    <th className="py-2.5 font-semibold">Tamaño</th>
                    <th className="py-2.5 font-semibold">Estado RAG</th>
                    <th className="py-2.5 font-semibold text-right">Indexado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-color)]">
                  {documents.map((doc, idx) => (
                    <tr key={idx} className="text-[var(--text-secondary)] hover:text-white transition">
                      <td className="py-3 font-medium flex items-center gap-2">
                        <FileText className="w-4 h-4 text-[var(--accent-cyan)] shrink-0" />
                        {doc.name}
                      </td>
                      <td className="py-3">{doc.type}</td>
                      <td className="py-3">{doc.size}</td>
                      <td className="py-3">
                        <span className={`badge ${doc.status.includes("RAG") ? "badge-progress" : "badge-pending"} py-0 px-2 text-[10px]`}>
                          {doc.status}
                        </span>
                      </td>
                      <td className="py-3 text-right text-[var(--text-muted)]">{doc.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Panel de Ingestión Automática */}
          <div className="card p-6 space-y-4">
            <div>
              <h3 className="text-base font-bold text-white">Ingestión Automática de Memoria</h3>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">Captura pasiva del sistema en tiempo real.</p>
            </div>

            <div className="space-y-4 max-h-[360px] overflow-y-auto pr-1">
              {memoryIngestionFeed.map((item, idx) => (
                <div key={idx} className="border border-[var(--border-color)] bg-[var(--bg-primary)]/40 rounded-xl p-3 space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] uppercase font-bold tracking-wider text-[var(--accent-cyan)] bg-[var(--accent-cyan)]/10 px-2 py-0.5 rounded border border-[var(--accent-cyan)]/10">
                      {item.type}
                    </span>
                    <span className="text-[10px] text-[var(--text-muted)]">{item.time}</span>
                  </div>
                  <h4 className="text-xs font-bold text-white">{item.title}</h4>
                  <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">{item.action}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* --- Pestaña 3: Tareas & Proyectos --- */}
      {activeTab === 'tasks' && (
        <div className="space-y-6">
          {/* Panel de Tareas */}
          <div className="card p-6 space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-base font-bold text-white">Tareas del Workspace (Humanos y Agentes)</h3>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">Listado y asignación activa de desarrollo de software.</p>
              </div>
              <button className="bg-gradient-to-r from-cyan-500 to-teal-500 text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 hover:opacity-90 transition">
                <Plus className="w-3.5 h-3.5" /> Nueva Tarea
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[var(--border-color)] text-[var(--text-muted)]">
                    <th className="py-2.5 font-semibold">Descripción de la Tarea</th>
                    <th className="py-2.5 font-semibold">Responsable</th>
                    <th className="py-2.5 font-semibold">Proyecto</th>
                    <th className="py-2.5 font-semibold">Prioridad</th>
                    <th className="py-2.5 font-semibold text-right">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-color)]">
                  {tasks.map((task, idx) => (
                    <tr key={idx} className="text-[var(--text-secondary)] hover:text-white transition">
                      <td className="py-3.5 font-medium">{task.title}</td>
                      <td className="py-3.5 flex items-center gap-1.5">
                        <span className={`w-1.5 h-1.5 rounded-full ${task.assignee.includes("Agente") ? 'bg-[var(--accent-cyan)]' : 'bg-teal-400'}`} />
                        {task.assignee}
                      </td>
                      <td className="py-3.5">{task.project}</td>
                      <td className="py-3.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] border ${
                          task.priority === 'Crítica' 
                            ? 'text-red-400 border-red-500/20 bg-red-500/10' 
                            : task.priority === 'Alta' 
                            ? 'text-amber-400 border-amber-500/20 bg-amber-500/10' 
                            : 'text-slate-400 border-slate-500/20 bg-slate-500/10'
                        }`}>
                          {task.priority}
                        </span>
                      </td>
                      <td className="py-3.5 text-right">
                        <span className={`badge ${task.status === 'Completado' ? 'badge-complete' : task.status.includes("Progreso") ? 'badge-progress' : 'badge-pending'} py-0 px-2 text-[10px]`}>
                          {task.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Portafolio de Proyectos */}
          <ProjectPortfolio />
        </div>
      )}
    </div>
  );
}
