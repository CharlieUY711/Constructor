import { supabase } from '../../utils/supabase/client';

export interface Subcategoria {
  id: string;
  categoria_id: string;
  nombre: string;
  orden?: number;
  activo: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface SubcategoriaInput {
  categoria_id: string;
  nombre: string;
  orden?: number;
  activo?: boolean;
}

export async function getSubcategorias(params?: { categoria_id?: string; activo?: boolean }): Promise<Subcategoria[]> {
  let query = supabase
    .from('subcategorias')
    .select('*');
  
  if (params?.categoria_id) {
    query = query.eq('categoria_id', params.categoria_id);
  }
  if (params?.activo !== undefined) {
    query = query.eq('activo', params.activo);
  }
  
  const { data, error } = await query.order('orden', { ascending: true, nullsFirst: false });
  
  if (error) {
    console.error('[subcategoriasApi] Error obteniendo subcategorías:', error);
    throw new Error(error.message || 'Error cargando subcategorías');
  }
  
  return data || [];
}

export async function getSubcategoriaById(id: string): Promise<Subcategoria> {
  const { data, error } = await supabase
    .from('subcategorias')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error('[subcategoriasApi] Error obteniendo subcategoría:', error);
    throw new Error(error.message || 'Error cargando subcategoría');
  }
  
  return data;
}

export async function createSubcategoria(data: SubcategoriaInput): Promise<Subcategoria> {
  const { data: result, error } = await supabase
    .from('subcategorias')
    .insert({
      ...data,
      activo: data.activo ?? true,
    })
    .select()
    .single();
  
  if (error) {
    console.error('[subcategoriasApi] Error creando subcategoría:', error);
    throw new Error(error.message || 'Error creando subcategoría');
  }
  
  return result;
}

export async function updateSubcategoria(id: string, data: Partial<SubcategoriaInput>): Promise<Subcategoria> {
  const { data: result, error } = await supabase
    .from('subcategorias')
    .update({
      ...data,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('[subcategoriasApi] Error actualizando subcategoría:', error);
    throw new Error(error.message || 'Error actualizando subcategoría');
  }
  
  return result;
}

export async function deleteSubcategoria(id: string): Promise<void> {
  const { error } = await supabase
    .from('subcategorias')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('[subcategoriasApi] Error eliminando subcategoría:', error);
    throw new Error(error.message || 'Error eliminando subcategoría');
  }
}
