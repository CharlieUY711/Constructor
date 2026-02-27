/* =====================================================
   Roadmap API Service — Frontend ↔ Backend
   ===================================================== */
import { projectId, publicAnonKey } from '/utils/supabase/info';

const BASE = `https://${projectId}.supabase.co/functions/v1/api/roadmap`;
const HEADERS = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${publicAnonKey}`,
  'apikey': publicAnonKey,
};

// ── Tipos ────────────────────────────────────────────────────────────────

export type ModuleStatus =
  | 'not-started'
  | 'spec-ready'
  | 'progress-10'
  | 'progress-50'
  | 'progress-80'
  | 'ui-only'
  | 'completed';

export type ModulePriority = 'critical' | 'high' | 'medium' | 'low';

export interface RoadmapModule {
  id: string;
  status: ModuleStatus;
  priority: ModulePriority;
  execOrder?: number;
  estimatedHours?: number;
  notas?: string;
  tiene_view?: boolean;
  tiene_backend?: boolean;
  endpoint_ok?: boolean;
  tiene_datos?: boolean;
  updated_at?: string;
}

export interface RoadmapTask {
  id: string;
  module_id: string;
  submodule_id?: string;
  nombre: string;
  status: 'todo' | 'in-progress' | 'done' | 'blocked';
  responsable?: string;
  fecha_estimada?: string;
  blocker?: string;
  notas?: string;
  orden?: number;
  created_at?: string;
  updated_at?: string;
}

export interface HistorialEntry {
  id: string;
  module_id: string;
  status_anterior?: string;
  status_nuevo: string;
  notas?: string;
  origen: 'manual' | 'auditoria' | 'promocion_idea';
  created_at: string;
}

export interface IdeaPromovida {
  id: string;
  idea_id: string;
  module_id?: string;
  idea_texto: string;
  idea_area?: string;
  estado: 'pendiente' | 'aprobada' | 'rechazada' | 'convertida';
  notas?: string;
  created_at: string;
}

export interface TaskInput {
  module_id: string;
  submodule_id?: string;
  nombre: string;
  status?: 'todo' | 'in-progress' | 'done' | 'blocked';
  responsable?: string;
  fecha_estimada?: string;
  blocker?: string;
  notas?: string;
  orden?: number;
}

export interface AuditOpts {
  moduleId: string;
  endpointUrl?: string;
  tableName?: string;
  tiene_view?: boolean;
  tiene_backend?: boolean;
}

export interface AuditResult {
  ok: boolean;
  tiene_view?: boolean;
  tiene_backend?: boolean;
  endpoint_ok?: boolean;
  tiene_datos?: boolean;
  status?: ModuleStatus;
  error?: string;
}

export interface PromocionInput {
  idea_id: string;
  idea_texto: string;
  idea_area?: string;
  notas?: string;
}

// ── Helpers ───────────────────────────────────────────────────────────────

async function apiGet<T>(path: string): Promise<{ ok: boolean; data?: T; error?: string }> {
  try {
    const res = await fetch(`${BASE}${path}`, { headers: HEADERS });
    const json = await res.json();
    if (!res.ok) {
      return { ok: false, error: json.error || 'Error en la petición' };
    }
    return { ok: true, data: json };
  } catch (err) {
    console.error(`Roadmap API GET ${path}:`, err);
    return { ok: false, error: String(err) };
  }
}

async function apiPost<T>(path: string, body: any): Promise<{ ok: boolean; data?: T; error?: string }> {
  try {
    const res = await fetch(`${BASE}${path}`, {
      method: 'POST',
      headers: HEADERS,
      body: JSON.stringify(body),
    });
    const json = await res.json();
    if (!res.ok) {
      return { ok: false, error: json.error || 'Error en la petición' };
    }
    return { ok: true, data: json };
  } catch (err) {
    console.error(`Roadmap API POST ${path}:`, err);
    return { ok: false, error: String(err) };
  }
}

async function apiPut<T>(path: string, body: any): Promise<{ ok: boolean; data?: T; error?: string }> {
  try {
    const res = await fetch(`${BASE}${path}`, {
      method: 'PUT',
      headers: HEADERS,
      body: JSON.stringify(body),
    });
    const json = await res.json();
    if (!res.ok) {
      return { ok: false, error: json.error || 'Error en la petición' };
    }
    return { ok: true, data: json };
  } catch (err) {
    console.error(`Roadmap API PUT ${path}:`, err);
    return { ok: false, error: String(err) };
  }
}

async function apiDelete(path: string): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await fetch(`${BASE}${path}`, {
      method: 'DELETE',
      headers: HEADERS,
    });
    const json = await res.json();
    if (!res.ok) {
      return { ok: false, error: json.error || 'Error en la petición' };
    }
    return { ok: true };
  } catch (err) {
    console.error(`Roadmap API DELETE ${path}:`, err);
    return { ok: false, error: String(err) };
  }
}

// ── Módulos ───────────────────────────────────────────────────────────────

export async function getModules(): Promise<RoadmapModule[]> {
  const res = await apiGet<{ modules: RoadmapModule[]; count: number }>('/modules');
  if (!res.ok || !res.data) return [];
  return res.data.modules || [];
}

export async function saveModulesBulk(modules: RoadmapModule[]): Promise<void> {
  await apiPost('/modules-bulk', { modules });
}

export async function saveModule(moduleId: string, data: Partial<RoadmapModule>): Promise<void> {
  await apiPost(`/modules/${moduleId}`, { ...data, id: moduleId });
}

export async function resetModules(): Promise<void> {
  await apiDelete('/modules/reset');
}

// ── Tasks ──────────────────────────────────────────────────────────────────

export async function getTasks(moduleId: string): Promise<RoadmapTask[]> {
  const res = await apiGet<{ tasks: RoadmapTask[] }>(`/tasks/${moduleId}`);
  if (!res.ok || !res.data) return [];
  return res.data.tasks || [];
}

export async function createTask(data: TaskInput): Promise<RoadmapTask> {
  const res = await apiPost<{ task: RoadmapTask }>('/tasks', data);
  if (!res.ok || !res.data) throw new Error(res.error || 'Error creando task');
  return res.data.task;
}

export async function updateTask(taskId: string, data: Partial<TaskInput>): Promise<RoadmapTask> {
  const res = await apiPut<{ task: RoadmapTask }>(`/tasks/${taskId}`, data);
  if (!res.ok || !res.data) throw new Error(res.error || 'Error actualizando task');
  return res.data.task;
}

export async function deleteTask(taskId: string): Promise<void> {
  const res = await apiDelete(`/tasks/${taskId}`);
  if (!res.ok) throw new Error(res.error || 'Error eliminando task');
}

// ── Historial ────────────────────────────────────────────────────────────

export async function getHistorial(moduleId?: string): Promise<HistorialEntry[]> {
  const path = moduleId ? `/historial/${moduleId}` : '/historial';
  const res = await apiGet<{ historial: HistorialEntry[] }>(path);
  if (!res.ok || !res.data) return [];
  return res.data.historial || [];
}

// ── Auditoría ─────────────────────────────────────────────────────────────

export async function auditModule(moduleId: string, opts: AuditOpts): Promise<AuditResult> {
  const res = await apiPost<AuditResult>('/audit', { moduleId, ...opts });
  if (!res.ok || !res.data) {
    return { ok: false, error: res.error || 'Error en auditoría' };
  }
  return res.data;
}

export async function auditAll(modules: AuditOpts[]): Promise<AuditResult[]> {
  const res = await apiPost<{ ok: boolean; results: AuditResult[] }>('/audit/all', { modules });
  if (!res.ok || !res.data) return [];
  return res.data.results || [];
}

// ── Ideas Promovidas ──────────────────────────────────────────────────────

export async function getIdeasPromovidas(): Promise<IdeaPromovida[]> {
  const res = await apiGet<{ ideas: IdeaPromovida[] }>('/ideas-promovidas');
  if (!res.ok || !res.data) return [];
  return res.data.ideas || [];
}

export async function promoverIdea(data: PromocionInput): Promise<IdeaPromovida> {
  const res = await apiPost<{ idea: IdeaPromovida }>('/ideas-promovidas', data);
  if (!res.ok || !res.data) throw new Error(res.error || 'Error promoviendo idea');
  return res.data.idea;
}

export async function resolverIdea(
  id: string,
  estado: 'aprobada' | 'rechazada' | 'convertida',
  moduleId?: string
): Promise<void> {
  const res = await apiPut<{ idea: IdeaPromovida }>(`/ideas-promovidas/${id}`, { estado, module_id: moduleId });
  if (!res.ok) throw new Error(res.error || 'Error resolviendo idea');
}
