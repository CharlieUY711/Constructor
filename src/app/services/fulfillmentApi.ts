/* =====================================================
   Fulfillment API Service — Dashboard ↔ Backend
   ===================================================== */
import { apiUrl, publicAnonKey } from '../../utils/supabase/client';

const BASE = `${apiUrl}/fulfillment`;
const HEADERS = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${publicAnonKey}`,
};

// ─── Types ────────────────────────────────────────────────────────────────
export interface OrdenFulfillment {
  id: string;
  orden_externa_id?: string;
  numero?: string;
  pedido?: string;
  cliente: string;
  estado: 'pendiente' | 'en_picking' | 'listo_empacar' | 'empacado' | 'despachado';
  prioridad?: 'urgente' | 'alta' | 'normal' | 'baja';
  items?: number;
  peso?: number;
  volumen?: number;
  zona?: string;
  wave_id?: string;
  operario?: string;
  tiempo_estimado?: string;
  fecha_creacion?: string;
  observaciones?: string;
  lineas?: any[];
  created_at?: string;
  updated_at?: string;
}

export interface Wave {
  id: string;
  nombre: string;
  estado: 'abierta' | 'en_proceso' | 'completada';
  operarios?: number;
  ordenes?: string[];
  inicio?: string;
  fin?: string;
  created_at?: string;
  updated_at?: string;
}

export interface OrdenFulfillmentInput {
  orden_externa_id?: string;
  numero?: string;
  pedido?: string;
  cliente: string;
  estado?: OrdenFulfillment['estado'];
  prioridad?: OrdenFulfillment['prioridad'];
  items?: number;
  peso?: number;
  volumen?: number;
  zona?: string;
  wave_id?: string;
  operario?: string;
  tiempo_estimado?: string;
  observaciones?: string;
  lineas?: any[];
}

export interface WaveInput {
  nombre: string;
  estado?: Wave['estado'];
  operarios?: number;
  ordenes?: string[];
  inicio?: string;
  fin?: string;
}

// ─── CRUD Órdenes ──────────────────────────────────────────────────────────

export async function getOrdenesFulfillment(estado?: string): Promise<OrdenFulfillment[]> {
  const url = estado ? `${BASE}/ordenes?estado=${estado}` : `${BASE}/ordenes`;
  const res = await fetch(url, { headers: HEADERS });
  const json = await res.json();
  if (json.error) throw new Error(json.error);
  return json.data || [];
}

export async function getOrdenFulfillmentById(id: string): Promise<OrdenFulfillment> {
  const res = await fetch(`${BASE}/ordenes/${id}`, { headers: HEADERS });
  const json = await res.json();
  if (json.error) throw new Error(json.error);
  return json.data;
}

export async function createOrdenFulfillment(data: OrdenFulfillmentInput): Promise<OrdenFulfillment> {
  const res = await fetch(`${BASE}/ordenes`, {
    method: 'POST',
    headers: HEADERS,
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (json.error) throw new Error(json.error);
  return json.data;
}

export async function updateOrdenFulfillment(id: string, data: Partial<OrdenFulfillmentInput>): Promise<OrdenFulfillment> {
  const res = await fetch(`${BASE}/ordenes/${id}`, {
    method: 'PUT',
    headers: HEADERS,
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (json.error) throw new Error(json.error);
  return json.data;
}

export async function deleteOrdenFulfillment(id: string): Promise<void> {
  const res = await fetch(`${BASE}/ordenes/${id}`, {
    method: 'DELETE',
    headers: HEADERS,
  });
  const json = await res.json();
  if (json.error) throw new Error(json.error);
}

// ─── CRUD Waves ────────────────────────────────────────────────────────────

export async function getWaves(estado?: string): Promise<Wave[]> {
  const url = estado ? `${BASE}/waves?estado=${estado}` : `${BASE}/waves`;
  const res = await fetch(url, { headers: HEADERS });
  const json = await res.json();
  if (json.error) throw new Error(json.error);
  return json.data || [];
}

export async function createWave(data: WaveInput): Promise<Wave> {
  const res = await fetch(`${BASE}/waves`, {
    method: 'POST',
    headers: HEADERS,
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (json.error) throw new Error(json.error);
  return json.data;
}

export async function updateWave(id: string, data: Partial<WaveInput>): Promise<Wave> {
  const res = await fetch(`${BASE}/waves/${id}`, {
    method: 'PUT',
    headers: HEADERS,
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (json.error) throw new Error(json.error);
  return json.data;
}

export async function deleteWave(id: string): Promise<void> {
  const res = await fetch(`${BASE}/waves/${id}`, {
    method: 'DELETE',
    headers: HEADERS,
  });
  const json = await res.json();
  if (json.error) throw new Error(json.error);
}
