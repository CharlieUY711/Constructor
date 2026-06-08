/* =====================================================
   AdminSidebar — filtrado por config.modulos del tenant
   ===================================================== */
import React from 'react';
import type { MainSection } from '../../AdminDashboard';
import { useOrchestrator } from '../../../shells/DashboardShell/app/providers/OrchestratorProvider';

const ACTIVE_BG = 'rgba(255,255,255,0.22)';
const HOVER_BG  = 'rgba(255,255,255,0.12)';

interface NavItem {
  id: MainSection;
  label: string;
  modulo: string; // clave que debe existir en config.modulos
}

// 'dashboard' siempre visible, el resto requiere modulo habilitado
const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard',      label: 'Dashboard',       modulo: '*' },
  { id: 'logistica',      label: 'Logística',       modulo: 'transportistas' },
  { id: 'transportistas', label: 'Transportistas',  modulo: 'transportistas' },
  { id: 'envios',         label: 'Envíos',          modulo: 'envios' },
];

interface Props {
  activeSection: MainSection;
  onNavigate: (section: MainSection) => void;
}

export function AdminSidebar({ activeSection, onNavigate }: Props) {
  const { config } = useOrchestrator();

  const clienteNombre = config?.theme?.nombre ?? 'Charlie';
  const colorPrimario = config?.theme?.primary ?? '#FF6B35';
  const modulos: string[] = config?.modulos ?? [];
  const todoHabilitado = modulos.includes('*');

  const itemsVisibles = NAV_ITEMS.filter(item =>
    item.modulo === '*' || todoHabilitado || modulos.includes(item.modulo)
  );

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
        overflow: 'hidden',
      }}
    >
      {/* ── Logo ── */}
      <div style={{
        height: '88px',
        display: 'flex',
        alignItems: 'center',
        padding: '0 16px',
        borderBottom: '1px solid rgba(255,255,255,0.18)',
        flexShrink: 0,
      }}>
        <span style={{
          color: '#000',
          fontWeight: '600',
          fontSize: '1.7rem',
          lineHeight: 1,
        }}>
          {clienteNombre}
        </span>
      </div>

      {/* ── User ── */}
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

      {/* ── Nav ── */}
      <nav style={{ flex: 1, padding: '6px 0', overflowY: 'auto' }}>
        {itemsVisibles.map((item) => {
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                width: '100%',
                padding: '9px 16px',
                border: 'none',
                backgroundColor: isActive ? ACTIVE_BG : 'transparent',
                color: '#fff',
                fontSize: '13px',
                fontWeight: isActive ? 700 : 400,
                cursor: 'pointer',
                textAlign: 'left',
                borderRadius: '6px',
                transition: 'background 0.15s',
              }}
              onMouseEnter={e => {
                if (!isActive) (e.currentTarget as HTMLElement).style.backgroundColor = HOVER_BG;
              }}
              onMouseLeave={e => {
                if (!isActive) (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
              }}
            >
              {item.label}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
