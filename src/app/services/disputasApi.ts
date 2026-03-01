import { supabase } from '../../utils/supabase/client';

export interface Disputa {
  id: string;
  producto_id?: string;
  comprador_id?: string;
  vendedor_id?: string;
  motivo: string;
  descripcion?: string;
  estado: 'abierta' | 'en_revision' | 'resuelta' | 'cerrada';
  resolucion?: string;
  created_at?: string;
  updated_at?: string;
}

export interface DisputaInput {
  producto_id: string;
  comprador_id?: string;
  vendedor_id?: string;
  motivo: string;
  descripcion?: string;
  estado?: 'abierta' | 'en_revision' | 'resuelta' | 'cerrada';
}

export async function getDisputas(params?: { estado?: string; producto_id?: string }): Promise<Disputa[]> {
  let query = supabase
    .from('disputas')
    .select('*');
  
  if (params?.estado) {
    query = query.eq('estado', params.estado);
  }
  if (params?.producto_id) {
    query = query.eq('producto_id', params.producto_id);
  }
  
  const { data, error } = await query.order('created_at', { ascending: false });
  
  if (error) {
    console.error('[disputasApi] Error obteniendo disputas:', error);
    throw new Error(error.message || 'Error cargando disputas');
  }
  
  return data || [];
}

export async function getDisputaById(id: string): Promise<Disputa> {
  const { data, error } = await supabase
    .from('disputas')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error('[disputasApi] Error obteniendo disputa:', error);
    throw new Error(error.message || 'Error cargando disputa');
  }
  
  return data;
}

export async function createDisputa(data: DisputaInput): Promise<Disputa> {
  const { data: result, error } = await supabase
    .from('disputas')
    .insert({
      ...data,
      estado: data.estado ?? 'abierta',
    })
    .select()
    .single();
  
  if (error) {
    console.error('[disputasApi] Error creando disputa:', error);
    throw new Error(error.message || 'Error creando disputa');
  }
  
  return result;
}

export async function updateDisputa(id: string, data: Partial<DisputaInput & { resolucion?: string }>): Promise<Disputa> {
  const { data: result, error } = await supabase
    .from('disputas')
    .update({
      ...data,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('[disputasApi] Error actualizando disputa:', error);
    throw new Error(error.message || 'Error actualizando disputa');
  }
  
  return result;
}

export async function deleteDisputa(id: string): Promise<void> {
  const { error } = await supabase
    .from('disputas')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('[disputasApi] Error eliminando disputa:', error);
    throw new Error(error.message || 'Error eliminando disputa');
  }
}
