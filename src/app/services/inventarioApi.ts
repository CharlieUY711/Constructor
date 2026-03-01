import { supabase } from '../../utils/supabase/client';

const TENANT = 'oddy';

export interface ItemInventario {
  id: string;
  tenant_id: string;
  deposito_id: string;
  sku: string;
  nombre: string;
  descripcion?: string;
  categoria?: string;
  cantidad: number;
  cantidad_minima: number;
  ubicacion?: string;
  costo_unitario?: number;
  moneda?: string;
  created_at: string;
  updated_at?: string;
  depositos?: { id: string; nombre: string; ciudad?: string };
}

export interface MovimientoInventario {
  tipo: 'entrada' | 'salida' | 'ajuste' | 'transferencia';
  cantidad: number;
  referencia?: string;
  notas?: string;
  usuario_id?: string;
}

export async function getInventario(params?: { deposito_id?: string; categoria?: string; search?: string }): Promise<{ data: ItemInventario[]; alertas_count: number }> {
  let query = supabase
    .from('inventario')
    .select('*, depositos(id, nombre, ciudad)')
    .eq('tenant_id', TENANT)
    .order('nombre');
  
  if (params?.deposito_id) {
    query = query.eq('deposito_id', params.deposito_id);
  }
  if (params?.categoria) {
    query = query.eq('categoria', params.categoria);
  }
  if (params?.search) {
    query = query.ilike('nombre', `%${params.search}%`);
  }
  
  const { data, error } = await query;
  
  if (error) {
    console.error('[inventarioApi] Error obteniendo inventario:', error);
    throw new Error(error.message || 'Error cargando inventario');
  }
  
  const result = data || [];
  const alertas = result.filter((i: ItemInventario) => i.cantidad <= i.cantidad_minima);
  
  return { data: result, alertas_count: alertas.length };
}

export async function getItem(id: string): Promise<{ data: ItemInventario; movimientos: any[] }> {
  const { data: item, error: itemError } = await supabase
    .from('inventario')
    .select('*, depositos(id, nombre)')
    .eq('id', id)
    .eq('tenant_id', TENANT)
    .single();
  
  if (itemError) {
    console.error('[inventarioApi] Error obteniendo item:', itemError);
    throw new Error(itemError.message || 'Error cargando item');
  }
  
  const { data: movimientos, error: movError } = await supabase
    .from('inventario_movimientos')
    .select('*')
    .eq('inventario_id', id)
    .order('created_at', { ascending: false })
    .limit(20);
  
  if (movError) {
    console.error('[inventarioApi] Error obteniendo movimientos:', movError);
    // No lanzamos error, solo retornamos movimientos vacíos
  }
  
  return { data: item, movimientos: movimientos || [] };
}

export async function createItem(data: Partial<ItemInventario>): Promise<ItemInventario | null> {
  if (!data.sku || !data.nombre || !data.deposito_id) {
    throw new Error('sku, nombre y deposito_id son requeridos');
  }
  
  const { data: result, error } = await supabase
    .from('inventario')
    .insert({
      ...data,
      tenant_id: TENANT,
      cantidad: data.cantidad ?? 0,
    })
    .select()
    .single();
  
  if (error) {
    console.error('[inventarioApi] Error creando item:', error);
    throw new Error(error.message || 'Error creando item');
  }
  
  return result;
}

export async function updateItem(id: string, data: Partial<ItemInventario>): Promise<ItemInventario | null> {
  const { data: result, error } = await supabase
    .from('inventario')
    .update({
      ...data,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .eq('tenant_id', TENANT)
    .select()
    .single();
  
  if (error) {
    console.error('[inventarioApi] Error actualizando item:', error);
    throw new Error(error.message || 'Error actualizando item');
  }
  
  return result;
}

export async function registrarMovimiento(id: string, mov: MovimientoInventario): Promise<{ success: boolean; cantidad_anterior: number; cantidad_nueva: number }> {
  if (!mov.tipo || !mov.cantidad) {
    throw new Error('tipo y cantidad son requeridos');
  }
  
  if (!['entrada', 'salida', 'ajuste', 'transferencia'].includes(mov.tipo)) {
    throw new Error('tipo inválido');
  }
  
  // Obtener cantidad actual
  const { data: item, error: fetchError } = await supabase
    .from('inventario')
    .select('cantidad')
    .eq('id', id)
    .single();
  
  if (fetchError) {
    console.error('[inventarioApi] Error obteniendo item para movimiento:', fetchError);
    throw new Error(fetchError.message || 'Error obteniendo item');
  }
  
  // Calcular nueva cantidad
  const delta = mov.tipo === 'salida' ? -Math.abs(mov.cantidad) : Math.abs(mov.cantidad);
  const nueva_cantidad = mov.tipo === 'ajuste' ? mov.cantidad : item.cantidad + delta;
  
  if (nueva_cantidad < 0) {
    throw new Error('Stock insuficiente');
  }
  
  // Registrar movimiento y actualizar cantidad
  const [movResult, updResult] = await Promise.all([
    supabase
      .from('inventario_movimientos')
      .insert({
        tenant_id: TENANT,
        inventario_id: id,
        tipo: mov.tipo,
        cantidad: mov.cantidad,
        referencia: mov.referencia,
        notas: mov.notas,
        usuario_id: mov.usuario_id,
      }),
    supabase
      .from('inventario')
      .update({
        cantidad: nueva_cantidad,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id),
  ]);
  
  if (movResult.error) {
    console.error('[inventarioApi] Error registrando movimiento:', movResult.error);
    throw new Error(movResult.error.message || 'Error registrando movimiento');
  }
  
  if (updResult.error) {
    console.error('[inventarioApi] Error actualizando cantidad:', updResult.error);
    throw new Error(updResult.error.message || 'Error actualizando cantidad');
  }
  
  return {
    success: true,
    cantidad_anterior: item.cantidad,
    cantidad_nueva: nueva_cantidad,
  };
}

export async function deleteItem(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('inventario')
    .delete()
    .eq('id', id)
    .eq('tenant_id', TENANT);
  
  if (error) {
    console.error('[inventarioApi] Error eliminando item:', error);
    return false;
  }
  
  return true;
}
