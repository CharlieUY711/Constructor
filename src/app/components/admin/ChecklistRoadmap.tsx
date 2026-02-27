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
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// CATEGORY INFO
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// âš ï¸ El orden de este objeto define el orden en la vista Lista — espeja el AdminSidebar.
const CATEGORY_INFO: Record<ModuleCategory, { label: string; color: string; icon: string }> = {
  ecommerce:    { label: "eCommerce / Pedidos",   color: "bg-orange-500",  icon: "ðŸ›’" },
  logistics:    { label: "Logística",             color: "bg-green-600",   icon: "🚚" },
  marketing:    { label: "Marketing",             color: "bg-pink-500",    icon: "ðŸ“¢" },
  rrss:         { label: "Redes Sociales",        color: "bg-rose-500",    icon: "ðŸ“±" },
  tools:        { label: "Herramientas",          color: "bg-teal-500",    icon: "ðŸ› ï¸" },
  erp:          { label: "ERP + POS",             color: "bg-blue-600",    icon: "ðŸ“Š" },
  crm:          { label: "CRM",                   color: "bg-purple-600",  icon: "ðŸ‘¥" },
  projects:     { label: "Proyectos",             color: "bg-indigo-600",  icon: "ðŸ“‹" },
  marketplace:  { label: "Marketplace",           color: "bg-amber-500",   icon: "ðŸª" },
  integrations: { label: "Integraciones",           color: "bg-cyan-600",    icon: "ðŸ”Œ" },
  audit:        { label: "Auditoría & Diagnóstico", color: "bg-violet-600",  icon: "ðŸ”" },
  admin:        { label: "Admin / Sistema",         color: "bg-slate-600",   icon: "âš™ï¸" },
  enterprise:   { label: "Enterprise",            color: "bg-red-600",     icon: "ðŸ¢" },
  territory:    { label: "Territorio",            color: "bg-lime-600",    icon: "ðŸ—ºï¸" },
  verification: { label: "Verificación",          color: "bg-yellow-600",  icon: "✅" },
  analytics:    { label: "Analytics & BI",        color: "bg-sky-600",     icon: "ðŸ“ˆ" },
  builder:      { label: "Constructor",           color: "bg-fuchsia-600", icon: "ðŸ”§" },
};

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// STATUS INFO
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const STATUS_INFO: Record<ModuleStatus, { label: string; color: string; icon: any; percent: number }> = {
  "not-started":  { label: "No Iniciado",            color: "text-gray-400",    icon: Circle,       percent: 0   },
  "spec-ready":   { label: "Definición Lista",        color: "text-violet-600",  icon: FileCheck2,   percent: 15  },
  "progress-10":  { label: "En Progreso (10%)",       color: "text-red-500",     icon: AlertCircle,  percent: 10  },
  "progress-50":  { label: "En Progreso (50%)",       color: "text-yellow-500",  icon: Clock,        percent: 50  },
  "progress-80":  { label: "En Progreso (80%)",       color: "text-blue-500",    icon: TrendingUp,   percent: 80  },
  "ui-only":      { label: "UI Lista — Sin Backend",  color: "text-blue-500",    icon: Monitor,      percent: 80  },
  "completed":    { label: "Completado (con DB)",     color: "text-[#FF6835]",   icon: CheckCircle2, percent: 100 },
};

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// PRIORITY INFO
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const PRIORITY_INFO: Record<ModulePriority, { label: string; color: string }> = {
  critical: { label: "Crítica",  color: "text-red-600 border-red-300 bg-red-50"       },
  high:     { label: "Alta",     color: "text-orange-600 border-orange-300 bg-orange-50" },
  medium:   { label: "Media",    color: "text-yellow-600 border-yellow-300 bg-yellow-50" },
  low:      { label: "Baja",     color: "text-gray-500 border-gray-300 bg-gray-50"    },
};

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// PROGRESS BAR COLOR
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function getProgressBarColor(pct: number, status?: ModuleStatus): string {
  if (pct === 0)                    return "bg-gray-300";
  if (pct < 30)                     return "bg-red-400";
  if (pct < 60)                     return "bg-yellow-400";
  if (status === "ui-only")         return "bg-blue-400";
  if (pct < 100)                    return "bg-blue-500";
  return "bg-green-500";
}

/** % real de un módulo = promedio ponderado de submódulos (si tiene); si no, el del selector. */
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
 * Aplica el estado correcto según manifest:
 *  - BUILT + hasSupabase=true  → "completed"  (100% ðŸ—„ï¸)
 *  - BUILT + hasSupabase=false → "ui-only"    (80%  ðŸ–¥ï¸ — hay UI pero falta backend)
 *  - No está en BUILT          → sin cambio   (mantiene estado manual)
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

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// MODULES_DATA  (fuente de verdad frontend)
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// MODULES_DATA eliminado - ahora se usa solo roadmapApi.getModules()
const MODULES_DATA_PLACEHOLDER: Module[] = [
  // ==================== ADMIN ====================
  { id: "admin-settings", name: "Configuración del Sistema", category: "admin", status: "not-started", priority: "critical", description: "Panel de configuración global", estimatedHours: 24, submodules: [ { id: "admin-set-global", name: "Configuración Global", status: "not-started", estimatedHours: 8 }, { id: "admin-set-theme", name: "Temas y Diseño", status: "not-started", estimatedHours: 8 }, { id: "admin-set-notif", name: "Notificaciones", status: "not-started", estimatedHours: 8 } ] },
  { id: "admin-users", name: "Gestión de Usuarios y Roles", category: "admin", status: "not-started", priority: "critical", description: "Administración de usuarios del sistema", estimatedHours: 32, submodules: [ { id: "admin-usr-crud", name: "CRUD de Usuarios", status: "not-started", estimatedHours: 12 }, { id: "admin-usr-roles", name: "Roles y Permisos", status: "not-started", estimatedHours: 12 }, { id: "admin-usr-audit", name: "Auditoría", status: "not-started", estimatedHours: 8 } ] },

  // ==================== ECOMMERCE ====================
  { id: "ecommerce-pedidos", name: "Módulo de Pedidos", category: "ecommerce", status: "not-started", priority: "critical", description: "Gestión integral de pedidos — árbol madre/hijos", estimatedHours: 48, submodules: [ { id: "eco-ped-crud", name: "CRUD de Pedidos", status: "not-started", estimatedHours: 16 }, { id: "eco-ped-estados", name: "Estados y Flujo", status: "not-started", estimatedHours: 12 }, { id: "eco-ped-tree", name: "Árbol Madre → Hijos", status: "not-started", estimatedHours: 12 }, { id: "eco-ped-doc", name: "Documentos y Facturas", status: "not-started", estimatedHours: 8 } ] },
  { id: "ecommerce-metodos-pago", name: "Métodos de Pago", category: "ecommerce", status: "not-started", priority: "high", description: "Integración con pasarelas de pago", estimatedHours: 24 },
  { id: "ecommerce-metodos-envio", name: "Métodos de Envío", category: "ecommerce", status: "not-started", priority: "high", description: "Configuración de métodos de envío y tarifas", estimatedHours: 16 },

  // ==================== ERP ====================
  { id: "erp-inventory", name: "Inventario", category: "erp", status: "not-started", priority: "critical", description: "Control de stock y movimientos", estimatedHours: 48, submodules: [ { id: "erp-inv-products", name: "Gestión de Productos", status: "not-started", estimatedHours: 12 }, { id: "erp-inv-stock", name: "Control de Stock", status: "not-started", estimatedHours: 10 }, { id: "erp-inv-movements", name: "Movimientos de Inventario", status: "not-started", estimatedHours: 8 }, { id: "erp-inv-transfers", name: "Transferencias entre Depósitos", status: "not-started", estimatedHours: 10 }, { id: "erp-inv-adjustments", name: "Ajustes de Stock", status: "not-started", estimatedHours: 4 }, { id: "erp-inv-lots", name: "Lotes y Números de Serie", status: "not-started", estimatedHours: 4 } ] },
  { id: "erp-invoicing", name: "Facturación", category: "erp", status: "not-started", priority: "critical", description: "Facturación electrónica y documentos fiscales", estimatedHours: 40, submodules: [ { id: "erp-inv-fac", name: "Facturas de Venta", status: "not-started", estimatedHours: 12 }, { id: "erp-inv-nc", name: "Notas de Crédito/Débito", status: "not-started", estimatedHours: 8 }, { id: "erp-inv-afip", name: "AFIP / Factura Electrónica", status: "not-started", estimatedHours: 16 }, { id: "erp-inv-pdf", name: "PDF y Envío por Email", status: "not-started", estimatedHours: 4 } ] },
  { id: "erp-sales", name: "Gestión de Ventas", category: "erp", status: "not-started", priority: "high", description: "Pipeline de ventas y presupuestos", estimatedHours: 32, submodules: [ { id: "erp-sal-quotes", name: "Presupuestos", status: "not-started", estimatedHours: 12 }, { id: "erp-sal-orders", name: "Órdenes de Venta", status: "not-started", estimatedHours: 12 }, { id: "erp-sal-pipeline", name: "Pipeline de Ventas", status: "not-started", estimatedHours: 8 } ] },
  { id: "erp-purchasing", name: "Compras", category: "erp", status: "not-started", priority: "high", description: "Órdenes de compra y proveedores", estimatedHours: 28, submodules: [ { id: "erp-pur-po", name: "Órdenes de Compra", status: "not-started", estimatedHours: 12 }, { id: "erp-pur-suppliers", name: "Gestión de Proveedores", status: "not-started", estimatedHours: 10 }, { id: "erp-pur-reception", name: "Recepción de Mercadería", status: "not-started", estimatedHours: 6 } ] },
  { id: "erp-accounting", name: "Contabilidad", category: "erp", status: "not-started", priority: "high", description: "Módulo contable completo", estimatedHours: 60, submodules: [ { id: "erp-acc-coa", name: "Plan de Cuentas", status: "not-started", estimatedHours: 8 }, { id: "erp-acc-journal", name: "Asientos Contables", status: "not-started", estimatedHours: 12 }, { id: "erp-acc-ar", name: "Cuentas por Cobrar", status: "not-started", estimatedHours: 10 }, { id: "erp-acc-ap", name: "Cuentas por Pagar", status: "not-started", estimatedHours: 10 }, { id: "erp-acc-bank", name: "Bancos y Cajas", status: "not-started", estimatedHours: 8 }, { id: "erp-acc-tax", name: "Impuestos", status: "not-started", estimatedHours: 8 }, { id: "erp-acc-reports", name: "Reportes Financieros", status: "not-started", estimatedHours: 4 } ] },
  { id: "erp-hr", name: "Recursos Humanos", category: "erp", status: "not-started", priority: "medium", description: "Gestión de empleados y nómina", estimatedHours: 40 },

  // ==================== CRM ====================
  { id: "crm-contacts", name: "Base de Personas y Organizaciones", category: "crm", status: "not-started", priority: "critical", description: "Gestión unificada de personas, organizaciones y roles contextuales", estimatedHours: 40 },
  { id: "crm-opportunities", name: "Oportunidades", category: "crm", status: "not-started", priority: "high", description: "Pipeline de oportunidades comerciales", estimatedHours: 24 },
  { id: "crm-activities", name: "Actividades y Seguimiento", category: "crm", status: "not-started", priority: "medium", description: "Registro de interacciones y tareas", estimatedHours: 16 },

  // ==================== LOGÍSTICA ====================
  { id: "logistics-hub", name: "Hub de Logística", category: "logistics", status: "completed", priority: "critical", description: "Hub principal: flujo completo OC→Pedido Madre→Hijos→Ruta→Producción→Envío→Acuse. Construido.", estimatedHours: 8, submodules: [ { id: "logistics-hub-view", name: "Vista Hub + flujo visual", status: "completed", estimatedHours: 4 }, { id: "logistics-hub-cards", name: "Cards de submódulos con estado", status: "completed", estimatedHours: 2 }, { id: "logistics-hub-flow", name: "Diagrama de flujo logístico 7 pasos", status: "completed", estimatedHours: 2 } ] },
  { id: "logistics-shipping", name: "Envíos", category: "logistics", status: "progress-50", priority: "high", description: "Vista árbol pedido madre → envíos hijos. Acuse de recibo, multi-tramo, Google Maps", estimatedHours: 40, submodules: [ { id: "logistics-ship-placeholder", name: "Vista placeholder (EnviosView)", status: "progress-10", estimatedHours: 2 }, { id: "logistics-ship-tree", name: "Vista árbol pedido → envíos hijos", status: "not-started", estimatedHours: 12 }, { id: "logistics-ship-multitramo", name: "Multi-tramo (local + intercity + last mile)", status: "not-started", estimatedHours: 8 }, { id: "logistics-ship-maps", name: "Google Maps + geocodificación", status: "completed", estimatedHours: 8 }, { id: "logistics-ship-acuse", name: "Acuse de recibo (transportista / destinatario)", status: "not-started", estimatedHours: 6 }, { id: "logistics-ship-table", name: "Tabla envios_75638143 en Supabase", status: "not-started", estimatedHours: 4 } ] },
  { id: "logistics-routes", name: "Rutas", category: "logistics", status: "progress-10", priority: "high", description: "Rutas standard y por proyecto. Asignación automática por geocodificación Google Maps", estimatedHours: 24, submodules: [ { id: "logistics-routes-standard", name: "Rutas standard", status: "not-started", estimatedHours: 8 }, { id: "logistics-routes-project", name: "Rutas por proyecto", status: "not-started", estimatedHours: 8 }, { id: "logistics-routes-auto", name: "Asignación automática (Google Maps)", status: "progress-50", estimatedHours: 8 } ] },
  { id: "logistics-carriers", name: "Transportistas", category: "logistics", status: "not-started", priority: "high", description: "Catálogo de carriers. Tramos predefinidos multi-carrier (local + intercity + internacional)", estimatedHours: 16, submodules: [ { id: "logistics-carrier-catalog", name: "Catálogo de transportistas", status: "not-started", estimatedHours: 6 }, { id: "logistics-carrier-tramos", name: "Tramos y tarifas multi-carrier", status: "not-started", estimatedHours: 6 }, { id: "logistics-carrier-assign", name: "Asignación a envíos", status: "not-started", estimatedHours: 4 } ] },
  { id: "logistics-production", name: "Producción / Armado", category: "logistics", status: "not-started", priority: "medium", description: "Órdenes de armado orientadas a ruta. BOM para artículos compuestos (canastas, kits)", estimatedHours: 32, submodules: [ { id: "logistics-prod-bom", name: "BOM — Bill of Materials", status: "not-started", estimatedHours: 10 }, { id: "logistics-prod-orders", name: "Órdenes de armado por ruta", status: "not-started", estimatedHours: 12 }, { id: "logistics-prod-kits", name: "Kits y canastas compuestas", status: "not-started", estimatedHours: 10 } ] },
  { id: "logistics-supply", name: "Abastecimiento", category: "logistics", status: "not-started", priority: "medium", description: "OC automáticas por faltantes de stock. MRP para cálculo de componentes necesarios", estimatedHours: 20, submodules: [ { id: "logistics-supply-oc", name: "OC automáticas por faltante", status: "not-started", estimatedHours: 8 }, { id: "logistics-supply-mrp", name: "MRP — cálculo de componentes", status: "not-started", estimatedHours: 8 }, { id: "logistics-supply-stock", name: "Stock de reserva", status: "not-started", estimatedHours: 4 } ] },
  { id: "logistics-map", name: "Mapa de Envíos", category: "logistics", status: "progress-50", priority: "low", description: "Vista geográfica de envíos activos por ruta y estado. Validación de direcciones en tiempo real", estimatedHours: 16, submodules: [ { id: "logistics-map-view", name: "Vista mapa Google Maps", status: "completed", estimatedHours: 8 }, { id: "logistics-map-realtime", name: "Estado en tiempo real por ruta", status: "not-started", estimatedHours: 5 }, { id: "logistics-map-validate", name: "Validación de direcciones", status: "completed", estimatedHours: 3 } ] },
  { id: "logistics-tracking", name: "Tracking público", category: "logistics", status: "not-started", priority: "medium", description: "Página pública de seguimiento + notificaciones automáticas al destinatario", estimatedHours: 12 },
  { id: "logistics-fulfillment", name: "Fulfillment / Picking", category: "logistics", status: "not-started", priority: "high", description: "Procesamiento de órdenes, lotes, wave picking y empaque", estimatedHours: 36, submodules: [ { id: "logistics-full-orders", name: "Procesamiento de Órdenes", status: "not-started", estimatedHours: 10 }, { id: "logistics-full-batches", name: "Lotes de Pedidos", status: "not-started", estimatedHours: 6 }, { id: "logistics-full-priority", name: "Priorización", status: "not-started", estimatedHours: 4 }, { id: "logistics-pick-wave", name: "Wave Picking", status: "not-started", estimatedHours: 8 }, { id: "logistics-pick-packing", name: "Empaque", status: "not-started", estimatedHours: 8 } ] },

  // ==================== MARKETING ====================
  { id: "marketing-campaigns", name: "Campañas Google Ads", category: "marketing", status: "not-started", priority: "high", description: "Gestión de campañas publicitarias", estimatedHours: 24 },
  { id: "marketing-email", name: "Email Marketing", category: "marketing", status: "not-started", priority: "high", description: "Campañas de email personalizadas", estimatedHours: 20 },
  { id: "marketing-email-bulk", name: "Mailing Masivo", category: "marketing", status: "not-started", priority: "high", description: "Envíos masivos con Resend", estimatedHours: 16 },
  { id: "marketing-seo", name: "SEO", category: "marketing", status: "not-started", priority: "medium", description: "Optimización para motores de búsqueda", estimatedHours: 20 },
  { id: "marketing-loyalty", name: "Fidelización y Sorteos", category: "marketing", status: "not-started", priority: "medium", description: "Rueda de sorteos y programas de fidelización", estimatedHours: 20 },
  { id: "marketing-etiqueta-emotiva", name: "Etiqueta Emotiva", category: "marketing", status: "not-started", priority: "high", description: "Sistema de etiquetado emocional de productos", estimatedHours: 16 },

  // ==================== REDES SOCIALES (RRSS) ====================
  { id: "rrss-centro-operativo", name: "Centro Operativo RRSS", category: "rrss", status: "not-started", priority: "high", description: "Gestión unificada de Facebook, Instagram, WhatsApp. Métricas, programación de posts y análisis de audiencia.", estimatedHours: 32, submodules: [
    { id: "rrss-co-dashboard",  name: "Dashboard de métricas RRSS",          status: "not-started", estimatedHours: 8  },
    { id: "rrss-co-scheduler",  name: "Programación de posts",                status: "not-started", estimatedHours: 10 },
    { id: "rrss-co-inbox",      name: "Inbox unificado (FB + IG + WA)",       status: "not-started", estimatedHours: 8  },
    { id: "rrss-co-analytics",  name: "Analytics de audiencia",               status: "not-started", estimatedHours: 6  },
  ] },
  { id: "rrss-migracion", name: "Migración RRSS", category: "rrss", status: "not-started", priority: "medium", description: "Backup, rebranding y migración de cuentas Instagram y Facebook entre identidades.", estimatedHours: 20, submodules: [
    { id: "rrss-mig-backup",    name: "Backup de cuenta (followers, posts)",  status: "not-started", estimatedHours: 6  },
    { id: "rrss-mig-rebrand",   name: "Rebranding (nombre, bio, avatar)",     status: "not-started", estimatedHours: 6  },
    { id: "rrss-mig-transfer",  name: "Transferencia de audiencia",           status: "not-started", estimatedHours: 8  },
  ] },
  { id: "rrss-meta", name: "Meta Business / RRSS Shop", category: "rrss", status: "not-started", priority: "medium", description: "Catálogo en Facebook Shops, Instagram Shopping y WhatsApp Business", estimatedHours: 20 },

  // ==================== HERRAMIENTAS ====================
  { id: "tools-image-editor", name: "Editor de Imágenes Pro", category: "tools", status: "not-started", priority: "high", description: "Editor con 50+ herramientas: collage, recorte, filtros, remover fondo con IA", estimatedHours: 20 },
  { id: "tools-documents", name: "Generador de Documentos", category: "tools", status: "not-started", priority: "medium", description: "Crea facturas, contratos y presupuestos con IA", estimatedHours: 16 },
  { id: "tools-qr", name: "Generador QR", category: "tools", status: "not-started", priority: "low", description: "Generador de códigos QR interno — sin APIs externas, PNG y SVG vectorial", estimatedHours: 8 },
  { id: "tools-ai", name: "Herramientas IA", category: "tools", status: "not-started", priority: "medium", description: "Suite de inteligencia artificial y machine learning integrada", estimatedHours: 24 },
  { id: "tools-ocr", name: "OCR", category: "tools", status: "not-started", priority: "medium", description: "Extrae texto de imágenes y documentos escaneados", estimatedHours: 12 },
  { id: "tools-quotes", name: "Generador de Presupuestos", category: "tools", status: "not-started", priority: "high", description: "Presupuestos personalizados para clientes con PDF y firma digital", estimatedHours: 20 },
  { id: "tools-print", name: "Impresión", category: "tools", status: "not-started", priority: "low", description: "Gestión de trabajos de impresión, etiquetas y documentos físicos", estimatedHours: 16 },
  { id: "tools-library", name: "Biblioteca / Documentación", category: "tools", status: "not-started", priority: "low", description: "Manuales, guías técnicas y documentación del sistema", estimatedHours: 12 },
  { id: "tools-ideas-board", name: "Ideas Board", category: "tools", status: "not-started", priority: "high", description: "Canvas visual de módulos e ideas — stickers, conectores de colores, múltiples canvases jerárquicos con navegación âŠ™/âŠ•, lamparita de acceso rápido desde Mi Vista", estimatedHours: 20 },

  // ==================== MARKETPLACE ====================
  { id: "marketplace-secondhand",           name: "Segunda Mano",          category: "marketplace", status: "not-started", priority: "high", description: "Marketplace de artículos de segunda mano con moderación, stats y publicaciones", estimatedHours: 48 },
  { id: "marketplace-secondhand-mediacion", name: "Mediación de Disputas", category: "marketplace", status: "not-started", priority: "high", description: "Sistema de mediación entre comprador y vendedor con hilo de mensajes y acciones de admin", estimatedHours: 20 },
  { id: "marketplace-storefront",           name: "Storefront Admin",      category: "marketplace", status: "not-started", priority: "high", description: "Panel de administración del storefront público", estimatedHours: 32 },

  // ==================== PROYECTOS ====================
  { id: "projects-management", name: "Gestión de Proyectos", category: "projects", status: "not-started", priority: "high", description: "Proyectos, hitos y entregas", estimatedHours: 32 },
  { id: "projects-tasks", name: "Tareas", category: "projects", status: "not-started", priority: "high", description: "Gestión de tareas con asignación y prioridad", estimatedHours: 24 },
  { id: "projects-time", name: "Control de Tiempos", category: "projects", status: "not-started", priority: "medium", description: "Registro de horas y timetracking", estimatedHours: 16 },

  // ==================== INTEGRACIONES ====================
  // Tienen UI en IntegracionesView (tab Marketplaces / tab Pagos / tab Mensajería)
  { id: "integrations-mercadolibre", name: "MercadoLibre",               category: "integrations", status: "not-started", priority: "high",   description: "Sincronización de productos, inventario y órdenes con MercadoLibre", estimatedHours: 40 },
  { id: "integrations-mercadopago",  name: "MercadoPago",                category: "integrations", status: "not-started", priority: "high",   description: "Pasarela de pago para Argentina y Latinoamérica", estimatedHours: 24 },
  { id: "integrations-plexo",        name: "Plexo uv",                   category: "integrations", status: "not-started", priority: "medium", description: "Procesamiento de tarjetas para Uruguay (Visa, Mastercard, OCA, Creditel) — sandbox disponible", estimatedHours: 16 },
  { id: "integrations-paypal",       name: "PayPal",                     category: "integrations", status: "not-started", priority: "medium", description: "Pagos internacionales con tarjetas y cuenta PayPal", estimatedHours: 12 },
  { id: "integrations-stripe",       name: "Stripe",                     category: "integrations", status: "not-started", priority: "medium", description: "Procesamiento de tarjetas Visa/Mastercard internacional", estimatedHours: 16 },
  { id: "integrations-twilio",       name: "Twilio SMS/WhatsApp",        category: "integrations", status: "not-started", priority: "medium", description: "Notificaciones SMS y WhatsApp — formulario de config disponible en UI", estimatedHours: 16 },
  { id: "integrations-meta",         name: "Meta Business Suite",        category: "integrations", status: "not-started", priority: "high",   description: "Catálogos y shopping en Instagram, WhatsApp Business y Facebook Shops", estimatedHours: 32 },
  { id: "integrations-logistics",    name: "Carriers Logísticos",        category: "integrations", status: "not-started", priority: "high",   description: "Brixo, Correo UY, OCA, Fedex, DHL — con y sin API. URL de tracking configurable.", estimatedHours: 28 },
  // Sin UI directa — pendientes de construcción
  { id: "integrations-resend",       name: "Resend Email",               category: "integrations", status: "not-started", priority: "medium", description: "Envío de emails transaccionales y campañas vía Resend API", estimatedHours: 8 },
  { id: "integrations-fixed",        name: "API Tipos de Cambio",        category: "integrations", status: "not-started", priority: "low",    description: "Tipos de cambio en tiempo real (Fixer / ExchangeRate API)", estimatedHours: 8 },
  { id: "integrations-replicate",    name: "Replicate AI",               category: "integrations", status: "not-started", priority: "low",    description: "Modelos de IA generativos para procesamiento de imágenes", estimatedHours: 12 },
  { id: "integrations-removebg",     name: "Remove.bg",                  category: "integrations", status: "not-started", priority: "low",    description: "Eliminación automática de fondo en imágenes vía API", estimatedHours: 4 },

  // ==================== AUDITORÍA & DIAGNÓSTICO ====================
  { id: "audit-hub",      name: "Hub Auditoría & Diagnóstico", category: "audit", status: "not-started", priority: "medium", description: "Hub central con métricas de estado, diagnóstico rápido y acceso a todas las herramientas de auditoría", estimatedHours: 6 },
  { id: "audit-apis-repo", name: "Repositorio de APIs", category: "audit", status: "progress-80", priority: "high", description: "Catálogo centralizado de las 23 APIs del sistema — estado, credenciales, auth type, docs y test de conexión", estimatedHours: 12, submodules: [
    { id: "audit-apis-catalog",  name: "Catálogo expandible con 23 APIs",   status: "completed", estimatedHours: 4 },
    { id: "audit-apis-filter",   name: "Filtros por categoría y estado",    status: "completed", estimatedHours: 2 },
    { id: "audit-apis-detail",   name: "Panel detalle: URL, env var, auth", status: "completed", estimatedHours: 3 },
    { id: "audit-apis-test",     name: "Test de conexión por API",          status: "not-started", estimatedHours: 3 },
  ] },
  { id: "audit-health", name: "Health Monitor", category: "audit", status: "not-started", priority: "high", description: "Verificación en tiempo real de Supabase DB, Auth, Edge Functions, KV Store, Storage y APIs externas con latencias", estimatedHours: 10, submodules: [
    { id: "audit-health-backend",  name: "Checks de servicios Supabase",  status: "not-started", estimatedHours: 4 },
    { id: "audit-health-latency",  name: "Latencia y tiempo de respuesta", status: "not-started", estimatedHours: 3 },
    { id: "audit-health-external", name: "Estado de APIs externas",        status: "not-started", estimatedHours: 3 },
  ] },
  { id: "audit-logs", name: "Logs del Sistema", category: "audit", status: "not-started", priority: "medium", description: "Registro de actividad, errores y eventos con filtros por nivel/módulo, detalle expandible y export TXT", estimatedHours: 8, submodules: [
    { id: "audit-logs-list",    name: "Lista con filtros nivel/módulo", status: "not-started", estimatedHours: 3 },
    { id: "audit-logs-detail",  name: "Panel detalle expandible",      status: "not-started", estimatedHours: 2 },
    { id: "audit-logs-export",  name: "Export a TXT",                  status: "not-started", estimatedHours: 1 },
    { id: "audit-logs-backend", name: "Integración con Supabase Logs", status: "not-started", estimatedHours: 2 },
  ] },

  // ==================== BASE DE PERSONAS ====================
  { id: "base-personas", name: "Base de Personas y Organizaciones", category: "crm", status: "not-started", priority: "critical", description: "Módulo unificado: Personas + Organizaciones + Roles Contextuales. Multi-país.", estimatedHours: 60, submodules: [ { id: "bp-personas", name: "Módulo Personas", status: "not-started", estimatedHours: 20 }, { id: "bp-orgs", name: "Módulo Organizaciones", status: "not-started", estimatedHours: 20 }, { id: "bp-roles", name: "Roles Contextuales", status: "not-started", estimatedHours: 12 }, { id: "bp-clientes", name: "Vista Clientes", status: "not-started", estimatedHours: 8 } ] },

  // ==================== ENTERPRISE (Module Marketplace) ====================
  { id: "enterprise-multi-entity", name: "Multi-Entity Management", category: "enterprise", status: "not-started", priority: "high", description: "Gestión de múltiples entidades comerciales con dashboards independientes por entidad, usuarios multi-tenant con permisos granulares y consolidación de reportes.", estimatedHours: 48, submodules: [
    { id: "me-entities",    name: "CRUD de Entidades comerciales",         status: "not-started", estimatedHours: 12 },
    { id: "me-dashboards",  name: "Dashboards independientes por entidad", status: "not-started", estimatedHours: 16 },
    { id: "me-permissions", name: "Usuarios multi-entidad con permisos",   status: "not-started", estimatedHours: 12 },
    { id: "me-reports",     name: "Consolidación de reportes",             status: "not-started", estimatedHours: 8  },
  ] },

  // ==================== ERP AMPLIADO (Module Marketplace) ====================
  { id: "erp-multi-warehouse", name: "Multi-Warehouse System", category: "erp", status: "not-started", priority: "high", description: "Sistema de múltiples depósitos con ruteo inteligente, cálculo automático de tiempos de traslado, transferencias entre almacenes y trazabilidad de lotes.", estimatedHours: 40, submodules: [
    { id: "mw-warehouses", name: "Gestión de depósitos",                     status: "not-started", estimatedHours: 10 },
    { id: "mw-routing",    name: "Ruteo inteligente de pedidos",             status: "not-started", estimatedHours: 12 },
    { id: "mw-transfers",  name: "Transferencias entre depósitos",           status: "not-started", estimatedHours: 10 },
    { id: "mw-times",      name: "Cálculo automático de tiempos de traslado", status: "not-started", estimatedHours: 8  },
  ] },
  { id: "erp-smart-quotation", name: "Smart Quotation System", category: "erp", status: "not-started", priority: "medium", description: "Presupuestos inteligentes con monitoreo automático de precios, alertas de cambio de stock, aprobación por flujo y conversión automática a orden de venta.", estimatedHours: 32, submodules: [
    { id: "sq-builder",  name: "Constructor de presupuestos inteligentes", status: "not-started", estimatedHours: 10 },
    { id: "sq-monitor",  name: "Monitoreo automático de precios",          status: "not-started", estimatedHours: 8  },
    { id: "sq-alerts",   name: "Alertas de cambio de stock",               status: "not-started", estimatedHours: 6  },
    { id: "sq-approval", name: "Flujo de aprobación y conversión a OV",    status: "not-started", estimatedHours: 8  },
  ] },
  { id: "erp-supplier-portal", name: "Supplier Portal", category: "erp", status: "not-started", priority: "medium", description: "Portal self-service para proveedores: gestión de órdenes de compra, actualización de catálogos, cotizaciones y comunicación directa con el equipo de compras.", estimatedHours: 36, submodules: [
    { id: "sp-portal",    name: "Portal web para proveedores",     status: "not-started", estimatedHours: 14 },
    { id: "sp-orders",    name: "Gestión de órdenes de compra",    status: "not-started", estimatedHours: 10 },
    { id: "sp-catalog",   name: "Actualización de catálogos",      status: "not-started", estimatedHours: 8  },
    { id: "sp-messaging", name: "Mensajería proveedor â†” compras",  status: "not-started", estimatedHours: 4  },
  ] },

  // ==================== COMUNICACIONES / UNIFIED WORKSPACE (Module Marketplace) ====================
  { id: "rrss-unified-workspace", name: "Unified Workspace", category: "rrss", status: "not-started", priority: "high", description: "Workspace unificado para gestionar Email, SMS y WhatsApp Business desde un único inbox centralizado con historial completo, plantillas de respuesta rápida y asignación a agentes.", estimatedHours: 36, submodules: [
    { id: "uw-inbox",     name: "Inbox unificado (Email + SMS + WA)",    status: "not-started", estimatedHours: 14 },
    { id: "uw-history",   name: "Historial completo de comunicaciones",  status: "not-started", estimatedHours: 8  },
    { id: "uw-templates", name: "Plantillas de respuesta rápida",        status: "not-started", estimatedHours: 6  },
    { id: "uw-agents",    name: "Asignación a agentes / equipos",        status: "not-started", estimatedHours: 8  },
  ] },

  // ==================== ANALYTICS & BI (Module Marketplace) ====================
  { id: "analytics-advanced", name: "Advanced Analytics & BI", category: "analytics", status: "not-started", priority: "high", description: "Analytics avanzado con Business Intelligence, reportes personalizables programables, dashboards interactivos customizables y predicciones con IA.", estimatedHours: 48, submodules: [
    { id: "aa-dashboards", name: "Dashboards interactivos customizables", status: "not-started", estimatedHours: 16 },
    { id: "aa-reports",    name: "Reportes automatizados programables",   status: "not-started", estimatedHours: 12 },
    { id: "aa-bi",         name: "Business Intelligence avanzado",        status: "not-started", estimatedHours: 12 },
    { id: "aa-ai",         name: "Predicciones e insights con IA",        status: "not-started", estimatedHours: 8  },
  ] },

  // ==================== CONSTRUCTOR ====================
  { id: "builder-constructor", name: "Constructor", category: "builder", status: "progress-50", priority: "high", description: "Constructor visual de páginas, tiendas y experiencias digitales. Drag & drop, componentes modulares, templates y publicación directa.", estimatedHours: 80, submodules: [
    { id: "bc-modules",    name: "Selección de módulos con sub-opciones por proveedor",                                           status: "completed",   estimatedHours: 12 },
    { id: "bc-envvars",    name: "Generación automática de .env.example según módulos + proveedores",                             status: "completed",   estimatedHours: 4  },
    { id: "bc-frontstore", name: "Step 3 — Elección de template de Frontstore (Minimal, Bold, Marketplace, Luxury, Deliveryâ€¦)",  status: "not-started", estimatedHours: 20 },
    { id: "bc-colors",     name: "Step 3 — Configurador de paleta de colores con preview en vivo del template",                   status: "not-started", estimatedHours: 10 },
    { id: "bc-homepage",   name: "Step 3 — Selector de secciones de la Home (hero, categorías, ofertas, testimoniosâ€¦)",           status: "not-started", estimatedHours: 8  },
    { id: "bc-github",        name: "Generación real de repositorio en GitHub vía API con template + config aplicada",               status: "not-started", estimatedHours: 16 },
    { id: "bc-preview",       name: "Preview live del storefront antes de generar el repo",                                          status: "not-started", estimatedHours: 10 },
    { id: "bc-arch-schema",   name: "Definir schema KV de config por tenant: módulos activos, proveedores, colores, template",       status: "not-started", estimatedHours: 4  },
    { id: "bc-arch-topdown",  name: "Flujo top-down: vistas hijas leen config del Constructor al cargar (módulos, proveedores)",     status: "not-started", estimatedHours: 12 },
    { id: "bc-arch-bottomup", name: "Flujo bottom-up: vistas hijas persisten su estado de config de vuelta al KV store",             status: "not-started", estimatedHours: 12 },
    { id: "bc-arch-badges",   name: "Constructor muestra badges reales por módulo: configurado / pendiente / con errores",           status: "not-started", estimatedHours: 8  },
    { id: "bc-arch-progress", name: "Panel de progreso real en Constructor calculado desde estado persistido de cada módulo",        status: "not-started", estimatedHours: 6  },
  ] },
];

type ViewMode = "list" | "kanban" | "stats" | "queue";

interface Props {
  hideHeader?: boolean;
}

export function ChecklistRoadmap({ hideHeader = false }: Props) {
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
  const [modules, setModules] = useState<Module[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showAudit, setShowAudit] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditProgress, setAuditProgress] = useState({ current: 0, total: 0 });
  
  // Mapa de endpoints y tablas por módulo para auditoría
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
      toast.success(`Idea ${estado === 'aprobada' ? 'aprobada' : estado === 'rechazada' ? 'rechazada' : 'convertida a módulo'}`);
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
        // Merge backend → MODULES_DATA → aplica cascade de BUILT_MODULE_IDS
        const merged = MODULES_DATA.map((def) => {
          const saved = savedModules.find((m) => m.id === def.id);
          const base = saved ? { ...def, ...saved, execOrder: saved.execOrder, notas: saved.notas } : def;
          const result = applyBuiltStatus(base);

          // â”€â”€ FIX: para módulos NO en BUILT_MODULE_IDS con status hardcodeado
          //    en MODULES_DATA (ej: logistics-hub = "completed"):
          //    si el SQL tiene "not-started" stale, preservar el status del def.
          if (
            !BUILT_MODULE_IDS.has(def.id) &&
            def.status !== "not-started" &&
            result.status === "not-started"
          ) {
            return applyBuiltStatus({
              ...def,
              ...(saved ?? {}),
              status: def.status,
              submodules: def.submodules,
            });
          }
          return result;
        });
        setModules(merged);

        // â”€â”€ Auto-resync mejorado: detecta TRES casos de desincronización:
        const hasNewModules = MODULES_DATA.some(
          def => !savedModules.find((s) => s.id === def.id)
        );
        const hasDiffStatus = merged.some((m) => {
          const saved = savedModules.find((s) => s.id === m.id);
          return saved && saved.status !== m.status;
        });
        const needsResync = hasNewModules || hasDiffStatus;

        if (needsResync) {
          console.log(
            `[ChecklistRoadmap] Resync necesario → módulos nuevos: ${hasNewModules}, diff status: ${hasDiffStatus}`
          );
          await roadmapApi.saveModulesBulk(merged.map(m => ({
            id: m.id,
            status: m.status,
            priority: m.priority,
            execOrder: m.execOrder,
            estimatedHours: m.estimatedHours,
            notas: m.notas,
          }))).catch(() => {/* silent */});
        }
      } else {
        // SQL vacío → computar desde manifest y guardar en backend
        const fresh = MODULES_DATA.map(applyBuiltStatus);
        setModules(fresh);
        await roadmapApi.saveModulesBulk(fresh.map(m => ({
          id: m.id,
          status: m.status,
          priority: m.priority,
          execOrder: m.execOrder,
          estimatedHours: m.estimatedHours,
          notas: m.notas,
        }))).catch(() => {/* silent */});
      }
    } catch {
      setModules(MODULES_DATA.map(applyBuiltStatus));
    } finally {
      setIsLoading(false);
    }
  };

  // â”€â”€ updateModuleStatus con cascade a submódulos y gestión de execOrder â”€â”€
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

    // Si se quitó de spec-ready, renumerar los que quedan
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

  // â”€â”€ Mover en la cola de ejecución â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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
        toast.warning("âš ï¸ Guardado local (Supabase no conectado)");
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
      toast.success("âœ… Progreso guardado en el servidor");
    } catch {
      toast.warning("âš ï¸ Cambios guardados localmente");
    } finally {
      setIsSaving(false);
    }
  };

  // â”€â”€ Resync forzado: limpia SQL y recomputa desde MODULES_DATA + manifest â”€â”€
  const forceResyncFromManifest = async () => {
    setIsSyncing(true);
    try {
      const fresh = MODULES_DATA.map(applyBuiltStatus);
      setModules(fresh);
      if (projectId) {
        // Primero limpiar el SQL
        await roadmapApi.resetModules().catch(() => {/* silent */});
        // Luego guardar el estado fresco
        try {
          await roadmapApi.saveModulesBulk(fresh.map(m => ({
            id: m.id,
            status: m.status,
            priority: m.priority,
            execOrder: m.execOrder,
            estimatedHours: m.estimatedHours,
            notas: m.notas,
          })));
          toast.success("ðŸ”„ Resincronizado — estadísticas actualizadas desde el manifest");
        } catch {
          toast.warning("âš ï¸ Resync aplicado localmente, backend no respondió");
        }
      } else {
        toast.success("📊 Estadísticas actualizadas desde el manifest");
      }
      setHasUnsavedChanges(false);
    } catch (err) {
      toast.error(`Error en resync: ${err}`);
    } finally {
      setIsSyncing(false);
    }
  };

  // â”€â”€ Expand / Collapse helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

  const expandAllCategories = () =>
    setExpandedCategories(new Set(Object.keys(CATEGORY_INFO)));

  const collapseAllCategories = () =>
    setExpandedCategories(new Set());

  // ── Tasks ────────────────────────────────────────────────────────────────────
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

  // â”€â”€ Auditoría automática â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const runAudit = async () => {
    if (!projectId) {
      toast.warning("âš ï¸ Supabase no conectado");
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
        
        // Ejecutar auditoría completa (incluye tiene_view y tiene_backend)
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
      
      // Recargar módulos para ver los cambios
      await loadModules();
      
      toast.success(`âœ… Auditoría completada — ${modules.length} módulos verificados`);
    } catch (err) {
      console.error("[ChecklistRoadmap] Error en auditoría:", err);
      toast.error("âŒ Error durante la auditoría");
    } finally {
      setIsAuditing(false);
      setAuditProgress({ current: 0, total: 0 });
    }
  };

  // â”€â”€ Stats globales (usa getEffectivePercent para honrar submódulos) â”€â”€â”€â”€â”€â”€â”€â”€
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

  // â”€â”€ Módulos filtrados â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

  // â”€â”€ Agrupado por área â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

  // Cuando hay búsqueda o filtro activo → expandir todo automáticamente
  const effectiveExpanded = useMemo(() => {
    if (searchTerm.trim() || selectedCategory !== "all" || selectedStatus !== "all" || selectedPriority !== "all") {
      return new Set(Object.keys(CATEGORY_INFO));
    }
    return expandedCategories;
  }, [searchTerm, selectedCategory, selectedStatus, selectedPriority, expandedCategories]);

  // â”€â”€ StatusIcon â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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
      {/* â”€â”€ Audit Modal â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <AnimatePresence>
        {showAudit && (
          <AuditPanel modules={modules} onClose={() => setShowAudit(false)} />
        )}
      </AnimatePresence>
      {/* â”€â”€ Header standalone â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
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
              {modules.filter(m => m.status === "spec-ready").length > 0 && (
                <button
                  onClick={() => setViewMode("queue")}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-100 text-violet-700 border border-violet-300 text-sm font-bold hover:bg-violet-200 transition-colors"
                >
                  <ListOrdered className="h-3.5 w-3.5" />
                  {modules.filter(m => m.status === "spec-ready").length} en cola
                </button>
              )}
              {ideasPromovidas.length > 0 && (
                <button
                  onClick={() => setShowIdeasTab(!showIdeasTab)}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-700 border border-orange-300 text-sm font-bold hover:bg-orange-200 transition-colors"
                >
                  <Inbox className="h-3.5 w-3.5" />
                  {ideasPromovidas.length} idea{ideasPromovidas.length !== 1 ? 's' : ''} pendiente{ideasPromovidas.length !== 1 ? 's' : ''}
                </button>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={forceResyncFromManifest}
                disabled={isSyncing}
                title="Resincroniza estadísticas desde el manifest — corrige estados stale del backend"
                className="flex items-center gap-2 px-3 py-2 rounded-lg border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-700 transition-colors text-sm font-medium disabled:opacity-50"
              >
                <RefreshCw className={`h-4 w-4 ${isSyncing ? "animate-spin" : ""}`} />
                {isSyncing ? "Sincronizando..." : "Resync manifest"}
              </button>
              <button
                onClick={() => setShowAudit(true)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 bg-white hover:bg-orange-50 hover:border-[#FF6835]/40 text-gray-600 hover:text-[#FF6835] transition-colors text-sm font-medium"
              >
                <ScanSearch className="h-4 w-4" /> Auditoría
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
                    <RefreshCw className="h-4 w-4" /> Auditar módulos
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
          <p className="text-muted-foreground">Estado completo de todos los módulos de Charlie Marketplace Builder</p>
        </div>
      )}

      {/* â”€â”€ Toolbar (modo embebido) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      {hideHeader && (
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div className="flex items-center gap-3">
            {!hasUnsavedChanges && !isSaving && (
              <span className="text-sm text-green-600 flex items-center gap-1">
                <CheckCircle2 className="h-4 w-4" /> Sincronizado
              </span>
            )}
            {hasUnsavedChanges && (
              <button onClick={saveAllProgress} disabled={isSaving}
                className="px-4 py-2 bg-[#FF6835] text-white rounded-lg hover:bg-[#FF6835]/90 transition-colors flex items-center gap-2 text-sm disabled:opacity-50">
                {isSaving ? <><Loader2 className="h-4 w-4 animate-spin" />Guardando...</> : <><Save className="h-4 w-4" />Guardar Cambios</>}
              </button>
            )}
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
              title="Resincroniza estadísticas desde el manifest — corrige estados stale del backend"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isSyncing ? "animate-spin" : ""}`} />
              {isSyncing ? "Sincronizando..." : "Resync"}
            </button>
            <button
              onClick={() => setShowAudit(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg border border-[#FF6835]/30 bg-orange-50 hover:bg-orange-100 text-[#FF6835] font-semibold transition-colors"
            >
              <ScanSearch className="h-3.5 w-3.5" /> Auditoría
            </button>
            <button
              onClick={runAudit}
              disabled={isAuditing}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold transition-colors disabled:opacity-50"
            >
              {isAuditing ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  {auditProgress.current}/{auditProgress.total}
                </>
              ) : (
                <>
                  <RefreshCw className="h-3.5 w-3.5" /> Auditar
                </>
              )}
            </button>
            <button onClick={expandAllCategories}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-card border border-border rounded-lg hover:bg-accent transition-colors text-muted-foreground">
              <ChevronsUpDown className="h-3.5 w-3.5" /> Expandir todo
            </button>
            <button onClick={collapseAllCategories}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-card border border-border rounded-lg hover:bg-accent transition-colors text-muted-foreground">
              <ChevronsDownUp className="h-3.5 w-3.5" /> Colapsar todo
            </button>
            {([
              { mode: "queue"  as ViewMode, Icon: ListOrdered },
              { mode: "stats"  as ViewMode, Icon: BarChart3   },
              { mode: "list"   as ViewMode, Icon: List        },
              { mode: "kanban" as ViewMode, Icon: Kanban      },
            ] as const).map(({ mode, Icon }) => (
              <button key={mode} onClick={() => setViewMode(mode)}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === mode
                    ? mode === "queue" ? "bg-violet-600 text-white" : "bg-[#FF6835] text-white"
                    : "bg-card text-muted-foreground hover:bg-accent"
                }`}>
                <Icon className="h-5 w-5" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* â”€â”€ Stats Cards â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {/* Progreso Total */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }}
          className="bg-card rounded-xl p-5 border border-border">
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
          className="bg-card rounded-xl p-5 border border-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground">Completados</span>
            <CheckCircle2 className="h-4 w-4 text-[#FF6835]" />
          </div>
          <div className="text-2xl font-bold text-foreground mb-1">
            {stats.completed}/{stats.total}
          </div>
          <div className="text-xs text-muted-foreground mb-2">{stats.completedPercent}% módulos con DB</div>
          {/* Mini breakdown de los 3 estados */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-orange-50 text-orange-700 border border-orange-200">
              ðŸŸ¢ {stats.completed} DB
            </span>
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              ðŸ”µ {stats.uiOnly} UI
            </span>
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-500 border border-gray-200">
              âš« {stats.notStarted} pend.
            </span>
          </div>
        </motion.div>

        {/* UI Lista / En Progreso */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }}
          className="bg-card rounded-xl p-5 border border-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground">UI Lista / En Progreso</span>
            <Monitor className="h-4 w-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-foreground mb-1">{stats.uiOnly}</div>
          <div className="text-xs text-muted-foreground mb-2">vistas construidas sin backend</div>
          {stats.specReady > 0 && (
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-violet-50 text-violet-700 border border-violet-200">
              ðŸŸ£ {stats.specReady} en cola
            </span>
          )}
        </motion.div>

        {/* Horas Restantes */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.24 }}
          className="bg-card rounded-xl p-5 border border-border">
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
      </div>

      {/* â”€â”€ Filters â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <div className="bg-card rounded-xl p-4 border border-border mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input type="text" placeholder="Buscar módulo..." value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6835]" />
          </div>
          <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value as any)}
            className="px-4 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6835]">
            <option value="all">Todas las áreas</option>
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

      {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
          LIST VIEW — agrupado por área, colapsable
      â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
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
                {/* â”€â”€ Cabecera del área â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
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

                  {/* Contenido izquierdo — flex-1 */}
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full text-white whitespace-nowrap flex-shrink-0 ${info.color}`}>
                      {info.label}
                    </span>
                    {allDone && <CheckCircle2 className="h-4 w-4 text-[#FF6835] flex-shrink-0" />}
                  </div>

                  {/* â•â• BLOQUE DERECHO FIJO — idéntico al de módulo â•â• */}
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
                  {/* w-40 espejo de la columna de badges de módulo */}
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
                  {/* Espejo del botón paperclip */}
                  <div className="w-7 flex-shrink-0" />
                  {/* Espacio espejo del chevron de submódulo */}
                  <div className="w-7 flex-shrink-0" />
                </button>

                {/* â”€â”€ Módulos del área â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
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
                            {/* â”€â”€ Fila del módulo â”€â”€ */}
                            <div className="flex items-center gap-2 px-4 py-2.5 hover:bg-accent/20 transition-colors">
                              {/* Selector de estado — w-44 fijo */}
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

                              {/* Nombre + descripción — badges movidos al bloque derecho */}
                              <div className="flex-1 min-w-0">
                                <span className="text-sm font-semibold text-foreground truncate block">{module.name}</span>
                                {module.description && (
                                  <p className="text-xs text-muted-foreground mt-0.5 truncate">{module.description}</p>
                                )}
                              </div>

                              {/* â•â• BLOQUE DERECHO FIJO â•â• */}
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

                              {/* â”€â”€ Badges DESPUÉS de la barra â”€â”€ */}
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

                              {/* Botón adjuntar archivos */}
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
                              {/* Chevron submódulos */}
                              <div className="w-7 flex-shrink-0 flex justify-center">
                                {module.submodules ? (
                                  <button
                                    onClick={() => toggleExpand(module.id)}
                                    className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                                    title={expandedModules.has(module.id) ? "Ocultar submódulos" : "Ver submódulos"}
                                  >
                                    {expandedModules.has(module.id)
                                      ? <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                      : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
                                  </button>
                                ) : null}
                              </div>
                            </div>

                            {/* â”€â”€ Submódulos expandibles â”€â”€ */}
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
                                          {/* Icono de estado — w-44 igual al selector del padre */}
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
                                          {/* â•â• BLOQUE DERECHO FIJO (espejo del padre) â•â• */}
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

                            {/* â”€â”€ Tasks expandibles â”€â”€ */}
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
                                                  {task.blocker && <span className="text-red-500 text-xs">🚫</span>}
                                                  <button onClick={() => handleDeleteTask(task.id, module.id)} className="text-red-500 hover:text-red-700">×</button>
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
                                            {task.blocker && <span className="text-red-500 text-xs">🚫</span>}
                                            <button onClick={() => handleDeleteTask(task.id, module.id)} className="text-red-500 hover:text-red-700">×</button>
                                          </div>
                                        ))}
                                      </div>
                                    ) : (
                                      <div className="text-xs text-muted-foreground italic">No hay tasks aún</div>
                                    )}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>

                            {/* â”€â”€ Panel de archivos adjuntos â”€â”€ */}
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

      {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
          KANBAN VIEW
      â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
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
                    <p className="text-xs text-muted-foreground text-center py-4">Sin módulos</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
          QUEUE VIEW — Cola de ejecución
      â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
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
                <h2 className="text-base font-bold text-violet-900">Cola de Ejecución</h2>
                <p className="text-xs text-violet-600 mt-0.5">
                  Módulos con definición completa — ordenados por prioridad de implementación.
                  Cambiá el estado de cualquier módulo a <strong>"Definición Lista"</strong> para agregarlo.
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
                <p className="text-sm font-semibold text-muted-foreground">Cola vacía</p>
                <p className="text-xs text-muted-foreground mt-1 max-w-xs mx-auto">
                  Andá a la vista <strong>Lista</strong>, buscá un módulo y cambiá su estado a
                  <span className="font-semibold text-violet-600"> "Definición Lista"</span> para agregarlo aquí.
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
                      {/* Número */}
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
                        <p className="text-sm font-bold text-foreground">{mod.estimatedHours ?? "—"}h</p>
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

                      {/* Botón iniciar */}
                      <button
                        onClick={() => updateModuleStatus(mod.id, "progress-10")}
                        className="flex items-center gap-1.5 px-3 py-2 bg-[#FF6835] text-white rounded-lg text-xs font-bold hover:bg-[#FF6835]/90 transition-colors flex-shrink-0 shadow-sm"
                        title="Iniciar implementación (pasa a En Progreso 10%)"
                      >
                        <Play className="h-3 w-3" /> Iniciar
                      </button>
                    </div>
                  </motion.div>
                ))}

                {/* Footer resumen */}
                <div className="mt-4 p-4 rounded-xl bg-violet-50 border border-violet-200 flex items-center justify-between flex-wrap gap-2">
                  <div className="text-sm text-violet-700 font-medium">
                    <span className="font-black">{queue.length}</span> módulo{queue.length !== 1 ? "s" : ""} en cola
                    {" Â· "}
                    <span className="font-black">
                      {queue.reduce((s, m) => s + (m.estimatedHours ?? 0), 0)}h
                    </span> estimadas totales
                  </div>
                  <span className="text-xs text-violet-500 italic">
                    â†• Reordenar Â· â–¶ Iniciar cambia el estado a "En Progreso 10%"
                  </span>
                </div>
              </div>
            )}
          </div>
        );
      })()}

      {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
          STATS VIEW
      â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
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

