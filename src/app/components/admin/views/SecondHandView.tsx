import React, { useState } from 'react';
import { OrangeHeader } from '../OrangeHeader';
import type { MainSection } from '../../../AdminDashboard';
import {
  CheckCircle2, CircleX, Clock, Eye, Package,
  TrendingUp, DollarSign, Users, Star, AlertTriangle,
  Search, Filter, ChevronDown,
} from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts';

interface Props { onNavigate: (section: MainSection) => void; }

const PURPLE = '#7C3AED';
const ORANGE = '#FF6835';

type TabType = 'moderacion' | 'estadisticas' | 'publicaciones';

interface Listing {
  id: string;
  title: string;
  price: number;
  category: string;
  seller: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  image: string;
}

const MOCK_LISTINGS: Listing[] = [
  { id: '1', title: 'iPhone 13 Pro 256GB - Muy buen estado', price: 650, category: 'Tecnología', seller: 'Juan P.', status: 'pending', createdAt: '2026-02-19', image: '📱' },
  { id: '2', title: 'Silla de escritorio ergonómica', price: 120, category: 'Hogar', seller: 'María G.', status: 'pending', createdAt: '2026-02-18', image: '🪑' },
  { id: '3', title: 'Bicicleta montaña Trek - R26', price: 280, category: 'Deportes', seller: 'Carlos M.', status: 'approved', createdAt: '2026-02-17', image: '🚲' },
  { id: '4', title: 'Campera de cuero talle M', price: 85, category: 'Moda', seller: 'Ana L.', status: 'rejected', createdAt: '2026-02-16', image: '🧥' },
  { id: '5', title: 'PS5 con 3 juegos incluidos', price: 420, category: 'Tecnología', seller: 'Pedro R.', status: 'approved', createdAt: '2026-02-15', image: '🎮' },
  { id: '6', title: 'Cochecito de bebé Graco - nuevo', price: 150, category: 'Bebés', seller: 'Laura S.', status: 'pending', createdAt: '2026-02-19', image: '🍼' },
];

const MONTHLY_DATA = [
  { mes: 'Sep', publicaciones: 42, aprobadas: 35, rechazadas: 7 },
  { mes: 'Oct', publicaciones: 58, aprobadas: 49, rechazadas: 9 },
  { mes: 'Nov', publicaciones: 74, aprobadas: 62, rechazadas: 12 },
  { mes: 'Dic', publicaciones: 91, aprobadas: 78, rechazadas: 13 },
  { mes: 'Ene', publicaciones: 67, aprobadas: 55, rechazadas: 12 },
  { mes: 'Feb', publicaciones: 83, aprobadas: 68, rechazadas: 15 },
];

const CAT_DATA = [
  { name: 'Tecnología', value: 38, color: '#3B82F6' },
  { name: 'Moda',       value: 22, color: '#EC4899' },
  { name: 'Hogar',      value: 18, color: '#10B981' },
  { name: 'Deportes',   value: 14, color: '#F59E0B' },
  { name: 'Otros',      value: 8,  color: '#9CA3AF' },
];

export function SecondHandView({ onNavigate }: Props) {
  const [tab, setTab] = useState<TabType>('estadisticas');
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [search, setSearch] = useState('');
  const [moderationOpen, setModerationOpen] = useState(true);

  const pending  = MOCK_LISTINGS.filter(l => l.status === 'pending').length;
  const approved = MOCK_LISTINGS.filter(l => l.status === 'approved').length;
  const rejected = MOCK_LISTINGS.filter(l => l.status === 'rejected').length;

  const filtered = MOCK_LISTINGS.filter(l => {
    if (filter !== 'all' && l.status !== filter) return false;
    if (search && !l.title.toLowerCase().includes(search.toLowerCase()) && !l.seller.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const STATUS_CONFIG = {
    pending:  { label: 'Pendiente', bg: '#FEF3C7', color: '#B45309', Icon: Clock },
    approved: { label: 'Aprobada',  bg: '#DCFCE7', color: '#15803D', Icon: CheckCircle2 },
    rejected: { label: 'Rechazada', bg: '#FEE2E2', color: '#DC2626', Icon: CircleX },
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <OrangeHeader
        title={<span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          ♻️ Second Hand
        </span>}
        subtitle="Marketplace de artículos usados — Moderación y estadísticas"
        actions={[
          { label: 'Volver', onClick: () => onNavigate('gestion') },
          { label: 'Exportar Datos' },
        ]}
      />

      {/* Tabs */}
      <div style={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid #E5E7EB', flexShrink: 0 }}>
        <div style={{ display: 'flex', padding: '0 28px' }}>
          {[
            { id: 'estadisticas' as TabType, label: '📊 Estadísticas' },
            { id: 'moderacion'   as TabType, label: '🛡️ Moderación' },
            { id: 'publicaciones' as TabType, label: '📋 Publicaciones' },
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              style={{ padding: '14px 18px', border: 'none', backgroundColor: 'transparent', cursor: 'pointer', color: tab === t.id ? PURPLE : '#6B7280', fontWeight: tab === t.id ? '700' : '500', fontSize: '0.875rem', borderBottom: tab === t.id ? `2px solid ${PURPLE}` : '2px solid transparent' }}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', backgroundColor: '#F8F9FA' }}>
        <div style={{ padding: '24px 28px', maxWidth: '1200px' }}>

          {/* ── ESTADÍSTICAS ── */}
          {tab === 'estadisticas' && (
            <>
              {/* KPI cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
                {[
                  { label: 'Total Publicaciones', value: MOCK_LISTINGS.length.toString(), Icon: Package, color: PURPLE, sub: '+12% este mes' },
                  { label: 'Pendientes',           value: pending.toString(),             Icon: Clock,       color: '#D97706', sub: 'Requieren revisión' },
                  { label: 'Aprobadas',            value: approved.toString(),            Icon: CheckCircle2, color: '#16A34A', sub: `${Math.round((approved/MOCK_LISTINGS.length)*100)}% del total` },
                  { label: 'Vendedores Activos',   value: '47',                           Icon: Users,       color: '#3B82F6', sub: '+5 esta semana' },
                ].map((s, i) => (
                  <div key={i} style={{ backgroundColor: '#FFFFFF', border: `1px solid ${s.color}22`, borderRadius: '12px', padding: '18px 20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontSize: '0.78rem', color: '#6B7280' }}>{s.label}</span>
                      <s.Icon size={16} color={s.color} />
                    </div>
                    <p style={{ margin: '0 0 4px', fontSize: '1.7rem', fontWeight: '900', color: s.color }}>{s.value}</p>
                    <p style={{ margin: 0, fontSize: '0.72rem', color: '#9CA3AF' }}>{s.sub}</p>
                  </div>
                ))}
              </div>

              {/* Revenue + avg price */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
                {[
                  { label: 'Valor Total Publicado', value: '$24,580', Icon: DollarSign, color: '#10B981', note: 'Suma de todos los precios' },
                  { label: 'Precio Promedio',        value: '$287',    Icon: TrendingUp,  color: ORANGE,   note: 'Por publicación activa' },
                  { label: 'Tasa de Aprobación',     value: '82%',     Icon: Star,        color: PURPLE,   note: 'Últimos 30 días' },
                ].map((s, i) => (
                  <div key={i} style={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '12px', padding: '18px 20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: s.color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <s.Icon size={20} color={s.color} />
                    </div>
                    <div>
                      <p style={{ margin: '0 0 2px', fontSize: '0.75rem', color: '#6B7280' }}>{s.label}</p>
                      <p style={{ margin: '0 0 2px', fontSize: '1.4rem', fontWeight: '900', color: s.color }}>{s.value}</p>
                      <p style={{ margin: 0, fontSize: '0.68rem', color: '#9CA3AF' }}>{s.note}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Charts row */}
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
                <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E5E7EB', padding: '20px' }}>
                  <h3 style={{ margin: '0 0 16px', fontWeight: '700', color: '#111827', fontSize: '0.9rem' }}>Publicaciones por Mes</h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={MONTHLY_DATA} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                      <XAxis dataKey="mes" tick={{ fontSize: 11, fill: '#9CA3AF' }} />
                      <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} />
                      <Tooltip contentStyle={{ borderRadius: '8px', fontSize: '0.75rem' }} />
                      <Bar dataKey="aprobadas"  fill="#10B981" radius={[3, 3, 0, 0]} name="Aprobadas" />
                      <Bar dataKey="rechazadas" fill="#EF4444" radius={[3, 3, 0, 0]} name="Rechazadas" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E5E7EB', padding: '20px' }}>
                  <h3 style={{ margin: '0 0 16px', fontWeight: '700', color: '#111827', fontSize: '0.9rem' }}>Por Categoría</h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie data={CAT_DATA} cx="50%" cy="45%" outerRadius={70} dataKey="value" label={({ name, value }) => `${value}%`} labelLine={false} fontSize={9}>
                        {CAT_DATA.map((e, i) => <Cell key={i} fill={e.color} />)}
                      </Pie>
                      <Tooltip contentStyle={{ borderRadius: '8px', fontSize: '0.75rem' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </>
          )}

          {/* ── MODERACIÓN ── */}
          {tab === 'moderacion' && (
            <>
              {/* Moderation panel header */}
              <div style={{ background: 'linear-gradient(135deg, #6D28D9, #7C3AED, #4F46E5)', borderRadius: '12px', padding: '20px 24px', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '1.5rem' }}>🛡️</span>
                  <div>
                    <h3 style={{ margin: 0, color: '#FFFFFF', fontWeight: '800', fontSize: '1rem' }}>Panel de Moderación</h3>
                    <p style={{ margin: '2px 0 0', color: 'rgba(255,255,255,0.8)', fontSize: '0.78rem' }}>Revisa y aprueba publicaciones de Second Hand</p>
                  </div>
                </div>
                <button onClick={() => setModerationOpen(!moderationOpen)} style={{ padding: '8px 18px', backgroundColor: 'rgba(255,255,255,0.2)', color: '#FFF', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', fontSize: '0.82rem' }}>
                  {moderationOpen ? 'Cerrar' : 'Abrir'}
                </button>
              </div>

              {moderationOpen && (
                pending === 0 ? (
                  <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E5E7EB', padding: '60px', textAlign: 'center' }}>
                    <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#DCFCE7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                      <CheckCircle2 size={32} color="#16A34A" />
                    </div>
                    <h3 style={{ margin: '0 0 6px', fontWeight: '800', color: '#111827', fontSize: '1rem' }}>¡Todo revisado!</h3>
                    <p style={{ margin: 0, color: '#6B7280', fontSize: '0.82rem' }}>No hay publicaciones pendientes de aprobación</p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {MOCK_LISTINGS.filter(l => l.status === 'pending').map(listing => (
                      <ModerationCard key={listing.id} listing={listing} />
                    ))}
                  </div>
                )
              )}
            </>
          )}

          {/* ── PUBLICACIONES ── */}
          {tab === 'publicaciones' && (
            <>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' }}>
                <div style={{ position: 'relative', flex: 1, maxWidth: '320px' }}>
                  <Search style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} size={14} color="#9CA3AF" />
                  <input type="text" placeholder="Buscar publicación o vendedor..." value={search} onChange={e => setSearch(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px 9px 32px', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '0.82rem', outline: 'none', boxSizing: 'border-box' }} />
                </div>
                {(['all', 'pending', 'approved', 'rejected'] as const).map(f => (
                  <button key={f} onClick={() => setFilter(f)}
                    style={{ padding: '8px 14px', borderRadius: '8px', border: `1px solid ${filter === f ? PURPLE : '#E5E7EB'}`, backgroundColor: filter === f ? PURPLE : '#FFF', color: filter === f ? '#FFF' : '#374151', fontWeight: filter === f ? '700' : '500', cursor: 'pointer', fontSize: '0.78rem' }}>
                    {f === 'all' ? 'Todos' : f === 'pending' ? `Pendientes (${pending})` : f === 'approved' ? `Aprobadas (${approved})` : `Rechazadas (${rejected})`}
                  </button>
                ))}
              </div>

              <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '12px', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#F9FAFB' }}>
                      {['Artículo', 'Categoría', 'Precio', 'Vendedor', 'Estado', 'Fecha', 'Acciones'].map(h => (
                        <th key={h} style={{ padding: '11px 14px', textAlign: 'left', fontSize: '0.72rem', fontWeight: '700', color: '#374151', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((listing, i) => {
                      const st = STATUS_CONFIG[listing.status];
                      return (
                        <tr key={listing.id} style={{ borderTop: '1px solid #F3F4F6', backgroundColor: i % 2 === 0 ? '#FFF' : '#FAFAFA' }}>
                          <td style={{ padding: '12px 14px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <span style={{ fontSize: '1.3rem' }}>{listing.image}</span>
                              <span style={{ fontWeight: '600', color: '#111827', fontSize: '0.82rem', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{listing.title}</span>
                            </div>
                          </td>
                          <td style={{ padding: '12px 14px', color: '#6B7280', fontSize: '0.8rem' }}>{listing.category}</td>
                          <td style={{ padding: '12px 14px', fontWeight: '700', color: '#111827', fontSize: '0.875rem' }}>${listing.price}</td>
                          <td style={{ padding: '12px 14px', color: '#374151', fontSize: '0.8rem' }}>{listing.seller}</td>
                          <td style={{ padding: '12px 14px' }}>
                            <span style={{ padding: '3px 10px', borderRadius: '20px', backgroundColor: st.bg, color: st.color, fontSize: '0.72rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px', width: 'fit-content' }}>
                              <st.Icon size={11} /> {st.label}
                            </span>
                          </td>
                          <td style={{ padding: '12px 14px', color: '#9CA3AF', fontSize: '0.78rem' }}>{listing.createdAt}</td>
                          <td style={{ padding: '12px 14px' }}>
                            <div style={{ display: 'flex', gap: '6px' }}>
                              <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280' }}><Eye size={14} /></button>
                              {listing.status === 'pending' && (
                                <>
                                  <button style={{ padding: '3px 8px', backgroundColor: '#DCFCE7', color: '#15803D', border: 'none', borderRadius: '5px', fontSize: '0.7rem', fontWeight: '700', cursor: 'pointer' }}>✓ Aprobar</button>
                                  <button style={{ padding: '3px 8px', backgroundColor: '#FEE2E2', color: '#DC2626', border: 'none', borderRadius: '5px', fontSize: '0.7rem', fontWeight: '700', cursor: 'pointer' }}>✕ Rechazar</button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function ModerationCard({ listing }: { listing: Listing }) {
  return (
    <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #FDE68A', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
      <div style={{ width: '48px', height: '48px', borderRadius: '10px', backgroundColor: '#FFF4EC', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem', flexShrink: 0 }}>
        {listing.image}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ margin: '0 0 3px', fontWeight: '700', color: '#111827', fontSize: '0.9rem' }}>{listing.title}</p>
        <p style={{ margin: 0, color: '#6B7280', fontSize: '0.78rem' }}>
          {listing.category} · {listing.seller} · ${listing.price}
        </p>
      </div>
      <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
        <button style={{ padding: '8px 16px', backgroundColor: '#DCFCE7', color: '#15803D', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <CheckCircle2 size={13} /> Aprobar
        </button>
        <button style={{ padding: '8px 16px', backgroundColor: '#FEE2E2', color: '#DC2626', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <CircleX size={13} /> Rechazar
        </button>
        <button style={{ padding: '8px 12px', backgroundColor: '#F3F4F6', color: '#374151', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.82rem' }}>
          <Eye size={14} />
        </button>
      </div>
    </div>
  );
}