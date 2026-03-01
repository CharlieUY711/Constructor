import { supabase } from '../../utils/supabase/client';

export interface MetodoPago {
  id: string;
  nombre: string;
  tipo: string;
  proveedor?: string;
  descripcion?: string;
  instrucciones?: string;
  activo: boolean;
  orden: number;
  created_at: string;
}

export async function getMetodosPago(params?: { activo?: boolean }): Promise<MetodoPago[]> {
  let query = supabase
    .from('metodos_pago')
    .select('*');
  
  if (params?.activo !== undefined) {
    query = query.eq('activo', params.activo);
  }
  
  const { data, error } = await query.order('orden', { ascending: true });
  
  if (error) {
    console.error('[metodosPagoApi] Error obteniendo métodos de pago:', error);
    throw new Error(error.message || 'Error cargando métodos de pago');
  }
  
  return data || [];
}

export async function getMetodoPago(id: string): Promise<MetodoPago | null> {
  const { data, error } = await supabase
    .from('metodos_pago')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error('[metodosPagoApi] Error obteniendo método de pago:', error);
    return null;
  }
  
  return data;
}

export async function createMetodoPago(data: Partial<MetodoPago>): Promise<MetodoPago | null> {
  const { data: result, error } = await supabase
    .from('metodos_pago')
    .insert(data)
    .select()
    .single();
  
  if (error) {
    console.error('[metodosPagoApi] Error creando método de pago:', error);
    throw new Error(error.message || 'Error creando método de pago');
  }
  
  return result;
}

export async function updateMetodoPago(id: string, data: Partial<MetodoPago>): Promise<MetodoPago | null> {
  const { data: result, error } = await supabase
    .from('metodos_pago')
    .update(data)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('[metodosPagoApi] Error actualizando método de pago:', error);
    throw new Error(error.message || 'Error actualizando método de pago');
  }
  
  return result;
}

export async function deleteMetodoPago(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('metodos_pago')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('[metodosPagoApi] Error eliminando método de pago:', error);
    return false;
  }
  
  return true;
}
