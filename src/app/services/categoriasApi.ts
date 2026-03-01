/* =====================================================
   Categorías API Service — Dashboard ↔ Backend
   Charlie Marketplace Builder v1.5
   ===================================================== */
import { apiUrl, publicAnonKey } from '../../utils/supabase/client';

const BASE = `${apiUrl}/categorias`;
const HEADERS = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${publicAnonKey}`,
};

// ── Types ──────────────────────────────────────────────────────────────────
export interface Categoria {
  id: string;
  departamento_id: string;
  nombre: string;
  icono?: string;
  color?: string;
  orden?: number;
  activo: boolean;
  created_at?: string;
  updated_at?: string;
  subcategorias?: Subcategoria[];
}

export interface Subcategoria {
  id: string;
  categoria_id: string;
  nombre: string;
  orden?: number;
  activo: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CategoriaInput {
  departamento_id: string;
  nombre: string;
  icono?: string;
  color?: string;
  orden?: number;
  activo?: boolean;
}

// ── CRUD ───────────────────────────────────────────────────────────────────

export async function getCategorias(params?: { departamento_id?: string; activo?: boolean }): Promise<Categoria[]> {
  const queryParams = new URLSearchParams();
  if (params?.departamento_id) queryParams.append('departamento_id', params.departamento_id);
  if (params?.activo !== undefined) queryParams.append('activo', String(params.activo));
  const url = queryParams.toString() ? `${BASE}?${queryParams}` : BASE;
  const res = await fetch(url, { headers: HEADERS });
  const json = await res.json();
  if (json.error) throw new Error(json.error);
  return json.data || [];
}

export async function getCategoriaById(id: string): Promise<Categoria> {
  const res = await fetch(`${BASE}/${id}`, { headers: HEADERS });
  const json = await res.json();
  if (json.error) throw new Error(json.error);
  return json.data;
}

export async function createCategoria(data: CategoriaInput): Promise<Categoria> {
  const res = await fetch(`${BASE}`, {
    method: 'POST',
    headers: HEADERS,
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (json.error) throw new Error(json.error);
  return json.data;
}

export async function updateCategoria(id: string, data: Partial<CategoriaInput>): Promise<Categoria> {
  const res = await fetch(`${BASE}/${id}`, {
    method: 'PUT',
    headers: HEADERS,
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (json.error) throw new Error(json.error);
  return json.data;
}

export async function deleteCategoria(id: string): Promise<void> {
  const res = await fetch(`${BASE}/${id}`, {
    method: 'DELETE',
    headers: HEADERS,
  });
  const json = await res.json();
  if (json.error) throw new Error(json.error);
}
