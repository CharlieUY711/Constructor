/* =====================================================
   Logística — Hub Principal
   Espacio modular para gestión logística completa
   ===================================================== */
import React from 'react';
import { OrangeHeader } from '../OrangeHeader';
import type { MainSection } from '../../../AdminDashboard';
import {
  Truck, Map, Users, Package, ShoppingCart,
  Navigation, Clock, CheckCircle, ArrowRight,
  Layers, GitBranch,
} from 'lucide-react';

interface Props { onNavigate: (section: MainSection) => void; }

const ORANGE = '#FF6835';

interface ModuloDef {
  id: string;
  icon: React.ElementType;
  label: string;
  description: string;
  color: string;
  bg: string;
  estado: 'activo' | 'proximo';
  tags?: string[];
  navSection?: MainSection;
}

const MODULOS: ModuloDef[] = [
  {
    id: 'envios',
    icon: Truck,
    label: 'Envíos',
    description: 'Tracking operativo de envíos. Vista árbol pedido madre → envíos hijos. Acuse de recibo por transportista o destinatario.',
    color: '#FF6835',
    bg: '#FFF4EC',
    estado: 'activo',
    tags: ['Árbol', 'Tracking', 'Multi-tramo'],
    navSection: 'envios',
  },
  {
    id: 'transportistas',
    icon: Users,
    label: 'Transportistas',
    description: 'Catálogo de carriers. Tramos y tarifas multi-carrier (local + intercity + internacional). Simulador de tarifas.',
    color: '#0EA5E9',
    bg: '#F0F9FF',
    estado: 'activo',
    tags: ['Carriers', 'Tramos', 'Tarifas'],
    navSection: 'transportistas',
  },
  {
    id: 'rutas',
    icon: Map,
    label: 'Rutas',
    description: 'Gestión de rutas standard y personalizadas por proyecto. Mapa de paradas y progreso de entrega.',
    color: '#6366F1',
    bg: '#EEF2FF',
    estado: 'activo',
    tags: ['Standard', 'Por proyecto', 'Paradas'],
    navSection: 'rutas',
  },
  {
    id: 'fulfillment',
    icon: Layers,
    label: 'Fulfillment / Picking',
    description: 'Wave picking, lotes de pedidos, empaque y procesamiento de órdenes en el depósito.',
    color: '#7C3AED',
    bg: '#F5F3FF',
    estado: 'activo',
    tags: ['Wave Picking', 'Lotes', 'Empaque'],
    navSection: 'fulfillment',
  },
  {
    id: 'produccion',
    icon: Package,
    label: 'Producción / Armado',
    description: 'Órdenes de armado orientadas a ruta. BOM (Bill of Materials) para kits, canastas y combos.',
    color: '#10B981',
    bg: '#F0FDF4',
    estado: 'activo',
    tags: ['BOM', 'Kits', 'Canastas'],
    navSection: 'produccion',
  },
  {
    id: 'abastecimiento',
    icon: ShoppingCart,
    label: 'Abastecimiento',
    description: 'OC automáticas por faltantes de stock. MRP para cálculo de componentes necesarios.',
    color: '#F59E0B',
    bg: '#FFFBEB',
    estado: 'activo',
    tags: ['OC automática', 'MRP', 'Stock reserva'],
    navSection: 'abastecimiento',
  },
  {
    id: 'mapa',
    icon: Navigation,
    label: 'Mapa de Envíos',
    description: 'Vista geográfica de envíos activos por ruta y estado. Mapa interactivo de Argentina.',
    color: '#EC4899',
    bg: '#FDF2F8',
    estado: 'activo',
    tags: ['Mapa', 'Tiempo real', 'Por ruta'],
    navSection: 'mapa-envios',
  },
  {
    id: 'tracking',
    icon: CheckCircle,
    label: 'Tracking Público',
    description: 'Página pública de seguimiento. Destinatarios pueden rastrear su envío sin login.',
    color: '#059669',
    bg: '#ECFDF5',
    estado: 'activo',
    tags: ['Público', 'Timeline', 'Notificaciones'],
    navSection: 'tracking-publico',
  },
];

const FLUJO_STEPS = [
  { icon: ShoppingCart,  label: 'OC / Compra',       sub: 'Origen comercial'          },
  { icon: Layers,        label: 'Pedido Madre',       sub: 'PEDX15000'                 },
  { icon: GitBranch,     label: 'Pedidos Hijos',      sub: 'PEDX15000-001, 002...'     },
  { icon: Map,           label: 'Asignación de Ruta', sub: 'Automática por Google Maps' },
  { icon: Package,       label: 'Producción',         sub: 'Armado por ruta/prioridad' },
  { icon: Truck,         label: 'Envíos Hijos',       sub: 'PEDX15000-ENV001, 002...'  },
  { icon: CheckCircle,   label: 'Acuse de Recibo',    sub: 'Transportista / Destinatario' },
];

export function LogisticaView({ onNavigate }: Props) {
  const activos = MODULOS.filter(m => m.estado === 'activo');
  const proximos = MODULOS.filter(m => m.estado === 'proximo');

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <OrangeHeader
        title="Logística"
        subtitle="Rutas, envíos, transportistas, producción y abastecimiento"
      />

      <div style={{ flex: 1, overflowY: 'auto', backgroundColor: '#F8F9FA', padding: '28px' }}>

        {/* ── Flujo general ── */}
        <div style={{ backgroundColor: '#fff', borderRadius: '16px', border: '1px solid #E5E7EB', padding: '24px', marginBottom: '28px' }}>
          <div style={{ marginBottom: '20px' }}>
            <h2 style={{ margin: 0, fontSize: '15px', fontWeight: 800, color: '#111' }}>Flujo Logístico Completo</h2>
            <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#6B7280' }}>
              De la orden de compra al acuse de recibo — un mismo objeto visto desde dos ángulos: Pedidos (comercial) y Envíos (logístico)
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0', overflowX: 'auto', paddingBottom: '4px' }}>
            {FLUJO_STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <React.Fragment key={step.label}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', minWidth: '110px', flexShrink: 0 }}>
                    <div style={{
                      width: '48px', height: '48px', borderRadius: '50%',
                      backgroundColor: i === 0 ? '#FFF4EC' : i === FLUJO_STEPS.length - 1 ? '#F0FDF4' : '#F9FAFB',
                      border: `2px solid ${i === 0 ? ORANGE : i === FLUJO_STEPS.length - 1 ? '#10B981' : '#E5E7EB'}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <Icon size={20} color={i === 0 ? ORANGE : i === FLUJO_STEPS.length - 1 ? '#10B981' : '#6B7280'} strokeWidth={1.8} />
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '12px', fontWeight: 700, color: '#111', whiteSpace: 'nowrap' }}>{step.label}</div>
                      <div style={{ fontSize: '10px', color: '#9CA3AF', marginTop: '2px', lineHeight: '1.3' }}>{step.sub}</div>
                    </div>
                  </div>
                  {i < FLUJO_STEPS.length - 1 && (
                    <ArrowRight size={16} color="#D1D5DB" style={{ flexShrink: 0, margin: '0 4px', marginBottom: '20px' }} />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* ── KPIs placeholder ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '28px' }}>
          {[
            { label: 'Envíos activos',     value: '—', icon: Truck,        color: ORANGE   },
            { label: 'En tránsito',        value: '—', icon: Navigation,   color: '#6366F1' },
            { label: 'Entregados hoy',     value: '—', icon: CheckCircle,  color: '#10B981' },
            { label: 'Pendientes salida',  value: '—', icon: Clock,        color: '#F59E0B' },
          ].map(k => {
            const Icon = k.icon;
            return (
              <div key={k.label} style={{ backgroundColor: '#fff', borderRadius: '14px', border: '1px solid #E5E7EB', padding: '20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: k.color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={20} color={k.color} strokeWidth={2} />
                </div>
                <div>
                  <div style={{ fontSize: '26px', fontWeight: 800, color: '#111', lineHeight: 1 }}>{k.value}</div>
                  <div style={{ fontSize: '12px', color: '#6B7280', marginTop: '4px' }}>{k.label}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Módulos activos ── */}
        {activos.length > 0 && (
          <div style={{ marginBottom: '28px' }}>
            <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h2 style={{ margin: 0, fontSize: '15px', fontWeight: 800, color: '#111' }}>Módulos disponibles</h2>
              <span style={{ backgroundColor: '#F0FDF4', color: '#059669', fontSize: '11px', fontWeight: 700, padding: '3px 10px', borderRadius: '20px', border: '1px solid #BBF7D0' }}>
                {activos.length} activo{activos.length > 1 ? 's' : ''}
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
              {activos.map(m => <ModuloCard key={m.id} modulo={m} onNavigate={onNavigate} />)}
            </div>
          </div>
        )}

        {/* ── Módulos próximos ── */}
        <div>
          <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h2 style={{ margin: 0, fontSize: '15px', fontWeight: 800, color: '#111' }}>Módulos en desarrollo</h2>
            <span style={{ backgroundColor: '#FFF4EC', color: ORANGE, fontSize: '11px', fontWeight: 700, padding: '3px 10px', borderRadius: '20px', border: '1px solid #FDBA74' }}>
              {proximos.length} módulos
            </span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            {proximos.map(m => <ModuloCard key={m.id} modulo={m} onNavigate={onNavigate} />)}
          </div>
        </div>

      </div>
    </div>
  );
}

/* ── Módulo Card ── */
function ModuloCard({ modulo, onNavigate }: { modulo: ModuloDef; onNavigate: (s: MainSection) => void }) {
  const Icon = modulo.icon;
  const activo = modulo.estado === 'activo';

  return (
    <button
      onClick={activo && modulo.navSection ? () => onNavigate(modulo.navSection!) : undefined}
      style={{
        backgroundColor: '#fff',
        border: `1.5px solid ${activo ? modulo.color + '40' : '#E5E7EB'}`,
        borderRadius: '16px',
        padding: '22px',
        cursor: activo ? 'pointer' : 'default',
        textAlign: 'left',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        transition: 'all 0.15s',
        opacity: activo ? 1 : 0.85,
        position: 'relative',
        overflow: 'hidden',
      }}
      onMouseEnter={e => {
        if (activo) {
          (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-3px)';
          (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 8px 24px rgba(0,0,0,0.09)';
        }
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLButtonElement).style.transform = 'none';
        (e.currentTarget as HTMLButtonElement).style.boxShadow = 'none';
      }}
    >
      {/* Borde de color superior */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', backgroundColor: activo ? modulo.color : '#E5E7EB', borderRadius: '16px 16px 0 0' }} />

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', paddingTop: '4px' }}>
        <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: modulo.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Icon size={22} color={modulo.color} strokeWidth={1.8} />
        </div>
        <span style={{
          fontSize: '10px', fontWeight: 700, padding: '3px 9px', borderRadius: '20px',
          backgroundColor: activo ? '#F0FDF4' : '#F9FAFB',
          color: activo ? '#059669' : '#9CA3AF',
          border: `1px solid ${activo ? '#BBF7D0' : '#E5E7EB'}`,
          whiteSpace: 'nowrap',
        }}>
          {activo ? '● Activo' : '◌ Próximamente'}
        </span>
      </div>

      {/* Content */}
      <div>
        <div style={{ fontWeight: 800, color: '#111', fontSize: '14px', marginBottom: '6px' }}>{modulo.label}</div>
        <div style={{ fontSize: '12px', color: '#6B7280', lineHeight: '1.55' }}>{modulo.description}</div>
      </div>

      {/* Tags */}
      {modulo.tags && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {modulo.tags.map(tag => (
            <span key={tag} style={{ fontSize: '10px', fontWeight: 600, padding: '2px 8px', borderRadius: '6px', backgroundColor: modulo.bg, color: modulo.color }}>
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* CTA */}
      {activo && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: modulo.color, fontSize: '12px', fontWeight: 700 }}>
          Abrir módulo <ArrowRight size={13} />
        </div>
      )}
    </button>
  );
}