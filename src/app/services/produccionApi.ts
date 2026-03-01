/* =====================================================
   Producción API Service — Dashboard ↔ Backend
   ===================================================== */
import { apiUrl, publicAnonKey } from '../../utils/supabase/client';

const BASE = `${apiUrl}/produccion`;
const HEADERS = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${publicAnonKey}`,
};

// ─── Types ────────────────────────────────────────────────────────────────
export interface ArticuloCompuesto {
  id: string;
  nombre: string;
  sku?: string;
  tipo: 'kit' | 'canasta' | 'combo' | 'pack';
  descripcion?: string;
  componentes?: any[];
  tiempo_armado?: number;
  costo_mano_obra?: number;
  activo?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface OrdenArmado {
  id: string;
  numero?: string;
  articulo_id?: string;
  articulo_nombre?: string;
  cantidad: number;
  estado: 'pendiente' | 'en_proceso' | 'completada' | 'cancelada';
  ruta?: string;
  operario?: string;
  fecha_pedido?: string;
  fecha_entrega?: string;
  prioridad?: 'alta' | 'normal' | 'baja';
  notas?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ArticuloCompuestoInput {
  nombre: string;
  sku?: string;
  tipo: ArticuloCompuesto['tipo'];
  descripcion?: string;
  componentes?: any[];
  tiempo_armado?: number;
  costo_mano_obra?: number;
  activo?: boolean;
}

export interface OrdenArmadoInput {
  numero?: string;
  articulo_id: string;
  articulo_nombre?: string;
  cantidad: number;
  estado?: OrdenArmado['estado'];
  ruta?: string;
  operario?: string;
  fecha_pedido?: string;
  fecha_entrega?: string;
  prioridad?: OrdenArmado['prioridad'];
  notas?: string;
}

// ─── CRUD Artículos ───────────────────────────────────────────────────────

export async function getArticulosProduccion(activo?: boolean): Promise<ArticuloCompuesto[]> {
  const url = activo !== undefined ? `${BASE}/articulos?activo=${activo}` : `${BASE}/articulos`;
  const res = await fetch(url, { headers: HEADERS });
  const json = await res.json();
  if (json.error) throw new Error(json.error);
  return json.data || [];
}

export async function getArticuloProduccionById(id: string): Promise<ArticuloCompuesto> {
  const res = await fetch(`${BASE}/articulos/${id}`, { headers: HEADERS });
  const json = await res.json();
  if (json.error) throw new Error(json.error);
  return json.data;
}

export async function createArticuloProduccion(data: ArticuloCompuestoInput): Promise<ArticuloCompuesto> {
  const res = await fetch(`${BASE}/articulos`, {
    method: 'POST',
    headers: HEADERS,
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (json.error) throw new Error(json.error);
  return json.data;
}

export async function updateArticuloProduccion(id: string, data: Partial<ArticuloCompuestoInput>): Promise<ArticuloCompuesto> {
  const res = await fetch(`${BASE}/articulos/${id}`, {
    method: 'PUT',
    headers: HEADERS,
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (json.error) throw new Error(json.error);
  return json.data;
}

export async function deleteArticuloProduccion(id: string): Promise<void> {
  const res = await fetch(`${BASE}/articulos/${id}`, {
    method: 'DELETE',
    headers: HEADERS,
  });
  const json = await res.json();
  if (json.error) throw new Error(json.error);
}

// ─── CRUD Órdenes de Armado ───────────────────────────────────────────────

export async function getOrdenesArmado(estado?: string): Promise<OrdenArmado[]> {
  const url = estado ? `${BASE}/ordenes?estado=${estado}` : `${BASE}/ordenes`;
  const res = await fetch(url, { headers: HEADERS });
  const json = await res.json();
  if (json.error) throw new Error(json.error);
  return json.data || [];
}

export async function getOrdenArmadoById(id: string): Promise<OrdenArmado> {
  const res = await fetch(`${BASE}/ordenes/${id}`, { headers: HEADERS });
  const json = await res.json();
  if (json.error) throw new Error(json.error);
  return json.data;
}

export async function createOrdenArmado(data: OrdenArmadoInput): Promise<OrdenArmado> {
  const res = await fetch(`${BASE}/ordenes`, {
    method: 'POST',
    headers: HEADERS,
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (json.error) throw new Error(json.error);
  return json.data;
}

export async function updateOrdenArmado(id: string, data: Partial<OrdenArmadoInput>): Promise<OrdenArmado> {
  const res = await fetch(`${BASE}/ordenes/${id}`, {
    method: 'PUT',
    headers: HEADERS,
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (json.error) throw new Error(json.error);
  return json.data;
}

export async function deleteOrdenArmado(id: string): Promise<void> {
  const res = await fetch(`${BASE}/ordenes/${id}`, {
    method: 'DELETE',
    headers: HEADERS,
  });
  const json = await res.json();
  if (json.error) throw new Error(json.error);
}
