"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/modules/core/infrastructure/AuthProvider';
import { supabase } from '@/modules/core/infrastructure/supabase';
import { 
  Lock, 
  Settings, 
  Layers, 
  Key, 
  Bot, 
  Database, 
  Save, 
  AlertCircle, 
  CheckCircle,
  FolderKanban,
  GitBranch,
  CloudLightning,
  Users,
  UserPlus,
  Edit2,
  Trash2,
  Mail,
  Shield,
  User
} from 'lucide-react';

interface Profile {
  id: string;
  email: string;
  role: string;
  name?: string;
  created_at?: string;
}

export default function SettingsPage() {
  const { role, user: currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'project' | 'users' | 'global'>('project');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form states - Project settings
  const [projectName, setProjectName] = useState('Proyecto Alpha');
  const [projectRepo, setProjectRepo] = useState('github.com/tairos-org/alpha');
  const [projectBucket, setProjectBucket] = useState('tairos-alpha-bucket');
  
  // Form states - Global settings (Super Admin)
  const [openaiKey, setOpenaiKey] = useState('••••••••••••••••••••••••••••');
  const [anthropicKey, setAnthropicKey] = useState('••••••••••••••••••••••••••••');
  const [supervisorModel, setSupervisorModel] = useState('gpt-4o');
  const [coderModel, setCoderModel] = useState('claude-3-5-sonnet');
  const [maxTokens, setMaxTokens] = useState(4000);
  const [embeddingModel, setEmbeddingModel] = useState('text-embedding-3-small');

  // CRUD User Management States
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingProfile, setEditingProfile] = useState<Profile | null>(null);
  
  // User Form Input
  const [inputEmail, setInputEmail] = useState('');
  const [inputPassword, setInputPassword] = useState('');
  const [inputName, setInputName] = useState('');
  const [inputRole, setInputRole] = useState('member');

  const isSuperAdmin = role === 'super_admin';
  const isDemo = typeof window !== 'undefined' && localStorage.getItem('tairos_demo_mode') === 'true';

  // Initialize and load profiles
  useEffect(() => {
    if (isSuperAdmin) {
      loadProfiles();
    }
  }, [role]);

  const loadProfiles = async () => {
    setLoadingUsers(true);
    if (isDemo) {
      // Load initial mock users for demo mode
      const mockProfiles: Profile[] = [
        { id: '1', email: 'carlos.demo@tairos.com', role: 'super_admin', name: 'Carlos Demo' },
        { id: '2', email: 'sofia.coder@tairos.com', role: 'member', name: 'Sofia Coder' },
        { id: '3', email: 'mateo.qa@tairos.com', role: 'member', name: 'Mateo QA' },
      ];
      setProfiles(mockProfiles);
      setLoadingUsers(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (data && !error) {
        setProfiles(data);
      } else {
        setErrorMessage("Error al conectar con la base de datos.");
      }
    } catch {
      setErrorMessage("Fallo al cargar usuarios.");
    }
    setLoadingUsers(false);
  };

  const handleSaveProject = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleSaveGlobal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSuperAdmin) return;
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  // --- CRUD User Actions ---
  const handleOpenAddModal = () => {
    setEditingProfile(null);
    setInputEmail('');
    setInputPassword('');
    setInputName('');
    setInputRole('member');
    setShowUserModal(true);
  };

  const handleOpenEditModal = (profile: Profile) => {
    setEditingProfile(profile);
    setInputEmail(profile.email);
    setInputName(profile.name || '');
    setInputRole(profile.role);
    setInputPassword(''); // Limpiar contraseña al abrir modal de edición
    setShowUserModal(true);
  };

  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (isDemo) {
      if (editingProfile) {
        // Edit in memory
        setProfiles(profiles.map(p => p.id === editingProfile.id ? { ...p, email: inputEmail, name: inputName, role: inputRole } : p));
      } else {
        // Create in memory
        const newProfile: Profile = {
          id: Math.random().toString(),
          email: inputEmail,
          name: inputName,
          role: inputRole
        };
        setProfiles([...profiles, newProfile]);
      }
      setShowUserModal(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      return;
    }

    // Supabase integration
    if (editingProfile) {
      // Actualizar usuario
      try {
        // Primero actualizar el rol y nombre en profiles
        const updateData: any = {
          role: inputRole,
          updated_at: new Date().toISOString()
        };
        
        // Agregar nombre si existe
        if (inputName && inputName.trim() !== '') {
          updateData.name = inputName;
        }
        
        const { error: profileError } = await supabase
          .from('profiles')
          .update(updateData)
          .eq('id', editingProfile.id);

        if (profileError) {
          setErrorMessage(profileError.message);
          return;
        }

        // Si hay una nueva contraseña, llamar al backend para actualizarla
        if (inputPassword && inputPassword.trim() !== '') {
          const { data: { session } } = await supabase.auth.getSession();
          
          if (!session) {
            setErrorMessage("No estás autenticado");
            return;
          }

          const response = await fetch(`http://localhost:8000/api/v1/auth/users/${editingProfile.id}`, {
            method: 'PATCH',
            headers: {
              'Authorization': `Bearer ${session.access_token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              password: inputPassword
            })
          });

          if (!response.ok) {
            const error = await response.json();
            setErrorMessage(`Error al actualizar contraseña: ${error.detail || 'Error desconocido'}`);
            return;
          }
        }

        // Todo bien
        loadProfiles();
        setShowUserModal(false);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } catch (error) {
        setErrorMessage(`Error: ${error}`);
      }
    } else {
      // Crear nuevo usuario usando Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email: inputEmail,
        password: inputPassword,
        options: {
          data: {
            name: inputName || inputEmail.split('@')[0],
            role: inputRole
          }
        }
      });

      if (error) {
        setErrorMessage(error.message);
      } else {
        // Esperar un momento para que se cree el perfil automáticamente
        setTimeout(async () => {
          // Actualizar el nombre en el perfil
          if (data.user && inputName) {
            await supabase
              .from('profiles')
              .update({ name: inputName })
              .eq('id', data.user.id);
          }
          
          setErrorMessage(null);
          setSaveSuccess(true);
          setShowUserModal(false);
          setTimeout(() => {
            setSaveSuccess(false);
            loadProfiles();
          }, 1000);
        }, 1500);
      }
    }
  };

  const handleDeleteUser = async (profileId: string) => {
    if (profileId === currentUser?.id || profileId === '1') {
      setErrorMessage("No puedes eliminar a tu propio usuario administrador.");
      setTimeout(() => setErrorMessage(null), 4000);
      return;
    }

    // Confirmación
    if (!confirm('¿Estás seguro de eliminar este usuario? Esta acción no se puede deshacer.')) {
      return;
    }

    if (isDemo) {
      setProfiles(profiles.filter(p => p.id !== profileId));
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      return;
    }

    try {
      // Obtener el token del usuario actual
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        setErrorMessage("No estás autenticado");
        return;
      }

      // Llamar al endpoint del backend para eliminar el usuario
      const response = await fetch(`http://localhost:8000/api/v1/auth/users/${profileId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        // Usuario eliminado correctamente
        loadProfiles();
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        const error = await response.json();
        setErrorMessage(`Error: ${error.detail || 'No se pudo eliminar el usuario'}`);
      }
    } catch (err) {
      setErrorMessage("Error al conectar con el servidor. Asegúrate de que el backend esté corriendo.");
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="border border-[var(--border-color)] bg-[var(--bg-secondary)]/40 backdrop-blur rounded-2xl p-6 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Panel de Configuración</h2>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Modifica los parámetros operativos de tus proyectos y del ecosistema de IA.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex flex-wrap bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl p-1 gap-1 w-full xl:w-auto">
          <button 
            onClick={() => setActiveTab('project')}
            className={`flex-1 xl:flex-initial flex items-center justify-center gap-2 text-xs font-semibold px-4 py-2 rounded-lg transition cursor-pointer ${
              activeTab === 'project' 
                ? 'bg-gradient-to-r from-cyan-500 to-teal-500 text-white shadow-md' 
                : 'text-[var(--text-secondary)] hover:text-white'
            }`}
          >
            <FolderKanban className="w-3.5 h-3.5" /> Ajustes de Proyecto
          </button>
          
          <button 
            onClick={() => setActiveTab('users')}
            className={`flex-1 xl:flex-initial flex items-center justify-center gap-2 text-xs font-semibold px-4 py-2 rounded-lg transition cursor-pointer ${
              activeTab === 'users' 
                ? 'bg-gradient-to-r from-cyan-500 to-teal-500 text-white shadow-md' 
                : 'text-[var(--text-secondary)] hover:text-white'
            }`}
          >
            {!isSuperAdmin && <Lock className="w-3 h-3 text-amber-500" />}
            <Users className="w-3.5 h-3.5" /> Control de Usuarios
          </button>

          <button 
            onClick={() => setActiveTab('global')}
            className={`flex-1 xl:flex-initial flex items-center justify-center gap-2 text-xs font-semibold px-4 py-2 rounded-lg transition cursor-pointer ${
              activeTab === 'global' 
                ? 'bg-gradient-to-r from-cyan-500 to-teal-500 text-white shadow-md' 
                : 'text-[var(--text-secondary)] hover:text-white'
            }`}
          >
            {!isSuperAdmin && <Lock className="w-3 h-3 text-amber-500" />}
            <Settings className="w-3.5 h-3.5" /> Ajustes Globales (Super Admin)
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-xl text-xs flex items-center gap-2 max-w-md">
          <CheckCircle className="w-4.5 h-4.5 shrink-0" />
          <span>¡Acción guardada correctamente!</span>
        </div>
      )}

      {errorMessage && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-xs flex items-center gap-2 max-w-md">
          <AlertCircle className="w-4.5 h-4.5 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* --- TAB 1: PROJECT SETTINGS --- */}
      {activeTab === 'project' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <form onSubmit={handleSaveProject} className="card p-6 lg:col-span-2 space-y-6">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FolderKanban className="w-4 h-4 text-[var(--accent-cyan)]" /> Detalles del Proyecto
              </h3>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">Configura la identidad del espacio de desarrollo activo.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">Nombre del Proyecto</label>
                <input 
                  type="text" 
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg px-3.5 py-2 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-cyan)]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">Identificador Único</label>
                <input 
                  type="text" 
                  value="proj-alpha-001" 
                  disabled
                  className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] opacity-60 rounded-lg px-3.5 py-2 text-sm text-[var(--text-muted)]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">Repositorio de Código (Git)</label>
                <div className="flex items-center gap-2 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg px-3.5 py-2">
                  <GitBranch className="w-4 h-4 text-[var(--text-muted)]" />
                  <input 
                    type="text" 
                    value={projectRepo}
                    onChange={(e) => setProjectRepo(e.target.value)}
                    className="bg-transparent text-sm text-[var(--text-primary)] focus:outline-none flex-1"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">Almacenamiento MinIO (Bucket)</label>
                <div className="flex items-center gap-2 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg px-3.5 py-2">
                  <CloudLightning className="w-4 h-4 text-[var(--text-muted)]" />
                  <input 
                    type="text" 
                    value={projectBucket}
                    onChange={(e) => setProjectBucket(e.target.value)}
                    className="bg-transparent text-sm text-[var(--text-primary)] focus:outline-none flex-1"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[var(--border-color)] flex justify-end">
              <button 
                type="submit"
                className="bg-gradient-to-r from-cyan-500 to-teal-500 text-white px-5 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 hover:opacity-90 transition cursor-pointer"
              >
                <Save className="w-4 h-4" /> Guardar Cambios
              </button>
            </div>
          </form>

          <div className="card p-6 space-y-4">
            <h4 className="text-sm font-bold text-white">Nivel de Acceso del Proyecto</h4>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              Como miembro del equipo, estás autorizado para reconfigurar repositorios vinculados y buckets de documentos.
            </p>
            <div className="bg-[var(--bg-primary)]/50 border border-[var(--border-color)] rounded-xl p-3.5 text-xs text-[var(--text-muted)]">
              Cualquier cambio en la configuración del proyecto se registrará automáticamente en la <strong>Memoria Organizacional</strong> para auditoría de decisiones.
            </div>
          </div>
        </div>
      )}

      {/* --- TAB 2: USER CRUD (Super Admin Protected) --- */}
      {activeTab === 'users' && (
        <div className="grid grid-cols-1 gap-6">
          {!isSuperAdmin ? (
            <div className="card p-8 text-center flex flex-col items-center justify-center space-y-4 min-h-[300px]">
              <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
                <Lock className="w-6 h-6" />
              </div>
              <div className="max-w-md space-y-2">
                <h3 className="text-base font-bold text-white">Acceso Restringido (Super Admin)</h3>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  Solo los **Super Administradores** de la organización pueden agregar nuevos usuarios, modificar roles o eliminar miembros.
                </p>
              </div>
            </div>
          ) : (
            <div className="card p-6 space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Users className="w-4.5 h-4.5 text-[var(--accent-cyan)]" /> Gestión de Usuarios y Miembros
                  </h3>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">Controla quién tiene acceso a la organización y define sus roles.</p>
                </div>
                <button
                  onClick={handleOpenAddModal}
                  className="bg-gradient-to-r from-cyan-500 to-teal-500 text-white px-4 py-2.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 hover:opacity-90 transition cursor-pointer"
                >
                  <UserPlus className="w-4 h-4" /> Agregar Usuario
                </button>
              </div>

              {/* Users list table */}
              <div className="overflow-x-auto border border-[var(--border-color)] rounded-xl">
                <table className="w-full text-left text-sm">
                  <thead className="bg-[var(--bg-secondary)]/50 border-b border-[var(--border-color)] text-[var(--text-secondary)] text-[10px] font-bold uppercase tracking-wider">
                    <tr>
                      <th className="p-4">Nombre</th>
                      <th className="p-4">Correo Electrónico</th>
                      <th className="p-4">Rol</th>
                      <th className="p-4 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border-color)] text-[var(--text-primary)]">
                    {loadingUsers ? (
                      <tr>
                        <td colSpan={4} className="p-8 text-center text-xs text-[var(--text-muted)]">Cargando usuarios...</td>
                      </tr>
                    ) : profiles.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="p-8 text-center text-xs text-[var(--text-muted)]">No hay usuarios registrados.</td>
                      </tr>
                    ) : (
                      profiles.map((profile) => (
                        <tr key={profile.id} className="hover:bg-[var(--bg-card-hover)]/30 transition">
                          <td className="p-4 flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-400/25 to-cyan-500/25 flex items-center justify-center text-xs font-semibold text-[var(--accent-cyan)] uppercase border border-[var(--accent-cyan)]/25">
                              {profile.name?.substring(0, 2) || profile.email.substring(0, 2)}
                            </div>
                            <span className="font-semibold text-xs">{profile.name || 'Sin Nombre'}</span>
                          </td>
                          <td className="p-4 text-xs text-[var(--text-secondary)]">{profile.email}</td>
                          <td className="p-4">
                            <span className={`badge ${profile.role === 'super_admin' ? 'bg-amber-500/10 border border-amber-500/20 text-amber-400' : 'badge-pending'}`}>
                              {profile.role === 'super_admin' ? 'Super Admin' : 'Miembro'}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex justify-end gap-2.5">
                              <button 
                                onClick={() => handleOpenEditModal(profile)}
                                className="text-[var(--text-secondary)] hover:text-[var(--accent-cyan)] transition cursor-pointer"
                                title="Editar"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => handleDeleteUser(profile.id)}
                                className="text-[var(--text-secondary)] hover:text-red-400 transition cursor-pointer"
                                title="Eliminar"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* --- TAB 3: GLOBAL SETTINGS (Super Admin Protected) --- */}
      {activeTab === 'global' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {!isSuperAdmin ? (
            <div className="card p-8 lg:col-span-3 text-center flex flex-col items-center justify-center space-y-4 min-h-[300px]">
              <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
                <Lock className="w-6 h-6" />
              </div>
              <div className="max-w-md space-y-2">
                <h3 className="text-base font-bold text-white">Acceso Restringido (Super Admin)</h3>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  Esta sección contiene llaves API de infraestructura y parámetros globales del LLM. Solo los usuarios con rol de <strong>Super Administrador</strong> pueden acceder y realizar modificaciones.
                </p>
              </div>
            </div>
          ) : (
            <>
              <form onSubmit={handleSaveGlobal} className="card p-6 lg:col-span-2 space-y-6">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Key className="w-4 h-4 text-[var(--accent-cyan)]" /> Credenciales y Modelos
                  </h3>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">Control de credenciales globales del motor inteligente.</p>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">OpenAI API Key</label>
                      <input 
                        type="password" 
                        value={openaiKey}
                        onChange={(e) => setOpenaiKey(e.target.value)}
                        className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg px-3.5 py-2 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-cyan)]"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">Anthropic API Key</label>
                      <input 
                        type="password" 
                        value={anthropicKey}
                        onChange={(e) => setAnthropicKey(e.target.value)}
                        className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg px-3.5 py-2 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-cyan)]"
                      />
                    </div>
                  </div>

                  <hr className="border-[var(--border-color)] my-2" />

                  <div>
                    <h4 className="text-xs font-bold text-white flex items-center gap-2 mb-3">
                      <Bot className="w-4 h-4 text-[var(--accent-teal)]" /> Selección de Modelos de Agentes
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">Agente Supervisor (Orquestador)</label>
                        <select 
                          value={supervisorModel}
                          onChange={(e) => setSupervisorModel(e.target.value)}
                          className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg px-3.5 py-2 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-cyan)]"
                        >
                          <option value="gpt-4o">GPT-4o (Recomendado)</option>
                          <option value="claude-3-5-sonnet">Claude 3.5 Sonnet</option>
                          <option value="o1-mini">o1-mini (Razonamiento)</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">Agente Desarrollador (Codificación)</label>
                        <select 
                          value={coderModel}
                          onChange={(e) => setCoderModel(e.target.value)}
                          className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg px-3.5 py-2 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-cyan)]"
                        >
                          <option value="claude-3-5-sonnet">Claude 3.5 Sonnet (Recomendado)</option>
                          <option value="o1-mini">o1-mini (Razonamiento)</option>
                          <option value="gpt-4o-mini">GPT-4o Mini</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <hr className="border-[var(--border-color)] my-2" />

                  <div>
                    <h4 className="text-xs font-bold text-white flex items-center gap-2 mb-3">
                      <Database className="w-4 h-4 text-purple-400" /> Parámetros RAG & Memoria (pgvector)
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">Modelo de Embeddings</label>
                        <input 
                          type="text" 
                          value={embeddingModel}
                          onChange={(e) => setEmbeddingModel(e.target.value)}
                          className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg px-3.5 py-2 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-cyan)]"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">Límite de Tokens de Salida por Agente</label>
                        <input 
                          type="number" 
                          value={maxTokens}
                          onChange={(e) => setMaxTokens(Number(e.target.value))}
                          className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg px-3.5 py-2 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-cyan)]"
                        />
                      </div>
                    </div>
                  </div>

                </div>

                <div className="pt-4 border-t border-[var(--border-color)] flex justify-end">
                  <button 
                    type="submit"
                    className="bg-gradient-to-r from-cyan-500 to-teal-500 text-white px-5 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 hover:opacity-90 transition cursor-pointer"
                  >
                    <Save className="w-4 h-4" /> Guardar Configuración Global
                  </button>
                </div>
              </form>

              <div className="card p-6 space-y-4">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-500" /> Auditoría Super Admin
                </h4>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  Estás modificando el núcleo del sistema. Los cambios en los modelos de agentes afectarán inmediatamente el pipeline de compilación de código de todos los workspaces.
                </p>
                <div className="bg-[var(--bg-primary)]/50 border border-[var(--border-color)] rounded-xl p-3.5 text-xs text-[var(--text-muted)]">
                  Las credenciales se cifran antes de persistirse en la base de datos de <strong>Supabase</strong>.
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* --- ADD/EDIT USER DIALOG (MODAL) --- */}
      {showUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="card w-full max-w-md p-6 space-y-5 shadow-2xl relative">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <UserPlus className="w-4.5 h-4.5 text-[var(--accent-cyan)]" />
                {editingProfile ? 'Editar Miembro de Equipo' : 'Agregar Nuevo Miembro'}
              </h3>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">
                {editingProfile ? 'Actualiza los datos del perfil y roles en la organización.' : 'Registra un nuevo usuario con credenciales y permisos.'}
              </p>
            </div>

            <form onSubmit={handleSaveUser} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">Nombre Completo (Opcional)</label>
                <div className="flex items-center gap-2 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg px-3.5 py-2">
                  <User className="w-4 h-4 text-[var(--text-muted)]" />
                  <input 
                    type="text" 
                    value={inputName}
                    onChange={(e) => setInputName(e.target.value)}
                    placeholder="Carlos Pérez"
                    className="bg-transparent text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none flex-1"
                  />
                </div>
                {!editingProfile && (
                  <p className="text-[9px] text-[var(--text-muted)] mt-1">Se guardará en el perfil del usuario.</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">Correo Electrónico</label>
                <div className="flex items-center gap-2 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg px-3.5 py-2">
                  <Mail className="w-4 h-4 text-[var(--text-muted)]" />
                  <input 
                    type="email" 
                    required
                    value={inputEmail}
                    onChange={(e) => setInputEmail(e.target.value)}
                    placeholder="carlos@tairos.com"
                    className="bg-transparent text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none flex-1"
                    disabled={!!editingProfile}
                  />
                </div>
              </div>

              {!editingProfile && (
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">Contraseña Inicial</label>
                  <div className="flex items-center gap-2 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg px-3.5 py-2">
                    <Lock className="w-4 h-4 text-[var(--text-muted)]" />
                    <input 
                      type="password" 
                      required
                      value={inputPassword}
                      onChange={(e) => setInputPassword(e.target.value)}
                      placeholder="••••••••"
                      minLength={6}
                      className="bg-transparent text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none flex-1"
                    />
                  </div>
                  <p className="text-[9px] text-[var(--text-muted)] mt-1">Mínimo 6 caracteres.</p>
                </div>
              )}

              {editingProfile && (
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">Nueva Contraseña (Opcional)</label>
                  <div className="flex items-center gap-2 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg px-3.5 py-2">
                    <Lock className="w-4 h-4 text-[var(--text-muted)]" />
                    <input 
                      type="password" 
                      value={inputPassword}
                      onChange={(e) => setInputPassword(e.target.value)}
                      placeholder="Dejar vacío para no cambiar"
                      minLength={6}
                      className="bg-transparent text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none flex-1"
                    />
                  </div>
                  <p className="text-[9px] text-[var(--text-muted)] mt-1">Solo completa si quieres cambiar la contraseña (mínimo 6 caracteres).</p>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">Rol de Acceso</label>
                <div className="flex items-center gap-2 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg px-3.5 py-2">
                  <Shield className="w-4 h-4 text-[var(--text-muted)]" />
                  <select 
                    value={inputRole}
                    onChange={(e) => setInputRole(e.target.value)}
                    className="bg-transparent text-sm text-[var(--text-primary)] focus:outline-none flex-1 cursor-pointer"
                  >
                    <option value="member" className="bg-[var(--bg-secondary)]">Miembro Regular</option>
                    <option value="super_admin" className="bg-[var(--bg-secondary)] text-amber-400">Super Administrador</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-[var(--border-color)] flex justify-end gap-2.5">
                <button 
                  type="button"
                  onClick={() => setShowUserModal(false)}
                  className="bg-transparent border border-[var(--border-color)] hover:bg-[var(--bg-card-hover)]/30 text-[var(--text-secondary)] hover:text-white px-4 py-2 rounded-lg text-xs font-semibold transition cursor-pointer"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="bg-gradient-to-r from-cyan-500 to-teal-500 text-white px-5 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 hover:opacity-90 transition cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" /> {editingProfile ? 'Guardar Cambios' : 'Registrar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
