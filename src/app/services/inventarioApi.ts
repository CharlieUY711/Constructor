import { apiUrl, publicAnonKey } from '../../utils/supabase/client';

const BASE = `${apiUrl}/inventario`;
const TENANT = 'oddy';
const HEADERS = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${publicAnonKey}`,
  'apikey': publicAnonKey,
  'x-tenant-id': TENANT,
};

export interface ItemInventario {
  id: string;
  tenant_id: string;
  deposito_id: string;
  sku: string;
  nombre: string;
  descripcion?: string;
  categoria?: string;
  cantidad: number;
  cantidad_minima: number;
  ubicacion?: string;
  costo_unitario?: number;
  moneda?: string;
  created_at: string;
  updated_at?: string;
  depositos?: { id: string; nombre: string; ciudad?: string };
}

export interface MovimientoInventario {
  tipo: 'entrada' | 'salida' | 'ajuste' | 'transferencia';
  cantidad: number;
  referencia?: string;
  notas?: string;
  usuario_id?: string;
}

async function req<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, { headers: HEADERS, ...options });
  const json = await res.json();
  if (json.error) throw new Error(json.error);
  return json;
}

export async function getInventario(params?: { deposito_id?: string; categoria?: string; search?: string }): Promise<{ data: ItemInventario[]; alertas_count: number }> {
  const q = new URLSearchParams();
  if (params?.deposito_id) q.set('deposito_id', params.deposito_id);
  if (params?.categoria) q.set('categoria', params.categoria);
  if (params?.search) q.set('search', params.search);
  return req(q.toString() ? `?${q}` : '');
}

export async function getItem(id: string): Promise<{ data: ItemInventario; movimientos: any[] }> {
  return req(`/${id}`);
}

export async function createItem(data: Partial<ItemInventario>): Promise<ItemInventario | null> {
  const res = await req<{ data: ItemInventario }>('', { method: 'POST', body: JSON.stringify(data) });
  return res.data || null;
}

export async function updateItem(id: string, data: Partial<ItemInventario>): Promise<ItemInventario | null> {
  const res = await req<{ data: ItemInventario }>(`/${id}`, { method: 'PUT', body: JSON.stringify(data) });
  return res.data || null;
}

export async function registrarMovimiento(id: string, mov: MovimientoInventario): Promise<{ success: boolean; cantidad_anterior: number; cantidad_nueva: number }> {
  return req(`/${id}/movimiento`, { method: 'POST', body: JSON.stringify(mov) });
}

export async function deleteItem(id: string): Promise<boolean> {
  try { await req(`/${id}`, { method: 'DELETE' }); return true; }
  catch { return false; }
}
