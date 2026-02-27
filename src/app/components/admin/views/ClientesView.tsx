/* =====================================================
   ClientesView — Personas y Organizaciones con rol 'cliente'
   ===================================================== */
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { OrangeHeader } from '../OrangeHeader';
import type { MainSection } from '../../../AdminDashboard';
import { toast } from 'sonner';
import { getPersonas, type Persona } from '../../../services/personasApi';
import { getOrganizaciones } from '../../../services/organizacionesApi';
import {
  Search, User, Building2, Mail, Phone, RefreshCw,
  Plus, X, Save, CheckCircle, XCircle, Tag, Users,
  ShoppingBag, Calendar, ChevronRight,
} from 'lucide-react';

interface Props { onNavigate: (section: MainSection) => void; }

const ORANGE = '#FF6835';

interface PersonaOption { id: string; nombre: string; apellido?: string; email?: string; }
interface OrgOption     { id: string; nombre: string; }

type Tab = 'personas' | 'organizaciones';

export function ClientesView({ onNavigate }: Props) {
  const [personasClientes, setPersonasClientes] = useState<Persona[]>([]);
  const [loading, setLoading]       = useState(true);
  const [tab, setTab]               = useState<Tab>('personas');
  const [search, setSearch]         = useState('');
  const [filterActivo, setFilterActivo] = useState<boolean | undefined>(true);

  // Modal
  const [showModal, setShowModal]   = useState(false);
  const [personas, setPersonas]     = useState<PersonaOption[]>([]);
  const [orgs, setOrgs]             = useState<OrgOption[]>([]);
  const [form, setForm]             = useState({ persona_id: '', organizacion_id: '', contexto: '', activo: true });
  const [saving, setSaving]         = useState(false);

  /* ── Fetch personas con rol cliente ── */
  const fetchClientes = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getPersonas({
        rol: 'cliente',
        activo: filterActivo,
      });
      setPersonasClientes(data);
    } catch (e: unknown) {
      console.error('Error cargando clientes:', e);
      toast.error('Error al cargar clientes');
    } finally {
      setLoading(false);
    }
  }, [filterActivo]);

  const fetchOptions = useCallback(async () => {
    try {
      const [personasData, orgsData] = await Promise.all([
        getPersonas({ activo: true }),
        getOrganizaciones({ activo: true }),
      ]);
      setPersonas(personasData);
      setOrgs(orgsData);
    } catch (e) { console.error('Error cargando opciones:', e); }
  }, []);

  useEffect(() => { fetchClientes(); }, [fetchClientes]);

  /* ── Search filter ── */
  const filteredPersonas = useMemo(() => personasClientes.filter(p => {
    if (!search) return true;
    const full  = `${p.nombre ?? ''} ${p.apellido ?? ''}`.toLowerCase();
    const email = (p.email ?? '').toLowerCase();
    const s     = search.toLowerCase();
    return full.includes(s) || email.includes(s);
  }), [personasClientes, search]);

  // TODO: organizaciones con rol cliente - endpoint pendiente
  const filteredOrgs: OrgOption[] = useMemo(() => [], []);

  /* ── Stats ── */
  const totalActivos   = personasClientes.filter(p => p.activo).length;
  const totalInactivos = personasClientes.filter(p => !p.activo).length;

  /* ── Save ── */
  const openModal = () => {
    fetchOptions();
    setForm({ persona_id: '', organizacion_id: '', contexto: '', activo: true });
    setShowModal(true);
  };

  const handleSave = async () => {
    // TODO: implementar creación de cliente - endpoint /api/personas con rol pendiente
    toast.error('Funcionalidad pendiente - endpoint /api/personas con rol cliente');
    setSaving(false);
  };

  const toggleActivo = async (p: Persona) => {
    // TODO: implementar toggle activo - endpoint pendiente
    toast.error('Funcionalidad pendiente - actualización de rol cliente');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      <OrangeHeader
        icon={ShoppingBag}
        title="Clientes"
        subtitle="Personas y organizaciones con rol de cliente en el sistema"
        actions={[{ label: '+ Registrar Cliente', primary: true, onClick: openModal }]}
      />

      {/* ── Stats ── */}
      <div style={{ padding: '14px 28px', backgroundColor: '#fff', borderBottom: '1px solid #E5E7EB', display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        {[
          { label: 'Total Clientes',    value: personasClientes.length, icon: Tag,        color: ORANGE      },
          { label: 'Personas Clientes', value: personasClientes.length, icon: User,       color: '#3B82F6'   },
          { label: 'Orgs. Clientes',    value: 0,                        icon: Building2,  color: '#8B5CF6'   },
          { label: 'Activos',           value: totalActivos,            icon: CheckCircle, color: '#10B981'  },
          { label: 'Inactivos',         value: totalInactivos,          icon: XCircle,     color: '#EF4444'  },
        ].map(s => (
          <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 14px', backgroundColor: '#F9FAFB', borderRadius: 10, border: '1px solid #E5E7EB' }}>
            <div style={{ width: 34, height: 34, borderRadius: 8, backgroundColor: s.color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <s.icon size={16} color={s.color} />
            </div>
            <div>
              <p style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#111827', lineHeight: 1 }}>{s.value}</p>
              <p style={{ margin: 0, fontSize: '0.7rem', color: '#6B7280' }}>{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Tabs ── */}
      <div style={{ backgroundColor: '#fff', borderBottom: '1px solid #E5E7EB', padding: '0 28px', display: 'flex', gap: 0 }}>
        {([
          { key: 'personas',       label: 'Personas Clientes',       icon: User,      count: personasClientes.length },
          { key: 'organizaciones', label: 'Organizaciones Clientes', icon: Building2, count: 0 },
        ] as const).map(t => (
          <button
            key={t.key}
            onClick={() => { setTab(t.key); setSearch(''); }}
            style={{
              display: 'flex', alignItems: 'center', gap: 7,
              padding: '12px 18px',
              border: 'none', background: 'none', cursor: 'pointer',
              borderBottom: tab === t.key ? `3px solid ${ORANGE}` : '3px solid transparent',
              color: tab === t.key ? ORANGE : '#6B7280',
              fontWeight: tab === t.key ? 700 : 500,
              fontSize: '0.875rem',
              transition: 'all 0.15s',
            }}
          >
            <t.icon size={15} />
            {t.label}
            <span style={{
              fontSize: '0.72rem', fontWeight: 700,
              backgroundColor: tab === t.key ? ORANGE + '18' : '#F3F4F6',
              color: tab === t.key ? ORANGE : '#9CA3AF',
              padding: '1px 7px', borderRadius: 20,
            }}>
              {t.count}
            </span>
          </button>
        ))}
      </div>

      {/* ── Filtros ── */}
      <div style={{ padding: '10px 28px', backgroundColor: '#F8F9FA', borderBottom: '1px solid #E5E7EB', display: 'flex', gap: 10, alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
          <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={tab === 'personas' ? 'Buscar por nombre, email u organización…' : 'Buscar por nombre de organización…'}
            style={{ width: '100%', paddingLeft: 30, paddingRight: 12, height: 34, border: '1.5px solid #E5E7EB', borderRadius: 8, fontSize: '0.84rem', outline: 'none', boxSizing: 'border-box', backgroundColor: '#fff' }}
          />
        </div>
        <select
          value={filterActivo === undefined ? '' : filterActivo ? 'true' : 'false'}
          onChange={e => setFilterActivo(e.target.value === '' ? undefined : e.target.value === 'true')}
          style={{ height: 34, border: '1.5px solid #E5E7EB', borderRadius: 8, padding: '0 10px', fontSize: '0.84rem', color: '#374151', cursor: 'pointer', backgroundColor: '#fff' }}
        >
          <option value="">Todos</option>
          <option value="true">Solo activos</option>
          <option value="false">Solo inactivos</option>
        </select>
        <button onClick={fetchClientes} style={{ height: 34, width: 34, border: '1.5px solid #E5E7EB', borderRadius: 8, background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <RefreshCw size={14} color="#6B7280" />
        </button>
      </div>

      {/* ── Contenido ── */}
      <div style={{ flex: 1, overflow: 'auto', padding: '20px 28px' }}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200, color: '#9CA3AF' }}>
            <RefreshCw size={18} style={{ animation: 'spin 1s linear infinite', marginRight: 8 }} /> Cargando clientes...
          </div>

        ) : tab === 'personas' ? (
          /* ── Tab Personas ── */
          filteredPersonas.length === 0 ? (
            <EmptyState icon={User} title="No hay personas clientes" sub='Registrá el primero usando "+ Registrar Cliente"' />
          ) : (
            <div style={{ backgroundColor: '#fff', borderRadius: 12, border: '1px solid #E5E7EB', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                <thead>
                  <tr style={{ backgroundColor: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
                    {['Cliente', 'Contacto', 'Tipo', 'Documento', 'Alta', 'Estado'].map(h => (
                      <th key={h} style={{ padding: '11px 16px', textAlign: 'left', fontWeight: 600, color: '#374151', whiteSpace: 'nowrap', fontSize: '0.8rem' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredPersonas.map((p, i) => (
                    <tr
                      key={p.id}
                      style={{ borderBottom: i < filteredPersonas.length - 1 ? '1px solid #F3F4F6' : 'none' }}
                      onMouseEnter={e => (e.currentTarget as HTMLElement).style.backgroundColor = '#FAFAFA'}
                      onMouseLeave={e => (e.currentTarget as HTMLElement).style.backgroundColor = ''}
                    >
                      <td style={{ padding: '11px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{ width: 34, height: 34, borderRadius: '50%', backgroundColor: '#FFF7ED', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <User size={15} color={ORANGE} />
                          </div>
                          <div>
                            <p style={{ margin: 0, fontWeight: 600, color: '#111827', fontSize: '0.875rem' }}>
                              {p.nombre} {p.apellido ?? ''}
                            </p>
                            {p.email && (
                              <p style={{ margin: 0, fontSize: '0.76rem', color: '#6B7280' }}>{p.email}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '11px 16px', color: '#6B7280', fontSize: '0.8rem' }}>
                        {p.telefono ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                            <Phone size={12} /> {p.telefono}
                          </div>
                        ) : <span style={{ color: '#D1D5DB' }}>—</span>}
                      </td>
                      <td style={{ padding: '11px 16px' }}>
                        <span style={{ fontSize: '0.76rem', fontWeight: 600, backgroundColor: p.tipo === 'natural' ? '#EFF6FF' : '#FFF7ED', color: p.tipo === 'natural' ? '#3B82F6' : ORANGE, padding: '3px 10px', borderRadius: 20 }}>
                          {p.tipo === 'natural' ? 'Natural' : 'Jurídica'}
                        </span>
                      </td>
                      <td style={{ padding: '11px 16px', color: '#6B7280', fontSize: '0.8rem' }}>
                        {p.documento_tipo && p.documento_numero ? `${p.documento_tipo}: ${p.documento_numero}` : <span style={{ color: '#D1D5DB' }}>—</span>}
                      </td>
                      <td style={{ padding: '11px 16px', color: '#9CA3AF', fontSize: '0.78rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <Calendar size={12} />
                          {new Date(p.created_at).toLocaleDateString('es-UY')}
                        </div>
                      </td>
                      <td style={{ padding: '11px 16px' }}>
                        <button
                          onClick={() => toggleActivo(p)}
                          style={{ padding: '3px 10px', borderRadius: 20, border: 'none', cursor: 'pointer', fontSize: '0.76rem', fontWeight: 600, backgroundColor: p.activo ? '#D1FAE5' : '#FEE2E2', color: p.activo ? '#10B981' : '#EF4444' }}
                        >
                          {p.activo ? '● Activo' : '● Inactivo'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )

        ) : (
          /* ── Tab Organizaciones ── */
          // TODO: endpoint /api/organizaciones?rol=cliente pendiente
          <EmptyState icon={Building2} title="No hay organizaciones clientes" sub='Endpoint /api/organizaciones?rol=cliente pendiente' />
        )}
      </div>

      {/* ── Modal Registrar Cliente ── */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ backgroundColor: '#fff', borderRadius: 16, width: '100%', maxWidth: 500, boxShadow: '0 20px 60px rgba(0,0,0,0.25)' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#111827' }}>Registrar Cliente</h2>
                <p style={{ margin: '2px 0 0', fontSize: '0.78rem', color: '#9CA3AF' }}>Persona y/u organización con rol cliente</p>
              </div>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF' }}><X size={20} /></button>
            </div>

            <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 15 }}>
              <div>
                <label style={labelStyle}>Persona <span style={{ color: '#9CA3AF', fontWeight: 400 }}>(opcional si hay organización)</span></label>
                <select value={form.persona_id} onChange={e => setForm(f => ({ ...f, persona_id: e.target.value }))} style={selectStyle}>
                  <option value="">— Sin persona específica —</option>
                  {personas.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.nombre} {p.apellido ?? ''} {p.email ? `(${p.email})` : ''}
                    </option>
                  ))}
                </select>
                {personas.length === 0 && (
                  <p style={{ margin: '4px 0 0', fontSize: '0.76rem', color: '#F59E0B' }}>
                    ⚠️ No hay personas.{' '}
                    <button onClick={() => { setShowModal(false); onNavigate('personas'); }} style={{ background: 'none', border: 'none', color: ORANGE, cursor: 'pointer', fontWeight: 600, fontSize: '0.76rem', padding: 0 }}>
                      Crear una
                    </button>
                  </p>
                )}
              </div>

              <div>
                <label style={labelStyle}>Organización <span style={{ color: '#9CA3AF', fontWeight: 400 }}>(opcional si hay persona)</span></label>
                <select value={form.organizacion_id} onChange={e => setForm(f => ({ ...f, organizacion_id: e.target.value }))} style={selectStyle}>
                  <option value="">— Sin organización —</option>
                  {orgs.map(o => <option key={o.id} value={o.id}>{o.nombre}</option>)}
                </select>
                {orgs.length === 0 && (
                  <p style={{ margin: '4px 0 0', fontSize: '0.76rem', color: '#F59E0B' }}>
                    ⚠️ No hay organizaciones.{' '}
                    <button onClick={() => { setShowModal(false); onNavigate('organizaciones'); }} style={{ background: 'none', border: 'none', color: ORANGE, cursor: 'pointer', fontWeight: 600, fontSize: '0.76rem', padding: 0 }}>
                      Crear una
                    </button>
                  </p>
                )}
              </div>

              <div>
                <label style={labelStyle}>Contexto / Nota</label>
                <input
                  value={form.contexto}
                  onChange={e => setForm(f => ({ ...f, contexto: e.target.value }))}
                  style={inputStyle}
                  placeholder="Ej: Canal mayorista, referido por…"
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <input type="checkbox" id="cli-activo" checked={form.activo} onChange={e => setForm(f => ({ ...f, activo: e.target.checked }))} style={{ width: 16, height: 16, accentColor: ORANGE, cursor: 'pointer' }} />
                <label htmlFor="cli-activo" style={{ fontSize: '0.875rem', color: '#374151', cursor: 'pointer' }}>Cliente activo</label>
              </div>

              <div style={{ padding: '10px 14px', backgroundColor: '#FFF7ED', borderRadius: 8, border: '1px solid #FDBA74', fontSize: '0.78rem', color: '#92400E' }}>
                💡 Podés registrar una <strong>persona cliente</strong>, una <strong>organización cliente</strong>, o ambas en el mismo registro.
              </div>
            </div>

            <div style={{ padding: '14px 24px', borderTop: '1px solid #E5E7EB', display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button onClick={() => setShowModal(false)} style={{ padding: '9px 20px', borderRadius: 8, border: '1.5px solid #E5E7EB', background: '#fff', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600, color: '#374151' }}>
                Cancelar
              </button>
              <button onClick={handleSave} disabled={saving} style={{ padding: '9px 24px', borderRadius: 8, border: 'none', backgroundColor: ORANGE, color: '#fff', cursor: saving ? 'not-allowed' : 'pointer', fontSize: '0.875rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6, opacity: saving ? 0.7 : 1 }}>
                <Save size={15} /> {saving ? 'Guardando…' : 'Registrar cliente'}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

/* ── Empty state helper ── */
function EmptyState({ icon: Icon, title, sub }: { icon: React.ElementType; title: string; sub: string }) {
  return (
    <div style={{ textAlign: 'center', padding: '60px 0', color: '#9CA3AF' }}>
      <Icon size={44} style={{ marginBottom: 12, opacity: 0.25 }} />
      <p style={{ fontSize: '1rem', fontWeight: 600, margin: 0 }}>{title}</p>
      <p style={{ fontSize: '0.875rem', marginTop: 6 }}>{sub}</p>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: 5,
};
const inputStyle: React.CSSProperties = {
  width: '100%', height: 38, border: '1.5px solid #E5E7EB', borderRadius: 8,
  padding: '0 12px', fontSize: '0.875rem', color: '#111827', outline: 'none', boxSizing: 'border-box',
};
const selectStyle: React.CSSProperties = {
  width: '100%', height: 38, border: '1.5px solid #E5E7EB', borderRadius: 8,
  padding: '0 10px', fontSize: '0.875rem', color: '#374151', cursor: 'pointer', outline: 'none',
};
