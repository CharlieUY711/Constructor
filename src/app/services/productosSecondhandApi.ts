/* =====================================================
   Productos Second Hand API Service — Frontend ↔ Backend
   ===================================================== */
import { projectId, publicAnonKey } from '/utils/supabase/info';

const BASE = `https://${projectId}.supabase.co/functions/v1/api/productos/secondhand`;
const HEADERS = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${publicAnonKey}`,
};

export interface ProductoSecondHand {
  id: string;
  nombre: string;
  descripcion: string;
  precio_1: number;
  estado: string;
  condicion: string;
  imagen_principal?: string;
  imagenes?: string[];
  departamento_id?: string;
  vendedor_id?: string;
  created_at: string;
}

/* ── Helpers ── */
async function apiGet<T>(path: string): Promise<{ ok: boolean; data?: T; error?: string }> {
  try {
    const res = await fetch(`${BASE}${path}`, { headers: HEADERS });
    return await res.json();
  } catch (err) {
    console.error(`Productos Second Hand API GET ${path}:`, err);
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
    console.error(`Productos Second Hand API POST ${path}:`, err);
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
    console.error(`Productos Second Hand API PUT ${path}:`, err);
    return { ok: false, error: String(err) };
  }
}

async function apiDelete(path: string): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await fetch(`${BASE}${path}`, { method: 'DELETE', headers: HEADERS });
    return await res.json();
  } catch (err) {
    console.error(`Productos Second Hand API DELETE ${path}:`, err);
    return { ok: false, error: String(err) };
  }
}

/* ── Public API ── */

/** Get all productos secondhand with optional filters */
export async function getProductosSecondHand(params?: { estado?: string; vendedor_id?: string; search?: string }): Promise<ProductoSecondHand[]> {
  const queryParams = new URLSearchParams();
  if (params?.estado) queryParams.set('estado', params.estado);
  if (params?.vendedor_id) queryParams.set('vendedor_id', params.vendedor_id);
  if (params?.search) queryParams.set('search', params.search);
  
  const res = await apiGet<ProductoSecondHand[]>(queryParams.toString() ? `?${queryParams}` : '');
  if (!res.ok || !res.data) return [];
  return res.data;
}

/** Get a single producto secondhand by ID */
export async function getProductoSecondHand(id: string): Promise<ProductoSecondHand | null> {
  const res = await apiGet<ProductoSecondHand>(`/${id}`);
  if (!res.ok || !res.data) return null;
  return res.data;
}

/** Create a new producto secondhand */
export async function createProductoSecondHand(data: Partial<ProductoSecondHand>): Promise<ProductoSecondHand | null> {
  const res = await apiPost<ProductoSecondHand>('', data);
  if (!res.ok || !res.data) return null;
  return res.data;
}

/** Update a producto secondhand */
export async function updateProductoSecondHand(id: string, data: Partial<ProductoSecondHand>): Promise<ProductoSecondHand | null> {
  const res = await apiPut<ProductoSecondHand>(`/${id}`, data);
  if (!res.ok || !res.data) return null;
  return res.data;
}

/** Delete a producto secondhand */
export async function deleteProductoSecondHand(id: string): Promise<boolean> {
  const res = await apiDelete(`/${id}`);
  return res.ok;
}
