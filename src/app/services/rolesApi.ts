/* =====================================================
   Roles API Service — Frontend ↔ Backend
   ===================================================== */
import { apiUrl, publicAnonKey } from '../../utils/supabase/client';

const BASE = `${apiUrl}/roles`;
const HEADERS = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${publicAnonKey}`,
};

export interface Rol {
  id: string;
  persona_id?: string;
  organizacion_id?: string;
  rol: string;
  contexto?: string;
  activo: boolean;
  created_at: string;
  persona?: { id: string; nombre: string; apellido?: string; email?: string; tipo: string; telefono?: string };
  organizacion?: { id: string; nombre: string; tipo?: string };
}

/* ── Helpers ── */
async function apiGet<T>(path: string): Promise<{ ok: boolean; data?: T; error?: string }> {
  try {
    const res = await fetch(`${BASE}${path}`, { headers: HEADERS });
    return await res.json();
  } catch (err) {
    console.error(`Roles API GET ${path}:`, err);
    return { ok: false, error: String(err) };
  }
}

async function apiPost<T>(path: string, body?: unknown): Promise<{ ok: boolean; data?: T; error?: string } & Record<string, unknown>> {
  try {
    const res = await fetch(`${BASE}${path}`, {
      method: 'POST',
      headers: HEADERS,
      body: body ? JSON.stringify(body) : undefined,
    });
    return await res.json();
  } catch (err) {
    console.error(`Roles API POST ${path}:`, err);
    return { ok: false, error: String(err) };
  }
}

async function apiPut<T>(path: string, body?: unknown): Promise<{ ok: boolean; data?: T; error?: string }> {
  try {
    const res = await fetch(`${BASE}${path}`, {
      method: 'PUT',
      headers: HEADERS,
      body: body ? JSON.stringify(body) : undefined,
    });
    return await res.json();
  } catch (err) {
    console.error(`Roles API PUT ${path}:`, err);
    return { ok: false, error: String(err) };
  }
}

async function apiDelete(path: string): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await fetch(`${BASE}${path}`, { method: 'DELETE', headers: HEADERS });
    return await res.json();
  } catch (err) {
    console.error(`Roles API DELETE ${path}:`, err);
    return { ok: false, error: String(err) };
  }
}

/* ── Public API ── */

/** Get all roles with optional filters */
export async function getRoles(params?: { persona_id?: string; organizacion_id?: string; rol?: string; activo?: boolean }): Promise<Rol[]> {
  const queryParams = new URLSearchParams();
  if (params?.persona_id) queryParams.set('persona_id', params.persona_id);
  if (params?.organizacion_id) queryParams.set('organizacion_id', params.organizacion_id);
  if (params?.rol) queryParams.set('rol', params.rol);
  if (params?.activo !== undefined) queryParams.set('activo', String(params.activo));
  
  const res = await apiGet<Rol[]>(queryParams.toString() ? `?${queryParams}` : '');
  if (!res.ok || !res.data) return [];
  return res.data;
}

/** Get a single rol by ID */
export async function getRol(id: string): Promise<Rol | null> {
  const res = await apiGet<Rol>(`/${id}`);
  if (!res.ok || !res.data) return null;
  return res.data;
}

/** Create a new rol */
export async function createRol(data: Partial<Rol>): Promise<Rol | null> {
  const res = await apiPost<Rol>('', data);
  if (!res.ok || !res.data) return null;
  return res.data;
}

/** Update a rol */
export async function updateRol(id: string, data: Partial<Rol>): Promise<Rol | null> {
  const res = await apiPut<Rol>(`/${id}`, data);
  if (!res.ok || !res.data) return null;
  return res.data;
}

/** Delete a rol */
export async function deleteRol(id: string): Promise<boolean> {
  const res = await apiDelete(`/${id}`);
  return res.ok;
}
