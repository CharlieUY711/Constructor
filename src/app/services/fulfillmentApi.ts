import { supabase } from '../../utils/supabase/client';

export interface OrdenFulfillment {
  id: string;
  orden_externa_id?: string;
  numero?: string;
  pedido?: string;
  cliente: string;
  estado: 'pendiente' | 'en_picking' | 'listo_empacar' | 'empacado' | 'despachado';
  prioridad?: 'urgente' | 'alta' | 'normal' | 'baja';
  items?: number;
  peso?: number;
  volumen?: number;
  zona?: string;
  wave_id?: string;
  operario?: string;
  tiempo_estimado?: string;
  fecha_creacion?: string;
  observaciones?: string;
  lineas?: any[];
  created_at?: string;
  updated_at?: string;
}

export interface Wave {
  id: string;
  nombre: string;
  estado: 'abierta' | 'en_proceso' | 'completada';
  operarios?: number;
  ordenes?: string[];
  inicio?: string;
  fin?: string;
  created_at?: string;
  updated_at?: string;
}

export interface OrdenFulfillmentInput {
  orden_externa_id?: string;
  numero?: string;
  pedido?: string;
  cliente: string;
  estado?: OrdenFulfillment['estado'];
  prioridad?: OrdenFulfillment['prioridad'];
  items?: number;
  peso?: number;
  volumen?: number;
  zona?: string;
  wave_id?: string;
  operario?: string;
  tiempo_estimado?: string;
  observaciones?: string;
  lineas?: any[];
}

export interface WaveInput {
  nombre: string;
  estado?: Wave['estado'];
  operarios?: number;
  ordenes?: string[];
  inicio?: string;
  fin?: string;
}

export async function getOrdenesFulfillment(estado?: string): Promise<OrdenFulfillment[]> {
  let query = supabase
    .from('fulfillment_ordenes')
    .select('*');
  
  if (estado) {
    query = query.eq('estado', estado);
  }
  
  const { data, error } = await query.order('created_at', { ascending: false });
  
  if (error) {
    console.error('[fulfillmentApi] Error obteniendo órdenes de fulfillment:', error);
    throw new Error(error.message || 'Error cargando órdenes de fulfillment');
  }
  
  return data || [];
}

export async function getOrdenFulfillmentById(id: string): Promise<OrdenFulfillment> {
  const { data, error } = await supabase
    .from('fulfillment_ordenes')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error('[fulfillmentApi] Error obteniendo orden de fulfillment:', error);
    throw new Error(error.message || 'Error cargando orden de fulfillment');
  }
  
  return data;
}

export async function createOrdenFulfillment(data: OrdenFulfillmentInput): Promise<OrdenFulfillment> {
  const { data: result, error } = await supabase
    .from('fulfillment_ordenes')
    .insert({
      ...data,
      estado: data.estado ?? 'pendiente',
    })
    .select()
    .single();
  
  if (error) {
    console.error('[fulfillmentApi] Error creando orden de fulfillment:', error);
    throw new Error(error.message || 'Error creando orden de fulfillment');
  }
  
  return result;
}

export async function updateOrdenFulfillment(id: string, data: Partial<OrdenFulfillmentInput>): Promise<OrdenFulfillment> {
  const { data: result, error } = await supabase
    .from('fulfillment_ordenes')
    .update({
      ...data,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('[fulfillmentApi] Error actualizando orden de fulfillment:', error);
    throw new Error(error.message || 'Error actualizando orden de fulfillment');
  }
  
  return result;
}

export async function deleteOrdenFulfillment(id: string): Promise<void> {
  const { error } = await supabase
    .from('fulfillment_ordenes')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('[fulfillmentApi] Error eliminando orden de fulfillment:', error);
    throw new Error(error.message || 'Error eliminando orden de fulfillment');
  }
}

export async function getWaves(estado?: string): Promise<Wave[]> {
  let query = supabase
    .from('fulfillment_waves')
    .select('*');
  
  if (estado) {
    query = query.eq('estado', estado);
  }
  
  const { data, error } = await query.order('created_at', { ascending: false });
  
  if (error) {
    console.error('[fulfillmentApi] Error obteniendo waves:', error);
    throw new Error(error.message || 'Error cargando waves');
  }
  
  return data || [];
}

export async function createWave(data: WaveInput): Promise<Wave> {
  const { data: result, error } = await supabase
    .from('fulfillment_waves')
    .insert({
      ...data,
      estado: data.estado ?? 'abierta',
    })
    .select()
    .single();
  
  if (error) {
    console.error('[fulfillmentApi] Error creando wave:', error);
    throw new Error(error.message || 'Error creando wave');
  }
  
  return result;
}

export async function updateWave(id: string, data: Partial<WaveInput>): Promise<Wave> {
  const { data: result, error } = await supabase
    .from('fulfillment_waves')
    .update({
      ...data,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('[fulfillmentApi] Error actualizando wave:', error);
    throw new Error(error.message || 'Error actualizando wave');
  }
  
  return result;
}

export async function deleteWave(id: string): Promise<void> {
  const { error } = await supabase
    .from('fulfillment_waves')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('[fulfillmentApi] Error eliminando wave:', error);
    throw new Error(error.message || 'Error eliminando wave');
  }
}
