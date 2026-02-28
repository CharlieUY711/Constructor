/**
 * configLoader.ts
 * Carga la configuración del cliente desde Supabase (infraestructura Charlie).
 *
 * Detecta el cliente por:
 *   1. Query param ?slug=oddy-market  (desarrollo / testing)
 *   2. window.location.hostname        (producción — cada cliente tiene su dominio)
 *
 * Nunca toca los datos del cliente — solo lee la config del shell.
 */

// Supabase de Charlie — donde vive la configuración de todos los clientes
const CHARLIE_URL = 'https://qhnmxvexkizcsmivfuam.supabase.co';
const CHARLIE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFobm14dmV4a2l6Y3NtaXZmdWFtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEyMjEyODEsImV4cCI6MjA4Njc5NzI4MX0.Ifz4fJYldIGZFzhBK5PPxQeqdYzO2ZKNQ5uo8j2mYmM';

export interface RemoteConfig {
  clienteId:    string;
  clienteSlug:  string;
  clienteNombre: string;
  shell:        string;
  theme: {
    primary:    string;
    secondary?: string;
    nombre?:    string;
  };
  modulos:      string[];
  backend: {
    supabaseUrl: string;
    supabaseKey: string;
  };
}

async function charlieFetch(path: string) {
  const res = await fetch(`${CHARLIE_URL}/rest/v1/${path}`, {
    headers: {
      'apikey':        CHARLIE_KEY,
      'Authorization': `Bearer ${CHARLIE_KEY}`,
      'Content-Type':  'application/json',
    },
  });
  if (!res.ok) throw new Error(`Charlie API error: ${res.status}`);
  return res.json();
}

/**
 * Detecta el slug del cliente activo.
 * En desarrollo: usar ?slug=oddy-market en la URL.
 * En producción: el dominio coincide con cliente.dominio en Supabase.
 */
function detectClientSlug(): string | null {
  // 1. Query param (desarrollo)
  const params = new URLSearchParams(window.location.search);
  const slugParam = params.get('slug');
  if (slugParam) return slugParam;

  // 2. Hostname (producción)
  const hostname = window.location.hostname;
  if (hostname === 'localhost' || hostname === '127.0.0.1') return null;
  return hostname; // el hostname ES el slug/dominio del cliente
}

/**
 * Carga la configuración remota del cliente.
 * Retorna null si no se puede determinar el cliente (fallback a config estática).
 */
export async function loadRemoteConfig(): Promise<RemoteConfig | null> {
  try {
    const slug = detectClientSlug();

    let clientes;
    if (slug) {
      // Buscar por slug o por dominio
      clientes = await charlieFetch(
        `clientes?or=(slug.eq.${slug},dominio.eq.${slug})&activo=eq.true&limit=1`
      );
    } else {
      // Sin slug detectado — no hay config remota
      return null;
    }

    if (!clientes || clientes.length === 0) {
      console.warn(`[ConfigLoader] Cliente "${slug}" no encontrado en Charlie.`);
      return null;
    }

    const cliente = clientes[0];

    // Cargar la config del cliente
    const configs = await charlieFetch(
      `cliente_config?cliente_id=eq.${cliente.id}&limit=1`
    );

    if (!configs || configs.length === 0) {
      console.warn(`[ConfigLoader] Sin config para cliente "${cliente.slug}".`);
      return null;
    }

    const cfg = configs[0];

    return {
      clienteId:     cliente.id,
      clienteSlug:   cliente.slug,
      clienteNombre: cliente.nombre,
      shell:         cfg.shell || 'DashboardShell',
      theme:         cfg.theme || { primary: '#6366F1' },
      modulos:       cfg.modulos || [],
      backend:       cfg.backend || { supabaseUrl: '', supabaseKey: '' },
    };

  } catch (error) {
    console.error('[ConfigLoader] Error cargando config remota:', error);
    return null;
  }
}
