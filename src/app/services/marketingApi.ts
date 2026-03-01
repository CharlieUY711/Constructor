/* =====================================================
   MARKETING API Service — Frontend ↔ Backend
   Campañas, Suscriptores, Fidelización y Sorteos
   Charlie Marketplace Builder v1.5
   ===================================================== */
import { apiUrl, publicAnonKey } from '../../utils/supabase/client';

const BASE = `${apiUrl}/marketing`;
const HEADERS = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${publicAnonKey}`,
};

/* ── Helpers ── */
async function apiGet<T>(path: string): Promise<{ ok: boolean; data?: T; error?: string }> {
  try {
    const res = await fetch(`${BASE}${path}`, { headers: HEADERS });
    return await res.json();
  } catch (err) {
    console.error(`Marketing API GET ${path}:`, err);
    return { ok: false, error: String(err) };
  }
}

async function apiPost<T>(path: string, body?: unknown): Promise<{ ok: boolean; data?: T; error?: string }> {
  try {
    const res = await fetch(`${BASE}${path}`, {
      method: 'POST',
      headers: HEADERS,
      body: body ? JSON.stringify(body) : undefined,
    });
    return await res.json();
  } catch (err) {
    console.error(`Marketing API POST ${path}:`, err);
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
    return await res.json();
  } catch (err) {
    console.error(`Marketing API PUT ${path}:`, err);
    return { ok: false, error: String(err) };
  }
}

async function apiDelete(path: string): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await fetch(`${BASE}${path}`, { method: 'DELETE', headers: HEADERS });
    return await res.json();
  } catch (err) {
    console.error(`Marketing API DELETE ${path}:`, err);
    return { ok: false, error: String(err) };
  }
}

// ── CAMPAÑAS ─────────────────────────────────────────

export interface Campana {
  id: string;
  nombre: string;
  asunto: string | null;
  contenido_html: string | null;
  estado: string;
  tipo: string;
  segmento: Record<string, unknown>;
  programada_para: string | null;
  enviada_en: string | null;
  total_destinatarios: number;
  total_enviados: number;
  total_abiertos: number;
  total_clicks: number;
  total_rebotes: number;
  created_at: string;
  updated_at: string;
}

export async function getCampanas(): Promise<Campana[]> {
  return [];
}

export async function createCampana(data: Partial<Campana>): Promise<Campana | null> {
  return null;
}

export async function updateCampana(id: string, data: Partial<Campana>): Promise<Campana | null> {
  return null;
}

export async function deleteCampana(id: string): Promise<boolean> {
  return false;
}

// ── SUSCRIPTORES ─────────────────────────────────────

export interface Suscriptor {
  id: string;
  email: string;
  nombre: string | null;
  estado: string;
  tags: string[];
  fuente: string | null;
  created_at: string;
  updated_at: string;
}

export async function getSuscriptores(estado?: string): Promise<Suscriptor[]> {
  return [];
}

export async function createSuscriptor(data: Partial<Suscriptor>): Promise<Suscriptor | null> {
  return null;
}

export async function updateSuscriptor(id: string, data: Partial<Suscriptor>): Promise<Suscriptor | null> {
  return null;
}

export async function deleteSuscriptor(id: string): Promise<boolean> {
  return false;
}

// ── FIDELIZACIÓN ─────────────────────────────────────

export interface Nivel {
  id: string;
  nombre: string;
  puntos_minimos: number;
  color: string;
  beneficios: string[];
  created_at: string;
}

export interface Miembro {
  id: string;
  persona_id: string | null;
  email: string;
  nombre: string | null;
  nivel_id: string | null;
  nivel?: Nivel;
  puntos_actuales: number;
  puntos_historicos: number;
  estado: string;
  created_at: string;
  updated_at: string;
}

export interface Movimiento {
  id: string;
  miembro_id: string;
  tipo: string;
  puntos: number;
  descripcion: string | null;
  referencia_id: string | null;
  created_at: string;
}

export interface MiembroDetalle extends Miembro {
  movimientos: Movimiento[];
}

export async function getMiembros(): Promise<Miembro[]> {
  return [];
}

export async function getMiembro(id: string): Promise<MiembroDetalle | null> {
  return null;
}

export async function createMiembro(data: Partial<Miembro>): Promise<Miembro | null> {
  return null;
}

export async function updateMiembro(id: string, data: Partial<Miembro>): Promise<Miembro | null> {
  return null;
}

export async function addPuntos(miembroId: string, puntos: number, descripcion: string, referenciaId?: string): Promise<boolean> {
  return false;
}

export async function getNiveles(): Promise<Nivel[]> {
  return [];
}

// ── SORTEOS ───────────────────────────────────────────

export interface Participante {
  id: string;
  sorteo_id: string;
  email: string;
  nombre: string | null;
  created_at: string;
}

export interface Sorteo {
  id: string;
  nombre: string;
  descripcion: string | null;
  premio: string | null;
  estado: string;
  inicio: string | null;
  fin: string | null;
  total_participantes: number;
  ganador_id: string | null;
  created_at: string;
  updated_at: string;
}

export async function getSorteos(estado?: string): Promise<Sorteo[]> {
  return [];
}

export async function createSorteo(data: Partial<Sorteo>): Promise<Sorteo | null> {
  return null;
}

export async function updateSorteo(id: string, data: Partial<Sorteo>): Promise<Sorteo | null> {
  return null;
}

export async function participarSorteo(id: string, email: string, nombre?: string): Promise<Participante | null> {
  return null;
}

export async function girarSorteo(id: string): Promise<{ ganador: Participante; sorteo: Sorteo } | null> {
  return null;
}
