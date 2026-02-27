/* =====================================================
   Organizaciones API Service — Frontend ↔ Backend
   ===================================================== */
import { projectId, publicAnonKey } from '/utils/supabase/info';

const BASE = `https://${projectId}.supabase.co/functions/v1/api/organizaciones`;
const HEADERS = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${publicAnonKey}`,
};

export interface Organizacion {
  id: string;
  nombre: string;
  tipo?: string;
  industria?: string;
  email?: string;
  telefono?: string;
  sitio_web?: string;
  direccion?: Record<string, string>;
  metadata?: Record<string, unknown>;
  activo: boolean;
  created_at: string;
}

/* ── Helpers ── */
async function apiGet<T>(path: string): Promise<{ ok: boolean; data?: T; error?: string }> {
  try {
    const res = await fetch(`${BASE}${path}`, { headers: HEADERS });
    return await res.json();
  } catch (err) {
    console.error(`Organizaciones API GET ${path}:`, err);
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
    console.error(`Organizaciones API POST ${path}:`, err);
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
    console.error(`Organizaciones API PUT ${path}:`, err);
    return { ok: false, error: String(err) };
  }
}

async function apiDelete(path: string): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await fetch(`${BASE}${path}`, { method: 'DELETE', headers: HEADERS });
    return await res.json();
  } catch (err) {
    console.error(`Organizaciones API DELETE ${path}:`, err);
    return { ok: false, error: String(err) };
  }
}

/* ── Public API ── */

/** Get all organizaciones with optional filters */
export async function getOrganizaciones(params?: { tipo?: string; activo?: boolean; search?: string }): Promise<Organizacion[]> {
  const queryParams = new URLSearchParams();
  if (params?.tipo) queryParams.set('tipo', params.tipo);
  if (params?.activo !== undefined) queryParams.set('activo', String(params.activo));
  if (params?.search) queryParams.set('search', params.search);
  
  const res = await apiGet<Organizacion[]>(queryParams.toString() ? `?${queryParams}` : '');
  if (!res.ok || !res.data) return [];
  return res.data;
}

/** Get a single organizacion by ID */
export async function getOrganizacion(id: string): Promise<Organizacion | null> {
  const res = await apiGet<Organizacion>(`/${id}`);
  if (!res.ok || !res.data) return null;
  return res.data;
}

/** Create a new organizacion */
export async function createOrganizacion(data: Partial<Organizacion>): Promise<Organizacion | null> {
  const res = await apiPost<Organizacion>('', data);
  if (!res.ok || !res.data) return null;
  return res.data;
}

/** Update a organizacion */
export async function updateOrganizacion(id: string, data: Partial<Organizacion>): Promise<Organizacion | null> {
  const res = await apiPut<Organizacion>(`/${id}`, data);
  if (!res.ok || !res.data) return null;
  return res.data;
}

/** Delete a organizacion */
export async function deleteOrganizacion(id: string): Promise<boolean> {
  const res = await apiDelete(`/${id}`);
  return res.ok;
}
