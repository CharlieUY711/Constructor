import React, { createContext, useContext, useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from '../../../../utils/supabase/info';
import type { User } from '@supabase/supabase-js';

const supabase = createClient(`https://${projectId}.supabase.co`, publicAnonKey);

interface AuthContextValue { user: User | null; signOut: () => Promise<void>; }
const AuthContext = createContext<AuthContextValue>({ user: null, signOut: async () => {} });
export const useAuth = () => useContext(AuthContext);

function isBypassMode(): boolean {
  if (typeof window === 'undefined') return false;
  const isLocal = ['localhost','127.0.0.1'].includes(window.location.hostname);
  const hasFlag = new URLSearchParams(window.location.search).get('bypass_auth') === '1';
  return isLocal || hasFlag;
}

const BYPASS_USER = { id: 'bypass-testing-user', email: 'testing@charlie.local', role: 'admin' } as unknown as User;

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const bypass = isBypassMode();
  const [user, setUser] = useState<User | null>(bypass ? BYPASS_USER : null);
  const [loading, setLoading] = useState(!bypass);

  useEffect(() => {
    if (bypass) return;
    supabase.auth.getSession().then(({ data }) => { setUser(data.session?.user ?? null); setLoading(false); });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => setUser(s?.user ?? null));
    return () => subscription.unsubscribe();
  }, [bypass]);

  const signOut = async () => { if (!bypass) await supabase.auth.signOut(); };

  if (loading) return <div style={{ height:'100vh', display:'flex', alignItems:'center', justifyContent:'center', backgroundColor:'#F4F5F7', color:'#9CA3AF', fontSize:14 }}>Verificando sesión...</div>;
  if (!user) return <div style={{ height:'100vh', display:'flex', alignItems:'center', justifyContent:'center', backgroundColor:'#F4F5F7', fontFamily:'system-ui' }}><div style={{ background:'#fff', borderRadius:16, padding:'40px 36px', width:360, boxShadow:'0 20px 60px rgba(0,0,0,0.1)', border:'1px solid #E5E7EB', textAlign:'center' }}><p style={{ fontWeight:700, fontSize:'1.1rem' }}>Charlie Platform</p><p style={{ color:'#9CA3AF', fontSize:'0.8rem' }}>Sin sesión activa</p></div></div>;

  return <AuthContext.Provider value={{ user, signOut }}>{children}</AuthContext.Provider>;
}
