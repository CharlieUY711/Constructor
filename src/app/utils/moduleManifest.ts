/**
 * MODULE MANIFEST — Charlie Marketplace Builder v1.5
 * ═══════════════════════════════════════════════════
 * FUENTE ÚNICA DE VERDAD sobre qué vistas existen y qué IDs del checklist cubren.
 *
 * ┌─ REGLA ──────────────────────────────────────────────────────────────────────┐
 * │  Cuando construís una vista nueva, SOLO tenés que agregar/editar UNA entrada │
 * │  aquí. moduleRegistry.ts y el ChecklistRoadmap se actualizan solos.          │
 * └──────────────────────────────────────────────────────────────────────────────┘
 *
 * isReal = true  → Vista funcional con UI completa (puede ser mock o real Supabase)
 * isReal = false → Hub de navegación o placeholder; no cuenta como completado
 */

import React from 'react';
import type { MainSection } from '../AdminDashboard';

// ── Imports de todos los componentes ────────────────────────────────────────────
import { DashboardView }      from '../components/admin/views/DashboardView';
import { EcommerceView }      from '../components/admin/views/EcommerceView';
import { MarketingView }      from '../components/admin/views/MarketingView';
import { HerramientasView }   from '../components/admin/views/HerramientasView';
import { QrGeneratorView }    from '../components/admin/views/QrGeneratorView';
import { GestionView }        from '../components/admin/views/GestionView';
import { POSView }            from '../components/admin/views/POSView';
import { SistemaView }        from '../components/admin/views/SistemaView';
import { DisenoView }         from '../components/admin/views/DisenoView';
import { ChecklistView }      from '../components/admin/views/ChecklistView';
import { IntegracionesView }  from '../components/admin/views/IntegracionesView';
import { MigracionRRSSView }  from '../components/admin/views/MigracionRRSSView';
import { MailingView }        from '../components/admin/views/MailingView';
import { GoogleAdsView }      from '../components/admin/views/GoogleAdsView';
import { RuedaSorteosView }   from '../components/admin/views/RuedaSorteosView';
import { FidelizacionView }   from '../components/admin/views/FidelizacionView';
import { RedesSocialesView }  from '../components/admin/views/RedesSocialesView';
import { RRSSHubView }        from '../components/admin/views/RRSSHubView';
import { DepartamentosView }  from '../components/admin/views/DepartamentosView';
import { SecondHandView }     from '../components/admin/views/SecondHandView';
import { ERPInventarioView }  from '../components/admin/views/ERPInventarioView';
import { ERPFacturacionView } from '../components/admin/views/ERPFacturacionView';
import { ERPComprasView }     from '../components/admin/views/ERPComprasView';
import { ERPCRMView }         from '../components/admin/views/ERPCRMView';
import { ERPContabilidadView } from '../components/admin/views/ERPContabilidadView';
import { ERPRRHHView }        from '../components/admin/views/ERPRRHHView';
import { ProyectosView }      from '../components/admin/views/ProyectosView';
import { PersonasView }       from '../components/admin/views/PersonasView';
import { OrganizacionesView } from '../components/admin/views/OrganizacionesView';
import { ClientesView }       from '../components/admin/views/ClientesView';
import { PedidosView }        from '../components/admin/views/PedidosView';
import { MetodosPagoView }    from '../components/admin/views/MetodosPagoView';
import { MetodosEnvioView }   from '../components/admin/views/MetodosEnvioView';
import { PagosView }          from '../components/admin/views/PagosView';
import { EnviosView }         from '../components/admin/views/EnviosView';
import { LogisticaView }      from '../components/admin/views/LogisticaView';
import { EtiquetaEmotivaView } from '../components/admin/views/EtiquetaEmotivaView';
import { TransportistasView } from '../components/admin/views/TransportistasView';
import { RutasView }          from '../components/admin/views/RutasView';
import { FulfillmentView }    from '../components/admin/views/FulfillmentView';
import { ProduccionView }     from '../components/admin/views/ProduccionView';
import { AbastecimientoView } from '../components/admin/views/AbastecimientoView';
import { MapaEnviosView }     from '../components/admin/views/MapaEnviosView';
import { TrackingPublicoView } from '../components/admin/views/TrackingPublicoView';
import { SEOView }            from '../components/admin/views/SEOView';
import { IdeasBoardView }     from '../components/admin/views/IdeasBoardView';
import { IntegracionesPagosView }      from '../components/admin/views/IntegracionesPagosView';
import { IntegracionesLogisticaView }  from '../components/admin/views/IntegracionesLogisticaView';
import { IntegracionesTiendasView }    from '../components/admin/views/IntegracionesTiendasView';
import { IntegracionesRRSSView }       from '../components/admin/views/IntegracionesRRSSView';
import { IntegracionesServiciosView }  from '../components/admin/views/IntegracionesServiciosView';
import { IntegracionesComunicacionView } from '../components/admin/views/IntegracionesComunicacionView';
import { IntegracionesMarketplaceView } from '../components/admin/views/IntegracionesMarketplaceView';
import { IntegracionesIdentidadView }   from '../components/admin/views/IntegracionesIdentidadView';
import { APIKeysView }                  from '../components/admin/views/APIKeysView';
import { WebhooksView }                 from '../components/admin/views/WebhooksView';
import { BibliotecaWorkspace }         from '../components/admin/views/BibliotecaWorkspace';
import { EditorImagenesWorkspace }     from '../components/admin/views/EditorImagenesWorkspace';
import { GenDocumentosWorkspace }      from '../components/admin/views/GenDocumentosWorkspace';
import { GenPresupuestosWorkspace }    from '../components/admin/views/GenPresupuestosWorkspace';
import { OCRWorkspace }                from '../components/admin/views/OCRWorkspace';
import { ImpresionWorkspace }          from '../components/admin/views/ImpresionWorkspace';
import { AuditoriaHubView }            from '../components/admin/views/AuditoriaHubView';
import { HealthMonitorView }           from '../components/admin/views/HealthMonitorView';
import { SystemLogsView }              from '../components/admin/views/SystemLogsView';
import { RepositorioAPIsView }         from '../components/admin/views/RepositorioAPIsView';
import { ConstructorView }             from '../components/admin/views/ConstructorView';
import { AuthRegistroView }            from '../components/admin/views/AuthRegistroView';
import { CargaMasivaView }             from '../components/admin/views/CargaMasivaView';
import { MetaBusinessView }            from '../components/admin/views/MetaBusinessView';
import { UnifiedWorkspaceView }        from '../components/admin/views/UnifiedWorkspaceView';
import { AdminDashboardView }          from '../components/admin/views/AdminDashboardView';
import { UserDashboardView }           from '../components/admin/views/UserDashboardView';
import { ConfigVistasPorRolView }      from '../components/admin/views/ConfigVistasPorRolView';
import { DocumentacionView }           from '../components/admin/views/DocumentacionView';
import { MetaMapView }                 from '../components/admin/views/MetaMapView';
import { GoogleMapsTestView }          from '../components/admin/views/GoogleMapsTestView';

export interface ManifestEntry {
  /** IDs exactos en MODULES_DATA que esta vista cubre (vacío = hub, no mapea nada) */
  checklistIds: string[];
  /** Sección en AdminDashboard / sidebar */
  section: MainSection;
  /** Nombre del archivo de vista (solo informativo) */
  viewFile: string;
  /** Componente React correspondiente a esta vista */
  component: React.ComponentType<{ onNavigate: (s: MainSection) => void }> | React.ComponentType<{}> | null;
  /** true = vista funcional real | false = hub de navegación o placeholder */
  isReal: boolean;
  /** ¿Conecta con Supabase/backend? */
  hasSupabase?: boolean;
  /** Nota descriptiva */
  notes?: string;
}

export const MODULE_MANIFEST: ManifestEntry[] = [

  // ══════════════════════════════════════════════════════
  // ADMIN / SISTEMA
  // ══════════════════════════════════════════════════════
  {
    checklistIds: ['admin-settings', 'admin-users'],
    section: 'dashboard',
    viewFile: 'DashboardView.tsx',
    component: DashboardView,
    isReal: true,
    notes: 'Dashboard con métricas, charts y navegación rápida',
  },
  {
    checklistIds: ['admin-settings', 'admin-users'],
    section: 'sistema',
    viewFile: 'SistemaView.tsx',
    component: SistemaView,
    isReal: true,
    notes: 'Configuración del sistema — hub con cards de config',
  },
  {
    checklistIds: ['admin-users'],
    section: 'departamentos',
    viewFile: 'DepartamentosView.tsx',
    component: DepartamentosView,
    isReal: true,
    notes: 'Gestión de departamentos, roles y permisos',
  },
  {
    checklistIds: ['admin-settings'],
    section: 'checklist',
    viewFile: 'ChecklistView.tsx',
    component: ChecklistView,
    isReal: true,
    notes: 'Vista del checklist / roadmap con audit integrado',
  },
  {
    checklistIds: [],
    section: 'diseno',
    viewFile: 'DisenoView.tsx',
    component: DisenoView,
    isReal: false,
    notes: 'Hub de diseño y branding (tabs de navegación)',
  },

  // ══════════════════════════════════════════════════════
  // BASE DE PERSONAS
  // ══════════════════════════════════════════════════════
  {
    checklistIds: ['base-personas'],
    section: 'personas',
    viewFile: 'PersonasView.tsx',
    component: PersonasView,
    isReal: true,
    hasSupabase: true,
    notes: 'CRUD completo de personas físicas y jurídicas',
  },
  {
    checklistIds: ['base-personas'],
    section: 'organizaciones',
    viewFile: 'OrganizacionesView.tsx',
    component: OrganizacionesView,
    isReal: true,
    hasSupabase: true,
    notes: 'CRUD completo de empresas y organizaciones',
  },
  {
    checklistIds: ['base-personas'],
    section: 'clientes',
    viewFile: 'ClientesView.tsx',
    component: ClientesView,
    isReal: true,
    hasSupabase: true,
    notes: 'Vista filtrada de personas/organizaciones con rol cliente',
  },

  // ══════════════════════════════════════════════════════
  // eCOMMERCE
  // ══════════════════════════════════════════════════════
  {
    checklistIds: [],
    section: 'ecommerce',
    viewFile: 'EcommerceView.tsx',
    component: EcommerceView,
    isReal: false,
    notes: 'Hub de navegación eCommerce (cards a sub-módulos)',
  },
  {
    checklistIds: ['ecommerce-pedidos'],
    section: 'pedidos',
    viewFile: 'PedidosView.tsx',
    component: PedidosView,
    isReal: true,
    hasSupabase: true,
    notes: 'CRUD de pedidos con estados, filtros y árbol madre/hijos',
  },
  {
    checklistIds: ['ecommerce-pedidos'],
    section: 'pagos',
    viewFile: 'PagosView.tsx',
    component: PagosView,
    isReal: true,
    hasSupabase: true,
    notes: 'Transacciones y estados de pago operativos',
  },
  {
    checklistIds: ['ecommerce-metodos-pago'],
    section: 'metodos-pago',
    viewFile: 'MetodosPagoView.tsx',
    component: MetodosPagoView,
    isReal: true,
    hasSupabase: true,
    notes: 'Configuración de pasarelas y métodos de pago',
  },
  {
    checklistIds: ['ecommerce-metodos-envio'],
    section: 'metodos-envio',
    viewFile: 'MetodosEnvioView.tsx',
    component: MetodosEnvioView,
    isReal: true,
    hasSupabase: true,
    notes: 'Configuración de métodos de envío y tarifas',
  },

  // ══════════════════════════════════════════════════════
  // LOGÍSTICA
  // ══════════════════════════════════════════════════════
  {
    checklistIds: ['logistics-hub'],
    section: 'logistica',
    viewFile: 'LogisticaView.tsx',
    component: LogisticaView,
    isReal: false,
    notes: 'Hub con diagrama de flujo logístico 7 pasos y cards a todos los sub-módulos',
  },
  {
    checklistIds: ['logistics-shipping'],
    section: 'envios',
    viewFile: 'EnviosView.tsx',
    component: EnviosView,
    isReal: true,
    hasSupabase: true,
    notes: 'Vista árbol PedidoMadre→EnvíosHijos · estados · multi-tramo · panel detalle + timeline',
  },
  {
    checklistIds: ['logistics-carriers'],
    section: 'transportistas',
    viewFile: 'TransportistasView.tsx',
    component: TransportistasView,
    isReal: true,
    hasSupabase: false,
    notes: 'Catálogo carriers · tramos y zonas · simulador de tarifas',
  },
  {
    checklistIds: ['logistics-routes'],
    section: 'rutas',
    viewFile: 'RutasView.tsx',
    component: RutasView,
    isReal: true,
    hasSupabase: false,
    notes: 'Rutas standard y por proyecto · vista detalle con paradas · progreso de entrega',
  },
  {
    checklistIds: ['logistics-fulfillment'],
    section: 'fulfillment',
    viewFile: 'FulfillmentView.tsx',
    component: FulfillmentView,
    isReal: true,
    hasSupabase: false,
    notes: 'Wave picking · lotes · cola de órdenes · empaque · materiales de packaging',
  },
  {
    checklistIds: ['logistics-production'],
    section: 'produccion',
    viewFile: 'ProduccionView.tsx',
    component: ProduccionView,
    isReal: true,
    hasSupabase: false,
    notes: 'BOM · órdenes de armado · catálogo de kits / canastas / combos / packs',
  },
  {
    checklistIds: ['logistics-supply'],
    section: 'abastecimiento',
    viewFile: 'AbastecimientoView.tsx',
    component: AbastecimientoView,
    isReal: true,
    hasSupabase: false,
    notes: 'Alertas de stock · OC sugeridas · MRP con cálculo de componentes necesarios',
  },
  {
    checklistIds: ['logistics-map'],
    section: 'mapa-envios',
    viewFile: 'MapaEnviosView.tsx',
    component: MapaEnviosView,
    isReal: true,
    hasSupabase: false,
    notes: 'Mapa SVG de Argentina con puntos de envíos activos · filtro por estado · tooltip detalle',
  },
  {
    checklistIds: ['logistics-tracking'],
    section: 'tracking-publico',
    viewFile: 'TrackingPublicoView.tsx',
    component: TrackingPublicoView,
    isReal: true,
    hasSupabase: false,
    notes: 'Búsqueda por número de envío · timeline de estados · link público para destinatarios',
  },

  // ══════════════════════════════════════════════════════
  // MARKETING
  // ══════════════════════════════════════════════════════
  {
    checklistIds: [],
    section: 'marketing',
    viewFile: 'MarketingView.tsx',
    component: MarketingView,
    isReal: false,
    notes: 'Hub de navegación Marketing (cards a sub-módulos)',
  },
  {
    checklistIds: ['marketing-campaigns'],
    section: 'google-ads',
    viewFile: 'GoogleAdsView.tsx',
    component: GoogleAdsView,
    isReal: true,
    notes: 'Dashboard Google Ads con charts recharts, KPIs y tabla de campañas',
  },
  {
    checklistIds: ['marketing-email', 'marketing-email-bulk'],
    section: 'mailing',
    viewFile: 'MailingView.tsx',
    component: MailingView,
    isReal: true,
    hasSupabase: false,
    notes: 'UI completa (5 tabs: Campañas, Suscriptores, Segmentación, A/B Testing, Analíticas) — MOCK DATA. Resend API no conectada aún.',
  },
  {
    checklistIds: ['marketing-seo'],
    section: 'seo',
    viewFile: 'SEOView.tsx',
    component: SEOView,
    isReal: true,
    hasSupabase: false,
    notes: 'Dashboard SEO · Keywords + rankings · análisis on-page de páginas · backlinks · salud SEO · sugerencias IA',
  },
  {
    checklistIds: ['marketing-loyalty'],
    section: 'fidelizacion',
    viewFile: 'FidelizacionView.tsx',
    component: FidelizacionView,
    isReal: true,
    notes: 'Programa de fidelización con niveles y charts',
  },
  {
    checklistIds: ['marketing-loyalty'],
    section: 'rueda-sorteos',
    viewFile: 'RuedaSorteosView.tsx',
    component: RuedaSorteosView,
    isReal: true,
    notes: 'Rueda de sorteos interactiva con premios configurables',
  },
  {
    checklistIds: ['rrss-centro-operativo'],
    section: 'redes-sociales',
    viewFile: 'RedesSocialesView.tsx',
    component: RedesSocialesView,
    isReal: true,
    notes: 'Centro Operativo RRSS — métricas, programación de posts y análisis de audiencia',
  },
  {
    checklistIds: ['rrss-migracion'],
    section: 'migracion-rrss',
    viewFile: 'MigracionRRSSView.tsx',
    component: MigracionRRSSView,
    isReal: true,
    notes: 'Herramienta de migración/rebranding Instagram + Facebook',
  },
  {
    checklistIds: ['marketing-etiqueta-emotiva'],
    section: 'etiqueta-emotiva',
    viewFile: 'EtiquetaEmotivaView.tsx',
    component: EtiquetaEmotivaView,
    isReal: true,
    hasSupabase: true,
    notes: 'Mensajes personalizados con QR para envíos · Supabase + QR real',
  },

  // ══════════════════════════════════════════════════════
  // RRSS
  // ══════════════════════════════════════════════════════
  {
    checklistIds: [],
    section: 'rrss',
    viewFile: 'RRSSHubView.tsx',
    component: RRSSHubView,
    isReal: false,
    notes: 'Hub de navegación RRSS — Centro Operativo + Migración RRSS',
  },

  // ══════════════════════════════════════════════════════
  // HERRAMIENTAS
  // ══════════════════════════════════════════════════════
  {
    checklistIds: [],
    section: 'herramientas',
    viewFile: 'HerramientasView.tsx',
    component: HerramientasView,
    isReal: false,
    notes: 'Hub de navegación — 6 workspace tools + 3 herramientas rápidas',
  },
  {
    checklistIds: ['tools-library'],
    section: 'biblioteca',
    viewFile: 'BibliotecaWorkspace.tsx',
    component: BibliotecaWorkspace,
    isReal: true,
    hasSupabase: false,
    notes: 'Biblioteca de assets — upload drag&drop, colecciones, tags, grid/lista, export',
  },
  {
    checklistIds: ['tools-image-editor'],
    section: 'editor-imagenes',
    viewFile: 'EditorImagenesWorkspace.tsx',
    component: EditorImagenesWorkspace,
    isReal: true,
    hasSupabase: false,
    notes: 'Editor de imágenes — filtros CSS, rotación, flip, 8 presets, export PNG/JPG',
  },
  {
    checklistIds: ['tools-documents'],
    section: 'gen-documentos',
    viewFile: 'GenDocumentosWorkspace.tsx',
    component: GenDocumentosWorkspace,
    isReal: true,
    hasSupabase: false,
    notes: 'Generador de documentos WYSIWYG — 8 tipos de bloque, A4, export PDF',
  },
  {
    checklistIds: ['tools-quotes'],
    section: 'gen-presupuestos',
    viewFile: 'GenPresupuestosWorkspace.tsx',
    component: GenPresupuestosWorkspace,
    isReal: true,
    hasSupabase: false,
    notes: 'Generador de presupuestos — ítems, IVA, descuentos, multi-moneda, export PDF',
  },
  {
    checklistIds: ['tools-ocr'],
    section: 'ocr',
    viewFile: 'OCRWorkspace.tsx',
    component: OCRWorkspace,
    isReal: true,
    hasSupabase: false,
    notes: 'OCR con Tesseract.js — 100% browser, sin API key, Español/Inglés/PT, export TXT',
  },
  {
    checklistIds: ['tools-print'],
    section: 'impresion',
    viewFile: 'ImpresionWorkspace.tsx',
    component: ImpresionWorkspace,
    isReal: true,
    hasSupabase: false,
    notes: 'Módulo de impresión — cola de trabajos, A4 preview, papel/orientación/color/calidad',
  },
  {
    checklistIds: ['tools-qr'],
    section: 'qr-generator',
    viewFile: 'QrGeneratorView.tsx',
    component: QrGeneratorView,
    isReal: true,
    notes: 'Generador QR — sin APIs externas, genera PNG y SVG vectorial',
  },
  {
    checklistIds: ['tools-ideas-board'],
    section: 'ideas-board',
    viewFile: 'IdeasBoardView.tsx',
    component: IdeasBoardView,
    isReal: true,
    hasSupabase: true,
    notes: 'Canvas visual de módulos e ideas — stickers, conectores, canvases jerárquicos, lamparita en Mi Vista',
  },

  // ══════════════════════════════════════════════════════
  // ERP
  // ══════════════════════════════════════════════════════
  {
    checklistIds: [],
    section: 'gestion',
    viewFile: 'GestionView.tsx',
    component: GestionView,
    isReal: false,
    notes: 'Hub de navegación ERP (cards a Inventario, Facturación, Compras, CRM, etc.)',
  },
  {
    checklistIds: ['erp-inventory'],
    section: 'erp-inventario',
    viewFile: 'ERPInventarioView.tsx',
    component: ERPInventarioView,
    isReal: true,
    notes: 'Inventario con tabs: Artículos, Stock, Movimientos, Alertas',
  },
  {
    checklistIds: ['erp-invoicing'],
    section: 'erp-facturacion',
    viewFile: 'ERPFacturacionView.tsx',
    component: ERPFacturacionView,
    isReal: true,
    notes: 'Facturación con tabs: Facturas, Tickets, Nueva factura',
  },
  {
    checklistIds: ['erp-purchasing'],
    section: 'erp-compras',
    viewFile: 'ERPComprasView.tsx',
    component: ERPComprasView,
    isReal: true,
    notes: 'Compras con tabs: Órdenes, Proveedores, Nueva orden',
  },
  {
    checklistIds: ['crm-contacts', 'crm-opportunities', 'crm-activities'],
    section: 'erp-crm',
    viewFile: 'ERPCRMView.tsx',
    component: ERPCRMView,
    isReal: true,
    notes: 'CRM completo: Contactos, Pipeline de oportunidades, Actividades y seguimiento',
  },
  {
    checklistIds: ['erp-accounting'],
    section: 'erp-contabilidad',
    viewFile: 'ERPContabilidadView.tsx',
    component: ERPContabilidadView,
    isReal: true,
    notes: 'Contabilidad: Plan de cuentas, Asientos, Cobrar/Pagar, Bancos',
  },
  {
    checklistIds: ['erp-hr'],
    section: 'erp-rrhh',
    viewFile: 'ERPRRHHView.tsx',
    component: ERPRRHHView,
    isReal: true,
    notes: 'RRHH: Empleados, Asistencia y Nómina',
  },

  // ══════════════════════════════════════════════════════
  // PROYECTOS
  // ══════════════════════════════════════════════════════
  {
    checklistIds: ['projects-management', 'projects-tasks', 'projects-time'],
    section: 'proyectos',
    viewFile: 'ProyectosView.tsx',
    component: ProyectosView,
    isReal: true,
    notes: 'Proyectos con Gantt simplificado y tablero Kanban',
  },

  // ══════════════════════════════════════════════════════
  // MARKETPLACE
  // ══════════════════════════════════════════════════════
  {
    checklistIds: ['marketplace-secondhand', 'marketplace-secondhand-mediacion'],
    section: 'secondhand',
    viewFile: 'SecondHandView.tsx',
    component: SecondHandView,
    isReal: true,
    notes: 'Marketplace Segunda Mano: Estadísticas, Moderación, Publicaciones y ⚖️ Mediación de disputas',
  },
  {
    checklistIds: ['marketplace-storefront'],
    section: 'storefront',
    viewFile: 'StorefrontAdminView.tsx',
    component: null, // StorefrontAdminView no está importado en AdminDashboard, se omite por ahora
    isReal: true,
    notes: 'Panel de acceso rápido al storefront público con stats y links',
  },

  // ══════════════════════════════════════════════════════
  // INTEGRACIONES
  // ══════════════════════════════════════════════════════
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
    component: IntegracionesView,
    isReal: true,
    notes: 'Hub de 5 módulos de integración — Uruguay first, Latam progresivo',
  },
  {
    checklistIds: ['integrations-plexo', 'integrations-mercadopago', 'integrations-paypal', 'integrations-stripe'],
    section: 'integraciones-pagos',
    viewFile: 'IntegracionesPagosView.tsx',
    component: IntegracionesPagosView,
    isReal: true,
    notes: '💳 Pasarela de pagos — Plexo, OCA, Abitab, RedPagos, MP, PayPal, Stripe',
  },
  {
    checklistIds: ['integrations-logistics'],
    section: 'integraciones-logistica',
    viewFile: 'IntegracionesLogisticaView.tsx',
    component: IntegracionesLogisticaView,
    isReal: true,
    notes: '🚚 Logística — Carriers con y sin API. URL de tracking configurable para carriers sin API',
  },
  {
    checklistIds: ['integrations-mercadolibre'],
    section: 'integraciones-tiendas',
    viewFile: 'IntegracionesTiendasView.tsx',
    component: IntegracionesTiendasView,
    isReal: true,
    notes: '🏪 Tiendas — ML, TiendaNube, WooCommerce, Shopify, VTEX, Magento',
  },
  {
    checklistIds: ['integrations-meta'],
    section: 'integraciones-rrss',
    viewFile: 'IntegracionesRRSSView.tsx',
    component: IntegracionesRRSSView,
    isReal: true,
    notes: '📱 Redes Sociales — Meta, Instagram Shopping, WhatsApp, Facebook Shops, TikTok, Pinterest',
  },
  {
    checklistIds: ['integrations-twilio'],
    section: 'integraciones-servicios',
    viewFile: 'IntegracionesServiciosView.tsx',
    component: IntegracionesServiciosView,
    isReal: true,
    notes: '⚙️ Servicios — Twilio, Resend, SendGrid, GA4, GTM, Zapier, n8n',
  },
  {
    checklistIds: [],
    section: 'integraciones-marketplace',
    viewFile: 'IntegracionesMarketplaceView.tsx',
    component: IntegracionesMarketplaceView,
    isReal: true,
    notes: 'Marketplace integrations',
  },
  {
    checklistIds: [],
    section: 'integraciones-comunicacion',
    viewFile: 'IntegracionesComunicacionView.tsx',
    component: IntegracionesComunicacionView,
    isReal: true,
    notes: 'Comunicación integrations',
  },
  {
    checklistIds: [],
    section: 'integraciones-identidad',
    viewFile: 'IntegracionesIdentidadView.tsx',
    component: IntegracionesIdentidadView,
    isReal: true,
    notes: 'Identidad integrations',
  },
  {
    checklistIds: [],
    section: 'integraciones-api-keys',
    viewFile: 'APIKeysView.tsx',
    component: APIKeysView,
    isReal: true,
    notes: 'API Keys management',
  },
  {
    checklistIds: [],
    section: 'integraciones-webhooks',
    viewFile: 'WebhooksView.tsx',
    component: WebhooksView,
    isReal: true,
    notes: 'Webhooks management',
  },
  // ══════════════════════════════════════════════════════
  // AUDITORÍA & DIAGNÓSTICO
  // ══════════════════════════════════════════════════════
  {
    checklistIds: ['audit-hub'],
    section: 'auditoria',
    viewFile: 'AuditoriaHubView.tsx',
    component: AuditoriaHubView,
    isReal: true,
    hasSupabase: false,
    notes: '🔍 Hub Auditoría — métricas de estado, diagnóstico rápido y acceso a todas las herramientas',
  },
  {
    checklistIds: ['audit-health'],
    section: 'auditoria-health',
    viewFile: 'HealthMonitorView.tsx',
    component: HealthMonitorView,
    isReal: true,
    hasSupabase: true,
    notes: '💚 Health Monitor — verifica en tiempo real Supabase DB/Auth/Edge/KV/Storage + APIs externas',
  },
  {
    checklistIds: ['audit-logs'],
    section: 'auditoria-logs',
    viewFile: 'SystemLogsView.tsx',
    component: SystemLogsView,
    isReal: true,
    hasSupabase: false,
    notes: '📜 Logs del Sistema — registro de actividad, errores y eventos con filtros y export TXT',
  },
  {
    checklistIds: ['audit-apis-repo'],
    section: 'integraciones-apis',
    viewFile: 'RepositorioAPIsView.tsx',
    component: RepositorioAPIsView,
    isReal: true,
    hasSupabase: false,
    notes: '📡 Repositorio centralizado — 23 APIs con estado, credenciales, docs y test de conexión',
  },

  // ══════════════════════════════════════════════════════
  // MÓDULOS ADICIONALES
  // ══════════════════════════════════════════════════════
  {
    checklistIds: [],
    section: 'pos',
    viewFile: 'POSView.tsx',
    component: POSView,
    isReal: true,
    notes: 'Punto de Venta',
  },
  {
    checklistIds: ['admin-settings'],
    section: 'roadmap',
    viewFile: 'ChecklistView.tsx',
    component: ChecklistView,
    isReal: true,
    notes: 'Roadmap (alias de checklist)',
  },
  {
    checklistIds: [],
    section: 'constructor',
    viewFile: 'ConstructorView.tsx',
    component: ConstructorView,
    isReal: true,
    notes: 'Constructor de módulos',
  },
  {
    checklistIds: [],
    section: 'auth-registro',
    viewFile: 'AuthRegistroView.tsx',
    component: AuthRegistroView,
    isReal: true,
    notes: 'Autenticación y registro',
  },
  {
    checklistIds: [],
    section: 'carga-masiva',
    viewFile: 'CargaMasivaView.tsx',
    component: CargaMasivaView,
    isReal: true,
    notes: 'Carga masiva de datos',
  },
  {
    checklistIds: [],
    section: 'meta-business',
    viewFile: 'MetaBusinessView.tsx',
    component: MetaBusinessView,
    isReal: true,
    notes: 'Meta Business integration',
  },
  {
    checklistIds: [],
    section: 'unified-workspace',
    viewFile: 'UnifiedWorkspaceView.tsx',
    component: UnifiedWorkspaceView,
    isReal: true,
    notes: 'Workspace unificado',
  },
  {
    checklistIds: [],
    section: 'dashboard-admin',
    viewFile: 'AdminDashboardView.tsx',
    component: AdminDashboardView,
    isReal: true,
    notes: 'Dashboard de administración',
  },
  {
    checklistIds: [],
    section: 'dashboard-usuario',
    viewFile: 'UserDashboardView.tsx',
    component: UserDashboardView,
    isReal: true,
    notes: 'Dashboard de usuario',
  },
  {
    checklistIds: [],
    section: 'config-vistas',
    viewFile: 'ConfigVistasPorRolView.tsx',
    component: ConfigVistasPorRolView,
    isReal: true,
    notes: 'Configuración de vistas por rol',
  },
  {
    checklistIds: [],
    section: 'documentacion',
    viewFile: 'DocumentacionView.tsx',
    component: DocumentacionView,
    isReal: true,
    notes: 'Documentación del sistema',
  },
  {
    checklistIds: [],
    section: 'metamap-config',
    viewFile: 'MetaMapView.tsx',
    component: MetaMapView,
    isReal: true,
    notes: 'Configuración Meta Map',
  },
  {
    checklistIds: [],
    section: 'google-maps-test',
    viewFile: 'GoogleMapsTestView.tsx',
    component: GoogleMapsTestView,
    isReal: true,
    notes: 'Test de Google Maps',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS (consumidos por moduleRegistry y AuditPanel)
// ─────────────────────────────────────────────────────────────────────────────

/** Set de todos los checklistIds cubiertos por vistas reales */
export const REAL_CHECKLIST_IDS = new Set<string>(
  MODULE_MANIFEST.filter(e => e.isReal).flatMap(e => e.checklistIds)
);

/** Map sección → entry del manifest */
export const MANIFEST_BY_SECTION = new Map<MainSection, ManifestEntry>(
  MODULE_MANIFEST.map(e => [e.section, e])
);