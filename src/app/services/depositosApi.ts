import { apiUrl, publicAnonKey } from '../../utils/supabase/client';

const BASE = `${apiUrl}/depositos`;
const TENANT = 'oddy';
const HEADERS = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${publicAnonKey}`,
  'apikey': publicAnonKey,
  'x-tenant-id': TENANT,
};

export interface Deposito {
  id: string;
  tenant_id: string;
  nombre: string;
  direccion: string;
  ciudad?: string;
  lat?: number;
  lng?: number;
  tipo: 'propio' | 'tercero' | 'cross_docking';
  capacidad_m2?: number;
  responsable?: string;
  telefono?: string;
  activo: boolean;
  created_at: string;
  updated_at?: string;
  inventario?: any[];
}

async function req<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, { headers: HEADERS, ...options });
  const json = await res.json();
  if (json.error) throw new Error(json.error);
  return json;
}

export async function getDepositos(): Promise<Deposito[]> {
  const res = await req<{ data: Deposito[] }>('');
  return res.data || [];
}

export async function getDeposito(id: string): Promise<Deposito | null> {
  const res = await req<{ data: Deposito }>(`/${id}`);
  return res.data || null;
}

export async function createDeposito(data: Partial<Deposito>): Promise<Deposito | null> {
  const res = await req<{ data: Deposito }>('', { method: 'POST', body: JSON.stringify(data) });
  return res.data || null;
}

export async function updateDeposito(id: string, data: Partial<Deposito>): Promise<Deposito | null> {
  const res = await req<{ data: Deposito }>(`/${id}`, { method: 'PUT', body: JSON.stringify(data) });
  return res.data || null;
}

export async function deleteDeposito(id: string): Promise<boolean> {
  try { await req(`/${id}`, { method: 'DELETE' }); return true; }
  catch { return false; }
}
