/* =====================================================
   Departamentos API Service â€” Dashboard â†” Backend
   Charlie Marketplace Builder v1.5
   ===================================================== */
import { projectId, publicAnonKey } from '/utils/supabase/info';

const BASE = `https://${projectId}.supabase.co/functions/v1/api/departamentos`;
const HEADERS = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${publicAnonKey}`,
};

// â”€â”€ Types â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export interface Departamento {
  id: string;
  nombre: string;
  icono?: string;
  color?: string;
  descripcion?: string;
  orden?: number;
  activo: boolean;
  moneda?: 'UYU' | 'USD' | 'EUR';
  edad_minima?: 'Todas' | '+13' | '+18' | '+21';
  alcance?: 'Local' | 'Nacional' | 'Internacional';
  created_at?: string;
  updated_at?: string;
  // campos locales del dashboard (no persisten en DB por ahora)
  categorias?: Categoria[];
}

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
  subcategorias?: Array<{
    id: string;
    categoria_id: string;
    nombre: string;
    orden?: number;
    activo: boolean;
    created_at?: string;
    updated_at?: string;
  }>;
}

export interface DepartamentoInput {
  nombre: string;
  icono?: string;
  color?: string;
  descripcion?: string;
  orden?: number;
  activo?: boolean;
  moneda?: 'UYU' | 'USD' | 'EUR';
  edad_minima?: 'Todas' | '+13' | '+18' | '+21';
  alcance?: 'Local' | 'Nacional' | 'Internacional';
}

// â”€â”€ CRUD â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export async function getDepartamentos(): Promise<Departamento[]> {
  const res = await fetch(`${BASE}`, { headers: HEADERS });
  const json = await res.json();
  if (json.error) throw new Error(json.error);
  return json.data || [];
}

export async function getDepartamentoById(id: string): Promise<Departamento> {
  const res = await fetch(`${BASE}/${id}`, { headers: HEADERS });
  const json = await res.json();
  if (json.error) throw new Error(json.error);
  return json.data;
}

export async function createDepartamento(data: DepartamentoInput): Promise<Departamento> {
  const res = await fetch(`${BASE}`, {
    method: 'POST',
    headers: HEADERS,
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (json.error) throw new Error(json.error);
  return json.data;
}

export async function updateDepartamento(id: string, data: Partial<DepartamentoInput>): Promise<Departamento> {
  const res = await fetch(`${BASE}/${id}`, {
    method: 'PUT',
    headers: HEADERS,
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (json.error) throw new Error(json.error);
  return json.data;
}

export async function deleteDepartamento(id: string): Promise<void> {
  const res = await fetch(`${BASE}/${id}`, {
    method: 'DELETE',
    headers: HEADERS,
  });
  const json = await res.json();
  if (json.error) throw new Error(json.error);
}
