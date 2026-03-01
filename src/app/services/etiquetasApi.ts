import { supabase } from '../../utils/supabase/client';

export interface Etiqueta {
  token: string;
  envio_numero: string;
  remitente_nombre: string;
  destinatario_nombre: string;
  destinatario_email: string;
  destinatario_tel: string;
  mensaje: string;
  icono: string;
  ocasion: string;
  formato: string;
  estado: 'pendiente' | 'escaneada' | 'respondida';
  scanned_at: string | null;
  respuesta: string | null;
  respuesta_nombre: string | null;
  respondida_at: string | null;
  optin_contacto: string | null;
  created_at: string;
}

export async function getEtiquetas(): Promise<Etiqueta[]> {
  const { data, error } = await supabase
    .from('etiquetas')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('[etiquetasApi] Error obteniendo etiquetas:', error);
    throw new Error(error.message || 'Error cargando etiquetas');
  }
  
  return data || [];
}

export async function getEtiqueta(token: string): Promise<Etiqueta | null> {
  const { data, error } = await supabase
    .from('etiquetas')
    .select('*')
    .eq('token', token)
    .single();
  
  if (error) {
    console.error('[etiquetasApi] Error obteniendo etiqueta:', error);
    return null;
  }
  
  return data;
}

export async function createEtiqueta(data: Partial<Etiqueta>): Promise<Etiqueta | null> {
  const { data: result, error } = await supabase
    .from('etiquetas')
    .insert(data)
    .select()
    .single();
  
  if (error) {
    console.error('[etiquetasApi] Error creando etiqueta:', error);
    throw new Error(error.message || 'Error creando etiqueta');
  }
  
  return result;
}

export async function deleteEtiqueta(token: string): Promise<boolean> {
  const { error } = await supabase
    .from('etiquetas')
    .delete()
    .eq('token', token);
  
  if (error) {
    console.error('[etiquetasApi] Error eliminando etiqueta:', error);
    return false;
  }
  
  return true;
}
