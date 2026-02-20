import React from 'react';
import { OrangeHeader } from '../OrangeHeader';
import { ModuleCardGrid } from '../ModuleCard';
import type { CardDef } from '../ModuleCard';
import {
  Sparkles, Box, Activity, CheckSquare, DollarSign, BookOpen,
  Shield, Building, BarChart2, Clock, Plug, Settings2, Eye,
} from 'lucide-react';
import type { MainSection } from '../../../AdminDashboard';

interface Props {
  onNavigate: (section: MainSection) => void;
}

export function SistemaView({ onNavigate }: Props) {
  const cards: CardDef[] = [
    {
      id: 'diseno',
      icon: Sparkles,
      label: 'Diseño',
      description: 'Espacio de diseño y pruebas visuales',
      color: 'orange',
      onClick: () => onNavigate('diseno'),
    },
    {
      id: 'marketplace-mod',
      icon: Box,
      label: 'Module Marketplace',
      description: 'Módulos enterprise portables y reutilizables',
      color: 'blue',
    },
    {
      id: 'diagnostico',
      icon: Activity,
      label: 'Diagnóstico Backend',
      description: 'Estado y diagnóstico de servicios backend',
      color: 'green',
    },
    {
      id: 'checklist',
      icon: CheckSquare,
      label: 'Checklist & Roadmap',
      description: 'Estado de todos los módulos y progreso de Charlie',
      color: 'orange',
      onClick: () => onNavigate('checklist'),
    },
    {
      id: 'presupuestos-sis',
      icon: DollarSign,
      label: 'Generador de Presupuestos',
      description: 'Crea presupuestos personalizados para clientes',
      color: 'teal',
    },
    {
      id: 'docs-sis',
      icon: BookOpen,
      label: 'Documentación',
      description: 'Documentación técnica y manual de usuario',
      color: 'blue',
    },
    {
      id: 'auditoria-sis',
      icon: Shield,
      label: 'Auditoría del Sistema',
      description: 'Evaluación completa de funcionalidades',
      color: 'lavender',
    },
    {
      id: 'analiticas',
      icon: BarChart2,
      label: 'Analíticas',
      description: 'Reportes avanzados y métricas',
      color: 'purple',
    },
    {
      id: 'auditoria-logs',
      icon: Clock,
      label: 'Auditoría y Logs',
      description: 'Historial de acciones del sistema',
      color: 'lavender',
    },
    {
      id: 'integraciones',
      icon: Plug,
      label: 'Integraciones',
      description: 'RRSS, Mercado Libre, Pagos y más',
      color: 'teal',
      onClick: () => onNavigate('integraciones'),
    },
    {
      id: 'config-apis',
      icon: Settings2,
      label: 'Configurar APIs',
      description: 'Claves y configuración de servicios',
      color: 'orange',
      onClick: () => onNavigate('integraciones'),
    },
    {
      id: 'config-vistas',
      icon: Eye,
      label: 'Configurar Vistas',
      description: 'Permisos de visualización por rol',
      color: 'pink',
    },
  ];

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <OrangeHeader
        title="Sistema"
        subtitle="Configuración, auditoría, integraciones y usuarios"
        actions={[
          { label: 'Diagnóstico', primary: true },
          { label: 'Ver Logs' },
        ]}
      />
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '28px 32px',
          backgroundColor: '#F8F9FA',
        }}
      >
        <ModuleCardGrid cards={cards} />
      </div>
    </div>
  );
}