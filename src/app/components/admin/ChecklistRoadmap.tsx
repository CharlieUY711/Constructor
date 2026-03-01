import React, { useState, useMemo, useEffect } from "react";
import {
  CheckCircle2,
  Circle,
  Clock,
  AlertCircle,
  TrendingUp,
  Package,
  Search,
  BarChart3,
  List,
  Kanban,
  ChevronDown,
  ChevronRight,
  Zap,
  Save,
  Loader2,
  ChevronsDownUp,
  ChevronsUpDown,
  ScanSearch,
  Monitor,
  Database,
  FileCheck2,
  ArrowUp,
  ArrowDown,
  ListOrdered,
  Play,
  Inbox,
  Paperclip,
  RefreshCw,
  X,
  Lightbulb,
  Check,
  XCircle,
  ExternalLink,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { projectId, publicAnonKey } from "../../../../utils/supabase/info";
import { AuditPanel } from "./AuditPanel";
import { ModuleFilesPanel } from "./ModuleFilesPanel";
import { BUILT_MODULE_IDS, SUPABASE_MODULE_IDS } from "../../utils/moduleRegistry";
import * as roadmapApi from "../../services/roadmapApi";

type ModuleStatus =
  | "not-started"
  | "spec-ready"
  | "progress-10"
  | "progress-50"
  | "progress-80"
  | "ui-only"
  | "completed";
type ModulePriority = "critical" | "high" | "medium" | "low";
type ModuleCategory =
  | "erp"
  | "crm"
  | "projects"
  | "logistics"
  | "marketing"
  | "rrss"
  | "tools"
  | "enterprise"
  | "territory"
  | "verification"
  | "marketplace"
  | "ecommerce"
  | "integrations"
  | "admin"
  | "audit"
  | "analytics"
  | "builder";

interface SubModule {
  id: string;
  name: string;
  status: ModuleStatus;
  estimatedHours?: number;
}

interface Module {
  id: string;
  name: string;
  category: ModuleCategory;
  status: ModuleStatus;
  priority: ModulePriority;
  description: string;
  estimatedHours?: number;
  submodules?: SubModule[];
  execOrder?: number;
  notas?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// CATEGORY INFO
// ─────────────────────────────────────────────────────────────────────────────
// ⚠️ El orden de este objeto define el orden en la vista Lista � espeja el AdminSidebar.
const CATEGORY_INFO: Record<ModuleCategory, { label: string; color: string; icon: string }> = {
  ecommerce:    { label: "eCommerce / Pedidos",   color: "bg-orange-500",  icon: "🛒" },
  logistics:    { label: "Log�stica",             color: "bg-green-600",   icon: "??" },
  marketing:    { label: "Marketing",             color: "bg-pink-500",    icon: "📢" },
  rrss:         { label: "Redes Sociales",        color: "bg-rose-500",    icon: "📱" },
  tools:        { label: "Herramientas",          color: "bg-teal-500",    icon: "🛠️" },
  erp:          { label: "ERP + POS",             color: "bg-blue-600",    icon: "📊" },
  crm:          { label: "CRM",                   color: "bg-purple-600",  icon: "👥" },
  projects:     { label: "Proyectos",             color: "bg-indigo-600",  icon: "📋" },
  marketplace:  { label: "Marketplace",           color: "bg-amber-500",   icon: "🏪" },
  integrations: { label: "Integraciones",           color: "bg-cyan-600",    icon: "🔌" },
  audit:        { label: "Auditor�a & Diagn�stico", color: "bg-violet-600",  icon: "🔍" },
  admin:        { label: "Admin / Sistema",         color: "bg-slate-600",   icon: "⚙️" },
  enterprise:   { label: "Enterprise",            color: "bg-red-600",     icon: "🏢" },
  territory:    { label: "Territorio",            color: "bg-lime-600",    icon: "🗺️" },
  verification: { label: "Verificaci�n",          color: "bg-yellow-600",  icon: "?" },
  analytics:    { label: "Analytics & BI",        color: "bg-sky-600",     icon: "📈" },
  builder:      { label: "Constructor",           color: "bg-fuchsia-600", icon: "🔧" },
};

// ─────────────────────────────────────────────────────────────────────────────
// STATUS INFO
// ─────────────────────────────────────────────────────────────────────────────
const STATUS_INFO: Record<ModuleStatus, { label: string; color: string; icon: any; percent: number }> = {
  "not-started":  { label: "No Iniciado",            color: "text-gray-400",    icon: Circle,       percent: 0   },
  "spec-ready":   { label: "Definici�n Lista",        color: "text-violet-600",  icon: FileCheck2,   percent: 15  },
  "progress-10":  { label: "En Progreso (10%)",       color: "text-red-500",     icon: AlertCircle,  percent: 10  },
  "progress-50":  { label: "En Progreso (50%)",       color: "text-yellow-500",  icon: Clock,        percent: 50  },
  "progress-80":  { label: "En Progreso (80%)",       color: "text-blue-500",    icon: TrendingUp,   percent: 80  },
  "ui-only":      { label: "UI Lista � Sin Backend",  color: "text-blue-500",    icon: Monitor,      percent: 80  },
  "completed":    { label: "Completado (con DB)",     color: "text-[#FF6835]",   icon: CheckCircle2, percent: 100 },
};

// ─────────────────────────────────────────────────────────────────────────────
// PRIORITY INFO
// ─────────────────────────────────────────────────────────────────────────────
const PRIORITY_INFO: Record<ModulePriority, { label: string; color: string }> = {
  critical: { label: "Cr�tica",  color: "text-red-600 border-red-300 bg-red-50"       },
  high:     { label: "Alta",     color: "text-orange-600 border-orange-300 bg-orange-50" },
  medium:   { label: "Media",    color: "text-yellow-600 border-yellow-300 bg-yellow-50" },
  low:      { label: "Baja",     color: "text-gray-500 border-gray-300 bg-gray-50"    },
};

// ─────────────────────────────────────────────────────────────────────────────
// PROGRESS BAR COLOR
// ─────────────────────────────────────────────────────────────────────────────
function getProgressBarColor(pct: number, status?: ModuleStatus): string {
  if (pct === 0)                    return "bg-gray-300";
  if (pct < 30)                     return "bg-red-400";
  if (pct < 60)                     return "bg-yellow-400";
  if (status === "ui-only")         return "bg-blue-400";
  if (pct < 100)                    return "bg-blue-500";
  return "bg-green-500";
}

/** % real de un m�dulo = promedio ponderado de subm�dulos (si tiene); si no, el del selector. */
function getEffectivePercent(module: Module): number {
  if (!module.submodules || module.submodules.length === 0) {
    return STATUS_INFO[module.status].percent;
  }
  const totalH = module.submodules.reduce((s, sub) => s + (sub.estimatedHours || 1), 0);
  return Math.round(
    module.submodules.reduce(
      (sum, sub) => sum + STATUS_INFO[sub.status].percent * ((sub.estimatedHours || 1) / totalH),
      0
    )
  );
}

/**
 * Aplica el estado correcto seg�n manifest:
 *  - BUILT + hasSupabase=true  ? "completed"  (100% 🗄️)
 *  - BUILT + hasSupabase=false ? "ui-only"    (80%  🖥️ � hay UI pero falta backend)
 *  - No est� en BUILT          ? sin cambio   (mantiene estado manual)
 */
function applyBuiltStatus(m: Module): Module {
  if (!BUILT_MODULE_IDS.has(m.id)) return m;
  const newStatus: ModuleStatus = SUPABASE_MODULE_IDS.has(m.id) ? "completed" : "ui-only";
  return {
    ...m,
    status: newStatus,
    submodules: m.submodules?.map(sub => ({ ...sub, status: newStatus })),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// DATOS DE MÓDULOS
// ─────────────────────────────────────────────────────────────────────────────
// Los datos de módulos se cargan desde roadmapApi.getModules() que obtiene
// el estado desde SQL (roadmap_modules). Los datos base (name, category, 
// description) deben venir combinados con los datos de estado de la API.

type ViewMode = "list" | "kanban" | "stats" | "queue";

interface Props {
  hideHeader?: boolean;
  onNavigate?: (section: string) => void;
}

export function ChecklistRoadmap({ hideHeader = false, onNavigate }: Props) {
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<ModuleCategory | "all">("all");
  const [selectedStatus, setSelectedStatus] = useState<ModuleStatus | "all">("all");
  const [selectedPriority, setSelectedPriority] = useState<ModulePriority | "all">("all");
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [expandedFiles, setExpandedFiles] = useState<Set<string>>(new Set());
  const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set());
  const [tasksByModule, setTasksByModule] = useState<Record<string, roadmapApi.RoadmapTask[]>>({});
  const [ideasPromovidas, setIdeasPromovidas] = useState<roadmapApi.IdeaPromovida[]>([]);
  const [showIdeasTab, setShowIdeasTab] = useState(false);
  const [showRoadmapPanel, setShowRoadmapPanel] = useState(false);
  const [modules, setModules] = useState<Module[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showAudit, setShowAudit] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditProgress, setAuditProgress] = useState({ current: 0, total: 0 });
  const [allExpanded, setAllExpanded] = useState(false);
  
  // Mapa de endpoints y tablas por m�dulo para auditor�a
  const AUDIT_MAP: Record<string, { endpointUrl?: string; tableName?: string }> = {
    "ecommerce-pedidos":        { endpointUrl: `/api/pedidos`,          tableName: "pedidos" },
    "ecommerce-metodos-pago":   { endpointUrl: `/api/metodos-pago`,     tableName: "metodos_pago" },
    "ecommerce-metodos-envio":  { endpointUrl: `/api/metodos-envio`,    tableName: "metodos_envio" },
    "crm-contacts":             { endpointUrl: `/api/personas`,         tableName: "personas" },
    "marketplace-productos":    { endpointUrl: `/api/productos/market`, tableName: "productos_market" },
    "marketplace-departamentos":{ endpointUrl: `/api/departamentos`,    tableName: "departamentos" },
    "marketplace-carrito":      { endpointUrl: `/api/carrito`,          tableName: "carrito" },
    "logistics-shipping":       { endpointUrl: `/api/envios`,           tableName: "envios" },
  };

  useEffect(() => {
    if (!projectId) {
      setModules([]);
      setIsLoading(false);
      return;
    }
    loadModules();
    loadIdeasPromovidas();
  }, []);

  // Recargar ideas cuando se abre el panel
  useEffect(() => {
    if (showIdeasTab) {
      loadIdeasPromovidas();
    }
  }, [showIdeasTab]);

  const loadIdeasPromovidas = async () => {
    if (!projectId) return;
    try {
      const ideas = await roadmapApi.getIdeasPromovidas();
      setIdeasPromovidas(ideas.filter(i => i.estado === 'pendiente'));
    } catch (err) {
      console.error('[ChecklistRoadmap] Error cargando ideas:', err);
    }
  };

  const handleResolverIdea = async (id: string, estado: 'aprobada' | 'rechazada' | 'convertida', moduleId?: string) => {
    try {
      await roadmapApi.resolverIdea(id, estado, moduleId);
      await loadIdeasPromovidas();
      if (estado === 'convertida') {
        await loadModules();
      }
      toast.success(`Idea ${estado === 'aprobada' ? 'aprobada' : estado === 'rechazada' ? 'rechazada' : 'convertida a m�dulo'}`);
    } catch (err) {
      toast.error('Error resolviendo idea');
    }
  };

  const loadModules = async () => {
    if (!projectId) return;
    try {
      setIsLoading(true);
      const savedModules = await roadmapApi.getModules();
      
      if (savedModules && savedModules.length > 0) {
        // Aplicar cascade de BUILT_MODULE_IDS a los m�dulos de la API
        const processed = savedModules.map((m) => {
          const module: Module = {
            id: m.id,
            name: m.name || m.id,
            category: (m.category as ModuleCategory) || 'admin',
            description: m.description || '',
            status: m.status,
            priority: m.priority,
            execOrder: m.execOrder,
            estimatedHours: m.estimatedHours,
            notas: m.notas,
            submodules: m.submodules?.map(sub => ({
              id: sub.id,
              name: sub.name,
              status: sub.status,
              estimatedHours: sub.estimatedHours,
            })),
          };
          return applyBuiltStatus(module);
        });
        setModules(processed);
      } else {
        // SQL vac�o ? no hay m�dulos
        setModules([]);
      }
    } catch {
      setModules([]);
    } finally {
      setIsLoading(false);
    }
  };

  // ── updateModuleStatus con cascade a subm�dulos y gesti�n de execOrder ──
  const updateModuleStatus = async (moduleId: string, newStatus: ModuleStatus) => {
    const maxOrder = modules
      .filter(m => m.status === "spec-ready" && m.id !== moduleId)
      .reduce((max, m) => Math.max(max, m.execOrder ?? 0), 0);

    const oldModule = modules.find(m => m.id === moduleId);

    const updated = modules.map((m) => {
      if (m.id !== moduleId) return m;
      const updatedSubs = m.submodules?.map(sub => ({
        ...sub,
        status: (newStatus === "completed" || newStatus === "not-started" || newStatus === "ui-only" || newStatus === "spec-ready")
          ? newStatus
          : sub.status,
      }));
      return {
        ...m,
        status: newStatus,
        submodules: updatedSubs,
        execOrder: newStatus === "spec-ready" ? (m.execOrder ?? maxOrder + 1) : undefined,
      };
    });

    // Si se quit� de spec-ready, renumerar los que quedan
    let finalModules = updated;
    if (oldModule?.status === "spec-ready" && newStatus !== "spec-ready") {
      const queueItems = updated
        .filter(m => m.status === "spec-ready")
        .sort((a, b) => (a.execOrder ?? 0) - (b.execOrder ?? 0));
      finalModules = updated.map(m => {
        if (m.status !== "spec-ready") return m;
        const idx = queueItems.findIndex(q => q.id === m.id);
        return { ...m, execOrder: idx + 1 };
      });
    }

    setModules(finalModules);
    setHasUnsavedChanges(true);
    if (!projectId) return;
    try {
      const mod = finalModules.find((m) => m.id === moduleId);
      if (!mod) return;
      await roadmapApi.saveModule(moduleId, {
        status: mod.status,
        priority: mod.priority,
        execOrder: mod.execOrder,
        estimatedHours: mod.estimatedHours,
        notas: mod.notas,
      });
      setHasUnsavedChanges(false);
    } catch { /* silent */ }
  };

  // ── Mover en la cola de ejecuci�n ───────────────────────────────────────
  const moveInQueue = (moduleId: string, direction: "up" | "down") => {
    const queue = [...modules]
      .filter(m => m.status === "spec-ready")
      .sort((a, b) => (a.execOrder ?? 0) - (b.execOrder ?? 0));
    const idx = queue.findIndex(m => m.id === moduleId);
    if (idx === -1) return;
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= queue.length) return;
    const idxOrder  = queue[idx].execOrder  ?? idx + 1;
    const swapOrder = queue[swapIdx].execOrder ?? swapIdx + 1;
    const updated = modules.map(m => {
      if (m.id === queue[idx].id)     return { ...m, execOrder: swapOrder };
      if (m.id === queue[swapIdx].id) return { ...m, execOrder: idxOrder  };
      return m;
    });
    setModules(updated);
    setHasUnsavedChanges(true);
  };

  const saveAllProgress = async () => {
    try {
      setIsSaving(true);
      if (!projectId) {
        toast.warning("⚠️ Guardado local (Supabase no conectado)");
        return;
      }
      await roadmapApi.saveModulesBulk(modules.map(m => ({
        id: m.id,
        status: m.status,
        priority: m.priority,
        execOrder: m.execOrder,
        estimatedHours: m.estimatedHours,
        notas: m.notas,
      })));
      setHasUnsavedChanges(false);
      toast.success("✅ Progreso guardado en el servidor");
    } catch {
      toast.warning("⚠️ Cambios guardados localmente");
    } finally {
      setIsSaving(false);
    }
  };

  // ── Resync forzado: limpia SQL y recomputa desde la API + manifest ──
  const forceResyncFromManifest = async () => {
    setIsSyncing(true);
    try {
      if (projectId) {
        // Primero limpiar el SQL
        await roadmapApi.resetModules().catch(() => {/* silent */});
        // Luego recargar desde la API
        await loadModules();
      } else {
        toast.success("?? Estad�sticas actualizadas desde el manifest");
      }
      setHasUnsavedChanges(false);
    } catch (err) {
      toast.error(`Error en resync: ${err}`);
    } finally {
      setIsSyncing(false);
    }
  };

  // ── Expand / Collapse helpers ─────────────────────────────────────────────
  const toggleExpand = (id: string) => {
    setExpandedModules(prev => {
      const ne = new Set(prev);
      ne.has(id) ? ne.delete(id) : ne.add(id);
      return ne;
    });
  };

  const toggleExpandCategory = (cat: string) => {
    setExpandedCategories(prev => {
      const ne = new Set(prev);
      ne.has(cat) ? ne.delete(cat) : ne.add(cat);
      return ne;
    });
  };

  const toggleExpandCollapse = () => {
    if (allExpanded) {
      setExpandedCategories(new Set());
      setAllExpanded(false);
    } else {
      setExpandedCategories(new Set(Object.keys(CATEGORY_INFO)));
      setAllExpanded(true);
    }
  };

  // -- Tasks --------------------------------------------------------------------
  const loadTasks = async (moduleId: string) => {
    if (tasksByModule[moduleId]) return;
    try {
      const tasks = await roadmapApi.getTasks(moduleId);
      setTasksByModule(prev => ({ ...prev, [moduleId]: tasks }));
    } catch (err) {
      console.error(`[ChecklistRoadmap] Error cargando tasks:`, err);
    }
  };

  const handleToggleTasks = (moduleId: string) => {
    setExpandedTasks(prev => {
      const ne = new Set(prev);
      if (ne.has(moduleId)) {
        ne.delete(moduleId);
      } else {
        ne.add(moduleId);
        loadTasks(moduleId);
      }
      return ne;
    });
  };

  const handleCreateTask = async (moduleId: string, submoduleId: string | undefined, nombre: string) => {
    try {
      const task = await roadmapApi.createTask({ module_id: moduleId, submodule_id: submoduleId, nombre, status: 'todo' });
      setTasksByModule(prev => ({ ...prev, [moduleId]: [...(prev[moduleId] || []), task] }));
      toast.success('Task creada');
    } catch (err) {
      toast.error('Error creando task');
    }
  };

  const handleUpdateTask = async (taskId: string, moduleId: string, updates: Partial<roadmapApi.TaskInput>) => {
    try {
      const updated = await roadmapApi.updateTask(taskId, updates);
      setTasksByModule(prev => ({ ...prev, [moduleId]: (prev[moduleId] || []).map(t => t.id === taskId ? updated : t) }));
      toast.success('Task actualizada');
    } catch (err) {
      toast.error('Error actualizando task');
    }
  };

  const handleDeleteTask = async (taskId: string, moduleId: string) => {
    try {
      await roadmapApi.deleteTask(taskId);
      setTasksByModule(prev => ({ ...prev, [moduleId]: (prev[moduleId] || []).filter(t => t.id !== taskId) }));
      toast.success('Task eliminada');
    } catch (err) {
      toast.error('Error eliminando task');
    }
  };

  // ── Auditor�a autom�tica ────────────────────────────────────────────────
  const runAudit = async () => {
    if (!projectId) {
      toast.warning("⚠️ Supabase no conectado");
      return;
    }
    
    setIsAuditing(true);
    setAuditProgress({ current: 0, total: modules.length });
    
    try {
      const auditPromises = modules.map(async (mod, idx) => {
        setAuditProgress({ current: idx + 1, total: modules.length });
        
        const auditInfo = AUDIT_MAP[mod.id] || {};
        const tieneView = BUILT_MODULE_IDS.has(mod.id);
        const tieneBackend = SUPABASE_MODULE_IDS.has(mod.id);
        
        // Ejecutar auditor�a completa (incluye tiene_view y tiene_backend)
        const endpointUrl = auditInfo.endpointUrl 
          ? `https://${projectId}.supabase.co/functions/v1${auditInfo.endpointUrl}`
          : undefined;
        
        await roadmapApi.auditModule(mod.id, {
          moduleId: mod.id,
          endpointUrl,
          tableName: auditInfo.tableName,
          tiene_view: tieneView,
          tiene_backend: tieneBackend,
        });
      });
      
      await Promise.all(auditPromises);
      
      // Recargar m�dulos para ver los cambios
      await loadModules();
      
      toast.success(`✅ Auditor�a completada � ${modules.length} m�dulos verificados`);
    } catch (err) {
      console.error("[ChecklistRoadmap] Error en auditor�a:", err);
      toast.error("❌ Error durante la auditor�a");
    } finally {
      setIsAuditing(false);
      setAuditProgress({ current: 0, total: 0 });
    }
  };

  // ── Stats globales (usa getEffectivePercent para honrar subm�dulos) ────────
  const stats = useMemo(() => {
    const total = modules.length;
    const completed  = modules.filter((m) => getEffectivePercent(m) === 100).length;
    const uiOnly     = modules.filter((m) => m.status === "ui-only").length;
    const specReady  = modules.filter((m) => m.status === "spec-ready").length;
    const notStarted = modules.filter((m) => getEffectivePercent(m) === 0).length;
    const inProgress = modules.filter((m) => { const p = getEffectivePercent(m); return p > 0 && p < 100; }).length;
    const totalHours = modules.reduce((s, m) => s + (m.estimatedHours || 0), 0);
    const completedHours = modules
      .filter((m) => getEffectivePercent(m) === 100)
      .reduce((s, m) => s + (m.estimatedHours || 0), 0);
    const progressPercent = modules.reduce((sum, m) => {
      const pct = getEffectivePercent(m);
      const w = (m.estimatedHours || 1) / Math.max(totalHours, 1);
      return sum + pct * w;
    }, 0);
    return {
      total, completed, uiOnly, specReady, notStarted, inProgress,
      completedPercent: Math.round((completed / total) * 100),
      progressPercent: Math.round(progressPercent),
      totalHours, completedHours,
      remainingHours: totalHours - completedHours,
    };
  }, [modules]);

  // ── M�dulos filtrados ─────────────────────────────────────────────────────
  const filteredModules = useMemo(() => {
    return modules.filter((m) => {
      if (searchTerm && !m.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !m.description.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      if (selectedCategory !== "all" && m.category !== selectedCategory) return false;
      if (selectedStatus !== "all" && m.status !== selectedStatus) return false;
      if (selectedPriority !== "all" && m.priority !== selectedPriority) return false;
      return true;
    });
  }, [modules, searchTerm, selectedCategory, selectedStatus, selectedPriority]);

  // ── Agrupado por �rea ─────────────────────────────────────────────────────
  const groupedByCategory = useMemo(() => {
    return (Object.keys(CATEGORY_INFO) as ModuleCategory[]).reduce<
      Array<{ cat: ModuleCategory; mods: Module[]; areaStats: { total: number; completed: number; inProgress: number; pct: number; hours: number } }>
    >((acc, cat) => {
      const mods = filteredModules.filter((m) => m.category === cat);
      if (mods.length === 0) return acc;
      const completed = mods.filter((m) => getEffectivePercent(m) === 100).length;
      const inProgress = mods.filter((m) => { const p = getEffectivePercent(m); return p > 0 && p < 100; }).length;
      const totalH = mods.reduce((s, m) => s + (m.estimatedHours || 1), 0);
      const pct = Math.round(
        mods.reduce((sum, m) => {
          const p = getEffectivePercent(m);
          const w = (m.estimatedHours || 1) / totalH;
          return sum + p * w;
        }, 0)
      );
      const hours = mods.reduce((s, m) =>
        s + (getEffectivePercent(m) === 100 ? 0 : (m.estimatedHours || 0)), 0);
      acc.push({ cat, mods, areaStats: { total: mods.length, completed, inProgress, pct, hours } });
      return acc;
    }, []);
  }, [filteredModules]);

  // Cuando hay b�squeda o filtro activo ? expandir todo autom�ticamente
  const effectiveExpanded = useMemo(() => {
    if (searchTerm.trim() || selectedCategory !== "all" || selectedStatus !== "all" || selectedPriority !== "all") {
      return new Set(Object.keys(CATEGORY_INFO));
    }
    return expandedCategories;
  }, [searchTerm, selectedCategory, selectedStatus, selectedPriority, expandedCategories]);

  // ── StatusIcon ────────────────────────────────────────────────────────────
  const StatusIcon = ({ status }: { status: ModuleStatus }) => {
    const Icon = STATUS_INFO[status].icon;
    return <Icon className={`h-4 w-4 ${STATUS_INFO[status].color} flex-shrink-0`} />;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-[#FF6835] mx-auto mb-4" />
          <p className="text-muted-foreground">Cargando roadmap...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      {/* ── Audit Modal ───────────────────────────────── */}
      <AnimatePresence>
        {showAudit && (
          <AuditPanel modules={modules} onClose={() => setShowAudit(false)} />
        )}
      </AnimatePresence>
      {/* ── Ideas Promovidas Panel ─────────────────────── */}
      <AnimatePresence>
        {showIdeasTab && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
            onClick={() => setShowIdeasTab(false)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card rounded-xl border border-border shadow-2xl w-full max-w-3xl max-h-[85vh] flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-5 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
                    <Lightbulb className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-foreground">Ideas Promovidas</h2>
                    <p className="text-xs text-muted-foreground">
                      {ideasPromovidas.length} idea{ideasPromovidas.length !== 1 ? 's' : ''} pendiente{ideasPromovidas.length !== 1 ? 's' : ''} de aprobación
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={loadIdeasPromovidas}
                    className="p-2 hover:bg-accent rounded-lg transition-colors"
                    title="Recargar ideas"
                  >
                    <RefreshCw className="h-4 w-4 text-muted-foreground" />
                  </button>
                  <button
                    onClick={() => setShowIdeasTab(false)}
                    className="p-2 hover:bg-accent rounded-lg transition-colors"
                  >
                    <X className="h-5 w-5 text-muted-foreground" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-5">
                {ideasPromovidas.length === 0 ? (
                  <div className="text-center py-12">
                    <Inbox className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                    <p className="text-sm font-semibold text-muted-foreground">No hay ideas pendientes</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Las ideas promovidas desde Ideas Board aparecerán aquí
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {ideasPromovidas.map((idea) => (
                      <motion.div
                        key={idea.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-background rounded-lg border border-border p-4"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 border border-orange-200">
                                {idea.idea_area || 'General'}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {new Date(idea.created_at).toLocaleDateString('es-AR')}
                              </span>
                            </div>
                            <p className="text-sm text-foreground mb-2">{idea.idea_texto}</p>
                            {idea.notas && (
                              <p className="text-xs text-muted-foreground italic mb-2">
                                📝 {idea.notas}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <button
                              onClick={() => handleResolverIdea(idea.id, 'aprobada')}
                              className="p-2 hover:bg-green-50 rounded-lg transition-colors border border-green-200"
                              title="Aprobar idea"
                            >
                              <Check className="h-4 w-4 text-green-600" />
                            </button>
                            <button
                              onClick={() => {
                                const moduleId = prompt('ID del módulo (opcional):');
                                if (moduleId) {
                                  handleResolverIdea(idea.id, 'convertida', moduleId);
                                }
                              }}
                              className="p-2 hover:bg-blue-50 rounded-lg transition-colors border border-blue-200"
                              title="Convertir a módulo"
                            >
                              <CheckCircle2 className="h-4 w-4 text-blue-600" />
                            </button>
                            <button
                              onClick={() => handleResolverIdea(idea.id, 'rechazada')}
                              className="p-2 hover:bg-red-50 rounded-lg transition-colors border border-red-200"
                              title="Rechazar idea"
                            >
                              <XCircle className="h-4 w-4 text-red-600" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-5 border-t border-border bg-background/50">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">
                    💡 Crea y promueve ideas desde <strong>Ideas Board</strong>
                  </p>
                  <button
                    onClick={() => {
                      if (onNavigate) {
                        onNavigate('ideas-board');
                      } else {
                        window.location.href = '#/admin?section=ideas-board';
                      }
                    }}
                    className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-orange-600 hover:bg-orange-50 rounded-lg border border-orange-200 transition-colors"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    Ir a Ideas Board
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* ── Roadmap Panel ─────────────────────── */}
      <AnimatePresence>
        {showRoadmapPanel && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
            onClick={() => setShowRoadmapPanel(false)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card rounded-xl border border-border shadow-2xl w-full max-w-3xl max-h-[85vh] flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-5 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-violet-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-foreground">Roadmap — Próximamente</h2>
                    <p className="text-xs text-muted-foreground">
                      {modules.filter(m => m.status === 'spec-ready' || m.status === 'not-started').length} módulo{modules.filter(m => m.status === 'spec-ready' || m.status === 'not-started').length !== 1 ? 's' : ''} pendiente{modules.filter(m => m.status === 'spec-ready' || m.status === 'not-started').length !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowRoadmapPanel(false)}
                  className="p-2 hover:bg-accent rounded-lg transition-colors"
                >
                  <X className="h-5 w-5 text-muted-foreground" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-5">
                {(() => {
                  const roadmapModules = modules
                    .filter(m => m.status === 'spec-ready' || m.status === 'not-started')
                    .sort((a, b) => {
                      const priorityOrder: Record<ModulePriority, number> = {
                        critical: 0,
                        high: 1,
                        medium: 2,
                        low: 3,
                      };
                      return priorityOrder[a.priority] - priorityOrder[b.priority];
                    });

                  if (roadmapModules.length === 0) {
                    return (
                      <div className="text-center py-12">
                        <Inbox className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                        <p className="text-sm font-semibold text-muted-foreground">No hay módulos en roadmap</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Los módulos con estado "Definición Lista" o "No Iniciado" aparecerán aquí
                        </p>
                      </div>
                    );
                  }

                  return (
                    <div className="space-y-3">
                      {roadmapModules.map((module) => (
                        <motion.div
                          key={module.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="bg-background rounded-lg border border-border p-4"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-2 flex-wrap">
                                <span className="text-sm font-semibold text-foreground">{module.name}</span>
                                <span className={`text-xs px-1.5 py-0.5 rounded border flex-shrink-0 ${PRIORITY_INFO[module.priority].color}`}>
                                  {PRIORITY_INFO[module.priority].label}
                                </span>
                                <span className={`text-xs px-1.5 py-0.5 rounded border flex-shrink-0 ${STATUS_INFO[module.status].color} border-current/20`}>
                                  {STATUS_INFO[module.status].label}
                                </span>
                              </div>
                              {module.description && (
                                <p className="text-xs text-muted-foreground">{module.description}</p>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  );
                })()}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* ── Header standalone ─────────────────────────── */}
      {!hideHeader && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-4">
              <h1 className="text-3xl font-bold text-foreground">Checklist & Roadmap</h1>
              {!hasUnsavedChanges && !isSaving && (
                <span className="text-sm text-green-600 flex items-center gap-1">
                  <CheckCircle2 className="h-4 w-4" /> Sincronizado
                </span>
              )}
              <button
                onClick={() => setShowIdeasTab(!showIdeasTab)}
                disabled={ideasPromovidas.length === 0}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-sm font-bold transition-colors ${
                  ideasPromovidas.length > 0
                    ? 'bg-orange-100 text-orange-700 border-orange-300 hover:bg-orange-200 cursor-pointer'
                    : 'bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed opacity-60'
                }`}
                title={
                  ideasPromovidas.length > 0
                    ? `Ver ${ideasPromovidas.length} idea${ideasPromovidas.length !== 1 ? 's' : ''} promovida${ideasPromovidas.length !== 1 ? 's' : ''} desde Ideas Board`
                    : 'No hay ideas promovidas pendientes. Crea ideas en Ideas Board y promuévelas para verlas aquí.'
                }
              >
                <Inbox className="h-3.5 w-3.5" />
                {ideasPromovidas.length > 0 ? (
                  <>
                    {ideasPromovidas.length} idea{ideasPromovidas.length !== 1 ? 's' : ''} pendiente{ideasPromovidas.length !== 1 ? 's' : ''}
                  </>
                ) : (
                  'Ideas Promovidas'
                )}
              </button>
              <button
                onClick={() => {
                  if (onNavigate) {
                    onNavigate('ideas-board');
                  } else {
                    window.location.href = '#/admin?section=ideas-board';
                  }
                }}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-100 text-teal-700 border border-teal-300 text-sm font-bold hover:bg-teal-200 transition-colors"
                title="Abrir Ideas Board para crear y gestionar ideas"
              >
                <Lightbulb className="h-3.5 w-3.5" />
                Ideas Board
              </button>
              <button
                onClick={() => setShowRoadmapPanel(!showRoadmapPanel)}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-100 text-violet-700 border border-violet-300 text-sm font-bold hover:bg-violet-200 transition-colors"
              >
                <TrendingUp className="h-3.5 w-3.5" />
                Roadmap
              </button>
              {modules.filter(m => m.status === "spec-ready").length > 0 && (
                <button
                  onClick={() => setViewMode("queue")}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-100 text-violet-700 border border-violet-300 text-sm font-bold hover:bg-violet-200 transition-colors"
                >
                  <ListOrdered className="h-3.5 w-3.5" />
                  {modules.filter(m => m.status === "spec-ready").length} en cola
                </button>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={forceResyncFromManifest}
                disabled={isSyncing}
                title="Resincroniza estad�sticas desde el manifest � corrige estados stale del backend"
                className="flex items-center gap-2 px-3 py-2 rounded-lg border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-700 transition-colors text-sm font-medium disabled:opacity-50"
              >
                <RefreshCw className={`h-4 w-4 ${isSyncing ? "animate-spin" : ""}`} />
                {isSyncing ? "Sincronizando..." : "Resync manifest"}
              </button>
              <button
                onClick={() => setShowAudit(true)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 bg-white hover:bg-orange-50 hover:border-[#FF6835]/40 text-gray-600 hover:text-[#FF6835] transition-colors text-sm font-medium"
              >
                <ScanSearch className="h-4 w-4" /> Auditor�a
              </button>
              <button
                onClick={runAudit}
                disabled={isAuditing}
                className="flex items-center gap-2 px-3 py-2 rounded-lg border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-700 transition-colors text-sm font-medium disabled:opacity-50"
              >
                {isAuditing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Auditando {auditProgress.current}/{auditProgress.total}...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4" /> Auditar m�dulos
                  </>
                )}
              </button>
              {hasUnsavedChanges && (
                <button onClick={saveAllProgress} disabled={isSaving}
                  className="px-4 py-2 bg-[#FF6835] text-white rounded-lg hover:bg-[#FF6835]/90 transition-colors flex items-center gap-2 disabled:opacity-50">
                  {isSaving ? <><Loader2 className="h-4 w-4 animate-spin" />Guardando...</> : <><Save className="h-4 w-4" />Guardar</>}
                </button>
              )}
            </div>
          </div>
          <p className="text-muted-foreground">Estado completo de todos los m�dulos de Charlie Marketplace Builder</p>
        </div>
      )}

      {/* ── Toolbar (modo embebido) ─────────────────── */}
      {hideHeader && (
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={() => setShowIdeasTab(!showIdeasTab)}
              disabled={ideasPromovidas.length === 0}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-sm font-bold transition-colors flex-shrink-0 ${
                ideasPromovidas.length > 0
                  ? 'bg-orange-100 text-orange-700 border-orange-300 hover:bg-orange-200 cursor-pointer'
                  : 'bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed opacity-60'
              }`}
              title={
                ideasPromovidas.length > 0
                  ? `Ver ${ideasPromovidas.length} idea${ideasPromovidas.length !== 1 ? 's' : ''} promovida${ideasPromovidas.length !== 1 ? 's' : ''} desde Ideas Board`
                  : 'No hay ideas promovidas pendientes. Crea ideas en Ideas Board y promuévelas para verlas aquí.'
              }
            >
              <Inbox className="h-3.5 w-3.5" />
              {ideasPromovidas.length > 0 ? (
                <>
                  {ideasPromovidas.length} idea{ideasPromovidas.length !== 1 ? 's' : ''} pendiente{ideasPromovidas.length !== 1 ? 's' : ''}
                </>
              ) : (
                'Ideas Promovidas'
              )}
            </button>
            <button
              onClick={() => {
                if (onNavigate) {
                  onNavigate('ideas-board');
                } else {
                  window.location.href = '#/admin?section=ideas-board';
                }
              }}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-100 text-teal-700 border border-teal-300 text-sm font-bold hover:bg-teal-200 transition-colors flex-shrink-0"
              title="Abrir Ideas Board para crear y gestionar ideas"
            >
                <Lightbulb className="h-3.5 w-3.5" />
                Ideas Board
              </button>
              <button
                onClick={() => setShowRoadmapPanel(!showRoadmapPanel)}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-100 text-violet-700 border border-violet-300 text-sm font-bold hover:bg-violet-200 transition-colors"
              >
                <TrendingUp className="h-3.5 w-3.5" />
                Roadmap
              </button>
            {hasUnsavedChanges && (
              <button onClick={saveAllProgress} disabled={isSaving}
                className="px-4 py-2 bg-[#FF6835] text-white rounded-lg hover:bg-[#FF6835]/90 transition-colors flex items-center gap-2 text-sm disabled:opacity-50">
                {isSaving ? <><Loader2 className="h-4 w-4 animate-spin" />Guardando...</> : <><Save className="h-4 w-4" />Guardar Cambios</>}
              </button>
            )}
            {(() => {
              const queueCount = modules.filter(m => m.status === "spec-ready").length;
              return queueCount > 0 ? (
                <button
                  onClick={() => setViewMode("queue")}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-100 text-violet-700 border border-violet-300 text-sm font-bold hover:bg-violet-200 transition-colors"
                >
                  <ListOrdered className="h-3.5 w-3.5" />
                  Tareas en cola {queueCount}
                </button>
              ) : null;
            })()}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={forceResyncFromManifest}
              disabled={isSyncing}
              title="Resincroniza estad�sticas desde el manifest � corrige estados stale del backend"
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg border font-semibold transition-colors disabled:opacity-50 ${
                !hasUnsavedChanges && !isSaving
                  ? 'border-green-200 bg-green-50 hover:bg-green-100 text-green-700'
                  : hasUnsavedChanges
                  ? 'border-red-200 bg-red-50 hover:bg-red-100 text-red-700'
                  : 'border-yellow-200 bg-yellow-50 hover:bg-yellow-100 text-yellow-700'
              }`}
            >
              <CheckCircle2 className={`h-3.5 w-3.5 ${isSyncing ? "animate-spin" : ""}`} />
              {isSyncing ? "Sincronizando..." : "Sincronizado"}
            </button>
            <button
              onClick={() => setShowAudit(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg border border-[#FF6835]/30 bg-orange-50 hover:bg-orange-100 text-[#FF6835] font-semibold transition-colors"
            >
              <ScanSearch className="h-3.5 w-3.5" /> Auditor�a
            </button>
            <button
              onClick={toggleExpandCollapse}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs bg-card border border-border rounded-lg hover:bg-accent transition-colors ${
                allExpanded ? 'text-muted-foreground' : 'text-muted-foreground'
              }`}
            >
              {allExpanded ? (
                <>
                  <ChevronsDownUp className="h-3.5 w-3.5" /> Colapsar
                </>
              ) : (
                <>
                  <ChevronsUpDown className="h-3.5 w-3.5" /> Expandir
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* ── Modal de Estadísticas y Controles (similar a Auditoría) ───────────────────────────────── */}
      <div className="bg-card rounded-xl p-5 border border-border mb-6" style={{
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
      }}>
        {/* ── 6 Tarjetas de Estadísticas ───────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-5">
          {/* Progreso Total */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }}
            className="bg-background rounded-xl p-4 border border-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground">Progreso Total</span>
            <TrendingUp className="h-4 w-4 text-[#FF6835]" />
          </div>
          <div className="text-2xl font-bold text-foreground mb-1">{stats.progressPercent}%</div>
          <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
            <div className="bg-[#FF6835] h-1.5 rounded-full transition-all duration-700"
              style={{ width: `${stats.progressPercent}%` }} />
          </div>
          <div className="text-xs text-muted-foreground mt-1.5">
            promedio ponderado por horas
          </div>
        </motion.div>

          {/* Completados con DB */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}
            className="bg-background rounded-xl p-4 border border-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground">Completados</span>
            <CheckCircle2 className="h-4 w-4 text-[#FF6835]" />
          </div>
          <div className="text-2xl font-bold text-foreground mb-1">
            {stats.completed}/{stats.total}
          </div>
          <div className="text-xs text-muted-foreground mb-2">{stats.completedPercent}% m�dulos con DB</div>
          {/* Mini breakdown de los 3 estados */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-orange-50 text-orange-700 border border-orange-200">
              🟢 {stats.completed} DB
            </span>
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              🔵 {stats.uiOnly} UI
            </span>
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-500 border border-gray-200">
              ⚫ {stats.notStarted} pend.
            </span>
          </div>
        </motion.div>

          {/* UI Lista / En Progreso */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }}
            className="bg-background rounded-xl p-4 border border-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground">UI Lista / En Progreso</span>
            <Monitor className="h-4 w-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-foreground mb-1">{stats.uiOnly}</div>
          <div className="text-xs text-muted-foreground mb-2">vistas construidas sin backend</div>
          {stats.specReady > 0 && (
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-violet-50 text-violet-700 border border-violet-200">
              🟣 {stats.specReady} en cola
            </span>
          )}
        </motion.div>

          {/* Horas Restantes */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.24 }}
            className="bg-background rounded-xl p-4 border border-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground">Horas Restantes</span>
            <AlertCircle className="h-4 w-4 text-[#FF6835]" />
          </div>
          <div className="text-2xl font-bold text-foreground mb-1">{stats.remainingHours}h</div>
          <div className="text-xs text-muted-foreground">de {stats.totalHours}h estimadas totales</div>
          <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
            <div className="bg-green-500 h-1.5 rounded-full transition-all duration-700"
              style={{ width: `${Math.round((stats.completedHours / Math.max(stats.totalHours, 1)) * 100)}%` }} />
          </div>
          </motion.div>

          {/* Checklist */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.32 }}
            className="bg-background rounded-xl p-4 border border-border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground">Checklist</span>
              <FileCheck2 className="h-4 w-4 text-[#FF6835]" />
            </div>
            <div className="text-2xl font-bold text-foreground mb-1">{stats.total}</div>
            <div className="text-xs text-muted-foreground">módulos totales</div>
            <div className="text-xs text-muted-foreground mt-1">{stats.inProgress} en progreso</div>
          </motion.div>

          {/* Roadmap */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.40 }}
            className="bg-background rounded-xl p-4 border border-border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground">Roadmap</span>
              <BarChart3 className="h-4 w-4 text-[#FF6835]" />
            </div>
            <div className="text-2xl font-bold text-foreground mb-1">{stats.specReady}</div>
            <div className="text-xs text-muted-foreground">módulos en cola</div>
            <div className="text-xs text-muted-foreground mt-1">{stats.notStarted} pendientes</div>
          </motion.div>
        </div>

        {/* ── Barra de Botones ───────────────────────────────── */}
        <div className="flex items-center gap-2 mb-4 pb-4 border-b border-border flex-wrap">
          <button
            onClick={() => {
              if (onNavigate) {
                onNavigate('ideas-board');
              } else {
                window.location.href = '#/admin?section=ideas-board';
              }
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-teal-200 bg-teal-50 hover:bg-teal-100 text-teal-700 text-sm font-semibold transition-colors"
          >
            <Lightbulb className="h-3.5 w-3.5" />
            Ideas
          </button>
          <button
            onClick={() => setViewMode("list")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-700 text-sm font-semibold transition-colors"
          >
            <Monitor className="h-3.5 w-3.5" />
            Desarrollo
          </button>
          <button
            onClick={forceResyncFromManifest}
            disabled={isSyncing}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm font-semibold transition-colors disabled:opacity-50 ${
              !hasUnsavedChanges && !isSaving
                ? 'border-green-200 bg-green-50 hover:bg-green-100 text-green-700'
                : hasUnsavedChanges
                ? 'border-red-200 bg-red-50 hover:bg-red-100 text-red-700'
                : 'border-yellow-200 bg-yellow-50 hover:bg-yellow-100 text-yellow-700'
            }`}
          >
            <CheckCircle2 className={`h-3.5 w-3.5 ${isSyncing ? "animate-spin" : ""}`} />
            {isSyncing ? "Sincronizando..." : "Sincronizado"}
          </button>
          <button
            onClick={() => setShowAudit(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#FF6835]/30 bg-orange-50 hover:bg-orange-100 text-[#FF6835] text-sm font-semibold transition-colors"
          >
            <ScanSearch className="h-3.5 w-3.5" />
            Auditoría
          </button>
          <button
            onClick={toggleExpandCollapse}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card hover:bg-accent text-muted-foreground text-sm font-semibold transition-colors"
          >
            {allExpanded ? (
              <>
                <ChevronsDownUp className="h-3.5 w-3.5" /> Colapsar
              </>
            ) : (
              <>
                <ChevronsUpDown className="h-3.5 w-3.5" /> Expandir
              </>
            )}
          </button>
        </div>

        {/* ── Buscador y Filtros ───────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input type="text" placeholder="Buscar m�dulo..." value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6835]" />
          </div>
          <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value as any)}
            className="px-4 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6835]">
            <option value="all">Todas las �reas</option>
            {Object.entries(CATEGORY_INFO).map(([key, info]) => <option key={key} value={key}>{info.label}</option>)}
          </select>
          <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value as any)}
            className="px-4 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6835]">
            <option value="all">Todos los estados</option>
            {Object.entries(STATUS_INFO).map(([key, info]) => <option key={key} value={key}>{info.label}</option>)}
          </select>
          <select value={selectedPriority} onChange={(e) => setSelectedPriority(e.target.value as any)}
            className="px-4 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6835]">
            <option value="all">Todas las prioridades</option>
            {Object.entries(PRIORITY_INFO).map(([key, info]) => <option key={key} value={key}>{info.label}</option>)}
          </select>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════
          LIST VIEW � agrupado por �rea, colapsable
      ═══════════════════════════════════════════════ */}
      {viewMode === "list" && (
        <div className="space-y-2">
          {groupedByCategory.map(({ cat, mods, areaStats }, gi) => {
            const info = CATEGORY_INFO[cat];
            const isOpen = effectiveExpanded.has(cat);
            const allDone = areaStats.pct === 100;

            return (
              <motion.div key={cat}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: gi * 0.03 }}
                className="rounded-xl border border-border overflow-hidden shadow-sm"
              >
                {/* ── Cabecera del �rea ────────────────── */}
                <button
                  onClick={() => toggleExpandCategory(cat)}
                  className={`w-full flex items-center gap-2 px-4 py-3.5 text-left transition-colors ${
                    isOpen ? "bg-card" : "bg-card hover:bg-accent/30"
                  }`}
                >
                  {/* Borde lateral de color */}
                  <div className={`w-1 self-stretch rounded-full flex-shrink-0 ${info.color}`} />

                  {/* Chevron animado */}
                  <ChevronRight className={`h-4 w-4 text-muted-foreground flex-shrink-0 transition-transform duration-200 ${isOpen ? "rotate-90" : ""}`} />

                  {/* Contenido izquierdo � flex-1 */}
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full text-white whitespace-nowrap flex-shrink-0 ${info.color}`}>
                      {info.label}
                    </span>
                    {allDone && <CheckCircle2 className="h-4 w-4 text-[#FF6835] flex-shrink-0" />}
                  </div>

                  {/* ══ BLOQUE DERECHO FIJO � id�ntico al de m�dulo ══ */}
                  <span className="w-14 text-right text-xs text-muted-foreground flex-shrink-0 hidden lg:block">
                    {areaStats.hours > 0 ? `${areaStats.hours}h` : ""}
                  </span>
                  <div className="w-36 flex-shrink-0">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`${getProgressBarColor(areaStats.pct)} h-2 rounded-full transition-all duration-500`}
                        style={{ width: `${areaStats.pct}%` }}
                      />
                    </div>
                  </div>
                  <span className="w-10 text-right text-sm font-semibold text-foreground flex-shrink-0">
                    {areaStats.pct}%
                  </span>
                  {/* w-40 espejo de la columna de badges de m�dulo */}
                  <div className="w-40 flex-shrink-0 hidden sm:flex items-center gap-2 justify-end">
                    <span className="text-xs text-muted-foreground">
                      {areaStats.completed}/{areaStats.total} mods
                    </span>
                    {areaStats.inProgress > 0 && (
                      <span className="text-xs font-bold px-1.5 py-0.5 rounded-full bg-yellow-100 text-yellow-700 border border-yellow-200">
                        {areaStats.inProgress} activos
                      </span>
                    )}
                  </div>
                  {/* Espejo del bot�n paperclip */}
                  <div className="w-7 flex-shrink-0" />
                  {/* Espacio espejo del chevron de subm�dulo */}
                  <div className="w-7 flex-shrink-0" />
                </button>

                {/* ── M�dulos del �rea ─────────────────── */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="area-body"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2, ease: "easeInOut" }}
                      style={{ overflow: "hidden" }}
                    >
                      <div className="border-t border-border divide-y divide-border/50 bg-background/40">
                        {mods.map((module) => (
                          <div key={module.id}>
                            {/* ── Fila del m�dulo ── */}
                            <div className="flex items-center gap-2 px-4 py-2.5 hover:bg-accent/20 transition-colors">
                              {/* Selector de estado � w-44 fijo */}
                              <div onClick={(e) => e.stopPropagation()} className="flex-shrink-0 w-44">
                                <select
                                  value={module.status}
                                  onChange={(e) => updateModuleStatus(module.id, e.target.value as ModuleStatus)}
                                  className="w-full px-2 py-1 bg-background border border-border rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#FF6835] cursor-pointer hover:border-[#FF6835] transition-colors"
                                >
                                  {Object.entries(STATUS_INFO).map(([key, inf]) => (
                                    <option key={key} value={key}>{inf.label} ({inf.percent}%)</option>
                                  ))}
                                </select>
                              </div>

                              {/* Nombre + descripci�n � badges movidos al bloque derecho */}
                              <div className="flex-1 min-w-0">
                                <span className="text-sm font-semibold text-foreground truncate block">{module.name}</span>
                                {module.description && (
                                  <p className="text-xs text-muted-foreground mt-0.5 truncate">{module.description}</p>
                                )}
                              </div>

                              {/* ══ BLOQUE DERECHO FIJO ══ */}
                              <span className="w-14 text-right text-xs text-muted-foreground flex-shrink-0 hidden lg:block">
                                {(module.estimatedHours ?? 0) > 0 ? `${module.estimatedHours}h` : ""}
                              </span>
                              <div className="w-36 flex-shrink-0">
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div
                                    className={`${getProgressBarColor(getEffectivePercent(module), module.status)} h-2 rounded-full transition-all duration-500`}
                                    style={{ width: `${getEffectivePercent(module)}%` }}
                                  />
                                </div>
                              </div>
                              <span className="w-10 text-right text-xs font-bold text-foreground flex-shrink-0">
                                {getEffectivePercent(module)}%
                              </span>

                              {/* ── Badges DESPU�S de la barra ── */}
                              <div className="w-40 flex-shrink-0 hidden sm:flex items-center gap-1 flex-wrap">
                                <span className={`text-xs px-1.5 py-0.5 rounded border flex-shrink-0 ${PRIORITY_INFO[module.priority].color}`}>
                                  {PRIORITY_INFO[module.priority].label}
                                </span>
                                {module.status === "completed" && (
                                  <span className="flex items-center gap-1 text-xs px-1.5 py-0.5 rounded bg-green-50 border border-green-200 text-green-700 flex-shrink-0 font-semibold">
                                    <Database className="h-3 w-3" /> DB
                                  </span>
                                )}
                                {module.status === "ui-only" && (
                                  <span className="flex items-center gap-1 text-xs px-1.5 py-0.5 rounded bg-blue-50 border border-blue-200 text-blue-600 flex-shrink-0 font-semibold">
                                    <Monitor className="h-3 w-3" /> UI
                                  </span>
                                )}
                                {module.status === "spec-ready" && (
                                  <span className="flex items-center gap-1 text-xs px-1.5 py-0.5 rounded bg-violet-50 border border-violet-300 text-violet-700 flex-shrink-0 font-bold">
                                    <FileCheck2 className="h-3 w-3" /> #{module.execOrder ?? "?"}
                                  </span>
                                )}
                              </div>

                              {/* Bot�n adjuntar archivos */}
                              <div className="w-7 flex-shrink-0 flex justify-center">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setExpandedFiles(prev => {
                                      const ne = new Set(prev);
                                      ne.has(module.id) ? ne.delete(module.id) : ne.add(module.id);
                                      return ne;
                                    });
                                  }}
                                  className={`p-1 rounded-lg transition-colors ${
                                    expandedFiles.has(module.id)
                                      ? "bg-[#FF6835]/10 text-[#FF6835]"
                                      : "hover:bg-gray-100 text-gray-400 hover:text-gray-600"
                                  }`}
                                  title="Archivos adjuntos"
                                >
                                  <Paperclip className="h-4 w-4" />
                                </button>
                              </div>

                              {/* Chevron tasks */}
                              <div className="w-7 flex-shrink-0 flex justify-center">
                                <button
                                  onClick={() => handleToggleTasks(module.id)}
                                  className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                                  title={expandedTasks.has(module.id) ? "Ocultar tasks" : "Ver tasks"}
                                >
                                  {expandedTasks.has(module.id)
                                    ? <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                    : <ListOrdered className="h-4 w-4 text-muted-foreground" />}
                                </button>
                              </div>
                              {/* Chevron subm�dulos */}
                              <div className="w-7 flex-shrink-0 flex justify-center">
                                {module.submodules ? (
                                  <button
                                    onClick={() => toggleExpand(module.id)}
                                    className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                                    title={expandedModules.has(module.id) ? "Ocultar subm�dulos" : "Ver subm�dulos"}
                                  >
                                    {expandedModules.has(module.id)
                                      ? <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                      : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
                                  </button>
                                ) : null}
                              </div>
                            </div>

                            {/* ── Subm�dulos expandibles ── */}
                            <AnimatePresence initial={false}>
                              {module.submodules && expandedModules.has(module.id) && (
                                <motion.div
                                  key={`sub-${module.id}`}
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.15 }}
                                  style={{ overflow: "hidden" }}
                                >
                                  <div className="bg-background/60 border-t border-dashed border-border/40">
                                    {module.submodules.map((sub) => {
                                      const pctSub   = STATUS_INFO[sub.status].percent;
                                      const isDone   = sub.status === "completed";
                                      const isUiOnly = sub.status === "ui-only";
                                      const isWip    = pctSub > 0 && !isDone && !isUiOnly;
                                      return (
                                        <div key={sub.id} className="flex items-center gap-2 px-4 py-2 hover:bg-accent/10 transition-colors">
                                          {/* Icono de estado � w-44 igual al selector del padre */}
                                          <div className="w-44 flex-shrink-0 flex items-center gap-2 pl-2">
                                            {isDone    ? <CheckCircle2 className="h-5 w-5 text-[#FF6835]" />
                                            : isUiOnly ? <Monitor      className="h-5 w-5 text-blue-500" />
                                            : isWip    ? <Clock        className="h-5 w-5 text-yellow-500" />
                                            :             <Circle      className="h-5 w-5 text-gray-300" />}
                                          </div>
                                          {/* Nombre */}
                                          <span className={`flex-1 text-xs min-w-0 truncate ${isDone ? "text-[#FF6835] font-medium" : isUiOnly ? "text-blue-600 font-medium" : "text-foreground"}`}>
                                            {sub.name}
                                          </span>
                                          {/* ══ BLOQUE DERECHO FIJO (espejo del padre) ══ */}
                                          <span className="w-14 text-right text-xs text-muted-foreground flex-shrink-0 hidden lg:block">
                                            {(sub.estimatedHours ?? 0) > 0 ? `${sub.estimatedHours}h` : ""}
                                          </span>
                                          <div className="w-36 flex-shrink-0">
                                            <div className="w-full bg-gray-200 rounded-full h-1.5">
                                              <div
                                                className={`${getProgressBarColor(pctSub)} h-1.5 rounded-full transition-all duration-500`}
                                                style={{ width: `${pctSub}%` }}
                                              />
                                            </div>
                                          </div>
                                          <div className="w-10 flex-shrink-0" />
                                          <div className="w-40 flex-shrink-0 hidden sm:block" />
                                          <div className="w-7  flex-shrink-0" />
                                          <div className="w-7  flex-shrink-0" />
                                        </div>
                                      );
                                    })}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>

                            {/* ── Tasks expandibles ── */}
                            <AnimatePresence initial={false}>
                              {expandedTasks.has(module.id) && (
                                <motion.div
                                  key={`tasks-${module.id}`}
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.15 }}
                                  style={{ overflow: "hidden" }}
                                >
                                  <div className="bg-background/40 border-t border-dashed border-border/30 pl-8 py-2">
                                    <div className="flex items-center justify-between mb-2">
                                      <span className="text-xs font-semibold text-muted-foreground">Tasks</span>
                                      <button
                                        onClick={() => {
                                          const nombre = prompt('Nombre de la task:');
                                          if (nombre) handleCreateTask(module.id, undefined, nombre);
                                        }}
                                        className="text-xs px-2 py-1 bg-[#FF6835]/10 text-[#FF6835] rounded hover:bg-[#FF6835]/20 transition-colors"
                                      >
                                        + Agregar
                                      </button>
                                    </div>
                                    {tasksByModule[module.id]?.length ? (
                                      <div className="space-y-1">
                                        {module.submodules?.map(sub => {
                                          const subTasks = (tasksByModule[module.id] || []).filter(t => t.submodule_id === sub.id);
                                          if (subTasks.length === 0) return null;
                                          return (
                                            <div key={sub.id} className="ml-4 mb-2">
                                              <div className="text-xs font-medium text-muted-foreground mb-1">{sub.name}</div>
                                              {subTasks.map(task => (
                                                <div key={task.id} className="flex items-center gap-2 py-1 px-2 hover:bg-accent/10 rounded text-xs">
                                                  <input
                                                    type="checkbox"
                                                    checked={task.status === 'done'}
                                                    onChange={() => handleUpdateTask(task.id, module.id, { status: task.status === 'done' ? 'todo' : 'done' })}
                                                    className="h-3 w-3"
                                                  />
                                                  <span className={`flex-1 ${task.status === 'done' ? 'line-through text-muted-foreground' : ''}`}>
                                                    {task.nombre}
                                                  </span>
                                                  {task.blocker && <span className="text-red-500 text-xs">??</span>}
                                                  <button onClick={() => handleDeleteTask(task.id, module.id)} className="text-red-500 hover:text-red-700">�</button>
                                                </div>
                                              ))}
                                            </div>
                                          );
                                        })}
                                        {(tasksByModule[module.id] || []).filter(t => !t.submodule_id).map(task => (
                                          <div key={task.id} className="flex items-center gap-2 py-1 px-2 hover:bg-accent/10 rounded text-xs">
                                            <input
                                              type="checkbox"
                                              checked={task.status === 'done'}
                                              onChange={() => handleUpdateTask(task.id, module.id, { status: task.status === 'done' ? 'todo' : 'done' })}
                                              className="h-3 w-3"
                                            />
                                            <span className={`flex-1 ${task.status === 'done' ? 'line-through text-muted-foreground' : ''}`}>
                                              {task.nombre}
                                            </span>
                                            {task.blocker && <span className="text-red-500 text-xs">??</span>}
                                            <button onClick={() => handleDeleteTask(task.id, module.id)} className="text-red-500 hover:text-red-700">�</button>
                                          </div>
                                        ))}
                                      </div>
                                    ) : (
                                      <div className="text-xs text-muted-foreground italic">No hay tasks a�n</div>
                                    )}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>

                            {/* ── Panel de archivos adjuntos ── */}
                            <AnimatePresence initial={false}>
                              {expandedFiles.has(module.id) && (
                                <motion.div
                                  key={`files-${module.id}`}
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.2, ease: "easeInOut" }}
                                  style={{ overflow: "hidden" }}
                                >
                                  <ModuleFilesPanel
                                    moduleId={module.id}
                                    moduleName={module.name}
                                  />
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* ═══════════════════════════════════════════════
          KANBAN VIEW
      ═══════════════════════════════════════════════ */}
      {viewMode === "kanban" && (
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          {Object.entries(STATUS_INFO).map(([status, info]) => {
            const mods = filteredModules.filter((m) => m.status === status);
            return (
              <div key={status} className="bg-card rounded-xl border border-border p-4">
                <div className="flex items-center gap-2 mb-4">
                  <info.icon className={`h-5 w-5 ${info.color}`} />
                  <h3 className="font-semibold text-foreground text-sm">{info.label}</h3>
                  <span className="ml-auto text-sm text-muted-foreground">{mods.length}</span>
                </div>
                <div className="space-y-2">
                  {mods.map((m) => (
                    <div key={m.id} className="bg-background p-3 rounded-lg border border-border hover:border-[#FF6835] transition-colors">
                      <div className="font-medium text-sm text-foreground mb-1">{m.name}</div>
                      <div className="flex items-center gap-1 flex-wrap">
                        <span className={`text-xs px-1.5 py-0.5 rounded ${CATEGORY_INFO[m.category].color} text-white`}>
                          {CATEGORY_INFO[m.category].label}
                        </span>
                        <span className={`text-xs px-1.5 py-0.5 rounded border ${PRIORITY_INFO[m.priority].color}`}>
                          {PRIORITY_INFO[m.priority].label}
                        </span>
                      </div>
                    </div>
                  ))}
                  {mods.length === 0 && (
                    <p className="text-xs text-muted-foreground text-center py-4">Sin m�dulos</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ═══════════════════════════════════════════════
          QUEUE VIEW � Cola de ejecuci�n
      ═══════════════════════════════════════════════ */}
      {viewMode === "queue" && (() => {
        const queue = [...modules]
          .filter(m => m.status === "spec-ready")
          .sort((a, b) => (a.execOrder ?? 999) - (b.execOrder ?? 999));
        return (
          <div className="space-y-4 max-w-3xl">
            {/* Header panel */}
            <div className="flex items-center gap-3 p-5 bg-violet-50 border border-violet-200 rounded-xl">
              <div className="w-10 h-10 rounded-xl bg-violet-600 flex items-center justify-center flex-shrink-0">
                <ListOrdered className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-base font-bold text-violet-900">Cola de Ejecuci�n</h2>
                <p className="text-xs text-violet-600 mt-0.5">
                  M�dulos con definici�n completa � ordenados por prioridad de implementaci�n.
                  Cambi� el estado de cualquier m�dulo a <strong>"Definici�n Lista"</strong> para agregarlo.
                </p>
              </div>
              {queue.length > 0 && (
                <div className="text-right flex-shrink-0">
                  <p className="text-2xl font-black text-violet-700">{queue.length}</p>
                  <p className="text-xs text-violet-500">en cola</p>
                </div>
              )}
            </div>

            {queue.length === 0 ? (
              <div className="bg-card rounded-xl border border-dashed border-border p-16 text-center">
                <Inbox className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-sm font-semibold text-muted-foreground">Cola vac�a</p>
                <p className="text-xs text-muted-foreground mt-1 max-w-xs mx-auto">
                  And� a la vista <strong>Lista</strong>, busc� un m�dulo y cambi� su estado a
                  <span className="font-semibold text-violet-600"> "Definici�n Lista"</span> para agregarlo aqu�.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {queue.map((mod, idx) => (
                  <motion.div
                    key={mod.id}
                    layout
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.04 }}
                    className="bg-card rounded-xl border border-violet-200 hover:border-violet-400 hover:shadow-md transition-all overflow-hidden"
                  >
                    <div className="flex items-center gap-3 px-4 py-3.5">
                      {/* N�mero */}
                      <div className="w-10 h-10 rounded-xl bg-violet-600 text-white flex items-center justify-center font-black text-lg flex-shrink-0 shadow-sm">
                        {idx + 1}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-sm text-foreground">{mod.name}</span>
                          <span className={`text-xs px-1.5 py-0.5 rounded-full text-white flex-shrink-0 ${CATEGORY_INFO[mod.category].color}`}>
                            {CATEGORY_INFO[mod.category].icon} {CATEGORY_INFO[mod.category].label}
                          </span>
                          <span className={`text-xs px-1.5 py-0.5 rounded border flex-shrink-0 ${PRIORITY_INFO[mod.priority].color}`}>
                            {PRIORITY_INFO[mod.priority].label}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5 truncate">{mod.description}</p>
                      </div>

                      {/* Horas estimadas */}
                      <div className="text-center flex-shrink-0 hidden md:block">
                        <p className="text-sm font-bold text-foreground">{mod.estimatedHours ?? "�"}h</p>
                        <p className="text-xs text-muted-foreground">estimadas</p>
                      </div>

                      {/* Flechas de orden */}
                      <div className="flex flex-col gap-0.5 flex-shrink-0">
                        <button
                          onClick={() => moveInQueue(mod.id, "up")}
                          disabled={idx === 0}
                          className="p-1.5 rounded-lg hover:bg-violet-100 text-violet-400 hover:text-violet-700 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                          title="Subir en la cola"
                        >
                          <ArrowUp className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => moveInQueue(mod.id, "down")}
                          disabled={idx === queue.length - 1}
                          className="p-1.5 rounded-lg hover:bg-violet-100 text-violet-400 hover:text-violet-700 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                          title="Bajar en la cola"
                        >
                          <ArrowDown className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      {/* Bot�n iniciar */}
                      <button
                        onClick={() => updateModuleStatus(mod.id, "progress-10")}
                        className="flex items-center gap-1.5 px-3 py-2 bg-[#FF6835] text-white rounded-lg text-xs font-bold hover:bg-[#FF6835]/90 transition-colors flex-shrink-0 shadow-sm"
                        title="Iniciar implementaci�n (pasa a En Progreso 10%)"
                      >
                        <Play className="h-3 w-3" /> Iniciar
                      </button>
                    </div>
                  </motion.div>
                ))}

                {/* Footer resumen */}
                <div className="mt-4 p-4 rounded-xl bg-violet-50 border border-violet-200 flex items-center justify-between flex-wrap gap-2">
                  <div className="text-sm text-violet-700 font-medium">
                    <span className="font-black">{queue.length}</span> m�dulo{queue.length !== 1 ? "s" : ""} en cola
                    {" · "}
                    <span className="font-black">
                      {queue.reduce((s, m) => s + (m.estimatedHours ?? 0), 0)}h
                    </span> estimadas totales
                  </div>
                  <span className="text-xs text-violet-500 italic">
                    ↕ Reordenar · ▶ Iniciar cambia el estado a "En Progreso 10%"
                  </span>
                </div>
              </div>
            )}
          </div>
        );
      })()}

      {/* ═══════════════════════════════════════════════
          STATS VIEW
      ═══════════════════════════════════════════════ */}
      {viewMode === "stats" && (
        <div className="space-y-4">
          {groupedByCategory.map(({ cat, mods, areaStats }, gi) => {
            const info = CATEGORY_INFO[cat];
            return (
              <motion.div key={cat}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: gi * 0.05 }}
                className="bg-card rounded-xl border border-border p-5"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full text-white ${info.color}`}>{info.label}</span>
                  <span className="text-sm text-muted-foreground">{areaStats.completed}/{areaStats.total} completados</span>
                  <span className="ml-auto text-xl font-bold text-foreground">{areaStats.pct}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
                  <div className={`${getProgressBarColor(areaStats.pct)} h-3 rounded-full transition-all duration-700`}
                    style={{ width: `${areaStats.pct}%` }} />
                </div>
                <div className="flex gap-4 text-xs text-muted-foreground">
                  <span><Zap className="h-3 w-3 inline mr-1" />{areaStats.inProgress} en progreso</span>
                  <span><Package className="h-3 w-3 inline mr-1" />{areaStats.hours}h restantes</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}

