/* =====================================================
   Transportistas API Service â€” Dashboard â†” Backend
   ===================================================== */
import { apiUrl, publicAnonKey } from '../../utils/supabase/client';

const BASE = `${apiUrl}/transportistas`;
const HEADERS = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${publicAnonKey}`,
  'apikey': publicAnonKey,
  'x-tenant-id': 'oddy',
};

// â”€â”€â”€ Types â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export interface Transportista {
  id: string;
  nombre: string;
  tipo: 'courier' | 'propio' | 'tercero' | 'nacional' | 'local' | 'internacional';
  estado: 'activo' | 'inactivo';
  contacto?: string;
  email?: string;
  telefono?: string;
  zonas?: string[];
  tarifa_base?: number;
  observaciones?: string;
  logo?: string;
  rating?: number;
  envios_activos?: number;
  envios_totales?: number;
  tiempo_promedio?: string;
  cobertura?: string[];
  activo?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Tramo {
  id: string;
  origen: string;
  destino: string;
  distancia_km?: number;
  tiempo_horas?: number;
  transportista_id: string;
  tipo: 'local' | 'intercity' | 'internacional';
  tiempo_estimado?: string;
  tarifa_base?: number;
  tarifa_kg?: number;
  estado: 'activo' | 'inactivo';
  activo?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface TransportistaInput {
  nombre: string;
  tipo: Transportista['tipo'];
  estado?: Transportista['estado'];
  contacto?: string;
  email?: string;
  telefono?: string;
  zonas?: string[];
  tarifa_base?: number;
  observaciones?: string;
  logo?: string;
  rating?: number;
  envios_activos?: number;
  envios_totales?: number;
  tiempo_promedio?: string;
  cobertura?: string[];
  activo?: boolean;
}

export interface TramoInput {
  origen: string;
  destino: string;
  distancia_km?: number;
  tiempo_horas?: number;
  tipo: Tramo['tipo'];
  tiempo_estimado?: string;
  tarifa_base?: number;
  tarifa_kg?: number;
  estado?: Tramo['estado'];
  activo?: boolean;
}

// â”€â”€â”€ CRUD Transportistas â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export async function getTransportistas(): Promise<Transportista[]> {
  const res = await fetch(`${BASE}`, { headers: HEADERS });
  const json = await res.json();
  if (json.error) throw new Error(json.error);
  return json.data || [];
}

export async function getTransportistaById(id: string): Promise<Transportista> {
  const res = await fetch(`${BASE}/${id}`, { headers: HEADERS });
  const json = await res.json();
  if (json.error) throw new Error(json.error);
  return json.data;
}

export async function createTransportista(data: TransportistaInput): Promise<Transportista> {
  const res = await fetch(`${BASE}`, {
    method: 'POST',
    headers: HEADERS,
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (json.error) throw new Error(json.error);
  return json.data;
}

export async function updateTransportista(id: string, data: Partial<TransportistaInput>): Promise<Transportista> {
  const res = await fetch(`${BASE}/${id}`, {
    method: 'PUT',
    headers: HEADERS,
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (json.error) throw new Error(json.error);
  return json.data;
}

export async function deleteTransportista(id: string): Promise<void> {
  const res = await fetch(`${BASE}/${id}`, {
    method: 'DELETE',
    headers: HEADERS,
  });
  const json = await res.json();
  if (json.error) throw new Error(json.error);
}

// â”€â”€â”€ CRUD Tramos â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export async function getTramos(transportistaId: string): Promise<Tramo[]> {
  const res = await fetch(`${BASE}/${transportistaId}/tramos`, { headers: HEADERS });
  const json = await res.json();
  if (json.error) throw new Error(json.error);
  return json.data || [];
}

export async function createTramo(transportistaId: string, data: TramoInput): Promise<Tramo> {
  const res = await fetch(`${BASE}/${transportistaId}/tramos`, {
    method: 'POST',
    headers: HEADERS,
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (json.error) throw new Error(json.error);
  return json.data;
}

