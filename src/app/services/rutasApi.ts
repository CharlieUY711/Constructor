/* =====================================================
   Rutas API Service — actualizado Paso 7
   Gestiona routes operativas del día (tabla routes)
   ===================================================== */
import { apiUrl, publicAnonKey } from '../../utils/supabase/client';

const BASE = `${apiUrl}/rutas`;
const TENANT = 'oddy';
const HEADERS = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${publicAnonKey}`,
  'apikey': publicAnonKey,
  'x-tenant-id': TENANT,
};

export interface Parada {
  id: string;
  route_id: string;
  envio_id?: string;
  recipient_name?: string;
  address?: string;
  order_index: number;
  status: 'pendiente' | 'completed' | 'failed';
  completed_at?: string;
  proof_url?: string;
  notes?: string;
  lat?: number;
  lng?: number;
  envios?: any;
}

export interface Ruta {
  id: string;
  tenant_id: string;
  name: string;
  driver_name?: string;
  date: string;
  status: 'pendiente' | 'en_curso' | 'completada' | 'cancelada';
  transportista_id?: string;
  vehiculo_id?: string;
  distancia_km?: number;
  duracion_min?: number;
  created_at: string;
  updated_at?: string;
  route_stops?: Parada[];
  transportistas?: { id: string; nombre: string };
  vehiculos?: { id: string; patente: string; tipo: string };
}

async function req<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, { headers: HEADERS, ...options });
  const json = await res.json();
  if (json.error) throw new Error(json.error);
  return json;
}

export async function getRutas(params?: { fecha?: string; status?: string; transportista_id?: string }): Promise<Ruta[]> {
  const q = new URLSearchParams();
  if (params?.fecha) q.set('fecha', params.fecha);
  if (params?.status) q.set('status', params.status);
  if (params?.transportista_id) q.set('transportista_id', params.transportista_id);
  const res = await req<{ data: Ruta[] }>(q.toString() ? `?${q}` : '');
  return res.data || [];
}

export async function getRuta(id: string): Promise<Ruta | null> {
  const res = await req<{ data: Ruta }>(`/${id}`);
  return res.data || null;
}

export async function createRuta(data: Partial<Ruta>): Promise<Ruta | null> {
  const res = await req<{ data: Ruta }>('', {
    method: 'POST', body: JSON.stringify(data),
  });
  return res.data || null;
}

export async function updateRuta(id: string, data: Partial<Ruta>): Promise<Ruta | null> {
  const res = await req<{ data: Ruta }>(`/${id}`, {
    method: 'PUT', body: JSON.stringify(data),
  });
  return res.data || null;
}

export async function deleteRuta(id: string): Promise<boolean> {
  try { await req(`/${id}`, { method: 'DELETE' }); return true; }
  catch { return false; }
}

export async function addParada(rutaId: string, data: {
  envio_id: string; address?: string; recipient_name?: string;
  lat?: number; lng?: number; notes?: string;
}): Promise<Parada | null> {
  const res = await req<{ data: Parada }>(`/${rutaId}/paradas`, {
    method: 'POST', body: JSON.stringify(data),
  });
  return res.data || null;
}

export async function reordenarParadas(rutaId: string, orden: { id: string; order_index: number }[]): Promise<boolean> {
  try { await req(`/${rutaId}/paradas/reordenar`, { method: 'PUT', body: JSON.stringify({ orden }) }); return true; }
  catch { return false; }
}

export async function optimizarRuta(rutaId: string): Promise<Parada[]> {
  const res = await req<{ data: Parada[] }>(`/${rutaId}/optimizar`, { method: 'POST' });
  return res.data || [];
}
