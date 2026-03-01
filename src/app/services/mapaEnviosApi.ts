/* =====================================================
   Mapa Envíos API Service — Dashboard ↔ Backend
   ===================================================== */
import { apiUrl, publicAnonKey } from '../../utils/supabase/client';

const BASE = `${apiUrl}/mapa-envios`;
const HEADERS = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${publicAnonKey}`,
};

// ─── Types ────────────────────────────────────────────────────────────────
export interface PuntoMapa {
  id: string;
  tipo: 'origen' | 'destino' | 'hub' | 'punto_entrega' | 'deposito' | 'en_transito' | 'entregado' | 'fallido' | 'en_reparto';
  nombre: string;
  numero?: string;
  lat: number;
  lng: number;
  x?: number;
  y?: number;
  envios?: number;
  estado?: 'activo' | 'inactivo';
  cliente?: string;
  carrier?: string;
  localidad?: string;
  provincia?: string;
  metadata?: Record<string, any>;
  created_at?: string;
  updated_at?: string;
}

export interface PuntoMapaInput {
  tipo: PuntoMapa['tipo'];
  nombre: string;
  numero?: string;
  lat: number;
  lng: number;
  x?: number;
  y?: number;
  envios?: number;
  estado?: PuntoMapa['estado'];
  cliente?: string;
  carrier?: string;
  localidad?: string;
  provincia?: string;
  metadata?: Record<string, any>;
}

// ─── CRUD ─────────────────────────────────────────────────────────────────

export async function getPuntosMapa(tipo?: string, estado?: string): Promise<PuntoMapa[]> {
  let url = BASE;
  const params = new URLSearchParams();
  if (tipo) params.append('tipo', tipo);
  if (estado) params.append('estado', estado);
  if (params.toString()) url += `?${params.toString()}`;
  
  const res = await fetch(url, { headers: HEADERS });
  const json = await res.json();
  if (json.error) throw new Error(json.error);
  return json.data || [];
}

export async function getPuntoMapaById(id: string): Promise<PuntoMapa> {
  const res = await fetch(`${BASE}/${id}`, { headers: HEADERS });
  const json = await res.json();
  if (json.error) throw new Error(json.error);
  return json.data;
}

export async function createPuntoMapa(data: PuntoMapaInput): Promise<PuntoMapa> {
  const res = await fetch(BASE, {
    method: 'POST',
    headers: HEADERS,
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (json.error) throw new Error(json.error);
  return json.data;
}

export async function updatePuntoMapa(id: string, data: Partial<PuntoMapaInput>): Promise<PuntoMapa> {
  const res = await fetch(`${BASE}/${id}`, {
    method: 'PUT',
    headers: HEADERS,
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (json.error) throw new Error(json.error);
  return json.data;
}

export async function deletePuntoMapa(id: string): Promise<void> {
  const res = await fetch(`${BASE}/${id}`, {
    method: 'DELETE',
    headers: HEADERS,
  });
  const json = await res.json();
  if (json.error) throw new Error(json.error);
}
