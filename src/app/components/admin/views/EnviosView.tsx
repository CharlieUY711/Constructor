/* =====================================================
   EnviosView — Módulo de Envíos (Logística)
   Próximamente: tracking árbol pedido→envíos,
   acuse de recibo, multi-tramo, Google Maps
   ===================================================== */
import React from 'react';
import { OrangeHeader } from '../OrangeHeader';
import type { MainSection } from '../../../AdminDashboard';
import { Truck, GitBranch, MapPin, CheckCircle, ArrowLeft } from 'lucide-react';

interface Props { onNavigate: (section: MainSection) => void; }

const ORANGE = '#FF6835';

const FEATURES = [
  { icon: GitBranch, label: 'Vista árbol',         sub: 'Pedido madre → Envíos hijos (PEDX15000-ENV001...)' },
  { icon: Truck,     label: 'Multi-tramo',          sub: 'Transportista local + intercity + last mile'       },
  { icon: MapPin,    label: 'Google Maps',          sub: 'Validación de dirección y geocodificación'         },
  { icon: CheckCircle, label: 'Acuse de recibo',   sub: 'Confirmación por transportista o destinatario'     },
];

export function EnviosView({ onNavigate }: Props) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <OrangeHeader
        title="Envíos"
        subtitle="Tracking operativo — Logística"
        actions={[
          { label: '← Logística', onClick: () => onNavigate('logistica') },
        ]}
      />
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F8F9FA', padding: '40px' }}>
        <div style={{ maxWidth: '560px', width: '100%', textAlign: 'center' }}>

          {/* Icono */}
          <div style={{ width: '80px', height: '80px', borderRadius: '24px', backgroundColor: '#FFF4EC', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
            <Truck size={36} color={ORANGE} strokeWidth={1.5} />
          </div>

          <h1 style={{ margin: '0 0 10px', fontSize: '24px', fontWeight: 800, color: '#111' }}>
            Módulo de Envíos
          </h1>
          <p style={{ margin: '0 0 32px', fontSize: '15px', color: '#6B7280', lineHeight: '1.6' }}>
            Este módulo está siendo diseñado como parte del espacio de Logística.
            Gestionará el tracking completo desde el despacho hasta el acuse de recibo.
          </p>

          {/* Features próximas */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '32px', textAlign: 'left' }}>
            {FEATURES.map(f => {
              const Icon = f.icon;
              return (
                <div key={f.label} style={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #E5E7EB', padding: '16px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: '#FFF4EC', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={18} color={ORANGE} strokeWidth={1.8} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '13px', color: '#111' }}>{f.label}</div>
                    <div style={{ fontSize: '11px', color: '#9CA3AF', marginTop: '3px', lineHeight: '1.4' }}>{f.sub}</div>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={() => onNavigate('logistica')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 24px', backgroundColor: ORANGE, color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontSize: '14px', fontWeight: 700 }}
          >
            <ArrowLeft size={16} /> Volver a Logística
          </button>
        </div>
      </div>
    </div>
  );
}
