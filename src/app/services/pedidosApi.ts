import { supabase } from '../../utils/supabase/client';

export interface PedidoItem {
  producto_id?: string;
  nombre: string;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
}

export interface Pedido {
  id: string;
  numero_pedido: string;
  estado: string;
  estado_pago: string;
  subtotal: number;
  descuento: number;
  impuestos: number;
  total: number;
  items: PedidoItem[];
  notas?: string;
  direccion_envio?: Record<string, string>;
  created_at: string;
  updated_at?: string;
  cliente_persona_id?: string;
  cliente_org_id?: string;
  metodo_pago_id?: string;
  metodo_envio_id?: string;
  cliente_persona?: { id: string; nombre: string; apellido?: string; email?: string; telefono?: string };
  cliente_org?: { id: string; nombre: string; tipo?: string };
  metodo_pago?: { id: string; nombre: string; tipo: string; proveedor?: string };
  metodo_envio?: { id: string; nombre: string; tipo: string; precio: number };
}

export async function getPedidos(params?: { estado?: string; estado_pago?: string; search?: string }): Promise<Pedido[]> {
  let query = supabase
    .from('pedidos')
    .select('*, cliente_persona:personas(id, nombre, apellido, email, telefono), cliente_org:organizaciones(id, nombre, tipo), metodo_pago:metodos_pago(id, nombre, tipo, proveedor), metodo_envio:metodos_envio(id, nombre, tipo, precio)');
  
  if (params?.estado) {
    query = query.eq('estado', params.estado);
  }
  if (params?.estado_pago) {
    query = query.eq('estado_pago', params.estado_pago);
  }
  if (params?.search) {
    query = query.or(`numero_pedido.ilike.%${params.search}%,notas.ilike.%${params.search}%`);
  }
  
  const { data, error } = await query.order('created_at', { ascending: false });
  
  if (error) {
    console.error('[pedidosApi] Error obteniendo pedidos:', error);
    throw new Error(error.message || 'Error cargando pedidos');
  }
  
  return data || [];
}

export async function getPedido(id: string): Promise<Pedido | null> {
  const { data, error } = await supabase
    .from('pedidos')
    .select('*, cliente_persona:personas(id, nombre, apellido, email, telefono), cliente_org:organizaciones(id, nombre, tipo), metodo_pago:metodos_pago(id, nombre, tipo, proveedor), metodo_envio:metodos_envio(id, nombre, tipo, precio)')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error('[pedidosApi] Error obteniendo pedido:', error);
    return null;
  }
  
  return data;
}

export async function createPedido(data: Partial<Pedido>): Promise<Pedido | null> {
  const { data: result, error } = await supabase
    .from('pedidos')
    .insert(data)
    .select()
    .single();
  
  if (error) {
    console.error('[pedidosApi] Error creando pedido:', error);
    throw new Error(error.message || 'Error creando pedido');
  }
  
  return result;
}

export async function updatePedido(id: string, data: Partial<Pedido>): Promise<Pedido | null> {
  const { data: result, error } = await supabase
    .from('pedidos')
    .update({
      ...data,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('[pedidosApi] Error actualizando pedido:', error);
    throw new Error(error.message || 'Error actualizando pedido');
  }
  
  return result;
}

export async function updatePedidoEstado(id: string, nuevo_estado: string): Promise<Pedido | null> {
  const { data: result, error } = await supabase
    .from('pedidos')
    .update({
      estado: nuevo_estado,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('[pedidosApi] Error actualizando estado del pedido:', error);
    throw new Error(error.message || 'Error actualizando estado del pedido');
  }
  
  return result;
}

export async function updatePedidoEstadoPago(id: string, estado_pago: string): Promise<Pedido | null> {
  const { data: result, error } = await supabase
    .from('pedidos')
    .update({
      estado_pago: estado_pago,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('[pedidosApi] Error actualizando estado de pago:', error);
    throw new Error(error.message || 'Error actualizando estado de pago');
  }
  
  return result;
}

export async function deletePedido(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('pedidos')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('[pedidosApi] Error eliminando pedido:', error);
    return false;
  }
  
  return true;
}
