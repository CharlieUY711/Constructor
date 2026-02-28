/* =====================================================
   Charlie Marketplace Builder — AdminDashboard v2.0
   Shell principal — Orquestador dinámico
   ===================================================== */

import React, { useState } from 'react';
import { AdminSidebar }      from './components/admin/AdminSidebar';
import { OrchestratorShell } from './components/OrchestratorShell';
import { Toaster }           from 'sonner';
import type { MainSection }  from './AdminDashboard';

export type MainSection =
  | 'dashboard'
  | 'ecommerce'
  | 'marketing'
  | 'herramientas'
  | 'qr-generator'
  | 'gestion'
  | 'pos'
  | 'sistema'
  | 'diseno'
  | 'checklist'
  | 'integraciones'
  | 'migracion-rrss'
  | 'mailing'
  | 'google-ads'
  | 'rueda-sorteos'
  | 'fidelizacion'
  | 'redes-sociales'
  | 'rrss'
  | 'departamentos'
  | 'secondhand'
  | 'erp-inventario'
  | 'erp-facturacion'
  | 'erp-compras'
  | 'erp-crm'
  | 'erp-contabilidad'
  | 'erp-rrhh'
  | 'proyectos'
  | 'personas'
  | 'organizaciones'
  | 'clientes'
  | 'pedidos'
  | 'metodos-pago'
  | 'metodos-envio'
  | 'pagos'
  | 'envios'
  | 'logistica'
  | 'transportistas'
  | 'rutas'
  | 'produccion'
  | 'abastecimiento'
  | 'mapa-envios'
  | 'tracking-publico'
  | 'fulfillment'
  | 'seo'
  | 'etiqueta-emotiva'
  | 'roadmap'
  | 'ideas-board'
  | 'integraciones-pagos'
  | 'integraciones-logistica'
  | 'integraciones-tiendas'
  | 'integraciones-rrss'
  | 'integraciones-servicios'
  | 'integraciones-marketplace'
  | 'integraciones-comunicacion'
  | 'integraciones-identidad'
  | 'integraciones-api-keys'
  | 'integraciones-webhooks'
  // ── Workspace Suite ──────────────────────────────────────────────────────────
  | 'biblioteca'
  | 'editor-imagenes'
  | 'gen-documentos'
  | 'gen-presupuestos'
  | 'ocr'
  | 'impresion'
  // ── Auditoría & Diagnóstico ───────────────────────────────────────────────────
  | 'auditoria'
  | 'auditoria-health'
  | 'auditoria-logs'
  // ── Repositorio de APIs ───────────────────────────────────────────────────────
  | 'integraciones-apis'
  // ── Constructor ───────────────────────────────────────────────────────────────
  | 'constructor'
  // ── Nuevos módulos v2 ─────────────────────────────────────────────────────────
  | 'auth-registro'
  | 'carga-masiva'
  | 'meta-business'
  | 'unified-workspace'
  // ── Sistema: Dashboards + Config + Docs ───────────────────────────────────────
  | 'dashboard-admin'
  | 'dashboard-usuario'
  | 'config-vistas'
  | 'documentacion'
  | 'metamap-config'
  | 'google-maps-test';

export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState<MainSection>('dashboard');
  const nav = (s: MainSection) => setActiveSection(s);

  return (
    <>
      <Toaster position="top-right" richColors />
      <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', backgroundColor: '#F8F9FA', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif' }}>
        <AdminSidebar activeSection={activeSection} onNavigate={nav} />
        <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
          <OrchestratorShell activeSection={activeSection} onNavigate={nav} />
        </main>
      </div>
    </>
  );
}
