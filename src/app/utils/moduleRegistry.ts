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
  'dashboard',
  'ecommerce',
  'marketing',
  'herramientas',
  'gestion',
  'sistema',
  'diseno',
  'checklist',
  'integraciones',
  'migracion-rrss',
  'mailing',
  'google-ads',
  'rueda-sorteos',
  'fidelizacion',
  'redes-sociales',
  'departamentos',
  'secondhand',
  'erp-inventario',
  'erp-facturacion',
  'erp-compras',
  'erp-crm',           // ← CRM completo
  'erp-logistica',     // ← Logística completa
  'erp-contabilidad',  // ← Contabilidad completa
  'erp-rrhh',          // ← RRHH completo
  'proyectos',         // ← Proyectos + Kanban
  'storefront',        // ← Portal del Cliente v1
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
  // Logística
  'erp-logistica':     ['logistics-fulfillment', 'logistics-picking', 'logistics-shipping', 'logistics-tracking'],
  // Contabilidad
  'erp-contabilidad':  ['erp-accounting'],
  // RRHH
  'erp-rrhh':          ['erp-hr'],
  // Proyectos
  'proyectos':         ['projects-management', 'projects-tasks', 'projects-time'],
  // Marketplace
  'secondhand':        ['marketplace-secondhand'],
  'ecommerce':         ['marketplace-secondhand'],
  'storefront':        ['marketplace-storefront'],
  // Marketing
  'marketing':         ['marketing-campaigns', 'marketing-seo'],
  'mailing':           ['marketing-email', 'marketing-email-bulk'],
  'google-ads':        ['marketing-campaigns'],
  'fidelizacion':      ['marketing-loyalty'],
  'redes-sociales':    ['marketing-social'],
  'migracion-rrss':    ['marketing-social'],
  'rueda-sorteos':     ['marketing-loyalty'],
  // Herramientas
  'herramientas':      ['tools-media', 'tools-documents'],
  'diseno':            ['tools-media'],
  // Integraciones
  'integraciones':     ['integrations-mercadolibre', 'integrations-mercadopago', 'integrations-resend', 'integrations-twilio'],
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
  // Módulos del checklist marcados como built
  const mapped = BUILT_SECTIONS.filter(s => s in SECTION_TO_MODULE_IDS).length;
  return { builtSections: total, mappedToChecklist: mapped };
};