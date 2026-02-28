/**
 * MODULE MANIFEST â€” Charlie Marketplace Builder v1.5
 * â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
 * FUENTE ÃšNICA DE VERDAD sobre quÃ© vistas existen y quÃ© IDs del checklist cubren.
 *
 * â”Œâ”€ REGLA â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
 * â”‚  Cuando construÃ­s una vista nueva, SOLO tenÃ©s que agregar/editar UNA entrada â”‚
 * â”‚  aquÃ­. moduleRegistry.ts y el ChecklistRoadmap se actualizan solos.          â”‚
 * â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
 *
 * isReal = true  â†’ Vista funcional con UI completa (puede ser mock o real Supabase)
 * isReal = false â†’ Hub de navegaciÃ³n o placeholder; no cuenta como completado
 */

import React from 'react';
import type { MainSection } from '../AdminDashboard';

// â”€â”€ Imports de todos los componentes â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export interface ManifestEntry {
  /** IDs exactos en MODULES_DATA que esta vista cubre (vacÃ­o = hub, no mapea nada) */
  checklistIds: string[];
  /** SecciÃ³n en AdminDashboard / sidebar */
  section: MainSection;
  /** Nombre del archivo de vista (solo informativo) */
  viewFile: string;
  /** Componente React correspondiente a esta vista */
  component: React.ComponentType<{ onNavigate: (s: MainSection) => void }> | React.ComponentType<{}> | null;
  /** true = vista funcional real | false = hub de navegaciÃ³n o placeholder */
  isReal: boolean;
  /** Â¿Conecta con Supabase/backend? */
  hasSupabase?: boolean;
  /** Nota descriptiva */
  notes?: string;
}

export const MODULE_MANIFEST: ManifestEntry[] = [

  // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
  // ADMIN / SISTEMA
  // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
  {
    checklistIds: ['admin-settings', 'admin-users'],
    section: 'dashboard',
    viewFile: 'DashboardView.tsx',
    component: React.lazy(() => import('../components/admin/views/DashboardView').then(m => ({ default: m.DashboardView }))),
    isReal: true,
    notes: 'Dashboard con mÃ©tricas, charts y navegaciÃ³n rÃ¡pida',
  },
  {
    checklistIds: ['admin-settings', 'admin-users'],
    section: 'sistema',
    viewFile: 'SistemaView.tsx',
    component: React.lazy(() => import('../components/admin/views/SistemaView').then(m => ({ default: m.SistemaView }))),
    isReal: true,
    notes: 'ConfiguraciÃ³n del sistema â€” hub con cards de config',
  },
  {
    checklistIds: ['admin-users'],
    section: 'departamentos',
    viewFile: 'DepartamentosView.tsx',
    component: React.lazy(() => import('../components/admin/views/DepartamentosView').then(m => ({ default: m.DepartamentosView }))),
    isReal: true,
    notes: 'GestiÃ³n de departamentos, roles y permisos',
  },
  {
    checklistIds: ['admin-settings'],
    section: 'checklist',
    viewFile: 'ChecklistView.tsx',
    component: React.lazy(() => import('../components/admin/views/ChecklistView').then(m => ({ default: m.ChecklistView }))),
    isReal: true,
    notes: 'Vista del checklist / roadmap con audit integrado',
  },
  {
    checklistIds: [],
    section: 'diseno',
    viewFile: 'DisenoView.tsx',
    component: React.lazy(() => import('../components/admin/views/DisenoView').then(m => ({ default: m.DisenoView }))),
    isReal: false,
    notes: 'Hub de diseÃ±o y branding (tabs de navegaciÃ³n)',
  },

  // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
  // BASE DE PERSONAS
  // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
  {
    checklistIds: ['base-personas'],
    section: 'personas',
    viewFile: 'PersonasView.tsx',
    component: React.lazy(() => import('../components/admin/views/PersonasView').then(m => ({ default: m.PersonasView }))),
    isReal: true,
    hasSupabase: true,
    notes: 'CRUD completo de personas fÃ­sicas y jurÃ­dicas',
  },
  {
    checklistIds: ['base-personas'],
    section: 'organizaciones',
    viewFile: 'OrganizacionesView.tsx',
    component: React.lazy(() => import('../components/admin/views/OrganizacionesView').then(m => ({ default: m.OrganizacionesView }))),
    isReal: true,
    hasSupabase: true,
    notes: 'CRUD completo de empresas y organizaciones',
  },
  {
    checklistIds: ['base-personas'],
    section: 'clientes',
    viewFile: 'ClientesView.tsx',
    component: React.lazy(() => import('../components/admin/views/ClientesView').then(m => ({ default: m.ClientesView }))),
    isReal: true,
    hasSupabase: true,
    notes: 'Vista filtrada de personas/organizaciones con rol cliente',
  },

  // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
  // eCOMMERCE
  // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
  {
    checklistIds: [],
    section: 'ecommerce',
    viewFile: 'EcommerceView.tsx',
    component: React.lazy(() => import('../components/admin/views/EcommerceView').then(m => ({ default: m.EcommerceView }))),
    isReal: false,
    notes: 'Hub de navegaciÃ³n eCommerce (cards a sub-mÃ³dulos)',
  },
  {
    checklistIds: ['ecommerce-pedidos'],
    section: 'pedidos',
    viewFile: 'PedidosView.tsx',
    component: React.lazy(() => import('../components/admin/views/PedidosView').then(m => ({ default: m.PedidosView }))),
    isReal: true,
    hasSupabase: true,
    notes: 'CRUD de pedidos con estados, filtros y Ã¡rbol madre/hijos',
  },
  {
    checklistIds: ['ecommerce-pedidos'],
    section: 'pagos',
    viewFile: 'PagosView.tsx',
    component: React.lazy(() => import('../components/admin/views/PagosView').then(m => ({ default: m.PagosView }))),
    isReal: true,
    hasSupabase: true,
    notes: 'Transacciones y estados de pago operativos',
  },
  {
    checklistIds: ['ecommerce-metodos-pago'],
    section: 'metodos-pago',
    viewFile: 'MetodosPagoView.tsx',
    component: React.lazy(() => import('../components/admin/views/MetodosPagoView').then(m => ({ default: m.MetodosPagoView }))),
    isReal: true,
    hasSupabase: true,
    notes: 'ConfiguraciÃ³n de pasarelas y mÃ©todos de pago',
  },
  {
    checklistIds: ['ecommerce-metodos-envio'],
    section: 'metodos-envio',
    viewFile: 'MetodosEnvioView.tsx',
    component: React.lazy(() => import('../components/admin/views/MetodosEnvioView').then(m => ({ default: m.MetodosEnvioView }))),
    isReal: true,
    hasSupabase: true,
    notes: 'ConfiguraciÃ³n de mÃ©todos de envÃ­o y tarifas',
  },

  // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
  // LOGÃSTICA
  // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
  {
    checklistIds: ['logistics-hub'],
    section: 'logistica',
    viewFile: 'LogisticaView.tsx',
    component: React.lazy(() => import('../components/admin/views/LogisticaView').then(m => ({ default: m.LogisticaView }))),
    isReal: false,
    notes: 'Hub con diagrama de flujo logÃ­stico 7 pasos y cards a todos los sub-mÃ³dulos',
  },
  {
    checklistIds: ['logistics-shipping'],
    section: 'envios',
    viewFile: 'EnviosView.tsx',
    component: React.lazy(() => import('../components/admin/views/EnviosView').then(m => ({ default: m.EnviosView }))),
    isReal: true,
    hasSupabase: true,
    notes: 'Vista Ã¡rbol PedidoMadreâ†’EnvÃ­osHijos Â· estados Â· multi-tramo Â· panel detalle + timeline',
  },
  {
    checklistIds: ['logistics-carriers'],
    section: 'transportistas',
    viewFile: 'TransportistasView.tsx',
    component: React.lazy(() => import('../components/admin/views/TransportistasView').then(m => ({ default: m.TransportistasView }))),
    isReal: true,
    hasSupabase: false,
    notes: 'CatÃ¡logo carriers Â· tramos y zonas Â· simulador de tarifas',
  },
  {
    checklistIds: ['logistics-routes'],
    section: 'rutas',
    viewFile: 'RutasView.tsx',
    component: React.lazy(() => import('../components/admin/views/RutasView').then(m => ({ default: m.RutasView }))),
    isReal: true,
    hasSupabase: false,
    notes: 'Rutas standard y por proyecto Â· vista detalle con paradas Â· progreso de entrega',
  },
  {
    checklistIds: ['logistics-fulfillment'],
    section: 'fulfillment',
    viewFile: 'FulfillmentView.tsx',
    component: React.lazy(() => import('../components/admin/views/FulfillmentView').then(m => ({ default: m.FulfillmentView }))),
    isReal: true,
    hasSupabase: false,
    notes: 'Wave picking Â· lotes Â· cola de Ã³rdenes Â· empaque Â· materiales de packaging',
  },
  {
    checklistIds: ['logistics-production'],
    section: 'produccion',
    viewFile: 'ProduccionView.tsx',
    component: React.lazy(() => import('../components/admin/views/ProduccionView').then(m => ({ default: m.ProduccionView }))),
    isReal: true,
    hasSupabase: false,
    notes: 'BOM Â· Ã³rdenes de armado Â· catÃ¡logo de kits / canastas / combos / packs',
  },
  {
    checklistIds: ['logistics-supply'],
    section: 'abastecimiento',
    viewFile: 'AbastecimientoView.tsx',
    component: React.lazy(() => import('../components/admin/views/AbastecimientoView').then(m => ({ default: m.AbastecimientoView }))),
    isReal: true,
    hasSupabase: false,
    notes: 'Alertas de stock Â· OC sugeridas Â· MRP con cÃ¡lculo de componentes necesarios',
  },
  {
    checklistIds: ['logistics-map'],
    section: 'mapa-envios',
    viewFile: 'MapaEnviosView.tsx',
    component: React.lazy(() => import('../components/admin/views/MapaEnviosView').then(m => ({ default: m.MapaEnviosView }))),
    isReal: true,
    hasSupabase: false,
    notes: 'Mapa SVG de Argentina con puntos de envÃ­os activos Â· filtro por estado Â· tooltip detalle',
  },
  {
    checklistIds: ['logistics-tracking'],
    section: 'tracking-publico',
    viewFile: 'TrackingPublicoView.tsx',
    component: React.lazy(() => import('../components/admin/views/TrackingPublicoView').then(m => ({ default: m.TrackingPublicoView }))),
    isReal: true,
    hasSupabase: false,
    notes: 'BÃºsqueda por nÃºmero de envÃ­o Â· timeline de estados Â· link pÃºblico para destinatarios',
  },

  // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
  // MARKETING
  // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
  {
    checklistIds: [],
    section: 'marketing',
    viewFile: 'MarketingView.tsx',
    component: React.lazy(() => import('../components/admin/views/MarketingView').then(m => ({ default: m.MarketingView }))),
    isReal: false,
    notes: 'Hub de navegaciÃ³n Marketing (cards a sub-mÃ³dulos)',
  },
  {
    checklistIds: ['marketing-campaigns'],
    section: 'google-ads',
    viewFile: 'GoogleAdsView.tsx',
    component: React.lazy(() => import('../components/admin/views/GoogleAdsView').then(m => ({ default: m.GoogleAdsView }))),
    isReal: true,
    notes: 'Dashboard Google Ads con charts recharts, KPIs y tabla de campaÃ±as',
  },
  {
    checklistIds: ['marketing-email', 'marketing-email-bulk'],
    section: 'mailing',
    viewFile: 'MailingView.tsx',
    component: React.lazy(() => import('../components/admin/views/MailingView').then(m => ({ default: m.MailingView }))),
    isReal: true,
    hasSupabase: false,
    notes: 'UI completa (5 tabs: CampaÃ±as, Suscriptores, SegmentaciÃ³n, A/B Testing, AnalÃ­ticas) â€” MOCK DATA. Resend API no conectada aÃºn.',
  },
  {
    checklistIds: ['marketing-seo'],
    section: 'seo',
    viewFile: 'SEOView.tsx',
    component: React.lazy(() => import('../components/admin/views/SEOView').then(m => ({ default: m.SEOView }))),
    isReal: true,
    hasSupabase: false,
    notes: 'Dashboard SEO Â· Keywords + rankings Â· anÃ¡lisis on-page de pÃ¡ginas Â· backlinks Â· salud SEO Â· sugerencias IA',
  },
  {
    checklistIds: ['marketing-loyalty'],
    section: 'fidelizacion',
    viewFile: 'FidelizacionView.tsx',
    component: React.lazy(() => import('../components/admin/views/FidelizacionView').then(m => ({ default: m.FidelizacionView }))),
    isReal: true,
    notes: 'Programa de fidelizaciÃ³n con niveles y charts',
  },
  {
    checklistIds: ['marketing-loyalty'],
    section: 'rueda-sorteos',
    viewFile: 'RuedaSorteosView.tsx',
    component: React.lazy(() => import('../components/admin/views/RuedaSorteosView').then(m => ({ default: m.RuedaSorteosView }))),
    isReal: true,
    notes: 'Rueda de sorteos interactiva con premios configurables',
  },
  {
    checklistIds: ['rrss-centro-operativo'],
    section: 'redes-sociales',
    viewFile: 'RedesSocialesView.tsx',
    component: React.lazy(() => import('../components/admin/views/RedesSocialesView').then(m => ({ default: m.RedesSocialesView }))),
    isReal: true,
    notes: 'Centro Operativo RRSS â€” mÃ©tricas, programaciÃ³n de posts y anÃ¡lisis de audiencia',
  },
  {
    checklistIds: ['rrss-migracion'],
    section: 'migracion-rrss',
    viewFile: 'MigracionRRSSView.tsx',
    component: React.lazy(() => import('../components/admin/views/MigracionRRSSView').then(m => ({ default: m.MigracionRRSSView }))),
    isReal: true,
    notes: 'Herramienta de migraciÃ³n/rebranding Instagram + Facebook',
  },
  {
    checklistIds: ['marketing-etiqueta-emotiva'],
    section: 'etiqueta-emotiva',
    viewFile: 'EtiquetaEmotivaView.tsx',
    component: React.lazy(() => import('../components/admin/views/EtiquetaEmotivaView').then(m => ({ default: m.EtiquetaEmotivaView }))),
    isReal: true,
    hasSupabase: true,
    notes: 'Mensajes personalizados con QR para envÃ­os Â· Supabase + QR real',
  },

  // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
  // RRSS
  // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
  {
    checklistIds: [],
    section: 'rrss',
    viewFile: 'RRSSHubView.tsx',
    component: React.lazy(() => import('../components/admin/views/RRSSHubView').then(m => ({ default: m.RRSSHubView }))),
    isReal: false,
    notes: 'Hub de navegaciÃ³n RRSS â€” Centro Operativo + MigraciÃ³n RRSS',
  },

  // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
  // HERRAMIENTAS
  // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
  {
    checklistIds: [],
    section: 'herramientas',
    viewFile: 'HerramientasView.tsx',
    component: React.lazy(() => import('../components/admin/views/HerramientasView').then(m => ({ default: m.HerramientasView }))),
    isReal: false,
    notes: 'Hub de navegaciÃ³n â€” 6 workspace tools + 3 herramientas rÃ¡pidas',
  },
  {
    checklistIds: ['tools-library'],
    section: 'biblioteca',
    viewFile: 'BibliotecaWorkspace.tsx',
    component: React.lazy(() => import('../components/admin/views/BibliotecaWorkspace').then(m => ({ default: m.BibliotecaWorkspace }))),
    isReal: true,
    hasSupabase: false,
    notes: 'Biblioteca de assets â€” upload drag&drop, colecciones, tags, grid/lista, export',
  },
  {
    checklistIds: ['tools-image-editor'],
    section: 'editor-imagenes',
    viewFile: 'EditorImagenesWorkspace.tsx',
    component: React.lazy(() => import('../components/admin/views/EditorImagenesWorkspace').then(m => ({ default: m.EditorImagenesWorkspace }))),
    isReal: true,
    hasSupabase: false,
    notes: 'Editor de imÃ¡genes â€” filtros CSS, rotaciÃ³n, flip, 8 presets, export PNG/JPG',
  },
  {
    checklistIds: ['tools-documents'],
    section: 'gen-documentos',
    viewFile: 'GenDocumentosWorkspace.tsx',
    component: React.lazy(() => import('../components/admin/views/GenDocumentosWorkspace').then(m => ({ default: m.GenDocumentosWorkspace }))),
    isReal: true,
    hasSupabase: false,
    notes: 'Generador de documentos WYSIWYG â€” 8 tipos de bloque, A4, export PDF',
  },
  {
    checklistIds: ['tools-quotes'],
    section: 'gen-presupuestos',
    viewFile: 'GenPresupuestosWorkspace.tsx',
    component: React.lazy(() => import('../components/admin/views/GenPresupuestosWorkspace').then(m => ({ default: m.GenPresupuestosWorkspace }))),
    isReal: true,
    hasSupabase: false,
    notes: 'Generador de presupuestos â€” Ã­tems, IVA, descuentos, multi-moneda, export PDF',
  },
  {
    checklistIds: ['tools-ocr'],
    section: 'ocr',
    viewFile: 'OCRWorkspace.tsx',
    component: React.lazy(() => import('../components/admin/views/OCRWorkspace').then(m => ({ default: m.OCRWorkspace }))),
    isReal: true,
    hasSupabase: false,
    notes: 'OCR con Tesseract.js â€” 100% browser, sin API key, EspaÃ±ol/InglÃ©s/PT, export TXT',
  },
  {
    checklistIds: ['tools-print'],
    section: 'impresion',
    viewFile: 'ImpresionWorkspace.tsx',
    component: React.lazy(() => import('../components/admin/views/ImpresionWorkspace').then(m => ({ default: m.ImpresionWorkspace }))),
    isReal: true,
    hasSupabase: false,
    notes: 'MÃ³dulo de impresiÃ³n â€” cola de trabajos, A4 preview, papel/orientaciÃ³n/color/calidad',
  },
  {
    checklistIds: ['tools-qr'],
    section: 'qr-generator',
    viewFile: 'QrGeneratorView.tsx',
    component: React.lazy(() => import('../components/admin/views/QrGeneratorView').then(m => ({ default: m.QrGeneratorView }))),
    isReal: true,
    notes: 'Generador QR â€” sin APIs externas, genera PNG y SVG vectorial',
  },
  {
    checklistIds: ['tools-ideas-board'],
    section: 'ideas-board',
    viewFile: 'IdeasBoardView.tsx',
    component: React.lazy(() => import('../components/admin/views/IdeasBoardView').then(m => ({ default: m.IdeasBoardView }))),
    isReal: true,
    hasSupabase: true,
    notes: 'Canvas visual de mÃ³dulos e ideas â€” stickers, conectores, canvases jerÃ¡rquicos, lamparita en Mi Vista',
  },

  // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
  // ERP
  // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
  {
    checklistIds: [],
    section: 'gestion',
    viewFile: 'GestionView.tsx',
    component: React.lazy(() => import('../components/admin/views/GestionView').then(m => ({ default: m.GestionView }))),
    isReal: false,
    notes: 'Hub de navegaciÃ³n ERP (cards a Inventario, FacturaciÃ³n, Compras, CRM, etc.)',
  },
  {
    checklistIds: ['erp-inventory'],
    section: 'erp-inventario',
    viewFile: 'ERPInventarioView.tsx',
    component: React.lazy(() => import('../components/admin/views/ERPInventarioView').then(m => ({ default: m.ERPInventarioView }))),
    isReal: true,
    notes: 'Inventario con tabs: ArtÃ­culos, Stock, Movimientos, Alertas',
  },
  {
    checklistIds: ['erp-invoicing'],
    section: 'erp-facturacion',
    viewFile: 'ERPFacturacionView.tsx',
    component: React.lazy(() => import('../components/admin/views/ERPFacturacionView').then(m => ({ default: m.ERPFacturacionView }))),
    isReal: true,
    notes: 'FacturaciÃ³n con tabs: Facturas, Tickets, Nueva factura',
  },
  {
    checklistIds: ['erp-purchasing'],
    section: 'erp-compras',
    viewFile: 'ERPComprasView.tsx',
    component: React.lazy(() => import('../components/admin/views/ERPComprasView').then(m => ({ default: m.ERPComprasView }))),
    isReal: true,
    notes: 'Compras con tabs: Ã“rdenes, Proveedores, Nueva orden',
  },
  {
    checklistIds: ['crm-contacts', 'crm-opportunities', 'crm-activities'],
    section: 'erp-crm',
    viewFile: 'ERPCRMView.tsx',
    component: React.lazy(() => import('../components/admin/views/ERPCRMView').then(m => ({ default: m.ERPCRMView }))),
    isReal: true,
    notes: 'CRM completo: Contactos, Pipeline de oportunidades, Actividades y seguimiento',
  },
  {
    checklistIds: ['erp-accounting'],
    section: 'erp-contabilidad',
    viewFile: 'ERPContabilidadView.tsx',
    component: React.lazy(() => import('../components/admin/views/ERPContabilidadView').then(m => ({ default: m.ERPContabilidadView }))),
    isReal: true,
    notes: 'Contabilidad: Plan de cuentas, Asientos, Cobrar/Pagar, Bancos',
  },
  {
    checklistIds: ['erp-hr'],
    section: 'erp-rrhh',
    viewFile: 'ERPRRHHView.tsx',
    component: React.lazy(() => import('../components/admin/views/ERPRRHHView').then(m => ({ default: m.ERPRRHHView }))),
    isReal: true,
    notes: 'RRHH: Empleados, Asistencia y NÃ³mina',
  },

  // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
  // PROYECTOS
  // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
  {
    checklistIds: ['projects-management', 'projects-tasks', 'projects-time'],
    section: 'proyectos',
    viewFile: 'ProyectosView.tsx',
    component: React.lazy(() => import('../components/admin/views/ProyectosView').then(m => ({ default: m.ProyectosView }))),
    isReal: true,
    notes: 'Proyectos con Gantt simplificado y tablero Kanban',
  },

  // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
  // MARKETPLACE
  // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
  {
    checklistIds: ['marketplace-secondhand', 'marketplace-secondhand-mediacion'],
    section: 'secondhand',
    viewFile: 'SecondHandView.tsx',
    component: React.lazy(() => import('../components/admin/views/SecondHandView').then(m => ({ default: m.SecondHandView }))),
    isReal: true,
    notes: 'Marketplace Segunda Mano: EstadÃ­sticas, ModeraciÃ³n, Publicaciones y âš–ï¸ MediaciÃ³n de disputas',
  },
  {
    checklistIds: ['marketplace-storefront'],
    section: 'storefront',
    viewFile: 'StorefrontAdminView.tsx',
    component: null, // StorefrontAdminView no estÃ¡ importado en AdminDashboard, se omite por ahora
    isReal: true,
    notes: 'Panel de acceso rÃ¡pido al storefront pÃºblico con stats y links',
  },

  // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
  // INTEGRACIONES
  // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
  {
    checklistIds: [
      'integrations-mercadolibre',
      'integrations-mercadopago',
      'integrations-plexo',
      'integrations-paypal',
      'integrations-stripe',
      'integrations-meta',
      'integrations-twilio',
    ],
    section: 'integraciones',
    viewFile: 'IntegracionesView.tsx',
    component: React.lazy(() => import('../components/admin/views/IntegracionesView').then(m => ({ default: m.IntegracionesView }))),
    isReal: true,
    notes: 'Hub de 5 mÃ³dulos de integraciÃ³n â€” Uruguay first, Latam progresivo',
  },
  {
    checklistIds: ['integrations-plexo', 'integrations-mercadopago', 'integrations-paypal', 'integrations-stripe'],
    section: 'integraciones-pagos',
    viewFile: 'IntegracionesPagosView.tsx',
    component: React.lazy(() => import('../components/admin/views/IntegracionesPagosView').then(m => ({ default: m.IntegracionesPagosView }))),
    isReal: true,
    notes: 'ðŸ’³ Pasarela de pagos â€” Plexo, OCA, Abitab, RedPagos, MP, PayPal, Stripe',
  },
  {
    checklistIds: ['integrations-logistics'],
    section: 'integraciones-logistica',
    viewFile: 'IntegracionesLogisticaView.tsx',
    component: React.lazy(() => import('../components/admin/views/IntegracionesLogisticaView').then(m => ({ default: m.IntegracionesLogisticaView }))),
    isReal: true,
    notes: 'ðŸšš LogÃ­stica â€” Carriers con y sin API. URL de tracking configurable para carriers sin API',
  },
  {
    checklistIds: ['integrations-mercadolibre'],
    section: 'integraciones-tiendas',
    viewFile: 'IntegracionesTiendasView.tsx',
    component: React.lazy(() => import('../components/admin/views/IntegracionesTiendasView').then(m => ({ default: m.IntegracionesTiendasView }))),
    isReal: true,
    notes: 'ðŸª Tiendas â€” ML, TiendaNube, WooCommerce, Shopify, VTEX, Magento',
  },
  {
    checklistIds: ['integrations-meta'],
    section: 'integraciones-rrss',
    viewFile: 'IntegracionesRRSSView.tsx',
    component: React.lazy(() => import('../components/admin/views/IntegracionesRRSSView').then(m => ({ default: m.IntegracionesRRSSView }))),
    isReal: true,
    notes: 'ðŸ“± Redes Sociales â€” Meta, Instagram Shopping, WhatsApp, Facebook Shops, TikTok, Pinterest',
  },
  {
    checklistIds: ['integrations-twilio'],
    section: 'integraciones-servicios',
    viewFile: 'IntegracionesServiciosView.tsx',
    component: React.lazy(() => import('../components/admin/views/IntegracionesServiciosView').then(m => ({ default: m.IntegracionesServiciosView }))),
    isReal: true,
    notes: 'âš™ï¸ Servicios â€” Twilio, Resend, SendGrid, GA4, GTM, Zapier, n8n',
  },
  {
    checklistIds: [],
    section: 'integraciones-marketplace',
    viewFile: 'IntegracionesMarketplaceView.tsx',
    component: React.lazy(() => import('../components/admin/views/IntegracionesMarketplaceView').then(m => ({ default: m.IntegracionesMarketplaceView }))),
    isReal: true,
    notes: 'Marketplace integrations',
  },
  {
    checklistIds: [],
    section: 'integraciones-comunicacion',
    viewFile: 'IntegracionesComunicacionView.tsx',
    component: React.lazy(() => import('../components/admin/views/IntegracionesComunicacionView').then(m => ({ default: m.IntegracionesComunicacionView }))),
    isReal: true,
    notes: 'ComunicaciÃ³n integrations',
  },
  {
    checklistIds: [],
    section: 'integraciones-identidad',
    viewFile: 'IntegracionesIdentidadView.tsx',
    component: React.lazy(() => import('../components/admin/views/IntegracionesIdentidadView').then(m => ({ default: m.IntegracionesIdentidadView }))),
    isReal: true,
    notes: 'Identidad integrations',
  },
  {
    checklistIds: [],
    section: 'integraciones-api-keys',
    viewFile: 'APIKeysView.tsx',
    component: React.lazy(() => import('../components/admin/views/APIKeysView').then(m => ({ default: m.APIKeysView }))),
    isReal: true,
    notes: 'API Keys management',
  },
  {
    checklistIds: [],
    section: 'integraciones-webhooks',
    viewFile: 'WebhooksView.tsx',
    component: React.lazy(() => import('../components/admin/views/WebhooksView').then(m => ({ default: m.WebhooksView }))),
    isReal: true,
    notes: 'Webhooks management',
  },
  // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
  // AUDITORÃA & DIAGNÃ“STICO
  // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
  {
    checklistIds: ['audit-hub'],
    section: 'auditoria',
    viewFile: 'AuditoriaHubView.tsx',
    component: React.lazy(() => import('../components/admin/views/AuditoriaHubView').then(m => ({ default: m.AuditoriaHubView }))),
    isReal: true,
    hasSupabase: false,
    notes: 'ðŸ” Hub AuditorÃ­a â€” mÃ©tricas de estado, diagnÃ³stico rÃ¡pido y acceso a todas las herramientas',
  },
  {
    checklistIds: ['audit-health'],
    section: 'auditoria-health',
    viewFile: 'HealthMonitorView.tsx',
    component: React.lazy(() => import('../components/admin/views/HealthMonitorView').then(m => ({ default: m.HealthMonitorView }))),
    isReal: true,
    hasSupabase: true,
    notes: 'ðŸ’š Health Monitor â€” verifica en tiempo real Supabase DB/Auth/Edge/KV/Storage + APIs externas',
  },
  {
    checklistIds: ['audit-logs'],
    section: 'auditoria-logs',
    viewFile: 'SystemLogsView.tsx',
    component: React.lazy(() => import('../components/admin/views/SystemLogsView').then(m => ({ default: m.SystemLogsView }))),
    isReal: true,
    hasSupabase: false,
    notes: 'ðŸ“œ Logs del Sistema â€” registro de actividad, errores y eventos con filtros y export TXT',
  },
  {
    checklistIds: ['audit-apis-repo'],
    section: 'integraciones-apis',
    viewFile: 'RepositorioAPIsView.tsx',
    component: React.lazy(() => import('../components/admin/views/RepositorioAPIsView').then(m => ({ default: m.RepositorioAPIsView }))),
    isReal: true,
    hasSupabase: false,
    notes: 'ðŸ“¡ Repositorio centralizado â€” 23 APIs con estado, credenciales, docs y test de conexiÃ³n',
  },

  // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
  // MÃ“DULOS ADICIONALES
  // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
  {
    checklistIds: [],
    section: 'pos',
    viewFile: 'POSView.tsx',
    component: React.lazy(() => import('../components/admin/views/POSView').then(m => ({ default: m.POSView }))),
    isReal: true,
    notes: 'Punto de Venta',
  },
  {
    checklistIds: ['admin-settings'],
    section: 'roadmap',
    viewFile: 'ChecklistView.tsx',
    component: React.lazy(() => import('../components/admin/views/ChecklistView').then(m => ({ default: m.ChecklistView }))),
    isReal: true,
    notes: 'Roadmap (alias de checklist)',
  },
  {
    checklistIds: [],
    section: 'constructor',
    viewFile: 'ConstructorView.tsx',
    component: React.lazy(() => import('../components/admin/views/ConstructorView').then(m => ({ default: m.ConstructorView }))),
    isReal: true,
    notes: 'Constructor de mÃ³dulos',
  },
  {
    checklistIds: [],
    section: 'auth-registro',
    viewFile: 'AuthRegistroView.tsx',
    component: React.lazy(() => import('../components/admin/views/AuthRegistroView').then(m => ({ default: m.AuthRegistroView }))),
    isReal: true,
    notes: 'AutenticaciÃ³n y registro',
  },
  {
    checklistIds: [],
    section: 'carga-masiva',
    viewFile: 'CargaMasivaView.tsx',
    component: React.lazy(() => import('../components/admin/views/CargaMasivaView').then(m => ({ default: m.CargaMasivaView }))),
    isReal: true,
    notes: 'Carga masiva de datos',
  },
  {
    checklistIds: [],
    section: 'meta-business',
    viewFile: 'MetaBusinessView.tsx',
    component: React.lazy(() => import('../components/admin/views/MetaBusinessView').then(m => ({ default: m.MetaBusinessView }))),
    isReal: true,
    notes: 'Meta Business integration',
  },
  {
    checklistIds: [],
    section: 'unified-workspace',
    viewFile: 'UnifiedWorkspaceView.tsx',
    component: React.lazy(() => import('../components/admin/views/UnifiedWorkspaceView').then(m => ({ default: m.UnifiedWorkspaceView }))),
    isReal: true,
    notes: 'Workspace unificado',
  },
  {
    checklistIds: [],
    section: 'dashboard-admin',
    viewFile: 'AdminDashboardView.tsx',
    component: React.lazy(() => import('../components/admin/views/AdminDashboardView').then(m => ({ default: m.AdminDashboardView }))),
    isReal: true,
    notes: 'Dashboard de administraciÃ³n',
  },
  {
    checklistIds: [],
    section: 'dashboard-usuario',
    viewFile: 'UserDashboardView.tsx',
    component: React.lazy(() => import('../components/admin/views/UserDashboardView').then(m => ({ default: m.UserDashboardView }))),
    isReal: true,
    notes: 'Dashboard de usuario',
  },
  {
    checklistIds: [],
    section: 'config-vistas',
    viewFile: 'ConfigVistasPorRolView.tsx',
    component: React.lazy(() => import('../components/admin/views/ConfigVistasPorRolView').then(m => ({ default: m.ConfigVistasPorRolView }))),
    isReal: true,
    notes: 'ConfiguraciÃ³n de vistas por rol',
  },
  {
    checklistIds: [],
    section: 'documentacion',
    viewFile: 'DocumentacionView.tsx',
    component: React.lazy(() => import('../components/admin/views/DocumentacionView').then(m => ({ default: m.DocumentacionView }))),
    isReal: true,
    notes: 'DocumentaciÃ³n del sistema',
  },
  {
    checklistIds: [],
    section: 'metamap-config',
    viewFile: 'MetaMapView.tsx',
    component: React.lazy(() => import('../components/admin/views/MetaMapView').then(m => ({ default: m.MetaMapView }))),
    isReal: true,
    notes: 'ConfiguraciÃ³n Meta Map',
  },
  {
    checklistIds: [],
    section: 'google-maps-test',
    viewFile: 'GoogleMapsTestView.tsx',
    component: React.lazy(() => import('../components/admin/views/GoogleMapsTestView').then(m => ({ default: m.GoogleMapsTestView }))),
    isReal: true,
    notes: 'Test de Google Maps',
  },
];

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// HELPERS (consumidos por moduleRegistry y AuditPanel)
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

/** Set de todos los checklistIds cubiertos por vistas reales */
export const REAL_CHECKLIST_IDS = new Set<string>(
  MODULE_MANIFEST.filter(e => e.isReal).flatMap(e => e.checklistIds)
);

/** Map secciÃ³n â†’ entry del manifest */
export const MANIFEST_BY_SECTION = new Map<MainSection, ManifestEntry>(
  MODULE_MANIFEST.map(e => [e.section, e])
);
