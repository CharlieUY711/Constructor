import { supabase } from '../../utils/supabase/client';

export interface ArticuloCompuesto {
  id: string;
  nombre: string;
  sku?: string;
  tipo: 'kit' | 'canasta' | 'combo' | 'pack';
  descripcion?: string;
  componentes?: any[];
  tiempo_armado?: number;
  costo_mano_obra?: number;
  activo?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface OrdenArmado {
  id: string;
  numero?: string;
  articulo_id?: string;
  articulo_nombre?: string;
  cantidad: number;
  estado: 'pendiente' | 'en_proceso' | 'completada' | 'cancelada';
  ruta?: string;
  operario?: string;
  fecha_pedido?: string;
  fecha_entrega?: string;
  prioridad?: 'alta' | 'normal' | 'baja';
  notas?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ArticuloCompuestoInput {
  nombre: string;
  sku?: string;
  tipo: ArticuloCompuesto['tipo'];
  descripcion?: string;
  componentes?: any[];
  tiempo_armado?: number;
  costo_mano_obra?: number;
  activo?: boolean;
}

export interface OrdenArmadoInput {
  numero?: string;
  articulo_id: string;
  articulo_nombre?: string;
  cantidad: number;
  estado?: OrdenArmado['estado'];
  ruta?: string;
  operario?: string;
  fecha_pedido?: string;
  fecha_entrega?: string;
  prioridad?: OrdenArmado['prioridad'];
  notas?: string;
}

export async function getArticulosProduccion(activo?: boolean): Promise<ArticuloCompuesto[]> {
  let query = supabase
    .from('produccion_articulos')
    .select('*');
  
  if (activo !== undefined) {
    query = query.eq('activo', activo);
  }
  
  const { data, error } = await query.order('nombre');
  
  if (error) {
    console.error('[produccionApi] Error obteniendo artículos:', error);
    throw new Error(error.message || 'Error cargando artículos');
  }
  
  return data || [];
}

export async function getArticuloProduccionById(id: string): Promise<ArticuloCompuesto> {
  const { data, error } = await supabase
    .from('produccion_articulos')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error('[produccionApi] Error obteniendo artículo:', error);
    throw new Error(error.message || 'Error cargando artículo');
  }
  
  return data;
}

export async function createArticuloProduccion(data: ArticuloCompuestoInput): Promise<ArticuloCompuesto> {
  const { data: result, error } = await supabase
    .from('produccion_articulos')
    .insert({
      ...data,
      activo: data.activo ?? true,
    })
    .select()
    .single();
  
  if (error) {
    console.error('[produccionApi] Error creando artículo:', error);
    throw new Error(error.message || 'Error creando artículo');
  }
  
  return result;
}

export async function updateArticuloProduccion(id: string, data: Partial<ArticuloCompuestoInput>): Promise<ArticuloCompuesto> {
  const { data: result, error } = await supabase
    .from('produccion_articulos')
    .update({
      ...data,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('[produccionApi] Error actualizando artículo:', error);
    throw new Error(error.message || 'Error actualizando artículo');
  }
  
  return result;
}

export async function deleteArticuloProduccion(id: string): Promise<void> {
  const { error } = await supabase
    .from('produccion_articulos')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('[produccionApi] Error eliminando artículo:', error);
    throw new Error(error.message || 'Error eliminando artículo');
  }
}

export async function getOrdenesArmado(estado?: string): Promise<OrdenArmado[]> {
  let query = supabase
    .from('produccion_ordenes_armado')
    .select('*');
  
  if (estado) {
    query = query.eq('estado', estado);
  }
  
  const { data, error } = await query.order('created_at', { ascending: false });
  
  if (error) {
    console.error('[produccionApi] Error obteniendo órdenes:', error);
    throw new Error(error.message || 'Error cargando órdenes');
  }
  
  return data || [];
}

export async function getOrdenArmadoById(id: string): Promise<OrdenArmado> {
  const { data, error } = await supabase
    .from('produccion_ordenes_armado')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error('[produccionApi] Error obteniendo orden:', error);
    throw new Error(error.message || 'Error cargando orden');
  }
  
  return data;
}

export async function createOrdenArmado(data: OrdenArmadoInput): Promise<OrdenArmado> {
  const { data: result, error } = await supabase
    .from('produccion_ordenes_armado')
    .insert({
      ...data,
      estado: data.estado ?? 'pendiente',
    })
    .select()
    .single();
  
  if (error) {
    console.error('[produccionApi] Error creando orden:', error);
    throw new Error(error.message || 'Error creando orden');
  }
  
  return result;
}

export async function updateOrdenArmado(id: string, data: Partial<OrdenArmadoInput>): Promise<OrdenArmado> {
  const { data: result, error } = await supabase
    .from('produccion_ordenes_armado')
    .update({
      ...data,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('[produccionApi] Error actualizando orden:', error);
    throw new Error(error.message || 'Error actualizando orden');
  }
  
  return result;
}

export async function deleteOrdenArmado(id: string): Promise<void> {
  const { error } = await supabase
    .from('produccion_ordenes_armado')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('[produccionApi] Error eliminando orden:', error);
    throw new Error(error.message || 'Error eliminando orden');
  }
}
