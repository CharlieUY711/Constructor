import React, { createContext, useContext } from 'react';
import type { User } from '@supabase/supabase-js';

interface AuthContextValue { user: User | null; signOut: () => Promise<void>; }
const AuthContext = createContext<AuthContextValue>({ user: null, signOut: async () => {} });
export const useAuth = () => useContext(AuthContext);

const BYPASS_USER = { id: 'bypass-testing-user', email: 'testing@charlie.local', role: 'admin' } as unknown as User;

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <AuthContext.Provider value={{ user: BYPASS_USER, signOut: async () => {} }}>
      {children}
    </AuthContext.Provider>
  );
}
