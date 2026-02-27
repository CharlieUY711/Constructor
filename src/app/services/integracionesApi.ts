/* =====================================================
   Integraciones API Service — Dashboard ↔ Backend
   Charlie Marketplace Builder v1.5
   ===================================================== */
import { projectId, publicAnonKey } from '/utils/supabase/info';

const BASE = `https://${projectId}.supabase.co/functions/v1/api/integraciones`;
const HEADERS = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${publicAnonKey}`,
};

// ── Types ───────────────────────────────────────────────────────────────────

export interface Integracion {
  id: string;
  nombre: string;
  tipo: 'pagos' | 'marketplace' | 'comunicacion' | 'logistica' | 'identidad' | 'analytics';
  proveedor: string;
  estado: 'activo' | 'inactivo' | 'error' | 'configurando';
  config: Record<string, unknown>;
  webhook_url?: string;
  ultimo_ping?: string;
  ultimo_error?: string;
  created_at: string;
  updated_at: string;
}

export interface IntegracionLog {
  id: string;
  integracion_id: string;
  tipo: 'conexion' | 'error' | 'webhook' | 'sync';
  nivel: 'info' | 'warning' | 'error';
  mensaje: string;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface ApiKey {
  id: string;
  nombre: string;
  descripcion?: string;
  key_prefix: string;
  permisos: string[];
  estado: 'activo' | 'revocado';
  expira_en?: string;
  ultimo_uso?: string;
  usos_totales: number;
  created_at: string;
  updated_at?: string;
  // Solo presente al crear
  key?: string;
}

export interface Webhook {
  id: string;
  nombre: string;
  url: string;
  eventos: string[];
  estado: 'activo' | 'inactivo';
  secret?: string;
  ultimo_intento?: string;
  ultimo_status?: number;
  intentos_fallidos: number;
  created_at: string;
  updated_at?: string;
}

// ── Integraciones ───────────────────────────────────────────────────────────

export async function getIntegraciones(filters?: { tipo?: string; estado?: string }): Promise<Integracion[]> {
  const params = new URLSearchParams();
  if (filters?.tipo) params.append('tipo', filters.tipo);
  if (filters?.estado) params.append('estado', filters.estado);
  const query = params.toString() ? `?${params.toString()}` : '';
  const res = await fetch(`${BASE}${query}`, { headers: HEADERS });
  const json = await res.json();
  if (json.error) throw new Error(json.error);
  return json.data || [];
}

export async function getIntegracionById(id: string): Promise<Integracion> {
  const res = await fetch(`${BASE}/${id}`, { headers: HEADERS });
  const json = await res.json();
  if (json.error) throw new Error(json.error);
  return json.data;
}

export async function updateIntegracion(id: string, data: Partial<Integracion>): Promise<Integracion> {
  const res = await fetch(`${BASE}/${id}`, {
    method: 'PUT',
    headers: HEADERS,
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (json.error) throw new Error(json.error);
  return json.data;
}

export async function pingIntegracion(id: string): Promise<{ data: Integracion; success: boolean }> {
  const res = await fetch(`${BASE}/${id}/ping`, {
    method: 'POST',
    headers: HEADERS,
  });
  const json = await res.json();
  if (json.error) throw new Error(json.error);
  return json;
}

export async function getIntegracionLogs(id: string, limit?: number): Promise<IntegracionLog[]> {
  const params = new URLSearchParams();
  if (limit) params.append('limit', limit.toString());
  const query = params.toString() ? `?${params.toString()}` : '';
  const res = await fetch(`${BASE}/${id}/logs${query}`, { headers: HEADERS });
  const json = await res.json();
  if (json.error) throw new Error(json.error);
  return json.data || [];
}

// ── API Keys ────────────────────────────────────────────────────────────────

export async function getApiKeys(estado?: string): Promise<ApiKey[]> {
  const query = estado ? `?estado=${estado}` : '';
  const res = await fetch(`${BASE}/api-keys${query}`, { headers: HEADERS });
  const json = await res.json();
  if (json.error) throw new Error(json.error);
  return json.data || [];
}

export async function createApiKey(data: {
  nombre: string;
  descripcion?: string;
  permisos: string[];
  expira_en?: string;
}): Promise<ApiKey> {
  const res = await fetch(`${BASE}/api-keys`, {
    method: 'POST',
    headers: HEADERS,
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (json.error) throw new Error(json.error);
  return json.data;
}

export async function deleteApiKey(id: string): Promise<void> {
  const res = await fetch(`${BASE}/api-keys/${id}`, {
    method: 'DELETE',
    headers: HEADERS,
  });
  const json = await res.json();
  if (json.error) throw new Error(json.error);
}

// ── Webhooks ────────────────────────────────────────────────────────────────

export async function getWebhooks(estado?: string): Promise<Webhook[]> {
  const query = estado ? `?estado=${estado}` : '';
  const res = await fetch(`${BASE}/webhooks${query}`, { headers: HEADERS });
  const json = await res.json();
  if (json.error) throw new Error(json.error);
  return json.data || [];
}

export async function createWebhook(data: Partial<Webhook>): Promise<Webhook> {
  const res = await fetch(`${BASE}/webhooks`, {
    method: 'POST',
    headers: HEADERS,
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (json.error) throw new Error(json.error);
  return json.data;
}

export async function updateWebhook(id: string, data: Partial<Webhook>): Promise<Webhook> {
  const res = await fetch(`${BASE}/webhooks/${id}`, {
    method: 'PUT',
    headers: HEADERS,
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (json.error) throw new Error(json.error);
  return json.data;
}

export async function deleteWebhook(id: string): Promise<void> {
  const res = await fetch(`${BASE}/webhooks/${id}`, {
    method: 'DELETE',
    headers: HEADERS,
  });
  const json = await res.json();
  if (json.error) throw new Error(json.error);
}
