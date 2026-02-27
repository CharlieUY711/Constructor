/* =====================================================
   Etiquetas API Service — Frontend ↔ Backend
   ===================================================== */
import { projectId, publicAnonKey } from '/utils/supabase/info';

const BASE = `https://${projectId}.supabase.co/functions/v1/api/etiquetas`;
const HEADERS = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${publicAnonKey}`,
};

export interface Etiqueta {
  token: string;
  envio_numero: string;
  remitente_nombre: string;
  destinatario_nombre: string;
  destinatario_email: string;
  destinatario_tel: string;
  mensaje: string;
  icono: string;
  ocasion: string;
  formato: string;
  estado: 'pendiente' | 'escaneada' | 'respondida';
  scanned_at: string | null;
  respuesta: string | null;
  respuesta_nombre: string | null;
  respondida_at: string | null;
  optin_contacto: string | null;
  created_at: string;
}

/* ── Helpers ── */
async function apiGet<T>(path: string): Promise<{ ok: boolean; data?: T; error?: string }> {
  try {
    const res = await fetch(`${BASE}${path}`, { headers: HEADERS });
    return await res.json();
  } catch (err) {
    console.error(`Etiquetas API GET ${path}:`, err);
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
    return await res.json();
  } catch (err) {
    console.error(`Etiquetas API POST ${path}:`, err);
    return { ok: false, error: String(err) };
  }
}

async function apiDelete(path: string): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await fetch(`${BASE}${path}`, { method: 'DELETE', headers: HEADERS });
    return await res.json();
  } catch (err) {
    console.error(`Etiquetas API DELETE ${path}:`, err);
    return { ok: false, error: String(err) };
  }
}

/* ── Public API ── */

/** Get all etiquetas */
export async function getEtiquetas(): Promise<Etiqueta[]> {
  const res = await apiGet<Etiqueta[]>('');
  if (!res.ok || !res.data) return [];
  return Array.isArray(res.data) ? res.data : [];
}

/** Get a single etiqueta by token */
export async function getEtiqueta(token: string): Promise<Etiqueta | null> {
  const res = await apiGet<Etiqueta>(`/${token}`);
  if (!res.ok || !res.data) return null;
  return res.data;
}

/** Create a new etiqueta */
export async function createEtiqueta(data: Partial<Etiqueta>): Promise<Etiqueta | null> {
  const res = await apiPost<Etiqueta>('', data);
  if (!res.ok || !res.data) return null;
  return res.data;
}

/** Delete an etiqueta */
export async function deleteEtiqueta(token: string): Promise<boolean> {
  const res = await apiDelete(`/${token}`);
  return res.ok;
}
