import { supabase } from '../../utils/supabase/client';

const TENANT = 'oddy';

export interface Parada {
  id: string;
  route_id: string;
  envio_id?: string;
  recipient_name?: string;
  address?: string;
  order_index: number;
  status: 'pendiente' | 'completed' | 'failed';
  completed_at?: string;
  proof_url?: string;
  notes?: string;
  lat?: number;
  lng?: number;
  envios?: any;
}

export interface Ruta {
  id: string;
  tenant_id: string;
  name: string;
  driver_name?: string;
  date: string;
  status: 'pendiente' | 'en_curso' | 'completada' | 'cancelada';
  transportista_id?: string;
  vehiculo_id?: string;
  distancia_km?: number;
  duracion_min?: number;
  created_at: string;
  updated_at?: string;
  route_stops?: Parada[];
  transportistas?: { id: string; nombre: string };
  vehiculos?: { id: string; patente: string; tipo: string };
}

export async function getRutas(params?: { fecha?: string; status?: string; transportista_id?: string }): Promise<Ruta[]> {
  let query = supabase
    .from('routes')
    .select('*, route_stops(*, envios(id, numero, destinatario, destino, estado)), transportistas(id, nombre), vehiculos(id, patente, tipo)')
    .eq('tenant_id', TENANT)
    .order('date', { ascending: false });
  
  if (params?.fecha) {
    query = query.eq('date', params.fecha);
  }
  if (params?.status) {
    query = query.eq('status', params.status);
  }
  if (params?.transportista_id) {
    query = query.eq('transportista_id', params.transportista_id);
  }
  
  const { data, error } = await query;
  
  if (error) {
    console.error('[rutasApi] Error obteniendo rutas:', error);
    throw new Error(error.message || 'Error cargando rutas');
  }
  
  return (data || []) as Ruta[];
}

export async function getRuta(id: string): Promise<Ruta | null> {
  const { data, error } = await supabase
    .from('routes')
    .select('*, route_stops(*, envios(*)), transportistas(*), vehiculos(*)')
    .eq('id', id)
    .eq('tenant_id', TENANT)
    .single();
  
  if (error) {
    console.error('[rutasApi] Error obteniendo ruta:', error);
    return null;
  }
  
  return data as Ruta | null;
}

export async function createRuta(data: Partial<Ruta>): Promise<Ruta | null> {
  if (!data.name || !data.date) {
    throw new Error('name y date son requeridos');
  }
  
  const { data: result, error } = await supabase
    .from('routes')
    .insert({
      ...data,
      tenant_id: TENANT,
      status: data.status || 'pendiente',
    })
    .select()
    .single();
  
  if (error) {
    console.error('[rutasApi] Error creando ruta:', error);
    throw new Error(error.message || 'Error creando ruta');
  }
  
  return result as Ruta | null;
}

export async function updateRuta(id: string, data: Partial<Ruta>): Promise<Ruta | null> {
  const { data: result, error } = await supabase
    .from('routes')
    .update({
      ...data,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .eq('tenant_id', TENANT)
    .select()
    .single();
  
  if (error) {
    console.error('[rutasApi] Error actualizando ruta:', error);
    throw new Error(error.message || 'Error actualizando ruta');
  }
  
  return result as Ruta | null;
}

export async function deleteRuta(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('routes')
    .delete()
    .eq('id', id)
    .eq('tenant_id', TENANT);
  
  if (error) {
    console.error('[rutasApi] Error eliminando ruta:', error);
    return false;
  }
  
  return true;
}

export async function addParada(rutaId: string, data: {
  envio_id: string; address?: string; recipient_name?: string;
  lat?: number; lng?: number; notes?: string;
}): Promise<Parada | null> {
  if (!data.envio_id) {
    throw new Error('envio_id es requerido');
  }
  
  // Obtener el número de paradas existentes para el order_index
  const { count } = await supabase
    .from('route_stops')
    .select('id', { count: 'exact', head: true })
    .eq('route_id', rutaId);
  
  const { data: result, error } = await supabase
    .from('route_stops')
    .insert({
      tenant_id: TENANT,
      route_id: rutaId,
      envio_id: data.envio_id,
      address: data.address,
      recipient_name: data.recipient_name,
      lat: data.lat,
      lng: data.lng,
      order_index: count || 0,
      status: 'pendiente',
      notes: data.notes,
    })
    .select()
    .single();
  
  if (error) {
    console.error('[rutasApi] Error agregando parada:', error);
    throw new Error(error.message || 'Error agregando parada');
  }
  
  // Actualizar el route_id en el envío
  await supabase
    .from('envios')
    .update({ route_id: rutaId })
    .eq('id', data.envio_id);
  
  return result as Parada | null;
}

export async function reordenarParadas(rutaId: string, orden: { id: string; order_index: number }[]): Promise<boolean> {
  if (!Array.isArray(orden)) {
    throw new Error('orden debe ser un array');
  }
  
  try {
    for (const stop of orden) {
      const { error } = await supabase
        .from('route_stops')
        .update({ order_index: stop.order_index })
        .eq('id', stop.id);
      
      if (error) {
        console.error('[rutasApi] Error reordenando parada:', error);
        throw error;
      }
    }
    return true;
  } catch (error) {
    console.error('[rutasApi] Error reordenando paradas:', error);
    return false;
  }
}

export async function optimizarRuta(rutaId: string): Promise<Parada[]> {
  // Obtener paradas con coordenadas
  const { data: paradas, error } = await supabase
    .from('route_stops')
    .select('id, lat, lng, address')
    .eq('route_id', rutaId)
    .not('lat', 'is', null);
  
  if (error) {
    console.error('[rutasApi] Error obteniendo paradas:', error);
    throw new Error(error.message || 'Error obteniendo paradas');
  }
  
  if (!paradas || paradas.length === 0) {
    throw new Error('No hay paradas con coordenadas');
  }
  
  // Algoritmo TSP greedy simple
  const optimizado = greedyTSP(paradas);
  
  // Actualizar el order_index de cada parada
  for (let i = 0; i < optimizado.length; i++) {
    const { error: updateError } = await supabase
      .from('route_stops')
      .update({ order_index: i })
      .eq('id', optimizado[i].id);
    
    if (updateError) {
      console.error('[rutasApi] Error actualizando orden:', updateError);
    }
  }
  
  return optimizado as Parada[];
}

function greedyTSP(paradas: any[]): any[] {
  const dist = (a: any, b: any) =>
    Math.sqrt(Math.pow((a.lat || 0) - (b.lat || 0), 2) + Math.pow((a.lng || 0) - (b.lng || 0), 2));
  
  const restantes = [...paradas];
  const ruta = [restantes.splice(0, 1)[0]];
  
  while (restantes.length > 0) {
    const actual = ruta[ruta.length - 1];
    let minDist = Infinity;
    let minIdx = 0;
    
    restantes.forEach((p, i) => {
      const d = dist(actual, p);
      if (d < minDist) {
        minDist = d;
        minIdx = i;
      }
    });
    
    ruta.push(restantes.splice(minIdx, 1)[0]);
  }
  
  return ruta;
}
