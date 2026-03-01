import { apiUrl, publicAnonKey } from '../../utils/supabase/client';

const BASE = `${apiUrl}/entregas`;
const TENANT = 'oddy';
const HEADERS = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${publicAnonKey}`,
  'apikey': publicAnonKey,
  'x-tenant-id': TENANT,
};

export interface Entrega {
  id: string;
  tenant_id: string;
  envio_id: string;
  route_stop_id?: string;
  estado: 'entregado' | 'no_entregado' | 'parcial' | 'devuelto';
  fecha_entrega: string;
  firmado_por?: string;
  firma_url?: string;
  foto_url?: string;
  lat?: number;
  lng?: number;
  notas?: string;
  motivo_no_entrega?: string;
  usuario_id?: string;
  created_at: string;
  envios?: any;
}

async function req<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, { headers: HEADERS, ...options });
  const json = await res.json();
  if (json.error) throw new Error(json.error);
  return json;
}

export async function getEntregas(params?: { estado?: string; desde?: string; hasta?: string }): Promise<Entrega[]> {
  const q = new URLSearchParams();
  if (params?.estado) q.set('estado', params.estado);
  if (params?.desde) q.set('desde', params.desde);
  if (params?.hasta) q.set('hasta', params.hasta);
  const res = await req<{ data: Entrega[] }>(q.toString() ? `?${q}` : '');
  return res.data || [];
}

export async function getEntrega(id: string): Promise<Entrega | null> {
  const res = await req<{ data: Entrega }>(`/${id}`);
  return res.data || null;
}

export async function confirmarEntrega(data: {
  envio_id: string;
  estado?: Entrega['estado'];
  firmado_por?: string;
  firma_url?: string;
  foto_url?: string;
  lat?: number;
  lng?: number;
  notas?: string;
  motivo_no_entrega?: string;
  route_stop_id?: string;
  usuario_id?: string;
}): Promise<Entrega | null> {
  const res = await req<{ data: Entrega }>('', { method: 'POST', body: JSON.stringify(data) });
  return res.data || null;
}
