import { supabase } from '../../utils/supabase/client';

export interface Persona {
  id: string;
  tipo: 'natural' | 'juridica';
  nombre: string;
  apellido?: string;
  email?: string;
  telefono?: string;
  documento_tipo?: string;
  documento_numero?: string;
  fecha_nacimiento?: string;
  genero?: string;
  nacionalidad?: string;
  direccion?: Record<string, string>;
  metadata?: Record<string, unknown>;
  activo: boolean;
  created_at: string;
}

export async function getPersonas(params?: { tipo?: string; activo?: boolean; rol?: string; search?: string }): Promise<Persona[]> {
  let query = supabase
    .from('personas')
    .select('*');
  
  if (params?.tipo) {
    query = query.eq('tipo', params.tipo);
  }
  if (params?.activo !== undefined) {
    query = query.eq('activo', params.activo);
  }
  if (params?.search) {
    query = query.or(`nombre.ilike.%${params.search}%,apellido.ilike.%${params.search}%,email.ilike.%${params.search}%`);
  }
  
  const { data, error } = await query.order('created_at', { ascending: false });
  
  if (error) {
    console.error('[personasApi] Error obteniendo personas:', error);
    throw new Error(error.message || 'Error cargando personas');
  }
  
  return data || [];
}

export async function getPersona(id: string): Promise<Persona | null> {
  const { data, error } = await supabase
    .from('personas')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error('[personasApi] Error obteniendo persona:', error);
    return null;
  }
  
  return data;
}

export async function createPersona(data: Partial<Persona>): Promise<Persona | null> {
  const { data: result, error } = await supabase
    .from('personas')
    .insert({
      ...data,
      activo: data.activo ?? true,
    })
    .select()
    .single();
  
  if (error) {
    console.error('[personasApi] Error creando persona:', error);
    throw new Error(error.message || 'Error creando persona');
  }
  
  return result;
}

export async function updatePersona(id: string, data: Partial<Persona>): Promise<Persona | null> {
  const { data: result, error } = await supabase
    .from('personas')
    .update(data)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('[personasApi] Error actualizando persona:', error);
    throw new Error(error.message || 'Error actualizando persona');
  }
  
  return result;
}

export async function deletePersona(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('personas')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('[personasApi] Error eliminando persona:', error);
    return false;
  }
  
  return true;
}
