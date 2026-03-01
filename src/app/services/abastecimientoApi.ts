import { supabase } from '../../utils/supabase/client';

export interface AlertaStock {
  id: string;
  tipo: 'stock_bajo' | 'ruptura' | 'sobrestock';
  producto: string;
  sku?: string;
  nivel: 'info' | 'warning' | 'critical';
  activa?: boolean;
  created_at?: string;
}

export interface SugerenciaOC {
  id: string;
  proveedor: string;
  producto: string;
  estado: 'sugerida' | 'aprobada' | 'enviada' | 'recibida' | 'cancelada';
  created_at?: string;
}

export interface ComponenteMRP {
  id: string;
  componente: string;
  stock_actual?: number;
  a_comprar?: number;
  created_at?: string;
}

export async function getAlertasStock(activa?: boolean): Promise<AlertaStock[]> {
  let query = supabase.from('abastecimiento_alertas').select('*');
  if (activa !== undefined) query = query.eq('activa', activa);
  const { data, error } = await query.order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return data || [];
}

export async function getOrdenesCompra(estado?: string): Promise<SugerenciaOC[]> {
  let query = supabase.from('abastecimiento_ordenes_compra').select('*');
  if (estado) query = query.eq('estado', estado);
  const { data, error } = await query.order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return data || [];
}

export async function getMRPComponentes(): Promise<ComponenteMRP[]> {
  const { data, error } = await supabase
    .from('abastecimiento_mrp')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return data || [];
}

export async function createAlertaStock(data: Omit<AlertaStock, 'id' | 'created_at'>): Promise<AlertaStock> {
  const { data: result, error } = await supabase.from('abastecimiento_alertas').insert(data).select().single();
  if (error) throw new Error(error.message);
  return result;
}

export async function createOrdenCompra(data: Omit<SugerenciaOC, 'id' | 'created_at'>): Promise<SugerenciaOC> {
  const { data: result, error } = await supabase.from('abastecimiento_ordenes_compra').insert(data).select().single();
  if (error) throw new Error(error.message);
  return result;
}

export async function createMRPComponente(data: Omit<ComponenteMRP, 'id' | 'created_at'>): Promise<ComponenteMRP> {
  const { data: result, error } = await supabase.from('abastecimiento_mrp').insert(data).select().single();
  if (error) throw new Error(error.message);
  return result;
}
