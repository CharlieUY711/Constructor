import { BUILT_MODULE_IDS } from "../../utils/moduleRegistry";
import { useState, useMemo, useEffect } from "react";
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
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { projectId, publicAnonKey } from "../../../utils/supabase/info";

type ModuleStatus =
  | "not-started"
  | "progress-10"
  | "progress-50"
  | "progress-80"
  | "completed";
type ModulePriority = "critical" | "high" | "medium" | "low";
type ModuleCategory =
  | "erp"
  | "crm"
  | "projects"
  | "logistics"
  | "marketing"
  | "pos"
  | "tools"
  | "enterprise"
  | "territory"
  | "verification"
  | "marketplace"
  | "integrations"
  | "admin";

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
  submodules?: SubModule[];
  estimatedHours?: number;
  dependencies?: string[];
}

const MODULES_DATA: Module[] = [
  // ==================== ERP ====================
  { id: "erp-sales", name: "Ventas", category: "erp", status: "completed", priority: "critical", description: "Módulo de ventas con cotizaciones y pedidos", estimatedHours: 40, submodules: [ { id: "erp-sales-quotations", name: "Cotizaciones/Presupuestos", status: "completed", estimatedHours: 12 }, { id: "erp-sales-orders", name: "Pedidos de Venta", status: "completed", estimatedHours: 16 }, { id: "erp-sales-commissions", name: "Comisiones", status: "not-started", estimatedHours: 8 }, { id: "erp-sales-credit-notes", name: "Notas de Crédito/Débito", status: "not-started", estimatedHours: 4 } ] },
  { id: "erp-purchasing", name: "Compras", category: "erp", status: "completed", priority: "high", description: "Gestión de compras y proveedores", estimatedHours: 32, submodules: [ { id: "erp-purchasing-suppliers", name: "Gestión de Proveedores", status: "completed", estimatedHours: 8 }, { id: "erp-purchasing-requests", name: "Solicitudes de Compra", status: "completed", estimatedHours: 6 }, { id: "erp-purchasing-orders", name: "Órdenes de Compra", status: "completed", estimatedHours: 12 }, { id: "erp-purchasing-receipts", name: "Recepción de Mercadería", status: "completed", estimatedHours: 6 } ] },
  { id: "erp-inventory", name: "Inventario", category: "erp", status: "progress-50", priority: "critical", description: "Control de stock y movimientos", estimatedHours: 48, submodules: [ { id: "erp-inventory-products", name: "Gestión de Productos", status: "completed", estimatedHours: 12 }, { id: "erp-inventory-stock", name: "Control de Stock", status: "completed", estimatedHours: 10 }, { id: "erp-inventory-movements", name: "Movimientos de Inventario", status: "completed", estimatedHours: 8 }, { id: "erp-inventory-transfers", name: "Transferencias entre Depósitos", status: "not-started", estimatedHours: 10 }, { id: "erp-inventory-adjustments", name: "Ajustes de Stock", status: "completed", estimatedHours: 4 }, { id: "erp-inventory-lots", name: "Lotes y Números de Serie", status: "not-started", estimatedHours: 4 } ] },
  { id: "erp-accounting", name: "Contabilidad", category: "erp", status: "not-started", priority: "high", description: "Módulo contable completo", estimatedHours: 60, submodules: [ { id: "erp-accounting-chart", name: "Plan de Cuentas", status: "not-started", estimatedHours: 8 }, { id: "erp-accounting-entries", name: "Asientos Contables", status: "not-started", estimatedHours: 12 }, { id: "erp-accounting-receivable", name: "Cuentas por Cobrar", status: "not-started", estimatedHours: 10 }, { id: "erp-accounting-payable", name: "Cuentas por Pagar", status: "not-started", estimatedHours: 10 }, { id: "erp-accounting-banks", name: "Bancos y Cajas", status: "not-started", estimatedHours: 8 }, { id: "erp-accounting-taxes", name: "Impuestos", status: "not-started", estimatedHours: 8 }, { id: "erp-accounting-reports", name: "Reportes Financieros", status: "not-started", estimatedHours: 4 } ] },
  { id: "erp-invoicing", name: "Facturación", category: "erp", status: "completed", priority: "critical", description: "Facturación electrónica multi-país", estimatedHours: 40, submodules: [ { id: "erp-invoicing-create", name: "Creación de Facturas", status: "completed", estimatedHours: 12 }, { id: "erp-invoicing-credit-notes", name: "Notas de Crédito", status: "completed", estimatedHours: 8 }, { id: "erp-invoicing-sequencing", name: "Numeración Automática", status: "completed", estimatedHours: 6 }, { id: "erp-invoicing-pdf", name: "Generación PDF", status: "not-started", estimatedHours: 8 }, { id: "erp-invoicing-email", name: "Envío por Email", status: "not-started", estimatedHours: 6 } ] },
  { id: "erp-hr", name: "RRHH", category: "erp", status: "not-started", priority: "medium", description: "Gestión de recursos humanos", estimatedHours: 50, submodules: [ { id: "erp-hr-employees", name: "Gestión de Empleados", status: "not-started", estimatedHours: 12 }, { id: "erp-hr-attendance", name: "Asistencia y Horarios", status: "not-started", estimatedHours: 10 }, { id: "erp-hr-payroll", name: "Nómina", status: "not-started", estimatedHours: 16 }, { id: "erp-hr-leaves", name: "Vacaciones y Ausencias", status: "not-started", estimatedHours: 8 }, { id: "erp-hr-performance", name: "Evaluaciones", status: "not-started", estimatedHours: 4 } ] },
  { id: "erp-manufacturing", name: "Producción", category: "erp", status: "not-started", priority: "low", description: "Órdenes de producción y MRP", estimatedHours: 40, submodules: [ { id: "erp-mfg-bom", name: "Lista de Materiales (BOM)", status: "not-started", estimatedHours: 10 }, { id: "erp-mfg-orders", name: "Órdenes de Producción", status: "not-started", estimatedHours: 12 }, { id: "erp-mfg-workcenters", name: "Centros de Trabajo", status: "not-started", estimatedHours: 8 }, { id: "erp-mfg-quality", name: "Control de Calidad", status: "not-started", estimatedHours: 6 }, { id: "erp-mfg-mrp", name: "Planificación MRP", status: "not-started", estimatedHours: 4 } ] },
  { id: "erp-reports", name: "Reportes y Analytics", category: "erp", status: "not-started", priority: "high", description: "Dashboards y BI", estimatedHours: 32, submodules: [ { id: "erp-reports-sales", name: "Reportes de Ventas", status: "not-started", estimatedHours: 8 }, { id: "erp-reports-inventory", name: "Reportes de Inventario", status: "not-started", estimatedHours: 8 }, { id: "erp-reports-financial", name: "Reportes Financieros", status: "not-started", estimatedHours: 10 }, { id: "erp-reports-custom", name: "Reportes Personalizados", status: "not-started", estimatedHours: 6 } ] },
  { id: "pos-system", name: "POS (Punto de Venta)", category: "pos", status: "completed", priority: "critical", description: "Sistema de punto de venta para operaciones presenciales", estimatedHours: 48, submodules: [ { id: "pos-interface", name: "Interfaz de Venta", status: "completed", estimatedHours: 16 }, { id: "pos-payments", name: "Gestión de Pagos", status: "completed", estimatedHours: 12 }, { id: "pos-cash-register", name: "Apertura/Cierre de Caja", status: "completed", estimatedHours: 8 }, { id: "pos-tickets", name: "Impresión de Tickets", status: "completed", estimatedHours: 6 }, { id: "pos-offline", name: "Modo Offline", status: "not-started", estimatedHours: 6 } ] },
  // ==================== CRM ====================
  { id: "crm-contacts", name: "Contactos", category: "crm", status: "not-started", priority: "high", description: "Gestión de clientes y leads", estimatedHours: 24, submodules: [ { id: "crm-contacts-management", name: "Gestión de Contactos", status: "not-started", estimatedHours: 10 }, { id: "crm-contacts-segmentation", name: "Segmentación", status: "not-started", estimatedHours: 6 }, { id: "crm-contacts-import", name: "Importación Masiva", status: "not-started", estimatedHours: 4 }, { id: "crm-contacts-merge", name: "Fusión de Duplicados", status: "not-started", estimatedHours: 4 } ] },
  { id: "crm-opportunities", name: "Oportunidades", category: "crm", status: "not-started", priority: "high", description: "Pipeline de ventas", estimatedHours: 20, submodules: [ { id: "crm-opp-pipeline", name: "Pipeline Visual", status: "not-started", estimatedHours: 8 }, { id: "crm-opp-forecasting", name: "Pronóstico de Ventas", status: "not-started", estimatedHours: 6 }, { id: "crm-opp-automation", name: "Automatizaciones", status: "not-started", estimatedHours: 6 } ] },
  { id: "crm-activities", name: "Actividades", category: "crm", status: "not-started", priority: "medium", description: "Tareas, llamadas y reuniones", estimatedHours: 16, submodules: [ { id: "crm-act-tasks", name: "Tareas", status: "not-started", estimatedHours: 6 }, { id: "crm-act-calls", name: "Registro de Llamadas", status: "not-started", estimatedHours: 5 }, { id: "crm-act-meetings", name: "Reuniones", status: "not-started", estimatedHours: 5 } ] },
  // ==================== PROYECTOS ====================
  { id: "projects-management", name: "Gestión de Proyectos", category: "projects", status: "not-started", priority: "medium", description: "Proyectos y Gantt", estimatedHours: 32, submodules: [ { id: "projects-mgmt-projects", name: "Proyectos", status: "not-started", estimatedHours: 10 }, { id: "projects-mgmt-gantt", name: "Diagrama de Gantt", status: "not-started", estimatedHours: 12 }, { id: "projects-mgmt-milestones", name: "Hitos", status: "not-started", estimatedHours: 6 }, { id: "projects-mgmt-resources", name: "Recursos", status: "not-started", estimatedHours: 4 } ] },
  { id: "projects-tasks", name: "Tareas", category: "projects", status: "not-started", priority: "medium", description: "Kanban y dependencias", estimatedHours: 24, submodules: [ { id: "projects-tasks-kanban", name: "Tablero Kanban", status: "not-started", estimatedHours: 10 }, { id: "projects-tasks-deps", name: "Dependencias", status: "not-started", estimatedHours: 8 }, { id: "projects-tasks-subtasks", name: "Subtareas", status: "not-started", estimatedHours: 6 } ] },
  { id: "projects-time", name: "Time Tracking", category: "projects", status: "not-started", priority: "low", description: "Registro de horas", estimatedHours: 16, submodules: [ { id: "projects-time-tracking", name: "Registro de Tiempo", status: "not-started", estimatedHours: 8 }, { id: "projects-time-reports", name: "Reportes de Tiempo", status: "not-started", estimatedHours: 8 } ] },
  // ==================== LOGÍSTICA ====================
  { id: "logistics-fulfillment", name: "Fulfillment", category: "logistics", status: "not-started", priority: "high", description: "Ejecución de pedidos", estimatedHours: 20, submodules: [ { id: "logistics-full-orders", name: "Procesamiento de Órdenes", status: "not-started", estimatedHours: 10 }, { id: "logistics-full-batches", name: "Lotes de Pedidos", status: "not-started", estimatedHours: 6 }, { id: "logistics-full-priority", name: "Priorización", status: "not-started", estimatedHours: 4 } ] },
  { id: "logistics-picking", name: "Picking & Packing", category: "logistics", status: "not-started", priority: "high", description: "Preparación de envíos", estimatedHours: 16, submodules: [ { id: "logistics-pick-wave", name: "Wave Picking", status: "not-started", estimatedHours: 8 }, { id: "logistics-pick-packing", name: "Empaque", status: "not-started", estimatedHours: 8 } ] },
  { id: "logistics-shipping", name: "Envíos", category: "logistics", status: "not-started", priority: "high", description: "Gestión de transportistas", estimatedHours: 24, submodules: [ { id: "logistics-ship-carriers", name: "Transportistas", status: "not-started", estimatedHours: 10 }, { id: "logistics-ship-labels", name: "Etiquetas", status: "not-started", estimatedHours: 8 }, { id: "logistics-ship-rates", name: "Cotización de Tarifas", status: "not-started", estimatedHours: 6 } ] },
  { id: "logistics-tracking", name: "Tracking", category: "logistics", status: "not-started", priority: "medium", description: "Seguimiento en tiempo real", estimatedHours: 12 },
  { id: "logistics-routes", name: "Rutas de Entrega", category: "logistics", status: "not-started", priority: "low", description: "Optimización de rutas", estimatedHours: 20 },
  // ==================== MARKETING ====================
  { id: "marketing-campaigns", name: "Campañas", category: "marketing", status: "not-started", priority: "medium", description: "Gestión de campañas de marketing", estimatedHours: 20 },
  { id: "marketing-email", name: "Email Marketing", category: "marketing", status: "not-started", priority: "high", description: "Campañas de email", estimatedHours: 24 },
  { id: "marketing-social", name: "Redes Sociales", category: "marketing", status: "not-started", priority: "medium", description: "Gestión de redes sociales", estimatedHours: 28 },
  { id: "marketing-seo", name: "SEO", category: "marketing", status: "not-started", priority: "medium", description: "Optimización SEO", estimatedHours: 20 },
  { id: "marketing-email-bulk", name: "Email Bulk (Mailing)", category: "marketing", status: "progress-50", priority: "medium", description: "Envío masivo de emails", estimatedHours: 16 },
  { id: "marketing-sms", name: "SMS Marketing", category: "marketing", status: "progress-50", priority: "medium", description: "Envío masivo de SMS", estimatedHours: 12 },
  { id: "marketing-loyalty", name: "Loyalty Program", category: "marketing", status: "not-started", priority: "low", description: "Programa de fidelización", estimatedHours: 32 },
  // ==================== HERRAMIENTAS ====================
  { id: "tools-media", name: "Gestión de Imágenes", category: "tools", status: "completed", priority: "critical", description: "Media Library completa", estimatedHours: 0 },
  { id: "tools-documents", name: "Generación de Documentos", category: "tools", status: "progress-50", priority: "high", description: "PDFs customizables", estimatedHours: 12 },
  { id: "tools-labels", name: "Generación de Etiquetas", category: "tools", status: "not-started", priority: "medium", description: "Etiquetas y códigos de barras", estimatedHours: 16 },
  { id: "tools-qr", name: "Generación de QR", category: "tools", status: "not-started", priority: "medium", description: "QR codes dinámicos", estimatedHours: 8 },
  { id: "tools-ocr", name: "OCR", category: "tools", status: "not-started", priority: "low", description: "Reconocimiento de texto", estimatedHours: 24 },
  { id: "tools-printing", name: "Sistema de Impresión", category: "tools", status: "not-started", priority: "medium", description: "Gestión de impresoras", estimatedHours: 16 },
  { id: "tools-docs", name: "Biblioteca/Documentación", category: "tools", status: "not-started", priority: "low", description: "Manuales y tutoriales", estimatedHours: 20 },
  // ==================== ENTERPRISE ====================
  { id: "enterprise-multi-entity", name: "Multi-Entity Management", category: "enterprise", status: "not-started", priority: "high", description: "Múltiples entidades comerciales", estimatedHours: 40 },
  { id: "enterprise-multi-warehouse", name: "Multi-Warehouse System", category: "enterprise", status: "not-started", priority: "high", description: "Múltiples depósitos", estimatedHours: 48 },
  { id: "enterprise-dropshipping", name: "Dropshipping & 3PL", category: "enterprise", status: "not-started", priority: "medium", description: "Stock de terceros", estimatedHours: 32 },
  { id: "enterprise-zones", name: "Zone & Team Management", category: "enterprise", status: "not-started", priority: "medium", description: "Segmentación geográfica", estimatedHours: 24 },
  { id: "enterprise-smart-quotation", name: "Smart Quotation System", category: "enterprise", status: "not-started", priority: "high", description: "Presupuestos inteligentes", estimatedHours: 32 },
  { id: "enterprise-workspace", name: "Unified Workspace", category: "enterprise", status: "progress-10", priority: "high", description: "Centro de comunicaciones", estimatedHours: 36 },
  { id: "enterprise-notifications", name: "Intelligent Notifications", category: "enterprise", status: "not-started", priority: "medium", description: "Motor de notificaciones", estimatedHours: 24 },
  { id: "enterprise-supplier-portal", name: "Supplier Portal", category: "enterprise", status: "not-started", priority: "low", description: "Portal para proveedores", estimatedHours: 40 },
  { id: "enterprise-analytics", name: "Advanced Analytics", category: "enterprise", status: "not-started", priority: "medium", description: "BI y predicciones con IA", estimatedHours: 48 },
  // ==================== TERRITORIO ====================
  { id: "territory-config", name: "Country Configuration", category: "territory", status: "completed", priority: "critical", description: "6 países configurados", estimatedHours: 0 },
  { id: "territory-selector", name: "Country Selector", category: "territory", status: "completed", priority: "critical", description: "Selector de país", estimatedHours: 0 },
  { id: "territory-localization", name: "Localization", category: "territory", status: "progress-80", priority: "high", description: "Multi-idioma y formatos", estimatedHours: 4 },
  // ==================== VERIFICACIÓN ====================
  { id: "verification-age", name: "Age Verification", category: "verification", status: "completed", priority: "critical", description: "Verificación de edad", estimatedHours: 0 },
  { id: "verification-identity", name: "Identity Verification (MetaMap)", category: "verification", status: "completed", priority: "critical", description: "KYC completo", estimatedHours: 0 },
  { id: "verification-guards", name: "Department Guards", category: "verification", status: "completed", priority: "high", description: "Control de acceso", estimatedHours: 0 },
  // ==================== MARKETPLACE ====================
  { id: "marketplace-secondhand", name: "SecondHand Marketplace", category: "marketplace", status: "completed", priority: "medium", description: "Marketplace de usados", estimatedHours: 0 },
  { id: "marketplace-secondhand-admin", name: "SecondHand Admin", category: "marketplace", status: "completed", priority: "medium", description: "Moderación", estimatedHours: 0 },
  { id: "marketplace-storefront", name: "Portal del Cliente (Storefront)", category: "marketplace", status: "not-started", priority: "critical", description: "Frontend público: navbar, catálogo, carrito, checkout, cuenta", estimatedHours: 60, submodules: [ { id: "storefront-home", name: "Home + Hero slider", status: "not-started", estimatedHours: 8 }, { id: "storefront-catalog", name: "Catálogo + Filtros", status: "not-started", estimatedHours: 10 }, { id: "storefront-product", name: "Detalle de Producto", status: "not-started", estimatedHours: 8 }, { id: "storefront-cart", name: "Carrito + Cupones", status: "not-started", estimatedHours: 6 }, { id: "storefront-checkout", name: "Checkout multi-paso (MP/Stripe)", status: "not-started", estimatedHours: 14 }, { id: "storefront-sh-browse", name: "Second Hand Browse", status: "not-started", estimatedHours: 8 }, { id: "storefront-sh-publish", name: "Publicar artículo SH", status: "not-started", estimatedHours: 6 } ] },
  // ==================== INTEGRACIONES ====================
  { id: "integrations-mercadolibre", name: "Mercado Libre", category: "integrations", status: "completed", priority: "critical", description: "Sincronización completa", estimatedHours: 0 },
  { id: "integrations-mercadopago", name: "Mercado Pago", category: "integrations", status: "completed", priority: "critical", description: "Pagos multi-país", estimatedHours: 0 },
  { id: "integrations-paypal", name: "PayPal", category: "integrations", status: "progress-10", priority: "high", description: "Frontend listo, falta backend", estimatedHours: 12 },
  { id: "integrations-plexo", name: "Plexo (Uruguay)", category: "integrations", status: "progress-10", priority: "high", description: "Frontend listo, falta backend", estimatedHours: 12 },
  { id: "integrations-stripe", name: "Stripe", category: "integrations", status: "not-started", priority: "medium", description: "Pagos internacionales", estimatedHours: 16 },
  { id: "integrations-resend", name: "Resend (Email)", category: "integrations", status: "completed", priority: "high", description: "Email transaccional", estimatedHours: 0 },
  { id: "integrations-twilio", name: "Twilio (SMS/WhatsApp)", category: "integrations", status: "progress-50", priority: "high", description: "SMS básico funcionando", estimatedHours: 8 },
  { id: "integrations-whatsapp-commerce", name: "WhatsApp Business API", category: "integrations", status: "not-started", priority: "critical", description: "Catálogo y ventas", estimatedHours: 40 },
  { id: "integrations-facebook-shop", name: "Facebook Shop", category: "integrations", status: "not-started", priority: "critical", description: "Sincronización catálogo", estimatedHours: 32 },
  { id: "integrations-instagram-shopping", name: "Instagram Shopping", category: "integrations", status: "not-started", priority: "critical", description: "Etiquetado de productos", estimatedHours: 24 },
  { id: "integrations-google-shopping", name: "Google Shopping", category: "integrations", status: "not-started", priority: "high", description: "Merchant Center", estimatedHours: 32 },
  { id: "integrations-tiktok", name: "TikTok Shop", category: "integrations", status: "not-started", priority: "medium", description: "TikTok commerce", estimatedHours: 32 },
  { id: "integrations-amazon", name: "Amazon Marketplace", category: "integrations", status: "not-started", priority: "low", description: "FBA integration", estimatedHours: 48 },
  { id: "integrations-fixed", name: "Fixed (Argentina)", category: "integrations", status: "completed", priority: "high", description: "Facturación AFIP", estimatedHours: 0 },
  { id: "integrations-replicate", name: "Replicate (IA)", category: "integrations", status: "completed", priority: "low", description: "Generación de imágenes", estimatedHours: 0 },
  { id: "integrations-removebg", name: "Remove.bg", category: "integrations", status: "completed", priority: "low", description: "Remoción de fondos", estimatedHours: 0 },
  { id: "integrations-shipping", name: "Transportistas", category: "integrations", status: "not-started", priority: "high", description: "Andreani, FedEx, etc.", estimatedHours: 40 },
  // ==================== ADMIN ====================
  { id: "admin-settings", name: "Configuración General", category: "admin", status: "progress-50", priority: "high", description: "Settings del sistema", estimatedHours: 8 },
  { id: "admin-users", name: "Usuarios y Permisos", category: "admin", status: "progress-80", priority: "critical", description: "Roles y accesos", estimatedHours: 4 },
  { id: "admin-workflows", name: "Workflows", category: "admin", status: "not-started", priority: "medium", description: "Aprobaciones multinivel", estimatedHours: 32 },
  { id: "admin-audit", name: "Auditoría", category: "admin", status: "not-started", priority: "high", description: "Logs completos", estimatedHours: 16 },
  { id: "admin-backup", name: "Backup y Recuperación", category: "admin", status: "not-started", priority: "high", description: "Respaldos automáticos", estimatedHours: 20 },
];

const CATEGORY_INFO: Record<ModuleCategory, { label: string; color: string; icon: any }> = {
  erp:          { label: "ERP",            color: "bg-blue-500",   icon: Package },
  crm:          { label: "CRM",            color: "bg-purple-500", icon: Package },
  projects:     { label: "Proyectos",      color: "bg-green-500",  icon: Package },
  logistics:    { label: "Logística",      color: "bg-orange-500", icon: Package },
  marketing:    { label: "Marketing",      color: "bg-pink-500",   icon: Package },
  pos:          { label: "POS",            color: "bg-yellow-500", icon: Package },
  tools:        { label: "Herramientas",   color: "bg-gray-500",   icon: Package },
  enterprise:   { label: "Enterprise",     color: "bg-indigo-500", icon: Zap },
  territory:    { label: "Multi-Territorio", color: "bg-cyan-500", icon: Package },
  verification: { label: "Verificación",   color: "bg-red-500",    icon: Package },
  marketplace:  { label: "Marketplace",    color: "bg-teal-500",   icon: Package },
  integrations: { label: "Integraciones",  color: "bg-violet-500", icon: Package },
  admin:        { label: "Admin",          color: "bg-slate-500",  icon: Package },
};

const STATUS_INFO: Record<ModuleStatus, { label: string; color: string; icon: any; percent: number }> = {
  "not-started":  { label: "No Iniciado",         color: "text-gray-400",   icon: Circle,       percent: 0   },
  "progress-10":  { label: "En Progreso (10%)",   color: "text-red-500",    icon: AlertCircle,  percent: 10  },
  "progress-50":  { label: "En Progreso (50%)",   color: "text-yellow-500", icon: Clock,        percent: 50  },
  "progress-80":  { label: "En Progreso (80%)",   color: "text-blue-500",   icon: TrendingUp,   percent: 80  },
  "completed":    { label: "Completado",           color: "text-[#FF6835]",  icon: CheckCircle2, percent: 100 },
};

const getProgressBarColor = (percent: number): string => {
  if (percent === 0)    return "bg-gray-300";
  if (percent <= 10)    return "bg-red-500";
  if (percent <= 40)    return "bg-orange-500";
  if (percent <= 70)    return "bg-yellow-500";
  if (percent < 100)    return "bg-blue-500";
  return "bg-green-500";
};

const PRIORITY_INFO: Record<ModulePriority, { label: string; color: string }> = {
  critical: { label: "Crítica", color: "bg-red-100 text-red-700 border-red-200" },
  high:     { label: "Alta",    color: "bg-orange-100 text-orange-700 border-orange-200" },
  medium:   { label: "Media",   color: "bg-yellow-100 text-yellow-700 border-yellow-200" },
  low:      { label: "Baja",    color: "bg-gray-100 text-gray-700 border-gray-200" },
};

type ViewMode = "list" | "kanban" | "stats";

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
  const [modules, setModules] = useState<Module[]>(MODULES_DATA);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const API_URL = projectId
    ? `https://${projectId}.supabase.co/functions/v1/make-server-0dd48dc4`
    : null;

  useEffect(() => {
    if (!API_URL) {
      // Auto-override: módulos en el registry → completed automáticamente
      const autoApplied = MODULES_DATA.map(m =>
        BUILT_MODULE_IDS.has(m.id) ? { ...m, status: 'completed' as ModuleStatus } : m
      );
      setModules(autoApplied);
      setIsLoading(false);
      return;
    }
    loadModules();
  }, []);

  const loadModules = async () => {
    if (!API_URL) return;
    try {
      setIsLoading(true);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      const response = await fetch(`${API_URL}/roadmap/modules`, {
        headers: { Authorization: `Bearer ${publicAnonKey}` },
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      if (response.ok) {
        const data = await response.json();
        if (data.modules && data.modules.length > 0) {
          const merged = MODULES_DATA.map((def) => {
            const saved = data.modules.find((m: Module) => m.id === def.id);
            const base = saved ? { ...def, ...saved } : def;
            // Registry siempre tiene prioridad sobre lo guardado en BD
            return BUILT_MODULE_IDS.has(base.id)
              ? { ...base, status: 'completed' as ModuleStatus }
              : base;
          });
          setModules(merged);
        } else {
          const autoApplied = MODULES_DATA.map(m =>
            BUILT_MODULE_IDS.has(m.id) ? { ...m, status: 'completed' as ModuleStatus } : m
          );
          setModules(autoApplied);
        }
      } else {
        const autoApplied = MODULES_DATA.map(m =>
          BUILT_MODULE_IDS.has(m.id) ? { ...m, status: 'completed' as ModuleStatus } : m
        );
        setModules(autoApplied);
      }
    } catch {
      const autoApplied = MODULES_DATA.map(m =>
        BUILT_MODULE_IDS.has(m.id) ? { ...m, status: 'completed' as ModuleStatus } : m
      );
      setModules(autoApplied);
    } finally {
      setIsLoading(false);
    }
  };

  const updateModuleStatus = async (moduleId: string, newStatus: ModuleStatus) => {
    const updated = modules.map((m) => (m.id === moduleId ? { ...m, status: newStatus } : m));
    setModules(updated);
    setHasUnsavedChanges(true);
    if (!API_URL) return;
    try {
      const controller = new AbortController();
      setTimeout(() => controller.abort(), 5000);
      const mod = updated.find((m) => m.id === moduleId);
      if (!mod) return;
      const res = await fetch(`${API_URL}/roadmap/modules/${moduleId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${publicAnonKey}` },
        body: JSON.stringify(mod),
        signal: controller.signal,
      });
      if (res.ok) setHasUnsavedChanges(false);
    } catch { /* silent */ }
  };

  const saveAllProgress = async () => {
    try {
      setIsSaving(true);
      if (!API_URL) {
        toast.warning("⚠️ Guardado local (Supabase no conectado)");
        return;
      }
      const controller = new AbortController();
      setTimeout(() => controller.abort(), 5000);
      const res = await fetch(`${API_URL}/roadmap/modules-bulk`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${publicAnonKey}` },
        body: JSON.stringify({ modules }),
        signal: controller.signal,
      });
      if (res.ok) {
        setHasUnsavedChanges(false);
        toast.success("✅ Progreso guardado en el servidor");
      } else {
        toast.warning("⚠️ No se pudo conectar con el servidor");
      }
    } catch {
      toast.warning("⚠️ Cambios guardados localmente");
    } finally {
      setIsSaving(false);
    }
  };

  const stats = useMemo(() => {
    const total = modules.length;
    const completed = modules.filter((m) => m.status === "completed").length;
    const inProgress = modules.filter((m) => m.status.startsWith("progress")).length;
    const totalHours = modules.reduce((s, m) => s + (m.estimatedHours || 0), 0);
    const completedHours = modules.filter((m) => m.status === "completed").reduce((s, m) => s + (m.estimatedHours || 0), 0);
    const progressPercent = modules.reduce((sum, m) => {
      const pct = STATUS_INFO[m.status].percent;
      const w = (m.estimatedHours || 1) / Math.max(totalHours, 1);
      return sum + pct * w;
    }, 0);
    return { total, completed, inProgress, completedPercent: Math.round((completed / total) * 100), progressPercent: Math.round(progressPercent), totalHours, completedHours, remainingHours: totalHours - completedHours };
  }, [modules]);

  const filteredModules = useMemo(() => {
    return modules.filter((m) => {
      if (searchTerm && !m.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      if (selectedCategory !== "all" && m.category !== selectedCategory) return false;
      if (selectedStatus !== "all" && m.status !== selectedStatus) return false;
      if (selectedPriority !== "all" && m.priority !== selectedPriority) return false;
      return true;
    });
  }, [modules, searchTerm, selectedCategory, selectedStatus, selectedPriority]);

  const toggleExpand = (id: string) => {
    const ne = new Set(expandedModules);
    ne.has(id) ? ne.delete(id) : ne.add(id);
    setExpandedModules(ne);
  };

  const StatusIcon = ({ status }: { status: ModuleStatus }) => {
    const Icon = STATUS_INFO[status].icon;
    return <Icon className={`h-5 w-5 ${STATUS_INFO[status].color}`} />;
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
      {/* Header (optional) */}
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
            </div>
            <div className="flex gap-2">
              {hasUnsavedChanges && (
                <button onClick={saveAllProgress} disabled={isSaving} className="px-4 py-2 bg-[#FF6835] text-white rounded-lg hover:bg-[#FF6835]/90 transition-colors flex items-center gap-2 disabled:opacity-50">
                  {isSaving ? <><Loader2 className="h-4 w-4 animate-spin" />Guardando...</> : <><Save className="h-4 w-4" />Guardar</>}
                </button>
              )}
            </div>
          </div>
          <p className="text-muted-foreground">Estado completo de todos los módulos de Charlie</p>
        </div>
      )}

      {/* View toggle (always visible) */}
      {hideHeader && (
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            {!hasUnsavedChanges && !isSaving && (
              <span className="text-sm text-green-600 flex items-center gap-1">
                <CheckCircle2 className="h-4 w-4" /> Sincronizado
              </span>
            )}
            {hasUnsavedChanges && (
              <button onClick={saveAllProgress} disabled={isSaving} className="px-4 py-2 bg-[#FF6835] text-white rounded-lg hover:bg-[#FF6835]/90 transition-colors flex items-center gap-2 text-sm disabled:opacity-50">
                {isSaving ? <><Loader2 className="h-4 w-4 animate-spin" />Guardando...</> : <><Save className="h-4 w-4" />Guardar Cambios</>}
              </button>
            )}
          </div>
          <div className="flex gap-2">
            {[{ mode: "stats" as ViewMode, Icon: BarChart3 }, { mode: "list" as ViewMode, Icon: List }, { mode: "kanban" as ViewMode, Icon: Kanban }].map(({ mode, Icon }) => (
              <button key={mode} onClick={() => setViewMode(mode)} className={`p-2 rounded-lg transition-colors ${viewMode === mode ? "bg-[#FF6835] text-white" : "bg-card text-muted-foreground hover:bg-accent"}`}>
                <Icon className="h-5 w-5" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Progreso Total", value: `${stats.progressPercent}%`, sub: null, Icon: TrendingUp, progress: stats.progressPercent },
          { label: "Completados", value: `${stats.completed}/${stats.total}`, sub: `${stats.completedPercent}% módulos`, Icon: CheckCircle2, progress: null },
          { label: "En Progreso", value: `${stats.inProgress}`, sub: "módulos activos", Icon: Clock, progress: null },
          { label: "Horas Restantes", value: `${stats.remainingHours}h`, sub: `de ${stats.totalHours}h totales`, Icon: AlertCircle, progress: null },
        ].map((card, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="bg-card rounded-xl p-6 border border-border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">{card.label}</span>
              <card.Icon className="h-5 w-5 text-[#FF6835]" />
            </div>
            <div className="text-3xl font-bold text-foreground mb-2">{card.value}</div>
            {card.sub && <div className="text-sm text-muted-foreground">{card.sub}</div>}
            {card.progress !== null && (
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div className="bg-[#FF6835] h-2 rounded-full transition-all duration-500" style={{ width: `${card.progress}%` }} />
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-card rounded-xl p-4 border border-border mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input type="text" placeholder="Buscar módulo..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6835]" />
          </div>
          <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value as any)} className="px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6835]">
            <option value="all">Todas las categorías</option>
            {Object.entries(CATEGORY_INFO).map(([key, info]) => <option key={key} value={key}>{info.label}</option>)}
          </select>
          <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value as any)} className="px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6835]">
            <option value="all">Todos los estados</option>
            {Object.entries(STATUS_INFO).map(([key, info]) => <option key={key} value={key}>{info.label}</option>)}
          </select>
          <select value={selectedPriority} onChange={(e) => setSelectedPriority(e.target.value as any)} className="px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6835]">
            <option value="all">Todas las prioridades</option>
            {Object.entries(PRIORITY_INFO).map(([key, info]) => <option key={key} value={key}>{info.label}</option>)}
          </select>
        </div>
      </div>

      {/* List View */}
      {viewMode === "list" && (
        <div className="space-y-3">
          {filteredModules.map((module, index) => (
            <motion.div key={module.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.01 }} className="bg-card rounded-xl border border-border overflow-hidden hover:border-[#FF6835] transition-colors">
              <div className="p-4 flex items-center gap-4">
                <div onClick={(e) => e.stopPropagation()}>
                  <select value={module.status} onChange={(e) => updateModuleStatus(module.id, e.target.value as ModuleStatus)} className="px-3 py-1.5 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6835] cursor-pointer hover:border-[#FF6835] transition-colors">
                    {Object.entries(STATUS_INFO).map(([key, info]) => <option key={key} value={key}>{info.label} ({info.percent}%)</option>)}
                  </select>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1 flex-wrap">
                    <h3 className="font-semibold text-foreground">{module.name}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${CATEGORY_INFO[module.category].color} text-white`}>{CATEGORY_INFO[module.category].label}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${PRIORITY_INFO[module.priority].color}`}>{PRIORITY_INFO[module.priority].label}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{module.description}</p>
                </div>
                {module.estimatedHours !== undefined && module.estimatedHours > 0 && (
                  <div className="text-sm text-muted-foreground whitespace-nowrap">{module.estimatedHours}h restantes</div>
                )}
                <div className="w-32">
                  <div className="text-xs text-muted-foreground mb-1 text-right">{STATUS_INFO[module.status].percent}%</div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className={`${getProgressBarColor(STATUS_INFO[module.status].percent)} h-2 rounded-full transition-all duration-300`} style={{ width: `${STATUS_INFO[module.status].percent}%` }} />
                  </div>
                </div>
                {module.submodules && (
                  <button onClick={() => toggleExpand(module.id)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    {expandedModules.has(module.id) ? <ChevronDown className="h-5 w-5 text-muted-foreground" /> : <ChevronRight className="h-5 w-5 text-muted-foreground" />}
                  </button>
                )}
              </div>
              <AnimatePresence>
                {module.submodules && expandedModules.has(module.id) && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="border-t border-border bg-background/50">
                    <div className="p-4 space-y-2">
                      {module.submodules.map((sub) => (
                        <div key={sub.id} className="flex items-center gap-3 pl-4">
                          <StatusIcon status={sub.status} />
                          <span className="flex-1 text-sm text-foreground">{sub.name}</span>
                          {sub.estimatedHours !== undefined && sub.estimatedHours > 0 && <span className="text-xs text-muted-foreground">{sub.estimatedHours}h</span>}
                          <div className="w-24">
                            <div className="w-full bg-gray-200 rounded-full h-1.5">
                              <div className={`${getProgressBarColor(STATUS_INFO[sub.status].percent)} h-1.5 rounded-full`} style={{ width: `${STATUS_INFO[sub.status].percent}%` }} />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      )}

      {/* Kanban View */}
      {viewMode === "kanban" && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
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
                        <span className={`text-xs px-1.5 py-0.5 rounded ${CATEGORY_INFO[m.category].color} text-white`}>{CATEGORY_INFO[m.category].label}</span>
                        <span className={`text-xs px-1.5 py-0.5 rounded border ${PRIORITY_INFO[m.priority].color}`}>{PRIORITY_INFO[m.priority].label}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Stats View */}
      {viewMode === "stats" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-card rounded-xl border border-border p-6">
            <h3 className="font-semibold text-foreground mb-4">Por Categoría</h3>
            <div className="space-y-3">
              {Object.entries(CATEGORY_INFO).map(([key, info]) => {
                const catMods = modules.filter((m) => m.category === key);
                const comp = catMods.filter((m) => m.status === "completed").length;
                const pct = catMods.length > 0 ? Math.round((comp / catMods.length) * 100) : 0;
                return (
                  <div key={key}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-foreground">{info.label}</span>
                      <span className="text-sm text-muted-foreground">{comp}/{catMods.length} ({pct}%)</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className={`${getProgressBarColor(pct)} h-2 rounded-full transition-all duration-500`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="bg-card rounded-xl border border-border p-6">
            <h3 className="font-semibold text-foreground mb-4">Por Prioridad</h3>
            <div className="space-y-3">
              {Object.entries(PRIORITY_INFO).map(([key, info]) => {
                const priMods = MODULES_DATA.filter((m) => m.priority === key);
                const comp = priMods.filter((m) => m.status === "completed").length;
                const pct = priMods.length > 0 ? Math.round((comp / priMods.length) * 100) : 0;
                return (
                  <div key={key}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-foreground">{info.label}</span>
                      <span className="text-sm text-muted-foreground">{comp}/{priMods.length} ({pct}%)</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-[#FF6835] h-2 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}