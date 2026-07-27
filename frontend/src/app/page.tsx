"use client";

import React, { useState, useEffect, useRef } from 'react';
import ChatContainer from '@/modules/workspace/components/ChatContainer';
import PipelineTimeline from '@/modules/orchestration/components/PipelineTimeline';
import ProjectPortfolio from '@/modules/workspace/components/ProjectPortfolio';
import QuickStats from '@/modules/workspace/components/QuickStats';
import { apiFetch, apiUpload } from '@/modules/core/infrastructure/api';
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
  AlertCircle,
  Loader2
} from 'lucide-react';

interface DocumentRecord {
  id: string;
  name: string;
  mime_type: string | null;
  size_bytes: number | null;
  status: 'processing' | 'indexed' | 'error';
  error_message?: string | null;
  created_at: string;
}

function formatSize(bytes: number | null): string {
  if (!bytes) return '—';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleString('es-ES', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
  } catch {
    return dateStr;
  }
}

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
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);
  const [loadingDocs, setLoadingDocs] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [tasks, setTasks] = useState(initialTasks);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const loadDocuments = async () => {
    setLoadingDocs(true);
    try {
      const res = await apiFetch('/api/v1/memory/documents');
      if (res.ok) {
        const data = await res.json();
        setDocuments(data);
      }
    } catch {
      // Backend no disponible; se deja la lista vacía silenciosamente
    }
    setLoadingDocs(false);
  };

  useEffect(() => {
    loadDocuments();
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, []);

  const handleUploadClick = () => fileInputRef.current?.click();

  const handleFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadError(null);
    setUploading(true);

    try {
      const res = await apiUpload('/api/v1/memory/documents/upload', file);
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        setUploadError(err.detail || 'Error al subir el documento.');
      } else {
        await loadDocuments();
        // Sondear cada 3s durante 30s mientras se procesa el embedding en el backend
        let attempts = 0;
        pollRef.current = setInterval(async () => {
          attempts += 1;
          await loadDocuments();
          if (attempts >= 10 && pollRef.current) {
            clearInterval(pollRef.current);
          }
        }, 3000);
      }
    } catch {
      setUploadError('No se pudo conectar con el backend. Verifica que esté corriendo.');
    }

    setUploading(false);
    e.target.value = '';
  };

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
                <p className="text-xs text-[var(--text-muted)] mt-0.5">Sube archivos (PDF, DOCX, TXT, MD) para vectorizarlos automáticamente.</p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,.txt,.md"
                className="hidden"
                onChange={handleFileSelected}
              />
              <button
                onClick={handleUploadClick}
                disabled={uploading}
                className="bg-gradient-to-r from-cyan-500/10 to-teal-500/10 hover:from-cyan-500/20 hover:to-teal-500/20 text-[var(--accent-cyan)] border border-[var(--accent-cyan)]/20 px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition disabled:opacity-50"
              >
                {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                {uploading ? 'Subiendo...' : 'Subir PDF/Doc'}
              </button>
            </div>

            {uploadError && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{uploadError}</span>
              </div>
            )}

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[var(--border-color)] text-[var(--text-muted)]">
                    <th className="py-2.5 font-semibold">Nombre del Archivo</th>
                    <th className="py-2.5 font-semibold">Tamaño</th>
                    <th className="py-2.5 font-semibold">Estado RAG</th>
                    <th className="py-2.5 font-semibold text-right">Subido</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-color)]">
                  {loadingDocs ? (
                    <tr>
                      <td colSpan={4} className="py-6 text-center text-[var(--text-muted)]">Cargando documentos...</td>
                    </tr>
                  ) : documents.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-6 text-center text-[var(--text-muted)]">Aún no hay documentos. Sube el primero.</td>
                    </tr>
                  ) : (
                    documents.map((doc) => (
                      <tr key={doc.id} className="text-[var(--text-secondary)] hover:text-white transition">
                        <td className="py-3 font-medium flex items-center gap-2">
                          <FileText className="w-4 h-4 text-[var(--accent-cyan)] shrink-0" />
                          {doc.name}
                        </td>
                        <td className="py-3">{formatSize(doc.size_bytes)}</td>
                        <td className="py-3">
                          <span
                            className={`badge py-0 px-2 text-[10px] ${
                              doc.status === 'indexed' ? 'badge-progress' : doc.status === 'error' ? 'bg-red-500/10 border border-red-500/20 text-red-400' : 'badge-pending'
                            }`}
                            title={doc.status === 'error' ? doc.error_message || '' : ''}
                          >
                            {doc.status === 'indexed' ? 'Indexado RAG' : doc.status === 'error' ? 'Error al indexar' : 'Procesando...'}
                          </span>
                        </td>
                        <td className="py-3 text-right text-[var(--text-muted)]">{formatDate(doc.created_at)}</td>
                      </tr>
                    ))
                  )}
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
