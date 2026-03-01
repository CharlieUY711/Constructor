import { supabase } from '../../utils/supabase/client';

const TENANT = 'oddy';

export interface Vehiculo {
  id: string;
  tenant_id: string;
  transportista_id?: string;
  patente: string;
  tipo: 'moto' | 'auto' | 'furgon' | 'camioneta' | 'camion';
  marca?: string;
  modelo?: string;
  anio?: number;
  capacidad_kg?: number;
  capacidad_m3?: number;
  activo: boolean;
  created_at: string;
  updated_at?: string;
  transportistas?: { id: string; nombre: string };
}

export async function getVehiculos(params?: { transportista_id?: string; activo?: boolean }): Promise<Vehiculo[]> {
  let query = supabase
    .from('vehiculos')
    .select('*, transportistas(id, nombre)')
    .eq('tenant_id', TENANT);
  
  if (params?.transportista_id) {
    query = query.eq('transportista_id', params.transportista_id);
  }
  if (params?.activo !== undefined) {
    query = query.eq('activo', params.activo);
  }
  
  const { data, error } = await query.order('patente');
  
  if (error) {
    console.error('[vehiculosApi] Error obteniendo vehículos:', error);
    throw new Error(error.message || 'Error cargando vehículos');
  }
  
  return data || [];
}

export async function getVehiculo(id: string): Promise<Vehiculo | null> {
  const { data, error } = await supabase
    .from('vehiculos')
    .select('*, transportistas(id, nombre)')
    .eq('id', id)
    .eq('tenant_id', TENANT)
    .single();
  
  if (error) {
    console.error('[vehiculosApi] Error obteniendo vehículo:', error);
    return null;
  }
  
  return data;
}

export async function createVehiculo(data: Partial<Vehiculo>): Promise<Vehiculo | null> {
  const { data: result, error } = await supabase
    .from('vehiculos')
    .insert({
      ...data,
      tenant_id: TENANT,
      activo: data.activo ?? true,
    })
    .select()
    .single();
  
  if (error) {
    console.error('[vehiculosApi] Error creando vehículo:', error);
    throw new Error(error.message || 'Error creando vehículo');
  }
  
  return result;
}

export async function updateVehiculo(id: string, data: Partial<Vehiculo>): Promise<Vehiculo | null> {
  const { data: result, error } = await supabase
    .from('vehiculos')
    .update({
      ...data,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .eq('tenant_id', TENANT)
    .select()
    .single();
  
  if (error) {
    console.error('[vehiculosApi] Error actualizando vehículo:', error);
    throw new Error(error.message || 'Error actualizando vehículo');
  }
  
  return result;
}

export async function deleteVehiculo(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('vehiculos')
    .delete()
    .eq('id', id)
    .eq('tenant_id', TENANT);
  
  if (error) {
    console.error('[vehiculosApi] Error eliminando vehículo:', error);
    return false;
  }
  
  return true;
}
