import { supabase } from '../../utils/supabase/client';

export interface MetodoEnvio {
  id: string;
  nombre: string;
  tipo: string;
  precio: number;
  zona?: string;
  tiempo_estimado?: string;
  descripcion?: string;
  activo: boolean;
  orden: number;
  created_at: string;
}

export async function getMetodosEnvio(params?: { activo?: boolean }): Promise<MetodoEnvio[]> {
  let query = supabase
    .from('metodos_envio')
    .select('*');
  
  if (params?.activo !== undefined) {
    query = query.eq('activo', params.activo);
  }
  
  const { data, error } = await query.order('orden', { ascending: true });
  
  if (error) {
    console.error('[metodosEnvioApi] Error obteniendo métodos de envío:', error);
    throw new Error(error.message || 'Error cargando métodos de envío');
  }
  
  return data || [];
}

export async function getMetodoEnvio(id: string): Promise<MetodoEnvio | null> {
  const { data, error } = await supabase
    .from('metodos_envio')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error('[metodosEnvioApi] Error obteniendo método de envío:', error);
    return null;
  }
  
  return data;
}

export async function createMetodoEnvio(data: Partial<MetodoEnvio>): Promise<MetodoEnvio | null> {
  const { data: result, error } = await supabase
    .from('metodos_envio')
    .insert(data)
    .select()
    .single();
  
  if (error) {
    console.error('[metodosEnvioApi] Error creando método de envío:', error);
    throw new Error(error.message || 'Error creando método de envío');
  }
  
  return result;
}

export async function updateMetodoEnvio(id: string, data: Partial<MetodoEnvio>): Promise<MetodoEnvio | null> {
  const { data: result, error } = await supabase
    .from('metodos_envio')
    .update(data)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('[metodosEnvioApi] Error actualizando método de envío:', error);
    throw new Error(error.message || 'Error actualizando método de envío');
  }
  
  return result;
}

export async function deleteMetodoEnvio(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('metodos_envio')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('[metodosEnvioApi] Error eliminando método de envío:', error);
    return false;
  }
  
  return true;
}
