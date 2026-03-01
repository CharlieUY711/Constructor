import { supabase } from '../../utils/supabase/client';

export interface PuntoMapa {
  id: string;
  tipo: 'origen' | 'destino' | 'hub' | 'punto_entrega' | 'deposito' | 'en_transito' | 'entregado' | 'fallido' | 'en_reparto';
  nombre: string;
  numero?: string;
  lat: number;
  lng: number;
  x?: number;
  y?: number;
  envios?: number;
  estado?: 'activo' | 'inactivo';
  cliente?: string;
  carrier?: string;
  localidad?: string;
  provincia?: string;
  metadata?: Record<string, any>;
  created_at?: string;
  updated_at?: string;
}

export interface PuntoMapaInput {
  tipo: PuntoMapa['tipo'];
  nombre: string;
  numero?: string;
  lat: number;
  lng: number;
  x?: number;
  y?: number;
  envios?: number;
  estado?: PuntoMapa['estado'];
  cliente?: string;
  carrier?: string;
  localidad?: string;
  provincia?: string;
  metadata?: Record<string, any>;
}

export async function getPuntosMapa(tipo?: string, estado?: string): Promise<PuntoMapa[]> {
  let query = supabase
    .from('puntos_mapa')
    .select('*');
  
  if (tipo) {
    query = query.eq('tipo', tipo);
  }
  if (estado) {
    query = query.eq('estado', estado);
  }
  
  const { data, error } = await query.order('created_at', { ascending: false });
  
  if (error) {
    console.error('[mapaEnviosApi] Error obteniendo puntos del mapa:', error);
    throw new Error(error.message || 'Error cargando puntos del mapa');
  }
  
  return data || [];
}

export async function getPuntoMapaById(id: string): Promise<PuntoMapa> {
  const { data, error } = await supabase
    .from('puntos_mapa')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error('[mapaEnviosApi] Error obteniendo punto del mapa:', error);
    throw new Error(error.message || 'Error cargando punto del mapa');
  }
  
  return data;
}

export async function createPuntoMapa(data: PuntoMapaInput): Promise<PuntoMapa> {
  const { data: result, error } = await supabase
    .from('puntos_mapa')
    .insert(data)
    .select()
    .single();
  
  if (error) {
    console.error('[mapaEnviosApi] Error creando punto del mapa:', error);
    throw new Error(error.message || 'Error creando punto del mapa');
  }
  
  return result;
}

export async function updatePuntoMapa(id: string, data: Partial<PuntoMapaInput>): Promise<PuntoMapa> {
  const { data: result, error } = await supabase
    .from('puntos_mapa')
    .update({
      ...data,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('[mapaEnviosApi] Error actualizando punto del mapa:', error);
    throw new Error(error.message || 'Error actualizando punto del mapa');
  }
  
  return result;
}

export async function deletePuntoMapa(id: string): Promise<void> {
  const { error } = await supabase
    .from('puntos_mapa')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('[mapaEnviosApi] Error eliminando punto del mapa:', error);
    throw new Error(error.message || 'Error eliminando punto del mapa');
  }
}
