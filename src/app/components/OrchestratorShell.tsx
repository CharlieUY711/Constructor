/**
 * OrchestratorShell — Charlie Platform v1.0
 * ══════════════════════════════════════════
 * Reemplaza el switch manual de AdminDashboard.
 * Lee MODULE_MANIFEST y renderiza el componente correspondiente
 * a la sección activa. Zero hardcoding.
 */

import React from 'react';
import type { MainSection } from '../AdminDashboard';
import { MODULE_MANIFEST } from '../utils/moduleManifest';

interface OrchestratorShellProps {
  activeSection: MainSection;
  onNavigate: (s: MainSection) => void;
}

export function OrchestratorShell({ activeSection, onNavigate }: OrchestratorShellProps) {
  const entry = MODULE_MANIFEST.find(e => e.section === activeSection);

  if (!entry || !entry.component) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        flexDirection: 'column',
        gap: '12px',
        color: '#888',
        fontFamily: 'inherit'
      }}>
        <span style={{ fontSize: '32px' }}>🔧</span>
        <p style={{ margin: 0, fontSize: '14px' }}>
          Módulo <strong>{activeSection}</strong> no encontrado en el manifest.
        </p>
      </div>
    );
  }

  const Component = entry.component;
  
  // GoogleMapsTestView no acepta onNavigate
  if (activeSection === 'google-maps-test') {
    const ComponentNoProps = Component as React.ComponentType<{}>;
    return <ComponentNoProps />;
  }
  
  // Todos los demás componentes aceptan onNavigate
  const ComponentWithProps = Component as React.ComponentType<{ onNavigate: (s: MainSection) => void }>;
  return <ComponentWithProps onNavigate={onNavigate} />;
}
