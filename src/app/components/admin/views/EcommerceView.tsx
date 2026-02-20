import React from 'react';
import { OrangeHeader } from '../OrangeHeader';
import { ModuleCardGrid } from '../ModuleCard';
import type { CardDef } from '../ModuleCard';
import type { MainSection } from '../../../AdminDashboard';
import { Package, FolderTree, ShoppingBag, ShoppingCart, CreditCard, Truck, DollarSign } from 'lucide-react';

interface Props { onNavigate: (section: MainSection) => void; }

export function EcommerceView({ onNavigate }: Props) {
  const cards: CardDef[] = [
    {
      id: 'pedidos',
      icon: ShoppingCart,
      label: 'Pedidos',
      description: 'Gestión de órdenes, estados y seguimiento de pedidos',
      color: 'orange',
      onClick: () => onNavigate('pedidos'),
    },
    {
      id: 'pagos',
      icon: DollarSign,
      label: 'Pagos & Transacciones',
      description: 'Intentos de pago, estados, cobros y reembolsos por pedido',
      color: 'green',
      onClick: () => onNavigate('pagos'),
    },
    {
      id: 'envios',
      icon: Truck,
      label: 'Seguimiento de Envíos',
      description: 'Despacho, tránsito, entrega y estados de envío por pedido',
      color: 'purple',
      onClick: () => onNavigate('envios'),
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
      id: 'clientes',
      icon: ShoppingBag,
      label: 'Clientes',
      description: 'Compradores registrados con rol de cliente en la tienda',
      color: 'blue',
      onClick: () => onNavigate('clientes'),
    },
  ];

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <OrangeHeader
        title="eCommerce"
        subtitle="Tienda online, pedidos, pagos y logística"
        actions={[
          { label: 'Ir a la Tienda', primary: true },
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