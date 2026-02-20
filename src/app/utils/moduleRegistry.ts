/**
 * MODULE REGISTRY — Oddy Market / Charlie Marketplace Builder v1.5
 *
 * Fuente única de verdad. Cada vez que se construye un módulo nuevo:
 *  1. Agregar la MainSection a BUILT_SECTIONS
 *  2. Agregar el mapeo en SECTION_TO_MODULE_IDS (IDs de MODULES_DATA)
 *  3. El ChecklistRoadmap lo refleja automáticamente → sin tocar nada más
 */

import type { MainSection } from '../AdminDashboard';

/** Secciones con vista implementada */
export const BUILT_SECTIONS: MainSection[] = [
  // ── Shell & Admin ──────────────────────────────────
  'dashboard',
  'sistema',
  'checklist',
  'departamentos',
  'diseno',

  // ── Base de Personas ───────────────────────────────
  'personas',
  'organizaciones',
  'clientes',

  // ── eCommerce ─────────────────────────────────────
  'ecommerce',
  'pedidos',
  'metodos-pago',
  'metodos-envio',
  'pagos',

  // ── Logística ─────────────────────────────────────
  'envios',
  'logistica',

  // ── Marketing ─────────────────────────────────────
  'marketing',
  'mailing',
  'google-ads',
  'rueda-sorteos',
  'fidelizacion',
  'redes-sociales',
  'migracion-rrss',
  'etiqueta-emotiva',   // ← Etiqueta Emotiva completa

  // ── Herramientas ──────────────────────────────────
  'herramientas',
  'qr-generator',       // ← Generador QR interno

  // ── ERP módulos ───────────────────────────────────
  'erp-inventario',
  'erp-facturacion',
  'erp-compras',
  'erp-crm',
  'erp-contabilidad',
  'erp-rrhh',
  'gestion',

  // ── Proyectos ─────────────────────────────────────
  'proyectos',

  // ── Marketplace ───────────────────────────────────
  'secondhand',
  'storefront',

  // ── Integraciones ─────────────────────────────────
  'integraciones',
];

/**
 * Mapeo MainSection → IDs exactos de MODULES_DATA en ChecklistRoadmap.
 * Un módulo del checklist se marca "completed" si su ID aparece aquí
 * y su sección está en BUILT_SECTIONS.
 */
export const SECTION_TO_MODULE_IDS: Partial<Record<MainSection, string[]>> = {
  // ERP core
  'erp-inventario':    ['erp-inventory'],
  'erp-facturacion':   ['erp-invoicing'],
  'erp-compras':       ['erp-purchasing'],
  'gestion':           ['erp-sales'],
  // CRM
  'erp-crm':           ['crm-contacts', 'crm-opportunities', 'crm-activities'],
  // Contabilidad / RRHH
  'erp-contabilidad':  ['erp-accounting'],
  'erp-rrhh':          ['erp-hr'],
  // Proyectos
  'proyectos':         ['projects-management', 'projects-tasks', 'projects-time'],
  // Base de Personas
  'personas':          ['base-personas'],
  'organizaciones':    ['base-personas'],
  'clientes':          ['base-personas'],
  // eCommerce / Pedidos
  'ecommerce':         ['marketplace-secondhand', 'ecommerce-pedidos'],
  'pedidos':           ['ecommerce-pedidos'],
  'metodos-pago':      ['ecommerce-metodos-pago'],
  'metodos-envio':     ['ecommerce-metodos-envio'],
  'pagos':             ['ecommerce-pedidos'],
  // Logística
  'envios':            ['logistics-shipping', 'logistics-fulfillment'],
  'logistica':         ['logistics-fulfillment', 'logistics-picking', 'logistics-shipping', 'logistics-tracking', 'logistics-routes'],
  // Marketing
  'marketing':         ['marketing-campaigns', 'marketing-seo'],
  'mailing':           ['marketing-email', 'marketing-email-bulk'],
  'google-ads':        ['marketing-campaigns'],
  'fidelizacion':      ['marketing-loyalty'],
  'redes-sociales':    ['marketing-social'],
  'migracion-rrss':    ['marketing-social'],
  'rueda-sorteos':     ['marketing-loyalty'],
  'etiqueta-emotiva':  ['marketing-etiqueta-emotiva'],   // ← nuevo
  // Herramientas
  'herramientas':      ['tools-media', 'tools-documents'],
  'qr-generator':      ['tools-qr'],                     // ← nuevo
  'diseno':            ['tools-media'],
  // Marketplace
  'secondhand':        ['marketplace-secondhand'],
  'storefront':        ['marketplace-storefront'],
  // Integraciones
  'integraciones':     ['integrations-mercadolibre', 'integrations-mercadopago', 'integrations-resend', 'integrations-twilio', 'integrations-fixed', 'integrations-replicate', 'integrations-removebg'],
  // Admin / Sistema
  'dashboard':         ['admin-settings', 'admin-users'],
  'sistema':           ['admin-settings', 'admin-users'],
  'checklist':         ['admin-settings'],
  'departamentos':     ['admin-users'],
};

/** Set de IDs de módulos que están construidos — para O(1) lookup */
export const BUILT_MODULE_IDS = new Set<string>(
  BUILT_SECTIONS.flatMap(s => SECTION_TO_MODULE_IDS[s] ?? [])
);

/** Retorna true si la sección está construida */
export const isBuilt = (s: MainSection) => BUILT_SECTIONS.includes(s);

/** Progreso global */
export const getBuildProgress = () => {
  const total = BUILT_SECTIONS.length;
  const mapped = BUILT_SECTIONS.filter(s => s in SECTION_TO_MODULE_IDS).length;
  return { builtSections: total, mappedToChecklist: mapped };
};