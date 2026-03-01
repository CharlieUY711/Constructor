/* =====================================================
   Subcategorías API Service — Dashboard ↔ Backend
   Charlie Marketplace Builder v1.5
   ===================================================== */
import { apiUrl, publicAnonKey } from '../../utils/supabase/client';

const BASE = `${apiUrl}/subcategorias`;
const HEADERS = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${publicAnonKey}`,
};

// ── Types ──────────────────────────────────────────────────────────────────
export interface Subcategoria {
  id: string;
  categoria_id: string;
  nombre: string;
  orden?: number;
  activo: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface SubcategoriaInput {
  categoria_id: string;
  nombre: string;
  orden?: number;
  activo?: boolean;
}

// ── CRUD ───────────────────────────────────────────────────────────────────

export async function getSubcategorias(params?: { categoria_id?: string; activo?: boolean }): Promise<Subcategoria[]> {
  const queryParams = new URLSearchParams();
  if (params?.categoria_id) queryParams.append('categoria_id', params.categoria_id);
  if (params?.activo !== undefined) queryParams.append('activo', String(params.activo));
  const url = queryParams.toString() ? `${BASE}?${queryParams}` : BASE;
  const res = await fetch(url, { headers: HEADERS });
  const json = await res.json();
  if (json.error) throw new Error(json.error);
  return json.data || [];
}

export async function getSubcategoriaById(id: string): Promise<Subcategoria> {
  const res = await fetch(`${BASE}/${id}`, { headers: HEADERS });
  const json = await res.json();
  if (json.error) throw new Error(json.error);
  return json.data;
}

export async function createSubcategoria(data: SubcategoriaInput): Promise<Subcategoria> {
  const res = await fetch(`${BASE}`, {
    method: 'POST',
    headers: HEADERS,
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (json.error) throw new Error(json.error);
  return json.data;
}

export async function updateSubcategoria(id: string, data: Partial<SubcategoriaInput>): Promise<Subcategoria> {
  const res = await fetch(`${BASE}/${id}`, {
    method: 'PUT',
    headers: HEADERS,
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (json.error) throw new Error(json.error);
  return json.data;
}

export async function deleteSubcategoria(id: string): Promise<void> {
  const res = await fetch(`${BASE}/${id}`, {
    method: 'DELETE',
    headers: HEADERS,
  });
  const json = await res.json();
  if (json.error) throw new Error(json.error);
}
