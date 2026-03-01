import { supabase } from '../../utils/supabase/client';

export interface Departamento {
  id: string;
  nombre: string;
  icono?: string;
  color?: string;
  descripcion?: string;
  orden?: number;
  activo: boolean;
  moneda?: 'UYU' | 'USD' | 'EUR';
  edad_minima?: 'Todas' | '+13' | '+18' | '+21';
  alcance?: 'Local' | 'Nacional' | 'Internacional';
  created_at?: string;
  updated_at?: string;
  categorias?: Categoria[];
}

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
  subcategorias?: Array<{
    id: string;
    categoria_id: string;
    nombre: string;
    orden?: number;
    activo: boolean;
    created_at?: string;
    updated_at?: string;
  }>;
}

export interface DepartamentoInput {
  nombre: string;
  icono?: string;
  color?: string;
  descripcion?: string;
  orden?: number;
  activo?: boolean;
  moneda?: 'UYU' | 'USD' | 'EUR';
  edad_minima?: 'Todas' | '+13' | '+18' | '+21';
  alcance?: 'Local' | 'Nacional' | 'Internacional';
}

export async function getDepartamentos(): Promise<Departamento[]> {
  const { data, error } = await supabase
    .from('departamentos')
    .select('*')
    .order('orden', { ascending: true, nullsFirst: false });
  
  if (error) {
    console.error('[departamentosApi] Error obteniendo departamentos:', error);
    throw new Error(error.message || 'Error cargando departamentos');
  }
  
  return data || [];
}

export async function getDepartamentoById(id: string): Promise<Departamento> {
  const { data, error } = await supabase
    .from('departamentos')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error('[departamentosApi] Error obteniendo departamento:', error);
    throw new Error(error.message || 'Error cargando departamento');
  }
  
  return data;
}

export async function createDepartamento(data: DepartamentoInput): Promise<Departamento> {
  const { data: result, error } = await supabase
    .from('departamentos')
    .insert({
      ...data,
      activo: data.activo ?? true,
    })
    .select()
    .single();
  
  if (error) {
    console.error('[departamentosApi] Error creando departamento:', error);
    throw new Error(error.message || 'Error creando departamento');
  }
  
  return result;
}

export async function updateDepartamento(id: string, data: Partial<DepartamentoInput>): Promise<Departamento> {
  const { data: result, error } = await supabase
    .from('departamentos')
    .update({
      ...data,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('[departamentosApi] Error actualizando departamento:', error);
    throw new Error(error.message || 'Error actualizando departamento');
  }
  
  return result;
}

export async function deleteDepartamento(id: string): Promise<void> {
  const { error } = await supabase
    .from('departamentos')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('[departamentosApi] Error eliminando departamento:', error);
    throw new Error(error.message || 'Error eliminando departamento');
  }
}
