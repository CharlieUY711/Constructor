/* =====================================================
   Abastecimiento API Service — Dashboard ↔ Backend
   ===================================================== */
import { apiUrl, publicAnonKey } from '../../utils/supabase/client';

const BASE = `${apiUrl}/abastecimiento`;
const HEADERS = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${publicAnonKey}`,
};

// ─── Types ────────────────────────────────────────────────────────────────
export interface AlertaStock {
  id: string;
  tipo: 'stock_bajo' | 'ruptura' | 'sobrestock';
  producto: string;
  sku?: string;
  categoria?: string;
  nivel: 'info' | 'warning' | 'critical';
  valor?: number;
  umbral?: number;
  stock_actual?: number;
  stock_minimo?: number;
  stock_optimo?: number;
  unidad?: string;
  proveedor?: string;
  tiempo_reposicion?: number;
  consumo_prom_diario?: number;
  dias_restantes?: number;
  activa?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface SugerenciaOC {
  id: string;
  proveedor: string;
  producto: string;
  sku?: string;
  cantidad_sugerida?: number;
  precio_estimado?: number;
  precio_unit?: number;
  total?: number;
  motivo_oc?: string;
  urgencia?: 'baja' | 'normal' | 'alta';
  estado: 'sugerida' | 'aprobada' | 'enviada' | 'recibida' | 'cancelada';
  fecha_sugerida?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ComponenteMRP {
  id: string;
  componente: string;
  sku?: string;
  unidad?: string;
  stock_actual?: number;
  demanda_proyectada?: number;
  necesario?: number;
  a_comprar?: number;
  created_at?: string;
  updated_at?: string;
}

export interface AlertaStockInput {
  tipo: AlertaStock['tipo'];
  producto: string;
  sku?: string;
  categoria?: string;
  nivel: AlertaStock['nivel'];
  valor?: number;
  umbral?: number;
  stock_actual?: number;
  stock_minimo?: number;
  stock_optimo?: number;
  unidad?: string;
  proveedor?: string;
  tiempo_reposicion?: number;
  consumo_prom_diario?: number;
  dias_restantes?: number;
  activa?: boolean;
}

export interface SugerenciaOCInput {
  proveedor: string;
  producto: string;
  sku?: string;
  cantidad_sugerida?: number;
  precio_estimado?: number;
  precio_unit?: number;
  total?: number;
  motivo_oc?: string;
  urgencia?: SugerenciaOC['urgencia'];
  estado?: SugerenciaOC['estado'];
}

export interface ComponenteMRPInput {
  componente: string;
  sku?: string;
  unidad?: string;
  stock_actual?: number;
  demanda_proyectada?: number;
  necesario?: number;
  a_comprar?: number;
}

// ─── CRUD Alertas ──────────────────────────────────────────────────────────

export async function getAlertasStock(activa?: boolean, nivel?: string): Promise<AlertaStock[]> {
  let url = `${BASE}/alertas`;
  const params = new URLSearchParams();
  if (activa !== undefined) params.append('activa', String(activa));
  if (nivel) params.append('nivel', nivel);
  if (params.toString()) url += `?${params.toString()}`;
  
  const res = await fetch(url, { headers: HEADERS });
  const json = await res.json();
  if (json.error) throw new Error(json.error);
  return json.data || [];
}

export async function createAlertaStock(data: AlertaStockInput): Promise<AlertaStock> {
  const res = await fetch(`${BASE}/alertas`, {
    method: 'POST',
    headers: HEADERS,
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (json.error) throw new Error(json.error);
  return json.data;
}

export async function updateAlertaStock(id: string, data: Partial<AlertaStockInput>): Promise<AlertaStock> {
  const res = await fetch(`${BASE}/alertas/${id}`, {
    method: 'PUT',
    headers: HEADERS,
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (json.error) throw new Error(json.error);
  return json.data;
}

export async function deleteAlertaStock(id: string): Promise<void> {
  const res = await fetch(`${BASE}/alertas/${id}`, {
    method: 'DELETE',
    headers: HEADERS,
  });
  const json = await res.json();
  if (json.error) throw new Error(json.error);
}

// ─── CRUD Órdenes de Compra ───────────────────────────────────────────────

export async function getOrdenesCompra(estado?: string): Promise<SugerenciaOC[]> {
  const url = estado ? `${BASE}/ordenes-compra?estado=${estado}` : `${BASE}/ordenes-compra`;
  const res = await fetch(url, { headers: HEADERS });
  const json = await res.json();
  if (json.error) throw new Error(json.error);
  return json.data || [];
}

export async function createOrdenCompra(data: SugerenciaOCInput): Promise<SugerenciaOC> {
  const res = await fetch(`${BASE}/ordenes-compra`, {
    method: 'POST',
    headers: HEADERS,
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (json.error) throw new Error(json.error);
  return json.data;
}

export async function updateOrdenCompra(id: string, data: Partial<SugerenciaOCInput>): Promise<SugerenciaOC> {
  const res = await fetch(`${BASE}/ordenes-compra/${id}`, {
    method: 'PUT',
    headers: HEADERS,
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (json.error) throw new Error(json.error);
  return json.data;
}

export async function deleteOrdenCompra(id: string): Promise<void> {
  const res = await fetch(`${BASE}/ordenes-compra/${id}`, {
    method: 'DELETE',
    headers: HEADERS,
  });
  const json = await res.json();
  if (json.error) throw new Error(json.error);
}

// ─── CRUD MRP ─────────────────────────────────────────────────────────────

export async function getMRPComponentes(): Promise<ComponenteMRP[]> {
  const res = await fetch(`${BASE}/mrp`, { headers: HEADERS });
  const json = await res.json();
  if (json.error) throw new Error(json.error);
  return json.data || [];
}

export async function createMRPComponente(data: ComponenteMRPInput): Promise<ComponenteMRP> {
  const res = await fetch(`${BASE}/mrp`, {
    method: 'POST',
    headers: HEADERS,
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (json.error) throw new Error(json.error);
  return json.data;
}

export async function updateMRPComponente(id: string, data: Partial<ComponenteMRPInput>): Promise<ComponenteMRP> {
  const res = await fetch(`${BASE}/mrp/${id}`, {
    method: 'PUT',
    headers: HEADERS,
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (json.error) throw new Error(json.error);
  return json.data;
}

export async function deleteMRPComponente(id: string): Promise<void> {
  const res = await fetch(`${BASE}/mrp/${id}`, {
    method: 'DELETE',
    headers: HEADERS,
  });
  const json = await res.json();
  if (json.error) throw new Error(json.error);
}
