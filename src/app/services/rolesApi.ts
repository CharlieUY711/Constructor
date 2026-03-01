import { supabase } from '../../utils/supabase/client';

export interface Rol {
  id: string;
  persona_id?: string;
  organizacion_id?: string;
  rol: string;
  contexto?: string;
  activo: boolean;
  created_at: string;
  persona?: { id: string; nombre: string; apellido?: string; email?: string; tipo: string; telefono?: string };
  organizacion?: { id: string; nombre: string; tipo?: string };
}

export async function getRoles(params?: { persona_id?: string; organizacion_id?: string; rol?: string; activo?: boolean }): Promise<Rol[]> {
  let query = supabase
    .from('roles')
    .select('*, persona:personas(id, nombre, apellido, email, tipo, telefono), organizacion:organizaciones(id, nombre, tipo)');
  
  if (params?.persona_id) {
    query = query.eq('persona_id', params.persona_id);
  }
  if (params?.organizacion_id) {
    query = query.eq('organizacion_id', params.organizacion_id);
  }
  if (params?.rol) {
    query = query.eq('rol', params.rol);
  }
  if (params?.activo !== undefined) {
    query = query.eq('activo', params.activo);
  }
  
  const { data, error } = await query.order('created_at', { ascending: false });
  
  if (error) {
    console.error('[rolesApi] Error obteniendo roles:', error);
    throw new Error(error.message || 'Error cargando roles');
  }
  
  return data || [];
}

export async function getRol(id: string): Promise<Rol | null> {
  const { data, error } = await supabase
    .from('roles')
    .select('*, persona:personas(id, nombre, apellido, email, tipo, telefono), organizacion:organizaciones(id, nombre, tipo)')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error('[rolesApi] Error obteniendo rol:', error);
    return null;
  }
  
  return data;
}

export async function createRol(data: Partial<Rol>): Promise<Rol | null> {
  const { data: result, error } = await supabase
    .from('roles')
    .insert({
      ...data,
      activo: data.activo ?? true,
    })
    .select()
    .single();
  
  if (error) {
    console.error('[rolesApi] Error creando rol:', error);
    throw new Error(error.message || 'Error creando rol');
  }
  
  return result;
}

export async function updateRol(id: string, data: Partial<Rol>): Promise<Rol | null> {
  const { data: result, error } = await supabase
    .from('roles')
    .update(data)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('[rolesApi] Error actualizando rol:', error);
    throw new Error(error.message || 'Error actualizando rol');
  }
  
  return result;
}

export async function deleteRol(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('roles')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('[rolesApi] Error eliminando rol:', error);
    return false;
  }
  
  return true;
}
