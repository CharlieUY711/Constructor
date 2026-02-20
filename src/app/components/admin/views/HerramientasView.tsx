import React from 'react';
import { OrangeHeader } from '../OrangeHeader';
import { ModuleCardGrid } from '../ModuleCard';
import type { CardDef } from '../ModuleCard';
import type { MainSection } from '../../../AdminDashboard';
import {
  Sparkles, FileText, QrCode, Brain, ScanLine,
  DollarSign, RotateCcw, Printer, BookOpen,
} from 'lucide-react';

interface Props { onNavigate: (section: MainSection) => void; }

export function HerramientasView({ onNavigate }: Props) {
  const cards: CardDef[] = [
    {
      id: 'editor-imagenes',
      icon: Sparkles,
      label: 'Editor de Imágenes Pro',
      description: 'Editor profesional con 50+ herramientas: Collage, Recorte, Filtros, Remover Fondo con IA',
      color: 'orange',
    },
    {
      id: 'gen-documentos',
      icon: FileText,
      label: 'Generador de Documentos',
      description: 'Crea facturas, contratos y más con IA',
      color: 'blue',
    },
    {
      id: 'gen-qr',
      icon: QrCode,
      label: 'Generador de QR',
      description: 'Códigos QR con personalización total — sin APIs externas, genera PNG y SVG vectorial',
      color: 'green',
      onClick: () => onNavigate('qr-generator'),
    },
    {
      id: 'herramientas-ia',
      icon: Brain,
      label: 'Herramientas IA',
      description: 'Inteligencia artificial y machine learning',
      color: 'purple',
    },
    {
      id: 'ocr',
      icon: ScanLine,
      label: 'OCR',
      description: 'Extrae texto de imágenes y documentos escaneados',
      color: 'lavender',
    },
    {
      id: 'presupuestos',
      icon: DollarSign,
      label: 'Generador de Presupuestos',
      description: 'Crea presupuestos personalizados para clientes',
      color: 'teal',
    },
    {
      id: 'rueda-sorteos',
      icon: RotateCcw,
      label: 'Rueda de Sorteos',
      description: 'Organiza sorteos interactivos y campañas',
      color: 'pink',
    },
    {
      id: 'impresion',
      icon: Printer,
      label: 'Impresión',
      description: 'Gestiona trabajos de impresión y etiquetas',
      color: 'yellow',
    },
    {
      id: 'biblioteca',
      icon: BookOpen,
      label: 'Biblioteca / Documentación',
      description: 'Manuales, guías y documentación técnica',
      color: 'rose',
    },
  ];

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <OrangeHeader
        title="Herramientas"
        subtitle="Suite completa de herramientas con IA integrada"
        actions={[
          { label: 'Abrir Editor', primary: true },
          { label: 'Ver Historial' },
        ]}
      />
      <div style={{ flex: 1, overflowY: 'auto', padding: '28px 32px', backgroundColor: '#F8F9FA' }}>
        <ModuleCardGrid cards={cards} />
      </div>
    </div>
  );
}