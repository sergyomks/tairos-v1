"use client";

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Search, Bell, Zap, LogOut, Sun, Moon, Settings, Database, Activity, LayoutDashboard } from "lucide-react";
import "./globals.css";
import AuthProvider, { useAuth } from '@/modules/core/infrastructure/AuthProvider';

function NavigationWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { loading, user, signOut } = useAuth();
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  // Load and apply theme on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('tairos_theme') as 'dark' | 'light' | null;
    const initialTheme = savedTheme || 'dark';
    setTheme(initialTheme);
    if (initialTheme === 'light') {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('tairos_theme', newTheme);
    if (newTheme === 'light') {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-10 h-10 rounded-lg bg-[var(--accent-cyan)]/20 border border-[var(--accent-cyan)]/30 flex items-center justify-center spinner mx-auto">
            <Zap className="w-5 h-5 text-[var(--accent-cyan)]" />
          </div>
          <p className="text-xs text-[var(--text-muted)] tracking-wider font-semibold uppercase">Cargando Tairos OS...</p>
        </div>
      </div>
    );
  }

  // Not logged in and not on login route, render nothing (AuthProvider handles redirect)
  if (!user && pathname !== '/login') {
    return null;
  }

  // If on login, render without top navigation
  if (pathname === '/login') {
    return <>{children}</>;
  }

  return (
    <div className="relative z-10 min-h-screen flex flex-col">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 border-b border-[var(--border-color)] bg-[var(--bg-secondary)]/80 backdrop-blur-xl">
        <div className="w-full flex items-center justify-between px-4 md:px-8 py-3">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-400 to-teal-500 flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold tracking-tight text-white leading-none">
                TAIROS OS
              </h1>
              <p className="text-[10px] text-[var(--text-muted)] tracking-widest uppercase mt-0.5">
                Software Factory de IA Colaborativa
              </p>
            </div>
          </div>

          {/* Search */}
          <div className="hidden md:flex items-center gap-2 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg px-3.5 py-2 w-64">
            <Search className="w-4 h-4 text-[var(--text-muted)]" />
            <input
              type="text"
              placeholder="Buscar..."
              className="bg-transparent text-sm text-[var(--text-secondary)] placeholder:text-[var(--text-muted)] focus:outline-none flex-1"
            />
          </div>

          {/* Nav Links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium">
            <a href="/" className={`nav-link ${pathname === '/' ? 'active' : ''}`}>Workspace</a>
            <a href="/library" className={`nav-link ${pathname === '/library' ? 'active' : ''}`}>Biblioteca</a>
            <a href="/radar" className={`nav-link ${pathname === '/radar' ? 'active' : ''}`}>Radar IA</a>
            <a href="/dashboard" className={`nav-link ${pathname === '/dashboard' ? 'active' : ''}`}>Dashboard</a>
            <a href="/settings" className={`nav-link ${pathname === '/settings' ? 'active' : ''}`}>Configuración</a>
          </nav>

          {/* User & Actions */}
          <div className="flex items-center gap-4">
            {/* Theme switcher */}
            <button 
              onClick={toggleTheme}
              className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition cursor-pointer"
              title={theme === 'dark' ? "Cambiar a Modo Claro" : "Cambiar a Modo Oscuro"}
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            <button className="relative text-[var(--text-muted)] hover:text-[var(--text-primary)] transition cursor-pointer">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[var(--accent-cyan)]" />
            </button>
            
            <div className="flex items-center gap-2.5 border-r border-[var(--border-color)] pr-4">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center text-xs font-bold text-white uppercase">
                {user?.email?.substring(0, 2) || 'AR'}
              </div>
              <div className="hidden sm:block text-left">
                <span className="text-xs font-semibold text-[var(--text-primary)] block leading-none">
                  {user?.user_metadata?.name || user?.email?.split('@')[0]}
                </span>
                <span className="text-[10px] text-[var(--text-muted)] block mt-0.5">
                  {user?.email === 'carlos.demo@tairos.com' ? 'Modo Demo' : 'Usuario'}
                </span>
              </div>
            </div>

            {/* Logout button */}
            <button 
              onClick={signOut}
              className="text-[var(--text-muted)] hover:text-red-400 transition cursor-pointer"
              title="Cerrar Sesión"
            >
              <LogOut className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Container spans full width */}
      <main className="flex-1 w-full px-4 md:px-8 py-6 space-y-6 pb-20 lg:pb-6">
        {children}
      </main>

      {/* Mobile Bottom Navigation (Visible only on mobile/tablet) */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-[var(--border-color)] bg-[var(--bg-secondary)]/90 backdrop-blur-lg flex justify-around py-3 px-4 shadow-lg">
        <a href="/" className={`flex flex-col items-center gap-1 text-[10px] font-semibold transition ${pathname === '/' ? 'text-[var(--accent-cyan)] font-bold' : 'text-[var(--text-muted)] hover:text-white'}`}>
          <Zap className="w-5 h-5" />
          <span>Workspace</span>
        </a>
        <a href="/library" className={`flex flex-col items-center gap-1 text-[10px] font-semibold transition ${pathname === '/library' ? 'text-[var(--accent-cyan)] font-bold' : 'text-[var(--text-muted)] hover:text-white'}`}>
          <Database className="w-5 h-5" />
          <span>Biblioteca</span>
        </a>
        <a href="/radar" className={`flex flex-col items-center gap-1 text-[10px] font-semibold transition ${pathname === '/radar' ? 'text-[var(--accent-cyan)] font-bold' : 'text-[var(--text-muted)] hover:text-white'}`}>
          <Activity className="w-5 h-5" />
          <span>Radar IA</span>
        </a>
        <a href="/dashboard" className={`flex flex-col items-center gap-1 text-[10px] font-semibold transition ${pathname === '/dashboard' ? 'text-[var(--accent-cyan)] font-bold' : 'text-[var(--text-muted)] hover:text-white'}`}>
          <LayoutDashboard className="w-5 h-5" />
          <span>Dashboard</span>
        </a>
        <a href="/settings" className={`flex flex-col items-center gap-1 text-[10px] font-semibold transition ${pathname === '/settings' ? 'text-[var(--accent-cyan)] font-bold' : 'text-[var(--text-muted)] hover:text-white'}`}>
          <Settings className="w-5 h-5" />
          <span>Configurar</span>
        </a>
      </nav>
    </div>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="antialiased min-h-screen flex flex-col bg-[var(--bg-primary)]">
        <AuthProvider>
          <NavigationWrapper>
            {children}
          </NavigationWrapper>
        </AuthProvider>
      </body>
    </html>
  );
}
