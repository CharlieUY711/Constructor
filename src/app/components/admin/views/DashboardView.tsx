import React from 'react';
import { HubCardGrid, HubCardDef } from '../HubView';
import type { MainSection } from '../../../AdminDashboard';
import {
  ShoppingCart, Megaphone, Database,
  Truck, Wrench, Settings, TrendingUp,
  Package, Users, BarChart2, Plug, CheckSquare,
  DollarSign, Activity, Map,
} from 'lucide-react';
import { useOrchestrator } from '../../../../shells/DashboardShell/app/providers/OrchestratorProvider';

interface Props { onNavigate: (s: MainSection) => void; }

export function DashboardView({ onNavigate }: Props) {
  const { clienteNombre } = useOrchestrator();
  const nav = (s: MainSection) => () => onNavigate(s);

  /* ── Cards de módulos principales ── */
  const moduleCards: HubCardDef[] = [
    {
      id: 'ecommerce', icon: ShoppingCart, onClick: nav('ecommerce'),
      gradient: 'linear-gradient(135deg, #FF6835 0%, #e04e20 100%)', color: '#FF6835',
      badge: 'Comercial', label: 'eCommerce',
      description: 'Pedidos, pagos, catálogo, clientes, envíos y storefront multi-país.',
      stats: [{ icon: ShoppingCart, value: '—', label: 'Pedidos activos' }, { icon: DollarSign, value: '—', label: 'Ventas hoy' }, { icon: TrendingUp, value: '—', label: 'Crecimiento' }],
    },
    {
      id: 'marketing', icon: Megaphone, onClick: nav('marketing'),
      gradient: 'linear-gradient(135deg, #E1306C 0%, #833AB4 100%)', color: '#E1306C',
      badge: 'Marketing', label: 'Marketing',
      description: 'Campañas, email, RRSS, rueda de sorteos y programa de fidelización.',
      stats: [{ icon: Users, value: '—', label: 'Suscriptores' }, { icon: TrendingUp, value: '—', label: 'CTR' }, { icon: Megaphone, value: '—', label: 'Campañas' }],
    },
    {
      id: 'gestion', icon: Database, onClick: nav('gestion'),
      gradient: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)', color: '#3B82F6',
      badge: 'ERP · CRM', label: 'Gestión',
      description: 'ERP completo: inventario, facturación, compras, RRHH, CRM y proyectos.',
      stats: [{ icon: Package, value: '—', label: 'Productos' }, { icon: Users, value: '—', label: 'Clientes' }, { icon: BarChart2, value: '—', label: 'Facturas' }],
    },
    {
      id: 'logistica', icon: Truck, onClick: nav('logistica'),
      gradient: 'linear-gradient(135deg, #10B981 0%, #059669 100%)', color: '#10B981',
      badge: 'Logística', label: 'Logística',
      description: 'Envíos, rutas, transportistas, fulfillment, producción y abastecimiento.',
      stats: [{ icon: Truck, value: '—', label: 'Envíos activos' }, { icon: Map, value: '—', label: 'Rutas' }, { icon: Package, value: '—', label: 'OA pendientes' }],
    },
    {
      id: 'herramientas', icon: Wrench, onClick: nav('herramientas'),
      gradient: 'linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)', color: '#8B5CF6',
      badge: 'Herramientas', label: 'Suite de Herramientas',
      description: '6 workspaces + 3 herramientas rápidas. Editor, OCR, QR, docs y más.',
      stats: [{ icon: Activity, value: '6', label: 'Workspaces' }, { icon: Wrench, value: '3', label: 'Herramientas' }, { icon: CheckSquare, value: '100%', label: 'Browser' }],
    },
    {
      id: 'integraciones', icon: Plug, onClick: nav('integraciones'),
      gradient: 'linear-gradient(135deg, #14B8A6 0%, #0F766E 100%)', color: '#14B8A6',
      badge: 'Integraciones', label: 'Integraciones',
      description: 'Pagos, logística, tiendas, RRSS, servicios y repositorio de APIs.',
      stats: [{ icon: Plug, value: '6', label: 'Módulos' }, { icon: CheckSquare, value: '1', label: 'Conectadas' }, { icon: Settings, value: '65', label: 'Disponibles' }],
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', backgroundColor: '#F8F9FA' }}>
      {/* ── Contenido scrollable ── */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '48px 32px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        
        {/* ── Nombre del cliente ── */}
        <h1 style={{ 
          margin: '0 0 48px', 
          fontSize: '3rem', 
          fontWeight: '800', 
          color: '#1A1A2E',
          textAlign: 'center',
          lineHeight: 1.2,
        }}>
          {clienteNombre || 'Cliente'}
        </h1>

        {/* ── Módulos principales ── */}
        <div style={{ width: '100%', maxWidth: '1400px' }}>
          <div style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: '800', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Acceso rápido a módulos
            </p>
            <div style={{ flex: 1, height: 1, backgroundColor: '#E9ECEF' }} />
            <span style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>6 módulos</span>
          </div>
          <p style={{ fontSize: '0.85rem', color: '#6C757D', margin: '6px 0 20px' }}>
            Navegá directamente a cualquier sección del sistema
          </p>
          <HubCardGrid cards={moduleCards} />
        </div>

      </div>
    </div>
  );
}
