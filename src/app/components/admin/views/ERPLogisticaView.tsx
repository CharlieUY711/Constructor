/* =====================================================
   Logística y Distribución
   Fulfillment · Picking & Packing · Envíos · Tracking
   ===================================================== */
import React, { useState } from 'react';
import { OrangeHeader } from '../OrangeHeader';
import type { MainSection } from '../../../AdminDashboard';
import {
  Package, Truck, MapPin, CheckSquare, Clock, AlertCircle,
  CheckCircle2, Search, Filter, Download, RefreshCw,
  ArrowRight, BarChart3, Hash, ChevronRight, Printer,
} from 'lucide-react';

interface Props { onNavigate: (section: MainSection) => void; }
type Tab = 'fulfillment' | 'picking' | 'envios' | 'tracking';

/* ── Mock data ─────────────────────────────────────── */
const ORDERS = [
  { id: 'ORD-1041', client: 'Valentina García',  items: 3, total: '$4.250', address: 'Av. 18 de Julio 1234, Montevideo',  status: 'pendiente',   priority: 'alta',   created: 'Hoy 09:14' },
  { id: 'ORD-1042', client: 'Martín Rodríguez',  items: 1, total: '$890',   address: 'Bvar. España 2567, Montevideo',     status: 'procesando',  priority: 'normal', created: 'Hoy 08:52' },
  { id: 'ORD-1043', client: 'Camila Torres',     items: 5, total: '$12.100',address: 'Calle Rivera 890, Salto',           status: 'listo',       priority: 'alta',   created: 'Ayer 17:30' },
  { id: 'ORD-1044', client: 'Sebastián López',   items: 2, total: '$2.750', address: 'Río Negro 456, Paysandú',           status: 'pendiente',   priority: 'normal', created: 'Hoy 10:01' },
  { id: 'ORD-1045', client: 'Luciana Fernández', items: 7, total: '$18.500',address: 'Colonia 1789, Montevideo',          status: 'procesando',  priority: 'crítica',created: 'Hoy 07:22' },
  { id: 'ORD-1046', client: 'Diego Martínez',    items: 4, total: '$6.300', address: 'Av. Italia 3210, Montevideo',       status: 'listo',       priority: 'normal', created: 'Ayer 15:10' },
];

const WAVES = [
  {
    id: 'W-001', name: 'Wave Mañana — Montevideo', orders: 12, items: 48, picker: 'Juan P.',
    products: [
      { sku: 'SKU-001', name: 'Zapatillas Running Pro X', qty: 4, bin: 'A-12-3', done: true },
      { sku: 'SKU-002', name: 'Remera Dry Fit L',         qty: 7, bin: 'B-05-1', done: true },
      { sku: 'SKU-003', name: 'Short Deportivo M',        qty: 3, bin: 'B-06-2', done: false },
      { sku: 'SKU-004', name: 'Medias Compresión Pack3',  qty: 12, bin: 'C-01-4', done: false },
      { sku: 'SKU-005', name: 'Botella Térmica 750ml',    qty: 5, bin: 'D-08-1', done: false },
    ],
  },
  {
    id: 'W-002', name: 'Wave Tarde — Interior', orders: 8, items: 31, picker: 'Laura M.',
    products: [
      { sku: 'SKU-006', name: 'Mochila Trail 30L',        qty: 2, bin: 'A-04-2', done: false },
      { sku: 'SKU-007', name: 'Guantes Ciclismo',         qty: 5, bin: 'E-02-3', done: false },
      { sku: 'SKU-008', name: 'Casco MTB Talla M',        qty: 3, bin: 'E-05-1', done: false },
    ],
  },
];

const SHIPMENTS = [
  { id: 'ENV-2201', order: 'ORD-1036', client: 'Roberto Díaz',   carrier: 'Andreani', tracking: 'AND-88721', weight: '2.3 kg', cost: '$380', status: 'en_tránsito', date: '18 Feb' },
  { id: 'ENV-2202', order: 'ORD-1037', client: 'Paula Sousa',    carrier: 'OCA',      tracking: 'OCA-44312', weight: '0.8 kg', cost: '$220', status: 'entregado',   date: '17 Feb' },
  { id: 'ENV-2203', order: 'ORD-1038', client: 'Andrés Vega',    carrier: 'FedEx',    tracking: 'FDX-91034', weight: '5.1 kg', cost: '$890', status: 'preparando',  date: '19 Feb' },
  { id: 'ENV-2204', order: 'ORD-1039', client: 'Elena Castro',   carrier: 'Andreani', tracking: 'AND-88880', weight: '1.2 kg', cost: '$350', status: 'en_tránsito', date: '18 Feb' },
  { id: 'ENV-2205', order: 'ORD-1040', client: 'Mario Suárez',   carrier: 'Correos',  tracking: 'COR-55432', weight: '3.7 kg', cost: '$290', status: 'entregado',   date: '15 Feb' },
  { id: 'ENV-2206', order: 'ORD-1043', client: 'Camila Torres',  carrier: 'OCA',      tracking: 'OCA-44390', weight: '4.5 kg', cost: '$480', status: 'preparando',  date: '19 Feb' },
];

const TRACKING_EVENTS = [
  { id: 'AND-88721', client: 'Roberto Díaz', events: [
    { time: '19 Feb 08:30', label: 'Enviado desde depósito Montevideo', done: true },
    { time: '19 Feb 14:00', label: 'En camino — Sucursal Florida',      done: true },
    { time: '19 Feb 19:00', label: 'Entrega estimada',                  done: false },
  ]},
  { id: 'AND-88880', client: 'Elena Castro', events: [
    { time: '18 Feb 10:15', label: 'Enviado desde depósito',            done: true },
    { time: '18 Feb 16:30', label: 'En centro de distribución',         done: true },
    { time: '19 Feb 09:00', label: 'En camino — última milla',         done: true },
    { time: '19 Feb 14:00', label: 'Entrega estimada',                  done: false },
  ]},
];

/* ── Status configs ────────────────────────────────── */
const ORDER_STATUS: Record<string, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  pendiente:  { label: 'Pendiente',  color: '#D97706', bg: '#FEF3C7', icon: <Clock size={12} /> },
  procesando: { label: 'Procesando', color: '#2563EB', bg: '#DBEAFE', icon: <RefreshCw size={12} /> },
  listo:      { label: 'Listo',      color: '#059669', bg: '#D1FAE5', icon: <CheckCircle2 size={12} /> },
};
const SHIP_STATUS: Record<string, { label: string; color: string; bg: string }> = {
  preparando:  { label: 'Preparando',   color: '#D97706', bg: '#FEF3C7' },
  en_tránsito: { label: 'En tránsito',  color: '#2563EB', bg: '#DBEAFE' },
  entregado:   { label: 'Entregado',    color: '#059669', bg: '#D1FAE5' },
};
const PRIORITY_COLOR: Record<string, string> = {
  crítica: '#DC2626', alta: '#D97706', normal: '#6B7280',
};

export function ERPLogisticaView({ onNavigate }: Props) {
  const [tab, setTab] = useState<Tab>('fulfillment');
  const TABS = [
    { id: 'fulfillment' as Tab, icon: <Package size={14} />,   label: 'Fulfillment' },
    { id: 'picking'     as Tab, icon: <CheckSquare size={14} />, label: 'Picking & Packing' },
    { id: 'envios'      as Tab, icon: <Truck size={14} />,    label: 'Envíos' },
    { id: 'tracking'    as Tab, icon: <MapPin size={14} />,   label: 'Tracking' },
  ];

  const kpis = [
    { label: 'Pendientes',  value: ORDERS.filter(o => o.status === 'pendiente').length,  color: '#F59E0B' },
    { label: 'Procesando',  value: ORDERS.filter(o => o.status === 'procesando').length, color: '#3B82F6' },
    { label: 'Listos',      value: ORDERS.filter(o => o.status === 'listo').length,      color: '#10B981' },
    { label: 'En tránsito', value: SHIPMENTS.filter(s => s.status === 'en_tránsito').length, color: '#6366F1' },
  ];

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <OrangeHeader
        title="Logística y Distribución"
        subtitle="Fulfillment, picking, envíos y tracking en tiempo real"
        actions={[
          { label: 'Volver', onClick: () => onNavigate('gestion') },
          { label: 'Nueva Orden de Envío', primary: true },
        ]}
      />

      {/* KPIs */}
      <div style={{ backgroundColor: '#fff', borderBottom: '1px solid #E5E7EB', padding: '14px 28px', display: 'flex', gap: '16px', flexShrink: 0 }}>
        {kpis.map(k => (
          <div key={k.label} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 20px', backgroundColor: '#F9FAFB', borderRadius: '10px', flex: 1 }}>
            <div style={{ width: 8, height: 32, borderRadius: '4px', backgroundColor: k.color }} />
            <div>
              <div style={{ fontSize: '22px', fontWeight: 800, color: '#111' }}>{k.value}</div>
              <div style={{ fontSize: '11px', color: '#6B7280' }}>{k.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ backgroundColor: '#fff', borderBottom: '1px solid #E5E7EB', display: 'flex', padding: '0 28px', flexShrink: 0 }}>
        {TABS.map(t => {
          const active = tab === t.id;
          return (
            <button key={t.id} onClick={() => setTab(t.id)}
              style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: '14px 20px', border: 'none', borderBottom: `3px solid ${active ? '#FF6835' : 'transparent'}`, backgroundColor: 'transparent', cursor: 'pointer', fontSize: '14px', fontWeight: active ? 700 : 500, color: active ? '#FF6835' : '#555' }}>
              {t.icon}{t.label}
            </button>
          );
        })}
      </div>

      <div style={{ flex: 1, overflowY: 'auto', backgroundColor: '#F8F9FA' }}>
        {tab === 'fulfillment' && <TabFulfillment />}
        {tab === 'picking'     && <TabPicking />}
        {tab === 'envios'      && <TabEnvios />}
        {tab === 'tracking'    && <TabTracking />}
      </div>
    </div>
  );
}

/* ── Fulfillment ────────────────────────────────────── */
function TabFulfillment() {
  const [filter, setFilter] = useState('todos');
  const filtered = filter === 'todos' ? ORDERS : ORDERS.filter(o => o.status === filter);

  return (
    <div style={{ padding: '24px 28px' }}>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        {['todos', 'pendiente', 'procesando', 'listo'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            style={{ padding: '8px 16px', border: `1.5px solid ${filter === f ? '#FF6835' : '#E0E0E0'}`, borderRadius: '8px', backgroundColor: filter === f ? '#FF683510' : '#fff', color: filter === f ? '#FF6835' : '#555', cursor: 'pointer', fontSize: '13px', fontWeight: filter === f ? 700 : 500, textTransform: 'capitalize' }}>
            {f === 'todos' ? 'Todos' : ORDER_STATUS[f]?.label}
          </button>
        ))}
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
          <button style={{ display: 'flex', gap: '6px', alignItems: 'center', padding: '8px 14px', border: '1.5px solid #E0E0E0', borderRadius: '8px', backgroundColor: '#fff', cursor: 'pointer', fontSize: '13px', color: '#555' }}>
            <Download size={14} /> Exportar
          </button>
        </div>
      </div>
      <div style={{ backgroundColor: '#fff', borderRadius: '14px', border: '1px solid #E5E7EB', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#F9FAFB', borderBottom: '1.5px solid #E5E7EB' }}>
              {['Orden', 'Cliente', 'Ítems', 'Total', 'Dirección', 'Prioridad', 'Estado', 'Creada', ''].map(h => (
                <th key={h} style={{ padding: '12px 14px', textAlign: 'left', fontSize: '12px', fontWeight: 700, color: '#6B7280', whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((o, i) => {
              const st = ORDER_STATUS[o.status];
              return (
                <tr key={o.id} style={{ borderBottom: i < filtered.length - 1 ? '1px solid #F3F4F6' : 'none' }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#FAFAFA')}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}>
                  <td style={{ padding: '14px', fontWeight: 700, fontSize: '13px', color: '#FF6835' }}>{o.id}</td>
                  <td style={{ padding: '14px', fontSize: '13px', fontWeight: 600, color: '#111' }}>{o.client}</td>
                  <td style={{ padding: '14px', textAlign: 'center' }}>
                    <span style={{ backgroundColor: '#F3F4F6', borderRadius: '20px', padding: '2px 10px', fontSize: '12px', fontWeight: 700 }}>{o.items}</span>
                  </td>
                  <td style={{ padding: '14px', fontWeight: 700, color: '#111' }}>{o.total}</td>
                  <td style={{ padding: '14px', fontSize: '12px', color: '#6B7280', maxWidth: '180px' }}>
                    <div style={{ display: 'flex', gap: '4px', alignItems: 'flex-start' }}><MapPin size={11} style={{ flexShrink: 0, marginTop: '2px' }} />{o.address}</div>
                  </td>
                  <td style={{ padding: '14px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: PRIORITY_COLOR[o.priority] }}>● {o.priority}</span>
                  </td>
                  <td style={{ padding: '14px' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600, color: st.color, backgroundColor: st.bg }}>
                      {st.icon}{st.label}
                    </span>
                  </td>
                  <td style={{ padding: '14px', fontSize: '12px', color: '#9CA3AF', whiteSpace: 'nowrap' }}>{o.created}</td>
                  <td style={{ padding: '14px' }}>
                    <button style={{ padding: '6px 12px', backgroundColor: '#FF6835', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: 700 }}>
                      Procesar
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ── Picking ─────────────────────────────────────────── */
function TabPicking() {
  const [activeWave, setActiveWave] = useState(0);
  const [pickedMap, setPickedMap] = useState<Record<string, boolean>>({});
  const wave = WAVES[activeWave];
  const toggle = (sku: string) => setPickedMap(m => ({ ...m, [sku]: !m[sku] }));
  const doneCount = wave.products.filter(p => pickedMap[p.sku] || p.done).length;

  return (
    <div style={{ padding: '24px 28px', display: 'grid', gridTemplateColumns: '280px 1fr', gap: '20px' }}>
      {/* Wave selector */}
      <div>
        <div style={{ fontWeight: 700, fontSize: '13px', color: '#6B7280', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Waves activas</div>
        {WAVES.map((w, i) => (
          <button key={w.id} onClick={() => setActiveWave(i)}
            style={{ width: '100%', padding: '14px', borderRadius: '12px', border: `2px solid ${activeWave === i ? '#FF6835' : '#E5E7EB'}`, backgroundColor: activeWave === i ? '#FF683508' : '#fff', cursor: 'pointer', textAlign: 'left', marginBottom: '8px', transition: 'all 0.15s' }}>
            <div style={{ fontWeight: 700, fontSize: '13px', color: '#111', marginBottom: '4px' }}>{w.id}</div>
            <div style={{ fontSize: '12px', color: '#6B7280', marginBottom: '6px' }}>{w.name}</div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <span style={{ fontSize: '11px', color: '#555' }}>{w.orders} órdenes</span>
              <span style={{ fontSize: '11px', color: '#555' }}>{w.items} ítems</span>
            </div>
            <div style={{ fontSize: '11px', color: '#9CA3AF', marginTop: '4px' }}>Picker: {w.picker}</div>
          </button>
        ))}
      </div>

      {/* Picking list */}
      <div>
        <div style={{ backgroundColor: '#fff', borderRadius: '14px', border: '1px solid #E5E7EB', overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: '15px', color: '#111' }}>{wave.name}</div>
              <div style={{ fontSize: '13px', color: '#6B7280', marginTop: '2px' }}>{doneCount}/{wave.products.length} ítems completados</div>
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <div style={{ width: '100px', height: '6px', backgroundColor: '#F0F0F0', borderRadius: '3px' }}>
                <div style={{ height: '100%', borderRadius: '3px', backgroundColor: '#10B981', width: `${(doneCount / wave.products.length) * 100}%`, transition: 'width 0.3s' }} />
              </div>
              <button style={{ display: 'flex', gap: '6px', alignItems: 'center', padding: '8px 14px', backgroundColor: '#FF6835', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 700 }}>
                <Printer size={13} /> Imprimir
              </button>
            </div>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#F9FAFB' }}>
                {['', 'SKU', 'Producto', 'Cant.', 'Ubicación', 'Estado'].map(h => (
                  <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: '12px', fontWeight: 700, color: '#6B7280' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {wave.products.map((p, i) => {
                const done = pickedMap[p.sku] || p.done;
                return (
                  <tr key={p.sku} style={{ borderTop: '1px solid #F3F4F6', backgroundColor: done ? '#F0FDF4' : 'transparent' }}>
                    <td style={{ padding: '12px 14px' }}>
                      <button onClick={() => toggle(p.sku)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: done ? '#10B981' : '#D1D5DB' }}>
                        {done ? <CheckCircle2 size={20} /> : <CheckSquare size={20} />}
                      </button>
                    </td>
                    <td style={{ padding: '12px 14px', fontSize: '12px', color: '#9CA3AF', fontFamily: 'monospace' }}>{p.sku}</td>
                    <td style={{ padding: '12px 14px', fontSize: '14px', color: '#111', fontWeight: done ? 400 : 600, textDecoration: done ? 'line-through' : 'none' }}>{p.name}</td>
                    <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                      <span style={{ width: 30, height: 30, borderRadius: '50%', backgroundColor: '#FF6835', color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 800 }}>{p.qty}</span>
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <span style={{ backgroundColor: '#EFF6FF', color: '#1D4ED8', padding: '3px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: 700, fontFamily: 'monospace' }}>{p.bin}</span>
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <span style={{ fontSize: '12px', fontWeight: 600, color: done ? '#059669' : '#D97706' }}>{done ? '✓ Recolectado' : '⏳ Pendiente'}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ── Envíos ──────────────────────────────────────────── */
function TabEnvios() {
  return (
    <div style={{ padding: '24px 28px' }}>
      <div style={{ backgroundColor: '#fff', borderRadius: '14px', border: '1px solid #E5E7EB', overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700 }}>Gestión de Envíos</h3>
          <button style={{ padding: '8px 16px', backgroundColor: '#FF6835', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 700 }}>
            + Nuevo Envío
          </button>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#F9FAFB', borderBottom: '1.5px solid #E5E7EB' }}>
              {['ID Envío', 'Orden', 'Cliente', 'Transportista', 'Tracking', 'Peso', 'Costo', 'Estado', 'Fecha', ''].map(h => (
                <th key={h} style={{ padding: '12px 14px', textAlign: 'left', fontSize: '12px', fontWeight: 700, color: '#6B7280', whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {SHIPMENTS.map((s, i) => {
              const st = SHIP_STATUS[s.status];
              return (
                <tr key={s.id} style={{ borderBottom: i < SHIPMENTS.length - 1 ? '1px solid #F3F4F6' : 'none' }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#FAFAFA')}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}>
                  <td style={{ padding: '13px 14px', fontWeight: 700, fontSize: '13px', color: '#FF6835' }}>{s.id}</td>
                  <td style={{ padding: '13px 14px', fontSize: '12px', color: '#374151' }}>{s.order}</td>
                  <td style={{ padding: '13px 14px', fontSize: '13px', fontWeight: 600, color: '#111' }}>{s.client}</td>
                  <td style={{ padding: '13px 14px' }}>
                    <span style={{ padding: '3px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: 600, backgroundColor: '#F3F4F6', color: '#374151' }}>{s.carrier}</span>
                  </td>
                  <td style={{ padding: '13px 14px', fontFamily: 'monospace', fontSize: '12px', color: '#4B5563' }}>{s.tracking}</td>
                  <td style={{ padding: '13px 14px', fontSize: '13px', color: '#555' }}>{s.weight}</td>
                  <td style={{ padding: '13px 14px', fontWeight: 700, color: '#111' }}>{s.cost}</td>
                  <td style={{ padding: '13px 14px' }}>
                    <span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600, color: st.color, backgroundColor: st.bg }}>{st.label}</span>
                  </td>
                  <td style={{ padding: '13px 14px', fontSize: '12px', color: '#9CA3AF' }}>{s.date}</td>
                  <td style={{ padding: '13px 14px' }}>
                    <button style={{ width: 28, height: 28, borderRadius: '6px', border: '1px solid #E0E0E0', backgroundColor: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Printer size={13} color="#6B7280" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ── Tracking ────────────────────────────────────────── */
function TabTracking() {
  const [selected, setSelected] = useState(TRACKING_EVENTS[0].id);
  const ev = TRACKING_EVENTS.find(t => t.id === selected)!;

  return (
    <div style={{ padding: '24px 28px', display: 'grid', gridTemplateColumns: '300px 1fr', gap: '20px' }}>
      {/* Shipment list */}
      <div>
        <div style={{ fontWeight: 700, fontSize: '13px', color: '#6B7280', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Envíos en tránsito</div>
        {SHIPMENTS.filter(s => s.status === 'en_tránsito').map(s => (
          <button key={s.tracking} onClick={() => setSelected(s.tracking)}
            style={{ width: '100%', padding: '14px', borderRadius: '12px', border: `2px solid ${selected === s.tracking ? '#FF6835' : '#E5E7EB'}`, backgroundColor: selected === s.tracking ? '#FF683508' : '#fff', cursor: 'pointer', textAlign: 'left', marginBottom: '8px', transition: 'all 0.15s' }}>
            <div style={{ fontWeight: 700, fontSize: '13px', color: '#111' }}>{s.tracking}</div>
            <div style={{ fontSize: '12px', color: '#6B7280', marginTop: '2px' }}>{s.client} · {s.carrier}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '6px' }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#3B82F6', display: 'inline-block' }} />
              <span style={{ fontSize: '11px', color: '#2563EB', fontWeight: 600 }}>En tránsito</span>
            </div>
          </button>
        ))}
      </div>

      {/* Timeline */}
      <div style={{ backgroundColor: '#fff', borderRadius: '14px', border: '1px solid #E5E7EB', padding: '24px' }}>
        <div style={{ marginBottom: '20px' }}>
          <div style={{ fontWeight: 800, fontSize: '16px', color: '#111' }}>{ev.id}</div>
          <div style={{ fontSize: '13px', color: '#6B7280', marginTop: '2px' }}>Cliente: {ev.client}</div>
        </div>
        <div style={{ position: 'relative', paddingLeft: '24px' }}>
          {/* Vertical line */}
          <div style={{ position: 'absolute', left: '8px', top: '8px', bottom: '8px', width: '2px', backgroundColor: '#E5E7EB' }} />
          {ev.events.map((e, i) => (
            <div key={i} style={{ position: 'relative', paddingBottom: i < ev.events.length - 1 ? '24px' : '0' }}>
              <div style={{ position: 'absolute', left: '-20px', width: '16px', height: '16px', borderRadius: '50%', backgroundColor: e.done ? '#10B981' : '#E5E7EB', border: `3px solid ${e.done ? '#059669' : '#D1D5DB'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', top: '1px' }}>
                {e.done && <div style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#fff' }} />}
              </div>
              <div style={{ opacity: e.done ? 1 : 0.5 }}>
                <div style={{ fontWeight: e.done ? 600 : 400, fontSize: '14px', color: '#111' }}>{e.label}</div>
                <div style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '2px' }}>{e.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
