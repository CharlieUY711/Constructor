import React, { useState } from 'react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts';
import { OrangeHeader } from '../OrangeHeader';
import {
  ShoppingCart, Megaphone, Database, Monitor,
  BookOpen, Store,
} from 'lucide-react';
import { ModuleCard, ModuleCardGrid } from '../ModuleCard';
import type { CardDef } from '../ModuleCard';
import type { MainSection } from '../../../AdminDashboard';

const ORANGE = '#FF6835';

interface Props {
  onNavigate: (section: MainSection) => void;
}

export function DashboardView({ onNavigate }: Props) {
  const [timeRange, setTimeRange] = useState('7d');

  /* ── KPIs ── */
  const kpis = [
    { label: 'Ventas del Día',    value: '$48,532', change: '+12.5%', up: true,  icon: '💰' },
    { label: 'Pedidos Activos',   value: '127',     change: '+8.2%',  up: true,  icon: '📦' },
    { label: 'Clientes Nuevos',   value: '34',      change: '-3.1%',  up: false, icon: '👥' },
    { label: 'Tasa de Conversión',value: '3.24%',   change: '+0.8%',  up: true,  icon: '🎯' },
  ];

  const salesData = [
    { mes: 'Ene', ventas: 45000, pedidos: 234 },
    { mes: 'Feb', ventas: 52000, pedidos: 267 },
    { mes: 'Mar', ventas: 48000, pedidos: 251 },
    { mes: 'Abr', ventas: 61000, pedidos: 312 },
    { mes: 'May', ventas: 55000, pedidos: 289 },
    { mes: 'Jun', ventas: 67000, pedidos: 334 },
    { mes: 'Jul', ventas: 72000, pedidos: 378 },
  ];

  const topProducts = [
    { name: 'Producto A', sales: 4500, pct: 35 },
    { name: 'Producto B', sales: 3200, pct: 25 },
    { name: 'Producto C', sales: 2800, pct: 22 },
    { name: 'Producto D', sales: 1500, pct: 12 },
    { name: 'Otros',      sales: 800,  pct: 6  },
  ];

  const categoryData = [
    { name: 'Electrónica', value: 4200 },
    { name: 'Ropa',        value: 3100 },
    { name: 'Hogar',       value: 2400 },
    { name: 'Deportes',    value: 1800 },
  ];
  const PIE_COLORS = [ORANGE, '#1F2937', '#6B7280', '#9CA3AF'];

  const activity = [
    { icon: '📦', text: 'Nuevo pedido #8834 — Juan Pérez',    time: 'Hace 2 min'  },
    { icon: '💳', text: 'Pago recibido $2,340',               time: 'Hace 5 min'  },
    { icon: '👤', text: 'Nuevo cliente registrado',           time: 'Hace 12 min' },
    { icon: '⚠️', text: 'Alerta: Stock bajo en Producto X',  time: 'Hace 18 min' },
    { icon: '🚚', text: 'Pedido #8833 enviado',               time: 'Hace 25 min' },
  ];

  /* ── Acceso rápido (Vista #1) ── */
  const quickModules: CardDef[] = [
    { id: 'ecommerce',    icon: ShoppingCart, label: 'eCommerce',         description: 'Tienda, pedidos y catálogo',          color: 'blue',     onClick: () => onNavigate('ecommerce')    },
    { id: 'marketing',    icon: Megaphone,    label: 'Marketing',          description: 'Campañas, CRM y fidelización',        color: 'green',    onClick: () => onNavigate('marketing')    },
    { id: 'gestion',      icon: Database,     label: 'Gestión',            description: 'ERP, POS, Inventario y Ventas',       color: 'lavender', onClick: () => onNavigate('gestion')      },
    { id: 'sistema',      icon: Monitor,      label: 'Sistema',            description: 'Config., auditoría y usuarios',       color: 'teal',     onClick: () => onNavigate('sistema')      },
    { id: 'docs',         icon: BookOpen,     label: 'Documentación',      description: 'Manuales y guías técnicas',           color: 'yellow',   onClick: () => onNavigate('sistema')      },
    { id: 'marketplace',  icon: Store,        label: 'Módulo Marketplace', description: 'Vendedores externos y comisiones',    color: 'pink',     onClick: () => onNavigate('sistema')      },
  ];

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <OrangeHeader
        title="Dashboard"
        subtitle="Sistema de Gestión Enterprise — ODDY Market v1.5"
        actions={[
          { label: 'Nueva Venta', primary: true },
          { label: 'Reportes' },
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
        {/* KPIs */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4,1fr)',
            gap: '16px',
            marginBottom: '24px',
          }}
        >
          {kpis.map((k, i) => (
            <div
              key={i}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '14px',
                border: '1px solid #E5E7EB',
                padding: '20px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ fontSize: '1.75rem' }}>{k.icon}</span>
                <span
                  style={{
                    fontSize: '0.78rem',
                    fontWeight: '700',
                    color: k.up ? '#10B981' : '#EF4444',
                    backgroundColor: k.up ? '#D1FAE5' : '#FEE2E2',
                    padding: '3px 9px',
                    borderRadius: '6px',
                  }}
                >
                  {k.change}
                </span>
              </div>
              <p style={{ color: '#6B7280', fontSize: '0.78rem', margin: '0 0 4px' }}>
                {k.label}
              </p>
              <p
                style={{
                  color: '#111827',
                  fontSize: '1.75rem',
                  fontWeight: '800',
                  margin: 0,
                  lineHeight: 1,
                }}
              >
                {k.value}
              </p>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '16px',
            marginBottom: '24px',
          }}
        >
          {/* Line chart */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '14px',
              border: '1px solid #E5E7EB',
              padding: '24px',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '16px',
              }}
            >
              <h3
                style={{ margin: 0, fontSize: '1rem', fontWeight: '700', color: '#111827' }}
              >
                Ventas Mensuales
              </h3>
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                style={{
                  padding: '6px 10px',
                  borderRadius: '8px',
                  border: '1px solid #E5E7EB',
                  fontSize: '0.78rem',
                  outline: 'none',
                }}
              >
                <option value="7d">7 días</option>
                <option value="30d">30 días</option>
                <option value="90d">90 días</option>
              </select>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                <XAxis dataKey="mes" stroke="#9CA3AF" style={{ fontSize: '0.72rem' }} />
                <YAxis stroke="#9CA3AF" style={{ fontSize: '0.72rem' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFF',
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                    fontSize: '0.78rem',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="ventas"
                  stroke={ORANGE}
                  strokeWidth={3}
                  dot={{ fill: ORANGE, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Bar chart */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '14px',
              border: '1px solid #E5E7EB',
              padding: '24px',
            }}
          >
            <h3
              style={{ margin: '0 0 16px', fontSize: '1rem', fontWeight: '700', color: '#111827' }}
            >
              Pedidos por Mes
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                <XAxis dataKey="mes" stroke="#9CA3AF" style={{ fontSize: '0.72rem' }} />
                <YAxis stroke="#9CA3AF" style={{ fontSize: '0.72rem' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFF',
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                    fontSize: '0.78rem',
                  }}
                />
                <Bar dataKey="pedidos" fill={ORANGE} radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bottom row */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: '16px',
            marginBottom: '32px',
          }}
        >
          {/* Top products */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '14px',
              border: '1px solid #E5E7EB',
              padding: '24px',
            }}
          >
            <h3 style={{ margin: '0 0 16px', fontSize: '1rem', fontWeight: '700', color: '#111827' }}>
              Productos Top
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {topProducts.map((p, i) => (
                <div key={i}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                    <span style={{ fontSize: '0.8rem', color: '#374151', fontWeight: '600' }}>
                      {p.name}
                    </span>
                    <span style={{ fontSize: '0.78rem', color: '#6B7280' }}>
                      ${p.sales.toLocaleString()}
                    </span>
                  </div>
                  <div
                    style={{
                      height: '6px',
                      backgroundColor: '#F3F4F6',
                      borderRadius: '3px',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        width: `${p.pct}%`,
                        height: '100%',
                        backgroundColor: ORANGE,
                        borderRadius: '3px',
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pie */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '14px',
              border: '1px solid #E5E7EB',
              padding: '24px',
            }}
          >
            <h3 style={{ margin: '0 0 8px', fontSize: '1rem', fontWeight: '700', color: '#111827' }}>
              Por Categoría
            </h3>
            <ResponsiveContainer width="100%" height={170}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={42}
                  outerRadius={70}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((_, idx) => (
                    <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '6px' }}>
              {categoryData.map((c, i) => (
                <div
                  key={i}
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div
                      style={{
                        width: '10px',
                        height: '10px',
                        borderRadius: '3px',
                        backgroundColor: PIE_COLORS[i % PIE_COLORS.length],
                      }}
                    />
                    <span style={{ fontSize: '0.75rem', color: '#6B7280' }}>{c.name}</span>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: '#111827', fontWeight: '700' }}>
                    ${c.value.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Activity */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '14px',
              border: '1px solid #E5E7EB',
              padding: '24px',
            }}
          >
            <h3 style={{ margin: '0 0 16px', fontSize: '1rem', fontWeight: '700', color: '#111827' }}>
              Actividad Reciente
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {activity.map((a, i) => (
                <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: '1.05rem', flexShrink: 0 }}>{a.icon}</span>
                  <div>
                    <p style={{ margin: '0 0 2px', fontSize: '0.78rem', color: '#374151' }}>
                      {a.text}
                    </p>
                    <p style={{ margin: 0, fontSize: '0.68rem', color: '#9CA3AF' }}>{a.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <button
              style={{
                marginTop: '14px',
                width: '100%',
                padding: '8px',
                backgroundColor: 'transparent',
                border: '1px solid #E5E7EB',
                borderRadius: '8px',
                color: '#6B7280',
                fontSize: '0.78rem',
                cursor: 'pointer',
              }}
            >
              Ver todas las actividades
            </button>
          </div>
        </div>

        {/* Acceso rápido a módulos */}
        <div>
          <h3
            style={{
              fontSize: '1rem',
              fontWeight: '700',
              color: '#111827',
              margin: '0 0 16px',
            }}
          >
            Acceso Rápido a Módulos
          </h3>
          <ModuleCardGrid cards={quickModules} />
        </div>
      </div>
    </div>
  );
}
