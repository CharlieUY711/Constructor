#!/bin/bash
# ══════════════════════════════════════════════════════════════════════════════
# deploy-bypass-auth.sh
# Aplica bypass de login para testing y hace commit+push a Vercel
#
# USO:
#   1. Copiá este script en la raíz del proyecto (constructor/)
#   2. chmod +x deploy-bypass-auth.sh
#   3. ./deploy-bypass-auth.sh
# ══════════════════════════════════════════════════════════════════════════════

set -e

TARGET="src/shells/DashboardShell/app/providers/AuthProvider.tsx"

echo "🔧 Aplicando bypass de auth para testing..."

cat > "$TARGET" << 'AUTHEOF'
/**
 * AuthProvider.tsx — versión bypass testing
 *
 * Bypass activo cuando:
 *   - hostname === 'localhost' o '127.0.0.1'
 *   - URL contiene ?bypass_auth=1
 *
 * En producción (dominio real sin el flag) sigue pidiendo login normal.
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from '../../../../utils/supabase/info';
import type { User } from '@supabase/supabase-js';

const supabase = createClient(
  `https://${projectId}.supabase.co`,
  publicAnonKey
);

interface AuthContextValue {
  user:    User | null;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  user:    null,
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

// ── Detectar modo bypass ───────────────────────────────────────────────────────

function isBypassMode(): boolean {
  if (typeof window === 'undefined') return false;
  const hostname = window.location.hostname;
  const isLocal  = hostname === 'localhost' || hostname === '127.0.0.1';
  const hasFlag  = new URLSearchParams(window.location.search).get('bypass_auth') === '1';
  return isLocal || hasFlag;
}

// ── Usuario ficticio para testing ─────────────────────────────────────────────

const BYPASS_USER = {
  id:    'bypass-testing-user',
  email: 'testing@charlie.local',
  role:  'admin',
} as unknown as User;

// ── Login Screen ──────────────────────────────────────────────────────────────

function LoginScreen() {
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState<string | null>(null);
  const [showPass, setShowPass] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) return;
    setLoading(true);
    setError(null);
    const { error: sbError } = await supabase.auth.signInWithPassword({ email, password });
    if (sbError) setError('Email o contraseña incorrectos');
    setLoading(false);
  };

  return (
    <div style={{
      height: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', backgroundColor: '#F4F5F7',
      fontFamily: 'system-ui, sans-serif',
    }}>
      <div style={{
        backgroundColor: '#fff', borderRadius: '16px', padding: '40px 36px',
        width: '360px', boxShadow: '0 20px 60px rgba(0,0,0,0.10)',
        border: '1px solid #E5E7EB',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '52px', height: '52px', borderRadius: '14px',
            backgroundColor: 'var(--shell-primary, #6366F1)',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.2rem', fontWeight: '800', color: '#fff', marginBottom: '12px',
          }}>C</div>
          <p style={{ margin: 0, fontWeight: '700', fontSize: '1.1rem', color: '#111' }}>
            Charlie Platform
          </p>
          <p style={{ margin: '4px 0 0', fontSize: '0.78rem', color: '#9CA3AF' }}>
            Ingresá a tu cuenta de administrador
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <input
            type="email" placeholder="correo@ejemplo.com" value={email}
            onChange={e => setEmail(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
            style={{ padding: '11px 14px', borderRadius: '9px',
              border: '1.5px solid #E5E7EB', fontSize: '0.88rem',
              outline: 'none', color: '#111' }}
          />
          <div style={{ position: 'relative' }}>
            <input
              type={showPass ? 'text' : 'password'}
              placeholder="Contraseña" value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              style={{ width: '100%', padding: '11px 40px 11px 14px',
                borderRadius: '9px', border: '1.5px solid #E5E7EB',
                fontSize: '0.88rem', outline: 'none', color: '#111',
                boxSizing: 'border-box' }}
            />
            <button onClick={() => setShowPass(p => !p)} style={{
              position: 'absolute', right: '12px', top: '50%',
              transform: 'translateY(-50%)', background: 'none',
              border: 'none', cursor: 'pointer', color: '#9CA3AF', fontSize: '0.75rem',
            }}>{showPass ? '🙈' : '👁'}</button>
          </div>

          {error && (
            <div style={{ padding: '10px 14px', borderRadius: '8px',
              backgroundColor: '#FEF2F2', border: '1px solid #FCA5A5',
              fontSize: '0.8rem', color: '#991B1B', fontWeight: '600' }}>
              {error}
            </div>
          )}

          <button onClick={handleLogin} disabled={loading || !email || !password}
            style={{ padding: '12px', borderRadius: '10px', border: 'none',
              backgroundColor: 'var(--shell-primary, #6366F1)',
              color: '#fff', fontSize: '0.92rem', fontWeight: '700',
              cursor: loading || !email || !password ? 'not-allowed' : 'pointer',
              opacity: loading || !email || !password ? 0.6 : 1, marginTop: '4px' }}>
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Provider ──────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const bypass = isBypassMode();
  const [user,    setUser]    = useState<User | null>(bypass ? BYPASS_USER : null);
  const [loading, setLoading] = useState(!bypass);

  useEffect(() => {
    if (bypass) return;

    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [bypass]);

  const signOut = async () => {
    if (bypass) return;
    await supabase.auth.signOut();
  };

  if (loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center',
        justifyContent: 'center', backgroundColor: '#F4F5F7',
        fontFamily: 'system-ui, sans-serif', color: '#9CA3AF', fontSize: 14 }}>
        Verificando sesión...
      </div>
    );
  }

  if (!user) return <LoginScreen />;

  return (
    <AuthContext.Provider value={{ user, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
AUTHEOF

echo "✅ AuthProvider actualizado"
echo ""

# ── Git commit + push ──────────────────────────────────────────────────────────

echo "📦 Haciendo commit..."
git add "$TARGET"
git commit -m "feat: bypass auth para testing (localhost + ?bypass_auth=1)"

echo ""
echo "🚀 Pusheando a origin..."
git push origin master

echo ""
echo "══════════════════════════════════════════════════"
echo "✅ Listo. Vercel va a deployar automáticamente."
echo ""
echo "Para entrar sin login:"
echo "  • Localhost:  http://localhost:5173  (automático)"
echo "  • Vercel/staging: https://tu-app.vercel.app/admin?bypass_auth=1"
echo "══════════════════════════════════════════════════"
