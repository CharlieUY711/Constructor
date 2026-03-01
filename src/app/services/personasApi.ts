/* =====================================================
   Personas API Service — Frontend ↔ Backend
   ===================================================== */
import { apiUrl, publicAnonKey } from '../../utils/supabase/client';

const BASE = `${apiUrl}/personas`;
const HEADERS = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${publicAnonKey}`,
};

export interface Persona {
  id: string;
  tipo: 'natural' | 'juridica';
  nombre: string;
  apellido?: string;
  email?: string;
  telefono?: string;
  documento_tipo?: string;
  documento_numero?: string;
  fecha_nacimiento?: string;
  genero?: string;
  nacionalidad?: string;
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
    console.error(`Personas API GET ${path}:`, err);
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
    console.error(`Personas API POST ${path}:`, err);
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
    console.error(`Personas API PUT ${path}:`, err);
    return { ok: false, error: String(err) };
  }
}

async function apiDelete(path: string): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await fetch(`${BASE}${path}`, { method: 'DELETE', headers: HEADERS });
    return await res.json();
  } catch (err) {
    console.error(`Personas API DELETE ${path}:`, err);
    return { ok: false, error: String(err) };
  }
}

/* ── Public API ── */

/** Get all personas with optional filters */
export async function getPersonas(params?: { tipo?: string; activo?: boolean; rol?: string; search?: string }): Promise<Persona[]> {
  const queryParams = new URLSearchParams();
  if (params?.tipo) queryParams.set('tipo', params.tipo);
  if (params?.activo !== undefined) queryParams.set('activo', String(params.activo));
  if (params?.rol) queryParams.set('rol', params.rol);
  if (params?.search) queryParams.set('search', params.search);
  
  const res = await apiGet<Persona[]>(queryParams.toString() ? `?${queryParams}` : '');
  if (!res.ok || !res.data) return [];
  return res.data;
}

/** Get a single persona by ID */
export async function getPersona(id: string): Promise<Persona | null> {
  const res = await apiGet<Persona>(`/${id}`);
  if (!res.ok || !res.data) return null;
  return res.data;
}

/** Create a new persona */
export async function createPersona(data: Partial<Persona>): Promise<Persona | null> {
  const res = await apiPost<Persona>('', data);
  if (!res.ok || !res.data) return null;
  return res.data;
}

/** Update a persona */
export async function updatePersona(id: string, data: Partial<Persona>): Promise<Persona | null> {
  const res = await apiPut<Persona>(`/${id}`, data);
  if (!res.ok || !res.data) return null;
  return res.data;
}

/** Delete a persona */
export async function deletePersona(id: string): Promise<boolean> {
  const res = await apiDelete(`/${id}`);
  return res.ok;
}
