import { supabase } from '../../utils/supabase/client';

export interface ProductoSecondHand {
  id: string;
  nombre: string;
  descripcion: string;
  precio_1: number;
  estado: string;
  condicion: string;
  imagen_principal?: string;
  imagenes?: string[];
  departamento_id?: string;
  vendedor_id?: string;
  created_at: string;
}

export async function getProductosSecondHand(params?: { estado?: string; vendedor_id?: string; search?: string }): Promise<ProductoSecondHand[]> {
  let query = supabase
    .from('productos_secondhand')
    .select('*');
  
  if (params?.estado) {
    query = query.eq('estado', params.estado);
  }
  if (params?.vendedor_id) {
    query = query.eq('vendedor_id', params.vendedor_id);
  }
  if (params?.search) {
    query = query.or(`nombre.ilike.%${params.search}%,descripcion.ilike.%${params.search}%`);
  }
  
  const { data, error } = await query.order('created_at', { ascending: false });
  
  if (error) {
    console.error('[productosSecondhandApi] Error obteniendo productos secondhand:', error);
    throw new Error(error.message || 'Error cargando productos secondhand');
  }
  
  return data || [];
}

export async function getProductoSecondHand(id: string): Promise<ProductoSecondHand | null> {
  const { data, error } = await supabase
    .from('productos_secondhand')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error('[productosSecondhandApi] Error obteniendo producto secondhand:', error);
    return null;
  }
  
  return data;
}

export async function createProductoSecondHand(data: Partial<ProductoSecondHand>): Promise<ProductoSecondHand | null> {
  const { data: result, error } = await supabase
    .from('productos_secondhand')
    .insert(data)
    .select()
    .single();
  
  if (error) {
    console.error('[productosSecondhandApi] Error creando producto secondhand:', error);
    throw new Error(error.message || 'Error creando producto secondhand');
  }
  
  return result;
}

export async function updateProductoSecondHand(id: string, data: Partial<ProductoSecondHand>): Promise<ProductoSecondHand | null> {
  const { data: result, error } = await supabase
    .from('productos_secondhand')
    .update(data)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('[productosSecondhandApi] Error actualizando producto secondhand:', error);
    throw new Error(error.message || 'Error actualizando producto secondhand');
  }
  
  return result;
}

export async function deleteProductoSecondHand(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('productos_secondhand')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('[productosSecondhandApi] Error eliminando producto secondhand:', error);
    return false;
  }
  
  return true;
}
