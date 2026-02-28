/* =====================================================
   HubView — Componente reutilizable para hubs modales
   Patrón: header blanco + badge naranja + grid de cards
   con gradiente + stats + sección "Próximamente"
   ===================================================== */
import React from 'react';

const ORANGE = '#FF6835';

/* ── Tipos públicos ───────────────────────────────── */

export interface HubCardDef {
  id: string;
  icon: React.ElementType;
  gradient: string;
  color: string;
  badge: string;
  label: string;
  description: string;
  stats: { icon: React.ElementType; value: string; label: string }[];
  onClick: () => void;
}

export interface HubSectionDef {
  /** Etiqueta opcional sobre la grilla (ej: "WORKSPACE SUITE") */
  label?: string;
  /** Conteo al lado de la etiqueta (ej: "6 herramientas") */
  count?: string;
  /** Subtítulo bajo la etiqueta */
  subtitle?: string;
  cards: HubCardDef[];
  /** Fila personalizada que ocupa todo el ancho de la primera fila del grid */
  customFirstRow?: React.ReactNode;
}

export interface HubQuickLink {
  label: string;
  icon: React.ElementType;
  color: string;
  onClick: () => void;
}

export interface HubComingSoonItem {
  icon: React.ElementType;
  label: string;
  /** Tooltip al hacer hover */
  desc?: string;
}

export interface HubViewProps {
  /* ── Header ── */
  hubIcon: React.ElementType;
  title: string;
  subtitle: string;

  /* ── Contenido ── */
  /** Una o más secciones de cards */
  sections: HubSectionDef[];

  /* ── Extras opcionales ── */
  /** Nodo insertado justo debajo del label "Seleccioná un módulo" (ej: banner UY-first) */
  intro?: React.ReactNode;
  /** Nodo insertado entre las cards y la sección "Próximamente" (ej: panel de diagnóstico) */
  afterCards?: React.ReactNode;
  /** Pills de acceso rápido (ej: Métodos de Pago, Envío, SEO) */
  quickLinks?: HubQuickLink[];

  /* ── Próximamente ── */
  comingSoon?: HubComingSoonItem[];
  comingSoonText?: string;
  /** Icono en el banner "Próximamente" (por defecto usa hubIcon) */
  comingSoonIcon?: React.ElementType;

  /* ── Comportamiento ── */
  /** Ocultar el texto "Seleccioná un módulo para comenzar" */
  hideSeleccionar?: boolean;
}

/* ── Card individual ──────────────────────────────── */

function ComingSoonCard({ 
  items, 
  text, 
  icon: Icon 
}: { 
  items: HubComingSoonItem[]; 
  text?: string; 
  icon: React.ElementType;
}) {
  return (
    <div
      style={{
        background: '#fff',
        border: '1px solid #E9ECEF',
        borderRadius: '13px', // 16px * 0.8
        padding: 0,
        textAlign: 'left',
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header blanco/gris - sin gradiente, sin badge - misma estructura que HubCard */}
      <div style={{
        background: '#F8F9FA',
        padding: '18px 19px', // 22px 24px * 0.8
        display: 'flex',
        alignItems: 'center',
        gap: '10px', // 12px * 0.8
        minHeight: '71px', // Altura fija igual a HubCard (18px*2 + 35px icono)
        flexShrink: 0,
      }}>
        <div style={{
          width: '35px', height: '35px', borderRadius: '10px', // 44px * 0.8, 12px * 0.8
          backgroundColor: '#E9ECEF',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <Icon size={18} color="#6C757D" strokeWidth={2} /> {/* 22 * 0.8 */}
        </div>
        <div>
          {/* Sin badge, solo el título */}
          <p style={{ margin: '2px 0 0', fontSize: '0.84rem', color: '#1A1A2E', fontWeight: '800' }}> {/* 1.05rem * 0.8 */}
            Próximamente
          </p>
        </div>
      </div>

      {/* Card body - misma estructura que HubCard */}
      <div style={{ 
        padding: '14px 19px 16px',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        minHeight: 0,
        overflow: 'hidden',
      }}> {/* 18px 24px 20px * 0.8 */}
        {text && (
          <p style={{ margin: '0 0 14px', fontSize: '0.67rem', color: '#6C757D', lineHeight: '1.5', flexShrink: 0 }}> {/* 18px * 0.8, 0.84rem * 0.8 */}
            {text}
          </p>
        )}

        {/* Items list - diseño compacto para que encaje en formato cuadrado */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '6px', // 8px * 0.8
          flex: 1,
          overflowY: 'auto',
          minHeight: 0,
          paddingRight: '3px', // 4px * 0.8
        }}>
          {items.map((item, i) => (
            <div
              key={i}
              title={item.desc}
              style={{
                display: 'flex', 
                alignItems: 'center', 
                gap: 6, // 8 * 0.8
                padding: '6px 8px', // 8px 10px * 0.8
                borderRadius: '5px', // 6px * 0.8
                backgroundColor: '#F8F9FA',
                border: '1px solid #E9ECEF',
                fontSize: '0.62rem', // 0.78rem * 0.8
                fontWeight: '600', 
                color: '#495057',
              }}
            >
              <item.icon size={11} color="#6C757D" /> {/* 14 * 0.8 */}
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function HubCard({ card }: { card: HubCardDef }) {
  return (
    <button
      onClick={card.onClick}
      style={{
        background: '#fff',
        border: '1px solid #E9ECEF',
        borderRadius: '13px', // 16px * 0.8
        padding: 0,
        cursor: 'pointer',
        textAlign: 'left',
        transition: 'all 0.2s',
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLButtonElement;
        el.style.transform = 'translateY(-3px)';
        el.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)';
        el.style.borderColor = card.color;
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLButtonElement;
        el.style.transform = 'translateY(0)';
        el.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)';
        el.style.borderColor = '#E9ECEF';
      }}
    >
      {/* Gradient header */}
      <div style={{
        background: card.gradient,
        padding: '18px 19px', // 22px 24px * 0.8
        display: 'flex',
        alignItems: 'center',
        gap: '10px', // 12px * 0.8
        minHeight: '71px', // Altura fija para todos los encabezados (18px*2 + 35px icono)
        flexShrink: 0,
      }}>
        <div style={{
          width: '35px', height: '35px', borderRadius: '10px', // 44px * 0.8, 12px * 0.8
          backgroundColor: 'rgba(255,255,255,0.22)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <card.icon size={18} color="#fff" strokeWidth={2} /> {/* 22 * 0.8 */}
        </div>
        <div>
          <p style={{ margin: 0, fontSize: '0.54rem', color: 'rgba(255,255,255,0.75)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: '600' }}> {/* 0.68rem * 0.8 */}
            {card.badge}
          </p>
          <p style={{ margin: '2px 0 0', fontSize: '0.84rem', color: '#fff', fontWeight: '800' }}> {/* 1.05rem * 0.8 */}
            {card.label}
          </p>
        </div>
      </div>

      {/* Card body */}
      <div style={{ 
        padding: '14px 19px 16px',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        minHeight: 0,
      }}> {/* 18px 24px 20px * 0.8 */}
        <p style={{ margin: '0 0 14px', fontSize: '0.67rem', color: '#6C757D', lineHeight: '1.5', flexShrink: 0 }}> {/* 18px * 0.8, 0.84rem * 0.8 */}
          {card.description}
        </p>

        {/* Stats row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '8px', // 10px * 0.8
          paddingTop: '11px', // 14px * 0.8
          borderTop: '1px solid #F0F0F0',
          flexShrink: 0,
        }}>
          {card.stats.map((stat, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <stat.icon size={11} color={card.color} style={{ marginBottom: '3px' }} /> {/* 14 * 0.8, 4px * 0.8 */}
              <p style={{ margin: 0, fontSize: '0.76rem', fontWeight: '800', color: '#1A1A2E' }}> {/* 0.95rem * 0.8 */}
                {stat.value}
              </p>
              <p style={{ margin: 0, fontSize: '0.54rem', color: '#ADB5BD' }}> {/* 0.68rem * 0.8 */}
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* CTA - ELIMINADO */}
      </div>
    </button>
  );
}

/* ── Grid de cards exportable ─────────────────────── */

export function HubCardGrid({ cards }: { cards: HubCardDef[] }) {
  // Calcular altura para 3 filas: (100vh - 88px header - 16px padding top - 16px padding bottom - 16px gaps) / 3
  const cardHeight = `calc((100vh - 88px - 16px - 16px - 16px) / 3)`;
  // Calcular ancho para 5 tarjetas: (100vw - 200px sidebar - 32px padding lateral - 32px gaps) / 5
  const cardWidth = `calc((100vw - 200px - 32px - 32px) / 5)`;
  
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: `repeat(auto-fill, ${cardWidth})`, // Auto-fill para manejar cualquier cantidad de tarjetas
      gridAutoRows: cardHeight, // Altura fija para que entren exactamente 3 filas
      gap: '8px', // 16px / 2 = 8px (mitad de la distancia)
      height: '100%',
      minHeight: 0,
    }}>
      {cards.map(card => (
        <div key={card.id} style={{ height: '100%', minHeight: 0, display: 'flex' }}>
          <HubCard card={card} />
        </div>
      ))}
    </div>
  );
}

/* ── Componente principal HubView ─────────────────── */

export function HubView({
  hubIcon: HubIcon,
  title,
  subtitle,
  sections,
  intro,
  afterCards,
  quickLinks,
  comingSoon,
  comingSoonText,
  comingSoonIcon,
  hideSeleccionar = false,
}: HubViewProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', backgroundColor: '#F8F9FA' }}>
      {/* ── Header blanco ── */}
      <div style={{
        padding: '0 32px',
        height: '88px',
        backgroundColor: '#fff',
        borderBottom: '1px solid #E9ECEF',
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px', height: '40px', borderRadius: '10px',
            background: `linear-gradient(135deg, ${ORANGE} 0%, #ff8c42 100%)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <HubIcon size={20} color="#fff" strokeWidth={2.5} />
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: '1.4rem', fontWeight: '800', color: '#1A1A2E' }}>
              {title}
            </h1>
            <p style={{ margin: 0, fontSize: '0.82rem', color: '#6C757D' }}>
              {subtitle}
            </p>
          </div>
        </div>
      </div>

      {/* ── Contenido scrollable ── */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
        {intro && <div style={{ marginBottom: '16px' }}>{intro}</div>}
        
        {/* Secciones de cards */}
        {sections.map((section, si) => {
          const isLastSection = si === sections.length - 1;
          const hasComingSoon = isLastSection && comingSoon && comingSoon.length > 0;
          
          return (
            <div key={si} style={{ marginBottom: si < sections.length - 1 ? '24px' : '0' }}>
              {section.label && (
                <div style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: '800', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    {section.label}
                  </p>
                  {section.count && (
                    <span style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>{section.count}</span>
                  )}
                </div>
              )}
              {section.subtitle && (
                <p style={{ margin: '0 0 12px', fontSize: '0.78rem', color: '#6C757D' }}>
                  {section.subtitle}
                </p>
              )}
              <div style={{
                display: 'grid',
                gridTemplateColumns: `repeat(auto-fill, calc((100vw - 200px - 32px - 32px) / 5))`,
                gridAutoRows: `calc((100vh - 88px - 16px - 16px - 16px) / 3)`,
                gap: '8px',
              }}>
                {section.customFirstRow && (
                  <div style={{ 
                    gridColumn: '1 / -1', // Ocupa todas las columnas
                    height: '100%',
                    minHeight: 0,
                    display: 'flex',
                  }}>
                    {section.customFirstRow}
                  </div>
                )}
                {section.cards.map(card => (
                  <div key={card.id} style={{ height: '100%', minHeight: 0, display: 'flex' }}>
                    <HubCard card={card} />
                  </div>
                ))}
                {hasComingSoon && (
                  <div style={{ height: '100%', minHeight: 0, display: 'flex' }}>
                    <ComingSoonCard 
                      items={comingSoon} 
                      text={comingSoonText}
                      icon={comingSoonIcon ?? HubIcon}
                    />
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Contenido extra entre cards y coming soon */}
        {afterCards && (
          <div style={{ marginTop: '32px' }}>{afterCards}</div>
        )}
      </div>
    </div>
  );
}