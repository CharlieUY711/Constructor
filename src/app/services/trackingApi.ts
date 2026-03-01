/* =====================================================
   Tracking API Service — Dashboard ↔ Backend
   ===================================================== */
import { apiUrl, publicAnonKey } from '../../utils/supabase/client';

const BASE = `${apiUrl}/tracking`;
const HEADERS = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${publicAnonKey}`,
};

// ─── Types ────────────────────────────────────────────────────────────────
export interface TrackingEnvio {
  id: string;
  codigo: string;
  numero?: string;
  tracking_externo?: string;
  estado: 'pendiente' | 'creado' | 'despachado' | 'en_transito' | 'en_deposito' | 'en_reparto' | 'entregado' | 'fallido';
  estado_tipo?: 'creado' | 'despachado' | 'en_transito' | 'en_deposito' | 'en_reparto' | 'entregado' | 'fallido';
  origen?: string;
  destino?: string;
  destinatario?: string;
  carrier?: string;
  peso?: string;
  fecha_estimada?: string;
  envio_id?: string;
  eventos?: TrackingEvento[];
  created_at?: string;
  updated_at?: string;
}

export interface TrackingEvento {
  id: string;
  tracking_id: string;
  fecha: string;
  hora?: string;
  descripcion: string;
  lugar?: string;
  ubicacion?: string;
  tipo?: 'info' | 'alerta' | 'entregado' | 'creado' | 'despachado' | 'en_transito' | 'en_deposito' | 'en_reparto' | 'entregado' | 'fallido';
  created_at?: string;
}

export interface TrackingEnvioInput {
  codigo: string;
  numero?: string;
  tracking_externo?: string;
  estado?: TrackingEnvio['estado'];
  estado_tipo?: TrackingEnvio['estado_tipo'];
  origen?: string;
  destino?: string;
  destinatario?: string;
  carrier?: string;
  peso?: string;
  fecha_estimada?: string;
  envio_id?: string;
}

export interface TrackingEventoInput {
  tracking_id: string;
  fecha?: string;
  hora?: string;
  descripcion: string;
  lugar?: string;
  ubicacion?: string;
  tipo?: TrackingEvento['tipo'];
}

// ─── CRUD Envíos ──────────────────────────────────────────────────────────

export async function getTrackingEnvios(estado?: string): Promise<TrackingEnvio[]> {
  const url = estado ? `${BASE}/envios?estado=${estado}` : `${BASE}/envios`;
  const res = await fetch(url, { headers: HEADERS });
  const json = await res.json();
  if (json.error) throw new Error(json.error);
  return json.data || [];
}

export async function getTrackingEnvioById(id: string): Promise<TrackingEnvio> {
  const res = await fetch(`${BASE}/envios/${id}`, { headers: HEADERS });
  const json = await res.json();
  if (json.error) throw new Error(json.error);
  return json.data;
}

export async function getTrackingEnvioByCodigo(codigo: string): Promise<TrackingEnvio> {
  const res = await fetch(`${BASE}/envios/codigo/${codigo}`, { headers: HEADERS });
  const json = await res.json();
  if (json.error) throw new Error(json.error);
  return json.data;
}

export async function createTrackingEnvio(data: TrackingEnvioInput): Promise<TrackingEnvio> {
  const res = await fetch(`${BASE}/envios`, {
    method: 'POST',
    headers: HEADERS,
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (json.error) throw new Error(json.error);
  return json.data;
}

export async function updateTrackingEnvio(id: string, data: Partial<TrackingEnvioInput>): Promise<TrackingEnvio> {
  const res = await fetch(`${BASE}/envios/${id}`, {
    method: 'PUT',
    headers: HEADERS,
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (json.error) throw new Error(json.error);
  return json.data;
}

export async function deleteTrackingEnvio(id: string): Promise<void> {
  const res = await fetch(`${BASE}/envios/${id}`, {
    method: 'DELETE',
    headers: HEADERS,
  });
  const json = await res.json();
  if (json.error) throw new Error(json.error);
}

// ─── CRUD Eventos ─────────────────────────────────────────────────────────

export async function getTrackingEventos(trackingId: string): Promise<TrackingEvento[]> {
  const res = await fetch(`${BASE}/eventos/${trackingId}`, { headers: HEADERS });
  const json = await res.json();
  if (json.error) throw new Error(json.error);
  return json.data || [];
}

export async function createTrackingEvento(data: TrackingEventoInput): Promise<TrackingEvento> {
  const res = await fetch(`${BASE}/eventos`, {
    method: 'POST',
    headers: HEADERS,
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (json.error) throw new Error(json.error);
  return json.data;
}

export async function updateTrackingEvento(id: string, data: Partial<TrackingEventoInput>): Promise<TrackingEvento> {
  const res = await fetch(`${BASE}/eventos/${id}`, {
    method: 'PUT',
    headers: HEADERS,
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (json.error) throw new Error(json.error);
  return json.data;
}

export async function deleteTrackingEvento(id: string): Promise<void> {
  const res = await fetch(`${BASE}/eventos/${id}`, {
    method: 'DELETE',
    headers: HEADERS,
  });
  const json = await res.json();
  if (json.error) throw new Error(json.error);
}
