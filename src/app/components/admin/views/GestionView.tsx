import React from 'react';
import { OrangeHeader } from '../OrangeHeader';
import { ModuleCardGrid } from '../ModuleCard';
import type { CardDef } from '../ModuleCard';
import type { MainSection } from '../../../AdminDashboard';
import {
  Layers, Package, FolderTree, Receipt, ClipboardList,
  Users, Truck, BookOpen, UserCheck, FolderKanban,
  User, Building2, ShoppingBag,
} from 'lucide-react';

interface Props { onNavigate: (section: MainSection) => void; }

export function GestionView({ onNavigate }: Props) {
  const cards: CardDef[] = [
    {
      id: 'erp',
      icon: Layers,
      label: 'ERP — Sistema Central',
      description: 'Gestión empresarial integrada',
      color: 'blue',
    },
    {
      id: 'inventario',
      icon: Package,
      label: 'Catálogo de Artículos',
      description: 'Gestión de productos, stock y movimientos',
      color: 'yellow',
      onClick: () => onNavigate('erp-inventario'),
    },
    {
      id: 'departamentos',
      icon: FolderTree,
      label: 'Departamentos y Categorías',
      description: 'Departamentos, categorías y subcategorías de la tienda',
      color: 'teal',
      onClick: () => onNavigate('departamentos'),
    },
    {
      id: 'personas',
      icon: User,
      label: 'Personas',
      description: 'Base de personas naturales y jurídicas del sistema',
      color: 'blue',
      onClick: () => onNavigate('personas'),
    },
    {
      id: 'organizaciones',
      icon: Building2,
      label: 'Organizaciones',
      description: 'Empresas, cooperativas y entidades registradas',
      color: 'orange',
      onClick: () => onNavigate('organizaciones'),
    },
    {
      id: 'facturacion',
      icon: Receipt,
      label: 'Facturación',
      description: 'Emisión de facturas, comprobantes y cobros',
      color: 'green',
      onClick: () => onNavigate('erp-facturacion'),
    },
    {
      id: 'compras',
      icon: ClipboardList,
      label: 'Compras',
      description: 'Órdenes de compra y gestión de proveedores',
      color: 'orange',
      onClick: () => onNavigate('erp-compras'),
    },
    {
      id: 'crm',
      icon: Users,
      label: 'CRM',
      description: 'Contactos, pipeline de ventas y actividades',
      color: 'lavender',
      onClick: () => onNavigate('erp-crm'),
    },
    {
      id: 'logistica',
      icon: Truck,
      label: 'Logística',
      description: 'Envíos, seguimiento y gestión de flota',
      color: 'rose',
      onClick: () => onNavigate('erp-logistica'),
    },
    {
      id: 'contabilidad',
      icon: BookOpen,
      label: 'Contabilidad',
      description: 'Plan de cuentas, asientos y balances',
      color: 'purple',
      onClick: () => onNavigate('erp-contabilidad'),
    },
    {
      id: 'rrhh',
      icon: UserCheck,
      label: 'RRHH',
      description: 'Empleados, nómina y gestión de personal',
      color: 'pink',
      onClick: () => onNavigate('erp-rrhh'),
    },
    {
      id: 'proyectos',
      icon: FolderKanban,
      label: 'Proyectos',
      description: 'Kanban, tareas y seguimiento de proyectos',
      color: 'teal',
      onClick: () => onNavigate('proyectos'),
    },
    {
      id: 'clientes',
      icon: ShoppingBag,
      label: 'Clientes',
      description: 'Personas con rol de cliente activo en el sistema',
      color: 'green',
      onClick: () => onNavigate('clientes'),
    },
  ];

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <OrangeHeader
        title="Gestión"
        subtitle="ERP, Base de Personas y Organizaciones"
        actions={[{ label: 'Nueva Orden', primary: true }]}
      />
      <div style={{ flex: 1, overflowY: 'auto', padding: '28px 32px', backgroundColor: '#F8F9FA' }}>
        <ModuleCardGrid cards={cards} />
      </div>
    </div>
  );
}