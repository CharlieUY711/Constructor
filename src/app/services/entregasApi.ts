import { supabase } from '../../utils/supabase/client';

const TENANT = 'oddy';

export interface Entrega {
  id: string;
  tenant_id: string;
  envio_id: string;
  route_stop_id?: string;
  estado: 'entregado' | 'no_entregado' | 'parcial' | 'devuelto';
  fecha_entrega: string;
  firmado_por?: string;
  firma_url?: string;
  foto_url?: string;
  lat?: number;
  lng?: number;
  notas?: string;
  motivo_no_entrega?: string;
  usuario_id?: string;
  created_at: string;
  envios?: any;
}

export async function getEntregas(params?: { estado?: string; desde?: string; hasta?: string }): Promise<Entrega[]> {
  let query = supabase
    .from('entregas')
    .select('*, envios(id, numero, destinatario, destino)')
    .eq('tenant_id', TENANT)
    .order('created_at', { ascending: false });
  
  if (params?.estado) {
    query = query.eq('estado', params.estado);
  }
  if (params?.desde) {
    query = query.gte('fecha_entrega', params.desde);
  }
  if (params?.hasta) {
    query = query.lte('fecha_entrega', params.hasta);
  }
  
  const { data, error } = await query;
  
  if (error) {
    console.error('[entregasApi] Error obteniendo entregas:', error);
    throw new Error(error.message || 'Error cargando entregas');
  }
  
  return data || [];
}

export async function getEntrega(id: string): Promise<Entrega | null> {
  const { data, error } = await supabase
    .from('entregas')
    .select('*, envios(*)')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error('[entregasApi] Error obteniendo entrega:', error);
    return null;
  }
  
  return data;
}

export async function confirmarEntrega(data: {
  envio_id: string;
  estado?: Entrega['estado'];
  firmado_por?: string;
  firma_url?: string;
  foto_url?: string;
  lat?: number;
  lng?: number;
  notas?: string;
  motivo_no_entrega?: string;
  route_stop_id?: string;
  usuario_id?: string;
}): Promise<Entrega | null> {
  if (!data.envio_id) {
    throw new Error('envio_id es requerido');
  }
  
  const estadoEntrega = data.estado ?? 'entregado';
  const fechaEntrega = new Date().toISOString();
  
  // Crear la entrega
  const { data: entrega, error: entregaError } = await supabase
    .from('entregas')
    .insert({
      ...data,
      tenant_id: TENANT,
      estado: estadoEntrega,
      fecha_entrega: fechaEntrega,
    })
    .select()
    .single();
  
  if (entregaError) {
    console.error('[entregasApi] Error creando entrega:', entregaError);
    throw new Error(entregaError.message || 'Error creando entrega');
  }
  
  // Actualizar estado del envío y crear evento de tracking
  await Promise.all([
    supabase
      .from('envios')
      .update({ estado: estadoEntrega })
      .eq('id', data.envio_id),
    supabase
      .from('tracking_eventos')
      .insert({
        tenant_id: TENANT,
        envio_id: data.envio_id,
        estado: estadoEntrega,
        descripcion: data.notas ?? 'Entrega confirmada',
        lat: data.lat,
        lng: data.lng,
        usuario_id: data.usuario_id,
      }),
    data.route_stop_id
      ? supabase
          .from('route_stops')
          .update({
            status: 'completed',
            completed_at: new Date().toISOString(),
            proof_url: data.foto_url,
          })
          .eq('id', data.route_stop_id)
      : Promise.resolve({ error: null }),
  ]);
  
  return entrega;
}
