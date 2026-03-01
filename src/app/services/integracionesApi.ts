/* =====================================================
   Integraciones API Service — Dashboard ↔ Backend
   Charlie Marketplace Builder v1.5
   ===================================================== */
import { apiUrl, publicAnonKey } from '../../utils/supabase/client';

const BASE = `${apiUrl}/integraciones`;
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
  return [];
}

export async function getIntegracionById(id: string): Promise<Integracion> {
  throw new Error('Not implemented');
}

export async function updateIntegracion(id: string, data: Partial<Integracion>): Promise<Integracion> {
  throw new Error('Not implemented');
}

export async function pingIntegracion(id: string): Promise<{ data: Integracion; success: boolean }> {
  throw new Error('Not implemented');
}

export async function getIntegracionLogs(id: string, limit?: number): Promise<IntegracionLog[]> {
  return [];
}

// ── API Keys ────────────────────────────────────────────────────────────────

export async function getApiKeys(estado?: string): Promise<ApiKey[]> {
  return [];
}

export async function createApiKey(data: {
  nombre: string;
  descripcion?: string;
  permisos: string[];
  expira_en?: string;
}): Promise<ApiKey> {
  throw new Error('Not implemented');
}

export async function deleteApiKey(id: string): Promise<void> {
  return;
}

// ── Webhooks ────────────────────────────────────────────────────────────────

export async function getWebhooks(estado?: string): Promise<Webhook[]> {
  return [];
}

export async function createWebhook(data: Partial<Webhook>): Promise<Webhook> {
  throw new Error('Not implemented');
}

export async function updateWebhook(id: string, data: Partial<Webhook>): Promise<Webhook> {
  throw new Error('Not implemented');
}

export async function deleteWebhook(id: string): Promise<void> {
  return;
}
