import React from 'react';

const ORANGE = '#FF6835';

export interface HeaderAction {
  label: string;
  primary?: boolean;
  onClick?: () => void;
}

interface Props {
  title: React.ReactNode;
  subtitle?: string;
  actions?: HeaderAction[];
  rightSlot?: React.ReactNode;
}

export function OrangeHeader({ title, subtitle, actions, rightSlot }: Props) {
  return (
    <header
      style={{
        backgroundColor: ORANGE,
        padding: '0 28px',
        height: '100px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0,
      }}
    >
      <div>
        <h1
          style={{
            color: '#FFFFFF',
            margin: 0,
            fontSize: '1.5rem',
            fontWeight: '800',
            lineHeight: 1.2,
          }}
        >
          {title}
        </h1>
        {subtitle && (
          <p
            style={{
              color: 'rgba(255,255,255,0.82)',
              margin: '5px 0 0',
              fontSize: '0.875rem',
            }}
          >
            {subtitle}
          </p>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {rightSlot}
        {actions && actions.length > 0 && (
          <div style={{ display: 'flex', gap: '10px' }}>
            {actions.map((action, i) => (
              <button
                key={i}
                onClick={action.onClick}
                style={{
                  padding: '9px 22px',
                  borderRadius: '8px',
                  border: '1.5px solid rgba(255,255,255,0.5)',
                  backgroundColor: action.primary ? '#FFFFFF' : 'transparent',
                  color: action.primary ? ORANGE : '#FFFFFF',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}
              >
                {action.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}