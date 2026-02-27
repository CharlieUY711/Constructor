/* =====================================================
   Pedidos API Service — Frontend ↔ Backend
   ===================================================== */
import { projectId, publicAnonKey } from '/utils/supabase/info';

const BASE = `https://${projectId}.supabase.co/functions/v1/api/pedidos`;
const HEADERS = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${publicAnonKey}`,
};

export interface PedidoItem {
  producto_id?: string;
  nombre: string;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
}

export interface Pedido {
  id: string;
  numero_pedido: string;
  estado: string;
  estado_pago: string;
  subtotal: number;
  descuento: number;
  impuestos: number;
  total: number;
  items: PedidoItem[];
  notas?: string;
  direccion_envio?: Record<string, string>;
  created_at: string;
  updated_at?: string;
  cliente_persona_id?: string;
  cliente_org_id?: string;
  metodo_pago_id?: string;
  metodo_envio_id?: string;
  cliente_persona?: { id: string; nombre: string; apellido?: string; email?: string; telefono?: string };
  cliente_org?: { id: string; nombre: string; tipo?: string };
  metodo_pago?: { id: string; nombre: string; tipo: string; proveedor?: string };
  metodo_envio?: { id: string; nombre: string; tipo: string; precio: number };
}

/* ── Helpers ── */
async function apiGet<T>(path: string): Promise<{ ok: boolean; data?: T; error?: string }> {
  try {
    const res = await fetch(`${BASE}${path}`, { headers: HEADERS });
    return await res.json();
  } catch (err) {
    console.error(`Pedidos API GET ${path}:`, err);
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
    console.error(`Pedidos API POST ${path}:`, err);
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
    console.error(`Pedidos API PUT ${path}:`, err);
    return { ok: false, error: String(err) };
  }
}

async function apiDelete(path: string): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await fetch(`${BASE}${path}`, { method: 'DELETE', headers: HEADERS });
    return await res.json();
  } catch (err) {
    console.error(`Pedidos API DELETE ${path}:`, err);
    return { ok: false, error: String(err) };
  }
}

/* ── Public API ── */

/** Get all pedidos with optional filters */
export async function getPedidos(params?: { estado?: string; estado_pago?: string; search?: string }): Promise<Pedido[]> {
  const queryParams = new URLSearchParams();
  if (params?.estado) queryParams.set('estado', params.estado);
  if (params?.estado_pago) queryParams.set('estado_pago', params.estado_pago);
  if (params?.search) queryParams.set('search', params.search);
  
  const res = await apiGet<Pedido[]>(queryParams.toString() ? `?${queryParams}` : '');
  if (!res.ok || !res.data) return [];
  return res.data;
}

/** Get a single pedido by ID */
export async function getPedido(id: string): Promise<Pedido | null> {
  const res = await apiGet<Pedido>(`/${id}`);
  if (!res.ok || !res.data) return null;
  return res.data;
}

/** Create a new pedido */
export async function createPedido(data: Partial<Pedido>): Promise<Pedido | null> {
  const res = await apiPost<Pedido>('', data);
  if (!res.ok || !res.data) return null;
  return res.data;
}

/** Update a pedido */
export async function updatePedido(id: string, data: Partial<Pedido>): Promise<Pedido | null> {
  const res = await apiPut<Pedido>(`/${id}`, data);
  if (!res.ok || !res.data) return null;
  return res.data;
}

/** Update pedido estado */
export async function updatePedidoEstado(id: string, nuevo_estado: string): Promise<Pedido | null> {
  const res = await apiPut<Pedido>(`/${id}/estado`, { nuevo_estado });
  if (!res.ok || !res.data) return null;
  return res.data;
}

/** Update pedido estado_pago */
export async function updatePedidoEstadoPago(id: string, estado_pago: string): Promise<Pedido | null> {
  const res = await apiPut<Pedido>(`/${id}/estado-pago`, { estado_pago });
  if (!res.ok || !res.data) return null;
  return res.data;
}

/** Delete a pedido */
export async function deletePedido(id: string): Promise<boolean> {
  const res = await apiDelete(`/${id}`);
  return res.ok;
}
