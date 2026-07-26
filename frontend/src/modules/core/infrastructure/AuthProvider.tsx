"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from './supabase';
import { useRouter, usePathname } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  role: string | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  role: null,
  loading: true,
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const fetchUserRole = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();
      
      if (data && !error) {
        setRole(data.role);
      } else {
        setRole('member'); // Default fallback
      }
    } catch {
      setRole('member');
    }
  };

  useEffect(() => {
    // 1. Check for Demo Mode bypass
    const isDemo = localStorage.getItem('tairos_demo_mode') === 'true';
    if (isDemo) {
      const mockUser = {
        id: 'demo-user-id',
        email: 'carlos.demo@tairos.com',
        user_metadata: { name: 'Carlos Demo' }
      } as any;
      setUser(mockUser);
      setSession({ user: mockUser } as any);
      setRole('super_admin'); // Demo mode gives full Super Admin rights
      setLoading(false);
      return;
    }

    // 2. Otherwise, check real Supabase active session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        await fetchUserRole(session.user.id);
      } else {
        setRole(null);
      }
      
      setLoading(false);
      
      // If no session and not on login, redirect to login
      if (!session && pathname !== '/login') {
        router.push('/login');
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      // Bypassed if demo mode active
      if (localStorage.getItem('tairos_demo_mode') === 'true') return;

      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        await fetchUserRole(session.user.id);
      } else {
        setRole(null);
      }

      setLoading(false);

      if (event === 'SIGNED_IN' && session) {
        router.push('/');
      } else if (event === 'SIGNED_OUT') {
        router.push('/login');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router, pathname]);

  const signOut = async () => {
    localStorage.removeItem('tairos_demo_mode');
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setRole(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, session, role, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
export { AuthContext };
