"use client";

import React, { useState } from 'react';
import { supabase } from '@/modules/core/infrastructure/supabase';
import { Zap, Mail, Lock, AlertCircle, Bot } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setError(error.message === "Invalid login credentials" ? "Credenciales de acceso incorrectas." : error.message);
    } else {
      router.push('/');
    }
    setLoading(false);
  };

  // Demo mode handler for rapid preview/mocking
  const handleDemoMode = () => {
    // We set a dummy session item in localStorage to simulate logged-in state if needed,
    // but we can also just redirect.
    localStorage.setItem('tairos_demo_mode', 'true');
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Ambient background glow */}
      <div className="absolute inset-0 bg-radial-gradient(ellipse 60% 40% at 50% 50%, rgba(6, 182, 212, 0.07), transparent) pointer-events-none z-0" />
      
      <div className="card w-full max-w-[420px] p-8 space-y-6 relative z-10">
        
        {/* Logo and header */}
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400 to-teal-500 flex items-center justify-center shadow-lg">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white uppercase leading-none">
              TAIROS OS
            </h1>
            <p className="text-xs text-[var(--text-muted)] tracking-wider mt-1.5">
              Sistema Operativo de Inteligencia Organizacional
            </p>
          </div>
        </div>

        {/* Alert Error */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Input Form */}
        <form onSubmit={handleAuth} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
              Correo Electrónico
            </label>
            <div className="flex items-center gap-2 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg px-3.5 py-2.5">
              <Mail className="w-4 h-4 text-[var(--text-muted)]" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="usuario@organizacion.com"
                className="bg-transparent text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none flex-1"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
              Contraseña
            </label>
            <div className="flex items-center gap-2 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg px-3.5 py-2.5">
              <Lock className="w-4 h-4 text-[var(--text-muted)]" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="bg-transparent text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none flex-1"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-cyan-500 to-teal-500 text-white py-3 rounded-lg font-semibold text-sm hover:opacity-90 transition shadow-md cursor-pointer flex items-center justify-center gap-2"
          >
            {loading ? "Procesando..." : "Iniciar Sesión"}
          </button>
        </form>

        <div className="relative flex py-2 items-center justify-center">
          <div className="flex-grow border-t border-[var(--border-color)]"></div>
          <span className="flex-shrink mx-4 text-[10px] text-[var(--text-muted)] uppercase tracking-widest font-semibold">o prueba sin cuenta</span>
          <div className="flex-grow border-t border-[var(--border-color)]"></div>
        </div>

        {/* Demo mode button */}
        <button
          onClick={handleDemoMode}
          className="w-full border border-[var(--border-color)] hover:border-[var(--accent-cyan)]/30 bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-white py-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer"
        >
          <Bot className="w-4 h-4 text-[var(--accent-cyan)]" /> Acceder en Modo Demostración
        </button>

      </div>
    </div>
  );
}
