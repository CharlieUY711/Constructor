import React, { useState } from 'react';
import { OrangeHeader } from '../OrangeHeader';
import type { MainSection } from '../../../AdminDashboard';
import { Settings2, ExternalLink, X, AlertTriangle, CheckCircle2, MessageCircle, Share2 } from 'lucide-react';

interface Props {
  onNavigate: (section: MainSection) => void;
}

const ORANGE = '#FF6835';

type Tab = 'marketplaces' | 'pagos' | 'redes' | 'mensajeria';
type TwilioTab = 'config' | 'enviar' | 'historial' | 'recibidos' | 'plantillas' | 'estadisticas';

/* ── Integration card status ── */
interface Integration {
  id: string;
  logo: string;
  name: string;
  description: string;
  configured: boolean;
  sandbox?: boolean;
  configLink?: string;
  docsLink?: string;
}

const MARKETPLACES: Integration[] = [
  { id: 'ml', logo: '🛒', name: 'Mercado Libre', description: 'Sincronización de productos, inventario y órdenes', configured: false, configLink: '#' },
];

const PAGOS: Integration[] = [
  { id: 'mp', logo: '💳', name: 'Mercado Pago', description: 'Pasarela de pago para Argentina y Latinoamérica', configured: false, configLink: '#' },
  { id: 'plexo', logo: '💳', name: 'Plexo uv', description: 'Procesamiento de tarjetas para Uruguay (Visa, Mastercard, OCA, Creditel)', configured: false, sandbox: true, docsLink: '#' },
  { id: 'paypal', logo: '🌐', name: 'PayPal', description: 'Pagos internacionales con tarjetas y PayPal', configured: false, docsLink: '#' },
  { id: 'stripe', logo: '💜', name: 'Stripe', description: 'Procesamiento de tarjetas Visa/Mastercard', configured: false, docsLink: '#' },
];

const REDES: Integration[] = [
  { id: 'meta', logo: '📘', name: 'Meta Business', description: 'Sincronización con Facebook e Instagram Shopping', configured: false, docsLink: '#' },
  { id: 'ig', logo: '📸', name: 'Instagram Shopping', description: 'Catálogo de productos en Instagram', configured: false, docsLink: '#' },
  { id: 'wa', logo: '💬', name: 'WhatsApp Business', description: 'Catálogo de productos y atención al cliente', configured: false, docsLink: '#' },
  { id: 'fbcat', logo: '📗', name: 'Facebook Catalog', description: 'Sincronización de catálogo para Marketplace y Shops', configured: false, docsLink: '#' },
];

const HOW_TO_STEPS = [
  'Registra una aplicación en cada plataforma para obtener las credenciales API',
  'Agrega las variables de entorno en tu proyecto de Supabase',
  'Reinicia el Edge Function para que tome las nuevas configuraciones',
  'Actualiza esta página y verifica que las integraciones estén configuradas',
  'Usa los botones de sincronización para publicar productos en los canales conectados',
];

export function IntegracionesView({ onNavigate }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('marketplaces');
  const [twilioTab, setTwilioTab] = useState<TwilioTab>('config');
  const [twilioConfig, setTwilioConfig] = useState({
    accountSid: '',
    authToken: '',
    phoneNumber: '+1234567890',
    whatsappNumber: '+1234567890',
  });

  const TABS: { id: Tab; label: string; icon: string }[] = [
    { id: 'marketplaces', label: 'Marketplaces', icon: '🛒' },
    { id: 'pagos',        label: 'Pagos',         icon: '💳' },
    { id: 'redes',        label: 'Redes Sociales', icon: '📱' },
    { id: 'mensajeria',   label: 'Mensajería (Twilio/WhatsApp)', icon: '💬' },
  ];

  const IntegrationCard = ({ integration, cols = 1 }: { integration: Integration; cols?: number }) => (
    <div
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '12px',
        border: '1px solid #E5E7EB',
        padding: '20px',
        position: 'relative',
      }}
    >
      {/* Close btn */}
      <button
        style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: '#9CA3AF',
          padding: '2px',
        }}
      >
        <X size={16} />
      </button>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
        <div
          style={{
            width: '40px', height: '40px',
            borderRadius: '10px',
            backgroundColor: '#F3F4F6',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.3rem',
          }}
        >
          {integration.logo}
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontWeight: '700', color: '#111827', fontSize: '0.95rem' }}>{integration.name}</span>
            {integration.sandbox && (
              <span style={{ padding: '2px 8px', borderRadius: '4px', backgroundColor: '#FFF3CD', color: '#856404', fontSize: '0.65rem', fontWeight: '700', border: '1px solid #FFEAA7' }}>
                Sandbox
              </span>
            )}
          </div>
          <p style={{ color: '#6B7280', fontSize: '0.78rem', margin: 0 }}>{integration.description}</p>
        </div>
      </div>
      {/* Status */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
        <span style={{ color: '#9CA3AF', fontSize: '0.8rem' }}>No configurado</span>
        {integration.configLink ? (
          <button style={{ background: 'none', border: 'none', color: ORANGE, fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer' }}>
            Configurar →
          </button>
        ) : (
          <button style={{ background: 'none', border: 'none', color: ORANGE, fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
            Documentación <ExternalLink size={12} />
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <OrangeHeader
        title="Integraciones"
        subtitle="Conectá ODDY Market con Redes Sociales, Marketplaces y Pasarelas de Pago"
        actions={[
          { label: '⚙️ Gestionar API Keys', primary: true },
        ]}
      />

      <div style={{ flex: 1, overflowY: 'auto', backgroundColor: '#F8F9FA' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '24px 28px' }}>

          {/* API Keys banner */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #E5E7EB',
              borderRadius: '12px',
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '24px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Settings2 size={20} color={ORANGE} />
              <div>
                <p style={{ margin: 0, fontWeight: '700', color: '#111827', fontSize: '0.95rem' }}>
                  Gestiona tus API Keys desde aquí
                </p>
                <p style={{ margin: 0, color: '#6B7280', fontSize: '0.8rem' }}>
                  Configura Mercado Libre, Mercado Pago, Plexo y más sin acceder a Supabase
                </p>
              </div>
            </div>
            <button
              style={{
                padding: '9px 18px',
                backgroundColor: ORANGE,
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '600',
                fontSize: '0.875rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              Abrir Gestor →
            </button>
          </div>

          {/* Tabs */}
          <div
            style={{
              display: 'flex',
              gap: '0',
              borderBottom: '2px solid #E5E7EB',
              marginBottom: '24px',
            }}
          >
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: '12px 18px',
                  border: 'none',
                  backgroundColor: 'transparent',
                  cursor: 'pointer',
                  color: activeTab === tab.id ? ORANGE : '#6B7280',
                  fontWeight: activeTab === tab.id ? '700' : '500',
                  fontSize: '0.875rem',
                  borderBottom: activeTab === tab.id ? `2px solid ${ORANGE}` : '2px solid transparent',
                  marginBottom: '-2px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.15s',
                }}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          {/* ── MARKETPLACES ── */}
          {activeTab === 'marketplaces' && (
            <div>
              <div style={{ maxWidth: '520px' }}>
                {MARKETPLACES.map((int) => <IntegrationCard key={int.id} integration={int} />)}
              </div>
              <HowToSection />
            </div>
          )}

          {/* ── PAGOS ── */}
          {activeTab === 'pagos' && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                {PAGOS.map((int) => <IntegrationCard key={int.id} integration={int} />)}
              </div>
              <HowToSection />
            </div>
          )}

          {/* ── REDES SOCIALES ── */}
          {activeTab === 'redes' && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                {REDES.map((int) => <IntegrationCard key={int.id} integration={int} />)}
              </div>
              {/* Multi-channel sync info */}
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '12px',
                  border: '1px solid #E5E7EB',
                  padding: '20px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <Share2 size={16} color={ORANGE} />
                  <span style={{ fontWeight: '700', color: '#111827', fontSize: '0.9rem' }}>Sincronización Multi-Canal</span>
                </div>
                <p style={{ color: '#6B7280', fontSize: '0.8rem', margin: '0 0 8px' }}>
                  Una vez configuradas las integraciones de redes sociales, tus productos se sincronizarán automáticamente:
                </p>
                <ul style={{ margin: 0, paddingLeft: '20px', color: '#374151', fontSize: '0.8rem' }}>
                  {[
                    'Catálogo de productos en Facebook Shops',
                    'Productos visibles en Instagram Shopping',
                    'Catálogo de WhatsApp Business para compartir con clientes',
                    'Sincronización automática de inventario y precios',
                  ].map((item, i) => (
                    <li key={i} style={{ marginBottom: '4px' }}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* ── MENSAJERÍA (TWILIO) ── */}
          {activeTab === 'mensajeria' && (
            <div>
              <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <MessageCircle size={20} color={ORANGE} />
                  <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '800', color: '#111827' }}>
                    Twilio & WhatsApp Business
                  </h2>
                </div>
                <p style={{ margin: 0, color: '#6B7280', fontSize: '0.8rem' }}>
                  SMS, WhatsApp y mensajería integrada con colas y automatizaciones
                </p>
              </div>

              {/* Status badge */}
              <div
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '6px',
                  padding: '6px 14px',
                  borderRadius: '8px',
                  backgroundColor: '#FEF3C7',
                  border: '1px solid #FDE68A',
                  marginBottom: '20px',
                }}
              >
                <AlertTriangle size={14} color="#D97706" />
                <span style={{ color: '#92400E', fontSize: '0.8rem', fontWeight: '700' }}>Twilio No Configurado</span>
              </div>

              {/* Sub-tabs */}
              <div style={{ display: 'flex', gap: '4px', borderBottom: '1px solid #E5E7EB', marginBottom: '20px' }}>
                {(['config', 'enviar', 'historial', 'recibidos', 'plantillas', 'estadisticas'] as TwilioTab[]).map((t) => {
                  const labels: Record<TwilioTab, string> = { config: 'Configuración', enviar: 'Enviar', historial: 'Historial', recibidos: 'Recibidos', plantillas: 'Plantillas', estadisticas: 'Estadísticas' };
                  return (
                    <button
                      key={t}
                      onClick={() => setTwilioTab(t)}
                      style={{
                        padding: '8px 14px',
                        border: 'none',
                        backgroundColor: 'transparent',
                        cursor: 'pointer',
                        color: twilioTab === t ? ORANGE : '#6B7280',
                        fontWeight: twilioTab === t ? '700' : '500',
                        fontSize: '0.8rem',
                        borderBottom: twilioTab === t ? `2px solid ${ORANGE}` : '2px solid transparent',
                        marginBottom: '-1px',
                      }}
                    >
                      {labels[t]}
                    </button>
                  );
                })}
              </div>

              {twilioTab === 'config' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                  {/* Form */}
                  <div
                    style={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '12px',
                      border: '1px solid #E5E7EB',
                      padding: '24px',
                    }}
                  >
                    <h3 style={{ margin: '0 0 16px', fontSize: '0.9rem', fontWeight: '700', color: '#111827' }}>
                      ⚙️ Credenciales de Twilio
                    </h3>
                    {[
                      { label: 'Account SID', key: 'accountSid' as const, placeholder: 'ACxxxxxxxxxxxxxxxxxxxx' },
                      { label: 'Auth Token', key: 'authToken' as const, placeholder: '••••••••••••••••••••••••••', type: 'password' },
                      { label: 'Número de Teléfono (SMS)', key: 'phoneNumber' as const, placeholder: '+1234567890' },
                      { label: 'Número de WhatsApp', key: 'whatsappNumber' as const, placeholder: '+1234567890' },
                    ].map(({ label, key, placeholder, type }) => (
                      <div key={key} style={{ marginBottom: '16px' }}>
                        <label style={{ display: 'block', color: '#374151', fontSize: '0.8rem', fontWeight: '600', marginBottom: '6px' }}>
                          {label}
                        </label>
                        <input
                          type={type || 'text'}
                          value={twilioConfig[key]}
                          onChange={(e) => setTwilioConfig((prev) => ({ ...prev, [key]: e.target.value }))}
                          placeholder={placeholder}
                          style={{
                            width: '100%',
                            padding: '10px 12px',
                            borderRadius: '8px',
                            border: '1px solid #E5E7EB',
                            fontSize: '0.82rem',
                            outline: 'none',
                            boxSizing: 'border-box',
                          }}
                        />
                      </div>
                    ))}
                    <button
                      style={{
                        width: '100%',
                        padding: '12px',
                        backgroundColor: ORANGE,
                        color: '#FFFFFF',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '0.875rem',
                        fontWeight: '700',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                      }}
                    >
                      ⚙️ Guardar Configuración
                    </button>
                  </div>

                  {/* Instructions */}
                  <div
                    style={{
                      backgroundColor: '#F0F9FF',
                      borderRadius: '12px',
                      border: '1px solid #BAE6FD',
                      padding: '24px',
                    }}
                  >
                    <h3 style={{ margin: '0 0 14px', fontSize: '0.9rem', fontWeight: '700', color: '#0369A1' }}>
                      📋 Instrucciones
                    </h3>
                    <ol style={{ margin: 0, paddingLeft: '18px', color: '#374151', fontSize: '0.8rem', lineHeight: '1.8' }}>
                      {[
                        <>Crea una cuenta en <a href="#" style={{ color: ORANGE, fontWeight: '600' }}>Twilio</a></>,
                        'Obtén tu Account SID y Auth Token del dashboard',
                        'Compra un número de teléfono para SMS',
                        <>Para WhatsApp, solicita acceso a <a href="#" style={{ color: ORANGE, fontWeight: '600' }}>WhatsApp Business API</a></>,
                        'Configura el webhook en Twilio apuntando a tu URL',
                        '¡Comienza a enviar mensajes!',
                      ].map((step, i) => (
                        <li key={i}>{step}</li>
                      ))}
                    </ol>
                  </div>
                </div>
              )}

              {twilioTab !== 'config' && (
                <div
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '12px',
                    border: '1px solid #E5E7EB',
                    padding: '40px',
                    textAlign: 'center',
                    color: '#9CA3AF',
                  }}
                >
                  <MessageCircle size={36} style={{ margin: '0 auto 12px', opacity: 0.4 }} />
                  <p style={{ margin: 0 }}>
                    Configura Twilio primero para acceder a esta sección
                  </p>
                </div>
              )}

              <HowToSection />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function HowToSection() {
  return (
    <div
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '12px',
        border: '1px solid #E5E7EB',
        padding: '20px',
        marginTop: '24px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
        <span style={{ fontSize: '1rem' }}>🔗</span>
        <span style={{ fontWeight: '700', color: '#111827', fontSize: '0.9rem' }}>Cómo configurar las integraciones</span>
      </div>
      <ol style={{ margin: 0, paddingLeft: '20px', color: '#374151', fontSize: '0.8rem', lineHeight: '1.9' }}>
        {[
          <>Registra una <span style={{ color: '#FF6835', fontWeight: '600' }}>aplicación en cada plataforma</span> para obtener las credenciales API</>,
          <>Agrega las <span style={{ color: '#FF6835', fontWeight: '600' }}>variables de entorno</span> en tu proyecto de Supabase</>,
          <>Reinicia el <span style={{ color: '#FF6835', fontWeight: '600' }}>Edge Function</span> para que tome las nuevas configuraciones</>,
          <>Actualiza esta página y <span style={{ color: '#FF6835', fontWeight: '600' }}>verifica que las integraciones estén configuradas</span></>,
          'Usa los botones de sincronización para publicar productos en los canales conectados',
        ].map((step, i) => (
          <li key={i}>{step}</li>
        ))}
      </ol>
    </div>
  );
}
