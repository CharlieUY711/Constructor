/* =====================================================
   Envíos API Service — Frontend ↔ Backend
   ===================================================== */
import { projectId, publicAnonKey } from '../../utils/supabase/info';

const BASE = `https://${projectId}.supabase.co/functions/v1/api/envios`;
const HEADERS = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${publicAnonKey}`,
};

export type EstadoEnvio =
  | 'creado' | 'despachado' | 'en_transito' | 'en_deposito'
  | 'en_reparto' | 'entregado' | 'fallido' | 'devuelto';

export type Tramo = 'local' | 'intercity' | 'internacional' | 'last_mile';

export interface Envio {
  id: string;
  numero: string;
  pedido_madre_id?: string;
  numero_pedido?: string;
  estado: EstadoEnvio;
  tracking?: string;
  origen: string;
  destino: string;
  destinatario: string;
  telefono?: string;
  email?: string;
  lat_origen?: number;
  lng_origen?: number;
  lat_destino?: number;
  lng_destino?: number;
  carrier: string;
  tramo: Tramo;
  es_multi_tramo?: boolean;
  tramos?: any[];
  peso: number;
  bultos: number;
  volumen?: number;
  fecha_creacion: string;
  fecha_despacho?: string;
  fecha_estimada?: string;
  fecha_entrega?: string;
  acuse_recibido?: boolean;
  acuse_fecha?: string;
  acuse_firmado_por?: string;
  acuse_firma_url?: string;
  notas?: string;
  metadata?: any;
  created_at: string;
  updated_at: string;
}

export interface EventoTracking {
  id: string;
  envio_id: string;
  estado: EstadoEnvio;
  descripcion: string;
  ubicacion?: string;
  lat?: number;
  lng?: number;
  fecha: string;
  origen: 'sistema' | 'carrier' | 'manual';
  created_at: string;
}

export interface EnvioInput {
  pedido_madre_id?: string;
  numero_pedido?: string;
  estado?: EstadoEnvio;
  tracking?: string;
  origen: string;
  destino: string;
  destinatario: string;
  telefono?: string;
  email?: string;
  lat_origen?: number;
  lng_origen?: number;
  lat_destino?: number;
  lng_destino?: number;
  carrier: string;
  tramo?: Tramo;
  es_multi_tramo?: boolean;
  tramos?: any[];
  peso?: number;
  bultos?: number;
  volumen?: number;
  fecha_estimada?: string;
  notas?: string;
  metadata?: any;
}

// ── Helpers ───────────────────────────────────────────────────────────────

async function apiGet<T>(path: string): Promise<{ ok: boolean; data?: T; error?: string }> {
  try {
    const res = await fetch(`${BASE}${path}`, { headers: HEADERS });
    const json = await res.json();
    if (!res.ok) {
      return { ok: false, error: json.error || 'Error en la petición' };
    }
    return { ok: true, data: json };
  } catch (err) {
    console.error(`Envios API GET ${path}:`, err);
    return { ok: false, error: String(err) };
  }
}

async function apiPost<T>(path: string, body: any): Promise<{ ok: boolean; data?: T; error?: string }> {
  try {
    const res = await fetch(`${BASE}${path}`, {
      method: 'POST',
      headers: HEADERS,
      body: JSON.stringify(body),
    });
    const json = await res.json();
    if (!res.ok) {
      return { ok: false, error: json.error || 'Error en la petición' };
    }
    return { ok: true, data: json };
  } catch (err) {
    console.error(`Envios API POST ${path}:`, err);
    return { ok: false, error: String(err) };
  }
}

async function apiPut<T>(path: string, body: any): Promise<{ ok: boolean; data?: T; error?: string }> {
  try {
    const res = await fetch(`${BASE}${path}`, {
      method: 'PUT',
      headers: HEADERS,
      body: JSON.stringify(body),
    });
    const json = await res.json();
    if (!res.ok) {
      return { ok: false, error: json.error || 'Error en la petición' };
    }
    return { ok: true, data: json };
  } catch (err) {
    console.error(`Envios API PUT ${path}:`, err);
    return { ok: false, error: String(err) };
  }
}

// ── Funciones principales ──────────────────────────────────────────────────

export async function getEnvios(filters?: {
  pedido_madre_id?: string;
  estado?: EstadoEnvio;
  carrier?: string;
  tramo?: Tramo;
}): Promise<Envio[]> {
  const params = new URLSearchParams();
  if (filters?.pedido_madre_id) params.append('pedido_madre_id', filters.pedido_madre_id);
  if (filters?.estado) params.append('estado', filters.estado);
  if (filters?.carrier) params.append('carrier', filters.carrier);
  if (filters?.tramo) params.append('tramo', filters.tramo);
  
  const query = params.toString() ? `?${params.toString()}` : '';
  const res = await apiGet<{ envios: Envio[]; count: number }>(query);
  if (!res.ok || !res.data) return [];
  return res.data.envios || [];
}

export async function getEnvio(id: string): Promise<{ envio: Envio; eventos: EventoTracking[] } | null> {
  const res = await apiGet<{ envio: Envio; eventos: EventoTracking[] }>(`/${id}`);
  if (!res.ok || !res.data) return null;
  return res.data;
}

export async function getEnviosByPedido(pedidoId: string): Promise<Envio[]> {
  const res = await apiGet<{ envios: Envio[] }>(`/pedido/${pedidoId}`);
  if (!res.ok || !res.data) return [];
  return res.data.envios || [];
}

export async function createEnvio(data: EnvioInput): Promise<Envio> {
  const res = await apiPost<{ envio: Envio }>('/', data);
  if (!res.ok || !res.data) throw new Error(res.error || 'Error creando envío');
  return res.data.envio;
}

export async function updateEnvio(id: string, data: Partial<EnvioInput> & {
  descripcion_evento?: string;
  ubicacion?: string;
  origen_evento?: 'sistema' | 'carrier' | 'manual';
}): Promise<Envio> {
  const res = await apiPut<{ envio: Envio }>(`/${id}`, data);
  if (!res.ok || !res.data) throw new Error(res.error || 'Error actualizando envío');
  return res.data.envio;
}

export async function addEvento(id: string, evento: {
  estado: EstadoEnvio;
  descripcion: string;
  ubicacion?: string;
  lat?: number;
  lng?: number;
  origen?: 'sistema' | 'carrier' | 'manual';
}): Promise<EventoTracking> {
  const res = await apiPost<{ evento: EventoTracking }>(`/${id}/evento`, evento);
  if (!res.ok || !res.data) throw new Error(res.error || 'Error agregando evento');
  return res.data.evento;
}

export async function registrarAcuse(id: string, acuse: {
  firmado_por: string;
  firma_url?: string;
  ubicacion?: string;
}): Promise<Envio> {
  const res = await apiPost<{ envio: Envio }>(`/${id}/acuse`, acuse);
  if (!res.ok || !res.data) throw new Error(res.error || 'Error registrando acuse');
  return res.data.envio;
}
