/* =====================================================
   Rutas API Service — Frontend ↔ Backend
   ===================================================== */
import { apiUrl, publicAnonKey } from '../../utils/supabase/client';

const BASE = `${apiUrl}/rutas`;
const HEADERS = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${publicAnonKey}`,
};

export type TipoRuta = 'standard' | 'proyecto';
export type EstadoRuta = 'activa' | 'pausada' | 'completada' | 'planificada';

export interface Parada {
  id: string;
  orden: number;
  direccion: string;
  localidad: string;
  envios: number;
  estado: 'pendiente' | 'entregado' | 'fallido';
}

export interface Ruta {
  id: string;
  nombre: string;
  tipo: TipoRuta;
  estado: EstadoRuta;
  carrier: string;
  zona: string;
  frecuencia?: string;
  proyecto?: string;
  paradas: Parada[];
  enviosTotales: number;
  kmsEstimados: number;
  tiempoEstimado: string;
  fechaProxima?: string;
  observaciones?: string;
  created_at: string;
  updated_at: string;
}

/* ── Helpers ── */
async function apiGet<T>(path: string): Promise<{ ok: boolean; data?: T; error?: string }> {
  try {
    const res = await fetch(`${BASE}${path}`, { headers: HEADERS });
    const json = await res.json();
    if (!res.ok) {
      return { ok: false, error: json.error || 'Error en la petición' };
    }
    return { ok: true, data: json };
  } catch (err) {
    console.error(`Rutas API GET ${path}:`, err);
    return { ok: false, error: String(err) };
  }
}

async function apiPost<T>(path: string, body?: unknown): Promise<{ ok: boolean; data?: T; error?: string } & Record<string, unknown>> {
  try {
    const res = await fetch(`${BASE}${path}`, {
      method: 'POST',
      headers: HEADERS,
      body: body ? JSON.stringify(body) : undefined,
    });
    const json = await res.json();
    if (!res.ok) {
      return { ok: false, error: json.error || 'Error en la petición' };
    }
    return { ok: true, data: json };
  } catch (err) {
    console.error(`Rutas API POST ${path}:`, err);
    return { ok: false, error: String(err) };
  }
}

async function apiPut<T>(path: string, body?: unknown): Promise<{ ok: boolean; data?: T; error?: string }> {
  try {
    const res = await fetch(`${BASE}${path}`, {
      method: 'PUT',
      headers: HEADERS,
      body: body ? JSON.stringify(body) : undefined,
    });
    const json = await res.json();
    if (!res.ok) {
      return { ok: false, error: json.error || 'Error en la petición' };
    }
    return { ok: true, data: json };
  } catch (err) {
    console.error(`Rutas API PUT ${path}:`, err);
    return { ok: false, error: String(err) };
  }
}

async function apiDelete(path: string): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await fetch(`${BASE}${path}`, { method: 'DELETE', headers: HEADERS });
    const json = await res.json();
    if (!res.ok) {
      return { ok: false, error: json.error || 'Error en la petición' };
    }
    return { ok: true };
  } catch (err) {
    console.error(`Rutas API DELETE ${path}:`, err);
    return { ok: false, error: String(err) };
  }
}

/* ── Public API ── */

/** Get all rutas with optional filters */
export async function getRutas(params?: { activo?: boolean; carrier?: string }): Promise<Ruta[]> {
  const queryParams = new URLSearchParams();
  if (params?.activo !== undefined) queryParams.set('activo', String(params.activo));
  if (params?.carrier) queryParams.set('carrier', params.carrier);
  
  const res = await apiGet<{ data: Ruta[] }>(queryParams.toString() ? `?${queryParams}` : '');
  if (!res.ok || !res.data) return [];
  return res.data.data || [];
}

/** Get a single ruta by ID */
export async function getRuta(id: string): Promise<Ruta | null> {
  const res = await apiGet<{ data: Ruta }>(`/${id}`);
  if (!res.ok || !res.data) return null;
  return res.data.data || null;
}

/** Create a new ruta */
export async function createRuta(data: Partial<Ruta>): Promise<Ruta | null> {
  const res = await apiPost<{ data: Ruta }>('', data);
  if (!res.ok || !res.data) return null;
  return res.data.data || null;
}

/** Update a ruta */
export async function updateRuta(id: string, data: Partial<Ruta>): Promise<Ruta | null> {
  const res = await apiPut<{ data: Ruta }>(`/${id}`, data);
  if (!res.ok || !res.data) return null;
  return res.data.data || null;
}

/** Delete a ruta */
export async function deleteRuta(id: string): Promise<boolean> {
  const res = await apiDelete(`/${id}`);
  return res.ok;
}
