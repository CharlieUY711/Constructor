/**
 * Integraciones Hub — Punto de entrada a los 5 módulos de integración
 */
import React from 'react';
import { OrangeHeader } from '../OrangeHeader';
import type { MainSection } from '../../../AdminDashboard';
import { CreditCard, Truck, Store, Smartphone, Settings2, ArrowRight, CheckCircle2, Clock } from 'lucide-react';

interface Props { onNavigate: (section: MainSection) => void; }
const ORANGE = '#FF6835';

const MODULES = [
  {
    id: 'integraciones-pagos' as MainSection,
    icon: CreditCard, emoji: '💳',
    label: 'Pasarela de Pagos',
    description: 'Plexo, OCA, Creditel, Abitab, RedPagos, Mercado Pago, PayPal, Stripe',
    color: '#FF6835',
    bg: '#FFF4F0',
    border: '#FFD4C2',
    totalProviders: 8,
    connected: 0,
    flag: '🇺🇾 Uruguay · 🌎 Global',
    highlight: 'Plexo recomendado para Uruguay',
  },
  {
    id: 'integraciones-logistica' as MainSection,
    icon: Truck, emoji: '🚚',
    label: 'Logística',
    description: 'Correo UY, OCA, Brixo, Mosca, PedidosYa, Fedex, DHL, Andreani y más',
    color: '#10B981',
    bg: '#F0FDF8',
    border: '#A7F3D0',
    totalProviders: 13,
    connected: 0,
    flag: '🇺🇾 Uruguay · 🇦🇷 Argentina · 🌎 Global',
    highlight: 'Soporte para carriers sin API',
  },
  {
    id: 'integraciones-tiendas' as MainSection,
    icon: Store, emoji: '🏪',
    label: 'Tiendas',
    description: 'Mercado Libre, TiendaNube, WooCommerce, Shopify, VTEX, Magento',
    color: '#3B82F6',
    bg: '#EFF6FF',
    border: '#BFDBFE',
    totalProviders: 7,
    connected: 0,
    flag: '🇺🇾 Uruguay · 🌎 Global',
    highlight: 'Sincronización de catálogo bidireccional',
  },
  {
    id: 'integraciones-rrss' as MainSection,
    icon: Smartphone, emoji: '📱',
    label: 'Redes Sociales',
    description: 'Meta Business, Instagram Shopping, WhatsApp Business, TikTok Shop, Pinterest',
    color: '#EC4899',
    bg: '#FDF2F8',
    border: '#FBCFE8',
    totalProviders: 6,
    connected: 0,
    flag: '🌎 Global',
    highlight: 'Catálogo en redes con un clic',
  },
  {
    id: 'integraciones-servicios' as MainSection,
    icon: Settings2, emoji: '⚙️',
    label: 'Servicios',
    description: 'Twilio, Resend, SendGrid, Google Analytics, Zapier, n8n, Slack',
    color: '#8B5CF6',
    bg: '#F5F3FF',
    border: '#DDD6FE',
    totalProviders: 8,
    connected: 0,
    flag: '🌎 Global',
    highlight: 'Comunicaciones y automatizaciones',
  },
];

export function IntegracionesView({ onNavigate }: Props) {
  const totalConnected = MODULES.reduce((a, m) => a + m.connected, 0);
  const totalProviders = MODULES.reduce((a, m) => a + m.totalProviders, 0);

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <OrangeHeader
        title="🔌 Integraciones"
        subtitle="Conectá tu stack — Uruguay first, expansión Latam progresiva"
      />

      <div style={{ flex: 1, overflowY: 'auto', padding: '28px 32px', backgroundColor: '#F8F9FA' }}>

        {/* Stats bar */}
        <div style={{
          display: 'flex', gap: 12, marginBottom: 28,
          padding: '16px 20px', backgroundColor: '#fff',
          borderRadius: 14, border: '1px solid #E5E7EB',
        }}>
          {[
            { label: 'Módulos de integración', value: '5', icon: '🔌' },
            { label: 'Proveedores disponibles', value: String(totalProviders), icon: '🏢' },
            { label: 'Conectadas', value: String(totalConnected), icon: '✅' },
            { label: 'Foco inicial', value: 'Uruguay 🇺🇾', icon: '📍' },
          ].map((s, i) => (
            <div key={i} style={{ flex: 1, textAlign: 'center', padding: '8px 0', borderRight: i < 3 ? '1px solid #F3F4F6' : 'none' }}>
              <div style={{ fontSize: '1.4rem', marginBottom: 2 }}>{s.icon}</div>
              <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#111827', lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: '0.68rem', color: '#9CA3AF', marginTop: 3 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* UY-first badge */}
        <div style={{
          marginBottom: 24,
          padding: '12px 18px',
          backgroundColor: '#FFF4F0',
          border: `1.5px solid ${ORANGE}33`,
          borderRadius: 10,
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <span style={{ fontSize: '1.2rem' }}>🇺🇾</span>
          <div>
            <span style={{ fontWeight: '700', fontSize: '0.85rem', color: '#111827' }}>Uruguay First</span>
            <span style={{ fontSize: '0.8rem', color: '#6B7280', marginLeft: 8 }}>
              Empezamos por los proveedores del mercado uruguayo y expandimos progresivamente a Argentina, Brasil y el resto de Latam.
            </span>
          </div>
        </div>

        {/* Module cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 16 }}>
          {MODULES.map(mod => {
            const Icon = mod.icon;
            return (
              <button
                key={mod.id}
                onClick={() => onNavigate(mod.id)}
                style={{
                  background: '#fff',
                  border: `1.5px solid ${mod.border}`,
                  borderRadius: 16,
                  padding: '22px 24px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.18s',
                  position: 'relative',
                  overflow: 'hidden',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = `0 8px 24px ${mod.color}22`;
                  e.currentTarget.style.borderColor = mod.color;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.borderColor = mod.border;
                }}
              >
                {/* top accent bar */}
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, backgroundColor: mod.color, borderRadius: '16px 16px 0 0' }} />

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginTop: 8 }}>
                  <div style={{
                    width: 48, height: 48, borderRadius: 12,
                    backgroundColor: mod.bg,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.5rem', flexShrink: 0,
                  }}>
                    {mod.emoji}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                      <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: '800', color: '#111827' }}>{mod.label}</h3>
                      <ArrowRight size={16} color={mod.color} style={{ flexShrink: 0 }} />
                    </div>
                    <p style={{ margin: '0 0 10px', fontSize: '0.78rem', color: '#6B7280', lineHeight: 1.45 }}>{mod.description}</p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 12, paddingTop: 12, borderTop: `1px solid ${mod.border}` }}>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <span style={{ fontSize: '0.68rem', color: '#9CA3AF', display: 'flex', alignItems: 'center', gap: 3 }}>
                      <Clock size={10} /> {mod.totalProviders} proveedores
                    </span>
                    {mod.connected > 0 && (
                      <span style={{ fontSize: '0.68rem', color: '#10B981', display: 'flex', alignItems: 'center', gap: 3 }}>
                        <CheckCircle2 size={10} /> {mod.connected} activas
                      </span>
                    )}
                  </div>
                  <span style={{ fontSize: '0.65rem', color: mod.color, fontWeight: '700', backgroundColor: mod.bg, padding: '3px 8px', borderRadius: 20 }}>
                    {mod.highlight}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
