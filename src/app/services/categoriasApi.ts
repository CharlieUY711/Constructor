import { supabase } from '../../utils/supabase/client';

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
  subcategorias?: Subcategoria[];
}

export interface Subcategoria {
  id: string;
  categoria_id: string;
  nombre: string;
  orden?: number;
  activo: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CategoriaInput {
  departamento_id: string;
  nombre: string;
  icono?: string;
  color?: string;
  orden?: number;
  activo?: boolean;
}

export async function getCategorias(params?: { departamento_id?: string; activo?: boolean }): Promise<Categoria[]> {
  let query = supabase
    .from('categorias')
    .select('*');
  
  if (params?.departamento_id) {
    query = query.eq('departamento_id', params.departamento_id);
  }
  if (params?.activo !== undefined) {
    query = query.eq('activo', params.activo);
  }
  
  const { data, error } = await query.order('orden', { ascending: true, nullsFirst: false });
  
  if (error) {
    console.error('[categoriasApi] Error obteniendo categorías:', error);
    throw new Error(error.message || 'Error cargando categorías');
  }
  
  return data || [];
}

export async function getCategoriaById(id: string): Promise<Categoria> {
  const { data, error } = await supabase
    .from('categorias')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error('[categoriasApi] Error obteniendo categoría:', error);
    throw new Error(error.message || 'Error cargando categoría');
  }
  
  return data;
}

export async function createCategoria(data: CategoriaInput): Promise<Categoria> {
  const { data: result, error } = await supabase
    .from('categorias')
    .insert({
      ...data,
      activo: data.activo ?? true,
    })
    .select()
    .single();
  
  if (error) {
    console.error('[categoriasApi] Error creando categoría:', error);
    throw new Error(error.message || 'Error creando categoría');
  }
  
  return result;
}

export async function updateCategoria(id: string, data: Partial<CategoriaInput>): Promise<Categoria> {
  const { data: result, error } = await supabase
    .from('categorias')
    .update({
      ...data,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('[categoriasApi] Error actualizando categoría:', error);
    throw new Error(error.message || 'Error actualizando categoría');
  }
  
  return result;
}

export async function deleteCategoria(id: string): Promise<void> {
  const { error } = await supabase
    .from('categorias')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('[categoriasApi] Error eliminando categoría:', error);
    throw new Error(error.message || 'Error eliminando categoría');
  }
}
