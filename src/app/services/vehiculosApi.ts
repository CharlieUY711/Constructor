import { apiUrl, publicAnonKey } from '../../utils/supabase/client';

const BASE = `${apiUrl}/vehiculos`;
const TENANT = 'oddy';
const HEADERS = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${publicAnonKey}`,
  'apikey': publicAnonKey,
  'x-tenant-id': TENANT,
};

export interface Vehiculo {
  id: string;
  tenant_id: string;
  transportista_id?: string;
  patente: string;
  tipo: 'moto' | 'auto' | 'furgon' | 'camioneta' | 'camion';
  marca?: string;
  modelo?: string;
  anio?: number;
  capacidad_kg?: number;
  capacidad_m3?: number;
  activo: boolean;
  created_at: string;
  updated_at?: string;
  transportistas?: { id: string; nombre: string };
}

async function req<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, { headers: HEADERS, ...options });
  const json = await res.json();
  if (json.error) throw new Error(json.error);
  return json;
}

export async function getVehiculos(params?: { transportista_id?: string; activo?: boolean }): Promise<Vehiculo[]> {
  const q = new URLSearchParams();
  if (params?.transportista_id) q.set('transportista_id', params.transportista_id);
  if (params?.activo !== undefined) q.set('activo', String(params.activo));
  const res = await req<{ data: Vehiculo[] }>(q.toString() ? `?${q}` : '');
  return res.data || [];
}

export async function getVehiculo(id: string): Promise<Vehiculo | null> {
  const res = await req<{ data: Vehiculo }>(`/${id}`);
  return res.data || null;
}

export async function createVehiculo(data: Partial<Vehiculo>): Promise<Vehiculo | null> {
  const res = await req<{ data: Vehiculo }>('', { method: 'POST', body: JSON.stringify(data) });
  return res.data || null;
}

export async function updateVehiculo(id: string, data: Partial<Vehiculo>): Promise<Vehiculo | null> {
  const res = await req<{ data: Vehiculo }>(`/${id}`, { method: 'PUT', body: JSON.stringify(data) });
  return res.data || null;
}

export async function deleteVehiculo(id: string): Promise<boolean> {
  try { await req(`/${id}`, { method: 'DELETE' }); return true; }
  catch { return false; }
}
