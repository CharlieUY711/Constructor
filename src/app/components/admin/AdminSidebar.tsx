/* =====================================================
   AdminSidebar â€” navegaciÃ³n plana, sin sub-menÃºs, sin scroll
   ===================================================== */
import React from 'react';
import {
  LayoutDashboard, ShoppingCart, Megaphone, Wrench, Database,
  Monitor, Sparkles, Package, Truck, Rss, ExternalLink, Plug,
  Search, Blocks,
} from 'lucide-react';
import type { MainSection } from '../../AdminDashboard';
import { useOrchestrator } from '../../../shells/DashboardShell/app/providers/OrchestratorProvider';

const ORANGE    = '#FF6835';
const ACTIVE_BG = 'rgba(255,255,255,0.22)';
const HOVER_BG  = 'rgba(255,255,255,0.12)';

interface NavItem {
  id: MainSection;
  icon: React.ElementType;
  label: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard',     icon: LayoutDashboard, label: 'Dashboard'           },
  { id: 'ecommerce',     icon: ShoppingCart,    label: 'eCommerce'           },
  { id: 'logistica',     icon: Truck,           label: 'LogÃ­stica'           },
  { id: 'marketing',     icon: Megaphone,       label: 'Marketing'           },
  { id: 'rrss',          icon: Rss,             label: 'RRSS'                },
  { id: 'herramientas',  icon: Wrench,          label: 'Herramientas'        },
  { id: 'gestion',       icon: Database,        label: 'GestiÃ³n'             },
  { id: 'sistema',       icon: Monitor,         label: 'Sistema'             },
  { id: 'integraciones', icon: Plug,            label: 'Integraciones'       },
  { id: 'auditoria',     icon: Search,          label: 'AuditorÃ­a'           },
];

interface Props {
  activeSection: MainSection;
  onNavigate: (section: MainSection) => void;
}

export function AdminSidebar({ activeSection, onNavigate }: Props) {
  const { config } = useOrchestrator();
  
  // Obtener valores de la configuraciÃ³n con fallbacks
  // Soporta tanto config.nombre como config.clienteNombre
  const clienteNombre = config?.theme?.nombre ?? 'Charlie';
  // Soporta tanto config.tokens.colorPrimario como config.theme.primary
  const colorPrimario = config?.theme?.primary ?? '#FF6B35';
  const modulosConfig = config?.modulos ?? [];
  
  // Filtrar NAV_ITEMS basado en config.modulos
  // Si modulosConfig estÃ¡ vacÃ­o, mostrar todos los mÃ³dulos (comportamiento por defecto)
  const navItems = modulosConfig.length > 0
    ? NAV_ITEMS.filter(item => modulosConfig.includes(item.id))
    : NAV_ITEMS;
  
  /* resolve which top-level hub "owns" the current section */
  const activeHub = (navItems.find(n => n.id === activeSection)?.id ?? activeSection) as MainSection;

  return (
    <aside
      style={{
        width: '200px',
        height: '100vh',
        backgroundColor: colorPrimario,
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        position: 'sticky',
        top: 0,
        overflow: 'hidden',          /* sin scroll */
      }}
    >
      {/* â”€â”€ Logo â”€â”€ */}
      <div style={{
        height: '88px',
        display: 'flex',
        alignItems: 'center',
        padding: '0 16px',
        borderBottom: '1px solid rgba(255,255,255,0.18)',
        flexShrink: 0,
      }}>
        <div style={{ display: 'inline-flex', flexDirection: 'column' }}>
          <span style={{
            color: '#000',
            fontWeight: '600',
            fontSize: '1.7rem',
            lineHeight: 1,
            textAlign: 'justify',
            textAlignLast: 'justify',
          }}>
            {clienteNombre}
          </span>
          <p style={{
            color: '#000',
            fontSize: '0.64rem',
            margin: '0',
            letterSpacing: '0.08em',
            textTransform: 'none',
            fontWeight: '500',
            lineHeight: 1,
            whiteSpace: 'nowrap',
          }}>
            Marketplace Builder
          </p>
        </div>
      </div>

      {/* â”€â”€ User â”€â”€ */}
      <div style={{ padding: '10px 14px', borderBottom: '1px solid rgba(255,255,255,0.18)', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
          <div style={{
            width: '34px', height: '34px', borderRadius: '50%',
            backgroundColor: 'rgba(255,255,255,0.28)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontWeight: '800', fontSize: '0.78rem',
            flexShrink: 0, border: '2px solid rgba(255,255,255,0.4)',
          }}>
            CV
          </div>
          <div style={{ overflow: 'hidden' }}>
            <p style={{ color: '#fff', fontWeight: '700', fontSize: '0.82rem', margin: 0, whiteSpace: 'nowrap' }}>Carlos Varalla</p>
            <p style={{ color: 'rgba(255,255,255,0.72)', fontSize: '0.68rem', margin: 0 }}>Administrador</p>
          </div>
        </div>
      </div>

      {/* â”€â”€ Nav â”€â”€ */}
      <nav style={{ flex: 1, padding: '6px 0', overflowY: 'auto' }}>
        {navItems.map(item => {
          const isActive = activeSection === item.id || activeHub === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '9px 16px',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: isActive ? ACTIVE_BG : 'transparent',
                color: '#fff',
                borderLeft: isActive ? '3px solid #fff' : '3px solid transparent',
                transition: 'all 0.14s',
              }}
              onMouseEnter={e => {
                if (!isActive) (e.currentTarget as HTMLButtonElement).style.backgroundColor = HOVER_BG;
              }}
              onMouseLeave={e => {
                if (!isActive) (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent';
              }}
            >
              <item.icon size={16} strokeWidth={isActive ? 2.5 : 2} style={{ flexShrink: 0 }} />
              <span style={{
                fontSize: '0.84rem',
                fontWeight: isActive ? '700' : '500',
                textAlign: 'left',
                whiteSpace: 'nowrap',
              }}>
                {item.label}
              </span>
            </button>
          );
        })}

        {/* â”€â”€ Divisor Constructor â”€â”€ */}
        <div style={{
          margin: '8px 14px',
          borderTop: '1px solid rgba(255,255,255,0.25)',
        }} />

        {/* â”€â”€ Constructor â”€â”€ */}
        {(() => {
          const isActive = activeSection === 'constructor';
          return (
            <button
              onClick={() => onNavigate('constructor')}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '9px 16px',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: isActive ? 'rgba(0,0,0,0.18)' : 'transparent',
                color: '#000',
                borderLeft: isActive ? '3px solid #000' : '3px solid transparent',
                transition: 'all 0.14s',
              }}
              onMouseEnter={e => {
                if (!isActive) (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'rgba(0,0,0,0.10)';
              }}
              onMouseLeave={e => {
                if (!isActive) (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent';
              }}
            >
              <Blocks size={16} strokeWidth={isActive ? 2.5 : 2} style={{ flexShrink: 0 }} />
              <span style={{
                fontSize: '0.84rem',
                fontWeight: isActive ? '700' : '600',
                textAlign: 'left',
                whiteSpace: 'nowrap',
                color: '#000',
              }}>
                Constructor
              </span>
            </button>
          );
        })()}
      </nav>

      {/* â”€â”€ Tip â”€â”€ */}
      <div style={{
        margin: '0 10px 10px',
        padding: '10px',
        backgroundColor: 'rgba(255,255,255,0.15)',
        borderRadius: '10px',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '5px' }}>
          <Sparkles size={12} color="#fff" />
          <span style={{ color: '#fff', fontWeight: '700', fontSize: '0.72rem' }}>Tip del dÃ­a</span>
        </div>
        <p style={{ color: 'rgba(255,255,255,0.82)', fontSize: '0.67rem', margin: 0, lineHeight: '1.4' }}>
          UsÃ¡ la IA para optimizar descripciones de productos automÃ¡ticamente
        </p>
      </div>

      {/* â”€â”€ Ver Tienda â”€â”€ */}
      <a
        href="/"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          margin: '0 10px 12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '7px',
          padding: '9px 0',
          backgroundColor: '#fff',
          color: colorPrimario,
          borderRadius: '10px',
          textDecoration: 'none',
          fontSize: '0.8rem',
          fontWeight: '700',
          flexShrink: 0,
          transition: 'opacity 0.15s',
        }}
        onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity = '0.88'}
        onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity = '1'}
      >
        <ExternalLink size={13} />
        Ver tienda
      </a>
    </aside>
  );
}
