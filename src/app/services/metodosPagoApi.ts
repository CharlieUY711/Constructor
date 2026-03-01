/* =====================================================
   Métodos de Pago API Service — Frontend ↔ Backend
   ===================================================== */
import { apiUrl, publicAnonKey } from '../../utils/supabase/client';

const BASE = `${apiUrl}/metodos-pago`;
const HEADERS = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${publicAnonKey}`,
};

export interface MetodoPago {
  id: string;
  nombre: string;
  tipo: string;
  proveedor?: string;
  descripcion?: string;
  instrucciones?: string;
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
    console.error(`Métodos Pago API GET ${path}:`, err);
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
    console.error(`Métodos Pago API POST ${path}:`, err);
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
    console.error(`Métodos Pago API PUT ${path}:`, err);
    return { ok: false, error: String(err) };
  }
}

async function apiDelete(path: string): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await fetch(`${BASE}${path}`, { method: 'DELETE', headers: HEADERS });
    return await res.json();
  } catch (err) {
    console.error(`Métodos Pago API DELETE ${path}:`, err);
    return { ok: false, error: String(err) };
  }
}

/* ── Public API ── */

/** Get all métodos de pago with optional filters */
export async function getMetodosPago(params?: { activo?: boolean }): Promise<MetodoPago[]> {
  const queryParams = new URLSearchParams();
  if (params?.activo !== undefined) queryParams.set('activo', String(params.activo));
  
  const res = await apiGet<MetodoPago[]>(queryParams.toString() ? `?${queryParams}` : '');
  if (!res.ok || !res.data) return [];
  return res.data;
}

/** Get a single método de pago by ID */
export async function getMetodoPago(id: string): Promise<MetodoPago | null> {
  const res = await apiGet<MetodoPago>(`/${id}`);
  if (!res.ok || !res.data) return null;
  return res.data;
}

/** Create a new método de pago */
export async function createMetodoPago(data: Partial<MetodoPago>): Promise<MetodoPago | null> {
  const res = await apiPost<MetodoPago>('', data);
  if (!res.ok || !res.data) return null;
  return res.data;
}

/** Update a método de pago */
export async function updateMetodoPago(id: string, data: Partial<MetodoPago>): Promise<MetodoPago | null> {
  const res = await apiPut<MetodoPago>(`/${id}`, data);
  if (!res.ok || !res.data) return null;
  return res.data;
}

/** Delete a método de pago */
export async function deleteMetodoPago(id: string): Promise<boolean> {
  const res = await apiDelete(`/${id}`);
  return res.ok;
}
