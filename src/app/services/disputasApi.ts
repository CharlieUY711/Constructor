/* =====================================================
   Disputas API Service — Dashboard ↔ Backend
   Charlie Marketplace Builder v1.5
   ===================================================== */
import { apiUrl, publicAnonKey } from '../../utils/supabase/client';

const BASE = `${apiUrl}/disputas`;
const HEADERS = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${publicAnonKey}`,
};

// ── Types ──────────────────────────────────────────────────────────────────
export interface Disputa {
  id: string;
  producto_id?: string;
  comprador_id?: string;
  vendedor_id?: string;
  motivo: string;
  descripcion?: string;
  estado: 'abierta' | 'en_revision' | 'resuelta' | 'cerrada';
  resolucion?: string;
  created_at?: string;
  updated_at?: string;
}

export interface DisputaInput {
  producto_id: string;
  comprador_id?: string;
  vendedor_id?: string;
  motivo: string;
  descripcion?: string;
  estado?: 'abierta' | 'en_revision' | 'resuelta' | 'cerrada';
}

// ── CRUD ───────────────────────────────────────────────────────────────────

export async function getDisputas(params?: { estado?: string; producto_id?: string }): Promise<Disputa[]> {
  const queryParams = new URLSearchParams();
  if (params?.estado) queryParams.append('estado', params.estado);
  if (params?.producto_id) queryParams.append('producto_id', params.producto_id);
  const url = queryParams.toString() ? `${BASE}?${queryParams}` : BASE;
  const res = await fetch(url, { headers: HEADERS });
  const json = await res.json();
  if (json.error) throw new Error(json.error);
  return json.data || [];
}

export async function getDisputaById(id: string): Promise<Disputa> {
  const res = await fetch(`${BASE}/${id}`, { headers: HEADERS });
  const json = await res.json();
  if (json.error) throw new Error(json.error);
  return json.data;
}

export async function createDisputa(data: DisputaInput): Promise<Disputa> {
  const res = await fetch(`${BASE}`, {
    method: 'POST',
    headers: HEADERS,
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (json.error) throw new Error(json.error);
  return json.data;
}

export async function updateDisputa(id: string, data: Partial<DisputaInput & { resolucion?: string }>): Promise<Disputa> {
  const res = await fetch(`${BASE}/${id}`, {
    method: 'PUT',
    headers: HEADERS,
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (json.error) throw new Error(json.error);
  return json.data;
}

export async function deleteDisputa(id: string): Promise<void> {
  const res = await fetch(`${BASE}/${id}`, {
    method: 'DELETE',
    headers: HEADERS,
  });
  const json = await res.json();
  if (json.error) throw new Error(json.error);
}
