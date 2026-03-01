import { supabase } from '../../utils/supabase/client';

const TENANT = 'oddy';

export interface Deposito {
  id: string;
  tenant_id: string;
  nombre: string;
  direccion: string;
  ciudad?: string;
  lat?: number;
  lng?: number;
  tipo: 'propio' | 'tercero' | 'cross_docking';
  capacidad_m2?: number;
  responsable?: string;
  telefono?: string;
  activo: boolean;
  created_at: string;
  updated_at?: string;
  inventario?: any[];
}

export async function getDepositos(): Promise<Deposito[]> {
  const { data, error } = await supabase
    .from('depositos')
    .select('*, inventario(id, sku, nombre, cantidad)')
    .eq('tenant_id', TENANT)
    .order('nombre');
  
  if (error) {
    console.error('[depositosApi] Error obteniendo depósitos:', error);
    throw new Error(error.message || 'Error cargando depósitos');
  }
  
  return data || [];
}

export async function getDeposito(id: string): Promise<Deposito | null> {
  const { data, error } = await supabase
    .from('depositos')
    .select('*, inventario(*)')
    .eq('id', id)
    .eq('tenant_id', TENANT)
    .single();
  
  if (error) {
    console.error('[depositosApi] Error obteniendo depósito:', error);
    return null;
  }
  
  return data;
}

export async function createDeposito(data: Partial<Deposito>): Promise<Deposito | null> {
  if (!data.nombre || !data.direccion) {
    throw new Error('nombre y direccion son requeridos');
  }
  
  const { data: result, error } = await supabase
    .from('depositos')
    .insert({
      ...data,
      tenant_id: TENANT,
      activo: data.activo ?? true,
    })
    .select()
    .single();
  
  if (error) {
    console.error('[depositosApi] Error creando depósito:', error);
    throw new Error(error.message || 'Error creando depósito');
  }
  
  return result;
}

export async function updateDeposito(id: string, data: Partial<Deposito>): Promise<Deposito | null> {
  const { data: result, error } = await supabase
    .from('depositos')
    .update({
      ...data,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .eq('tenant_id', TENANT)
    .select()
    .single();
  
  if (error) {
    console.error('[depositosApi] Error actualizando depósito:', error);
    throw new Error(error.message || 'Error actualizando depósito');
  }
  
  return result;
}

export async function deleteDeposito(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('depositos')
    .delete()
    .eq('id', id)
    .eq('tenant_id', TENANT);
  
  if (error) {
    console.error('[depositosApi] Error eliminando depósito:', error);
    return false;
  }
  
  return true;
}
