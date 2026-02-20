import React from 'react';
import { OrangeHeader } from '../OrangeHeader';
import { ModuleCardGrid } from '../ModuleCard';
import type { CardDef } from '../ModuleCard';
import type { MainSection } from '../../../AdminDashboard';
import {
  Users, Mail, Share2, Database, RotateCcw, TrendingUp,
  Ticket, Target, MessageSquare, BarChart2, Megaphone, QrCode,
} from 'lucide-react';

interface Props {
  onNavigate: (section: MainSection) => void;
}

export function MarketingView({ onNavigate }: Props) {
  const cards: CardDef[] = [
    {
      id: 'etiqueta-emotiva',
      icon: QrCode,
      label: 'Etiqueta Emotiva ✨',
      description: 'Mensajes personalizados con QR en cada envío. Prueba de entrega real y conexión emocional con el destinatario.',
      color: 'orange',
      onClick: () => onNavigate('etiqueta-emotiva'),
    },
    {
      id: 'mailing',
      icon: Mail,
      label: 'Mailing / Email',
      description: 'Campañas, suscriptores, segmentación y A/B Testing con Resend',
      color: 'orange',
      onClick: () => onNavigate('mailing'),
    },
    {
      id: 'crm',
      icon: Users,
      label: 'CRM',
      description: 'Gestión de clientes y relaciones comerciales',
      color: 'lavender',
    },
    {
      id: 'google-ads',
      icon: TrendingUp,
      label: 'Google Ads',
      description: 'Gestiona y analiza tus campañas publicitarias',
      color: 'blue',
      onClick: () => onNavigate('google-ads'),
    },
    {
      id: 'redes',
      icon: Share2,
      label: 'Redes Sociales',
      description: 'Centro Operativo: Facebook, Instagram, WhatsApp, Calendario',
      color: 'pink',
      onClick: () => onNavigate('redes-sociales'),
    },
    {
      id: 'migracion',
      icon: Database,
      label: 'Migración RRSS',
      description: 'Backup, eliminar y rebrandear Facebook e Instagram',
      color: 'blue',
      onClick: () => onNavigate('migracion-rrss'),
    },
    {
      id: 'rueda',
      icon: RotateCcw,
      label: 'Rueda de Sorteos',
      description: 'Gamificación, descuentos y engagement en tiempo real',
      color: 'orange',
      onClick: () => onNavigate('rueda-sorteos'),
    },
    {
      id: 'fidelizacion',
      icon: Target,
      label: 'Fidelización',
      description: 'Programa de puntos y membresías Bronce/Plata/Oro/Platino',
      color: 'purple',
      onClick: () => onNavigate('fidelizacion'),
    },
    {
      id: 'cupones',
      icon: Ticket,
      label: 'Cupones',
      description: 'Descuentos, promociones y códigos especiales',
      color: 'green',
    },
    {
      id: 'popups',
      icon: MessageSquare,
      label: 'Pop-ups & Banners',
      description: 'Mensajes promocionales y captura de leads',
      color: 'yellow',
    },
    {
      id: 'abtesting',
      icon: BarChart2,
      label: 'A/B Testing',
      description: 'Experimenta y optimiza conversiones',
      color: 'blue',
      onClick: () => onNavigate('mailing'),
    },
    {
      id: 'campanas',
      icon: Megaphone,
      label: 'Campañas',
      description: 'Gestión de campañas multicanal',
      color: 'lavender',
    },
  ];

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <OrangeHeader
        title="Marketing"
        subtitle="Campañas, CRM, redes sociales y fidelización"
        actions={[
          { label: 'Nueva Campaña', primary: true },
          { label: 'Ver Métricas' },
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