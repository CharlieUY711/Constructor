/* =====================================================
   Métodos de Envío API Service — Frontend ↔ Backend
   ===================================================== */
import { projectId, publicAnonKey } from '/utils/supabase/info';

const BASE = `https://${projectId}.supabase.co/functions/v1/api/metodos-envio`;
const HEADERS = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${publicAnonKey}`,
};

export interface MetodoEnvio {
  id: string;
  nombre: string;
  tipo: string;
  precio: number;
  zona?: string;
  tiempo_estimado?: string;
  descripcion?: string;
  activo: boolean;
  orden: number;
  created_at: string;
}

/* ── Helpers ── */
async function apiGet<T>(path: string): Promise<{ ok: boolean; data?: T; error?: string }> {
  try {
    const res = await fetch(`${BASE}${path}`, { headers: HEADERS });
    return await res.json();
  } catch (err) {
    console.error(`Métodos Envío API GET ${path}:`, err);
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
    console.error(`Métodos Envío API POST ${path}:`, err);
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
    console.error(`Métodos Envío API PUT ${path}:`, err);
    return { ok: false, error: String(err) };
  }
}

async function apiDelete(path: string): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await fetch(`${BASE}${path}`, { method: 'DELETE', headers: HEADERS });
    return await res.json();
  } catch (err) {
    console.error(`Métodos Envío API DELETE ${path}:`, err);
    return { ok: false, error: String(err) };
  }
}

/* ── Public API ── */

/** Get all métodos de envío with optional filters */
export async function getMetodosEnvio(params?: { activo?: boolean }): Promise<MetodoEnvio[]> {
  const queryParams = new URLSearchParams();
  if (params?.activo !== undefined) queryParams.set('activo', String(params.activo));
  
  const res = await apiGet<MetodoEnvio[]>(queryParams.toString() ? `?${queryParams}` : '');
  if (!res.ok || !res.data) return [];
  return res.data;
}

/** Get a single método de envío by ID */
export async function getMetodoEnvio(id: string): Promise<MetodoEnvio | null> {
  const res = await apiGet<MetodoEnvio>(`/${id}`);
  if (!res.ok || !res.data) return null;
  return res.data;
}

/** Create a new método de envío */
export async function createMetodoEnvio(data: Partial<MetodoEnvio>): Promise<MetodoEnvio | null> {
  const res = await apiPost<MetodoEnvio>('', data);
  if (!res.ok || !res.data) return null;
  return res.data;
}

/** Update a método de envío */
export async function updateMetodoEnvio(id: string, data: Partial<MetodoEnvio>): Promise<MetodoEnvio | null> {
  const res = await apiPut<MetodoEnvio>(`/${id}`, data);
  if (!res.ok || !res.data) return null;
  return res.data;
}

/** Delete a método de envío */
export async function deleteMetodoEnvio(id: string): Promise<boolean> {
  const res = await apiDelete(`/${id}`);
  return res.ok;
}
