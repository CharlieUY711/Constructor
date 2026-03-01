/* =====================================================
   Tracking API Service — actualizado Paso 7
   ===================================================== */
import { apiUrl, publicAnonKey } from '../../utils/supabase/client';

const BASE = `${apiUrl}/tracking`;
const TENANT = 'oddy';
const HEADERS = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${publicAnonKey}`,
  'apikey': publicAnonKey,
  'x-tenant-id': TENANT,
};

export interface TrackingEnvio {
  id: string;
  numero: string;
  tracking?: string;
  estado: string;
  origen?: string;
  destino?: string;
  destinatario?: string;
  carrier?: string;
  peso?: number;
  bultos?: number;
  fecha_estimada?: string;
  fecha_entrega?: string;
}

export interface TrackingEvento {
  estado: string;
  descripcion: string;
  ubicacion?: string;
  lat?: number;
  lng?: number;
  created_at: string;
}

export interface TrackingEntrega {
  estado: string;
  fecha_entrega: string;
  firmado_por?: string;
  foto_url?: string;
}

export interface TrackingResult {
  data: TrackingEnvio;
  eventos: TrackingEvento[];
  entrega?: TrackingEntrega;
}

/** Buscar por número de envío o código de tracking — endpoint público */
export async function getTrackingEnvioByCodigo(numero: string): Promise<TrackingResult> {
  const res = await fetch(`${BASE}/${numero}`, { headers: HEADERS });
  const json = await res.json();
  if (json.error) throw new Error(json.error);
  return json;
}

/** Agregar evento de tracking (uso interno / conductores) */
export async function addTrackingEvento(envioId: string, data: {
  estado: string;
  descripcion: string;
  ubicacion?: string;
  lat?: number;
  lng?: number;
  usuario_id?: string;
}): Promise<TrackingEvento> {
  const res = await fetch(`${BASE}/${envioId}/evento`, {
    method: 'POST',
    headers: HEADERS,
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (json.error) throw new Error(json.error);
  return json.data;
}

/** Historial completo de eventos de un envío */
export async function getHistorialEnvio(envioId: string): Promise<TrackingEvento[]> {
  const res = await fetch(`${BASE}/envio/${envioId}/historial`, { headers: HEADERS });
  const json = await res.json();
  if (json.error) throw new Error(json.error);
  return json.data || [];
}
