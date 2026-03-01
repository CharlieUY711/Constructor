/* =====================================================
   TransportistasView — Catálogo de Carriers
   Transportistas · Tramos · Tarifas
   ===================================================== */
import React, { useState, useEffect } from 'react';
import { OrangeHeader } from '../OrangeHeader';
import type { MainSection } from '../../../AdminDashboard';
import {
  Users, Truck, Star, MapPin, Clock, Package,
  DollarSign, Plus, Search, Edit2, CheckCircle2,
  ArrowRight, Globe, Phone, Mail, ToggleLeft, ToggleRight,
  Loader2,
} from 'lucide-react';
import { getTransportistas, getTramos, type Transportista as TransportistaApi, type Tramo as TramoApi } from '../../../services/transportistasApi';
import { DrawerForm } from '../DrawerForm';
import type { SheetDef } from '../DrawerForm';

interface Props { onNavigate: (s: MainSection) => void; }
const ORANGE = '#FF6835';

interface Transportista {
  id: string;
  nombre: string;
  tipo: 'nacional' | 'local' | 'internacional';
  logo?: string;
  contacto?: string;
  email?: string;
  telefono?: string;
  rating?: number;
  enviosActivos?: number;
  enviosTotales?: number;
  activo: boolean;
  tiempoPromedio?: string;
  cobertura?: string[];
}

interface Tramo {
  id: string;
  carrierId: string;
  carrier: string;
  origen: string;
  destino: string;
  tipo: 'local' | 'intercity' | 'internacional';
  tiempoEstimado?: string;
  tarifaBase?: number;
  tarifaKg?: number;
  activo: boolean;
}

type Tab = 'transportistas' | 'tramos' | 'tarifas';

// Sheets de prueba para DrawerForm
const TRANSPORTISTA_SHEETS: SheetDef[] = [
  {
    id: 'general',
    title: 'General',
    subtitle: 'Datos generales · Información principal del carrier',
    fields: [
      { id: 'nombre',  label: 'Nombre del carrier', type: 'text',   required: true,  placeholder: 'Ej: Transporte del Sur SRL' },
      { id: 'tipo',    label: 'Tipo',               type: 'select', required: true,
        options: [
          { value: 'propio',         label: 'Propio' },
          { value: 'tercero',        label: 'Tercero' },
          { value: 'courier',        label: 'Courier' },
          { value: 'nacional',       label: 'Nacional' },
          { value: 'internacional',  label: 'Internacional' },
        ],
        row: 'row1'
      },
      { id: 'estado',  label: 'Estado',             type: 'select', required: true,
        options: [{ value: 'activo', label: 'Activo' }, { value: 'inactivo', label: 'Inactivo' }],
        row: 'row1'
      },
      { id: 'logo',    label: 'Logo / Imagen',      type: 'image' },
      { id: 'activo',  label: 'Carrier activo',     type: 'toggle', helpText: 'Visible para asignación de envíos' },
    ]
  },
  {
    id: 'contacto',
    title: 'Contacto',
    subtitle: 'Contacto · Persona y medios de comunicación',
    fields: [
      { id: 'contacto_nombre',   label: 'Nombre completo',    type: 'text',  placeholder: 'Ej: Juan Pérez' },
      { id: 'email',             label: 'Email',              type: 'email', placeholder: 'contacto@empresa.com', row: 'row1' },
      { id: 'telefono',          label: 'Teléfono',           type: 'tel',   placeholder: '09X XXX XXX',          row: 'row1' },
      { id: 'rut',               label: 'Documento / RUT',    type: 'text',  placeholder: 'XX.XXX.XXX-X',         row: 'row2' },
      { id: 'cargo',             label: 'Cargo',              type: 'text',  placeholder: 'Ej: Gerente logística', row: 'row2' },
      { id: 'web',               label: 'Sitio web',          type: 'url',   placeholder: 'https://empresa.com',  row: 'row3' },
      { id: 'whatsapp',          label: 'WhatsApp',           type: 'tel',   placeholder: '598 9X XXX XXX',       row: 'row3' },
    ]
  },
  {
    id: 'direccion',
    title: 'Dirección',
    subtitle: 'Dirección y cobertura · Ubicación y zonas operativas',
    fields: [
      { id: 'calle',        label: 'Calle y número',         type: 'text',   placeholder: 'Ej: Av. Italia 2500', hint: '💡 Completá la dirección y validamos con Google Maps' },
      { id: 'ciudad',       label: 'Ciudad',                 type: 'text',   placeholder: 'Montevideo',  row: 'row1' },
      { id: 'cp',           label: 'Código postal',          type: 'text',   placeholder: '11300',        row: 'row1' },
      { id: 'departamento', label: 'Departamento / Estado',  type: 'text',   placeholder: 'Montevideo',  row: 'row2' },
      { id: 'pais',         label: 'País',                   type: 'select',
        options: [{ value: 'uy', label: 'Uruguay' }, { value: 'ar', label: 'Argentina' }, { value: 'br', label: 'Brasil' }],
        row: 'row2'
      },
      { id: 'tramos',       label: 'Tramos habilitados',     type: 'multicheck',
        options: [
          { value: 'local',          label: 'Local' },
          { value: 'intercity',      label: 'Intercity' },
          { value: 'internacional',  label: 'Internacional' },
          { value: 'last_mile',      label: 'Last mile' },
        ]
      },
    ]
  },
  {
    id: 'depositos',
    title: 'Depósitos',
    subtitle: 'Depósitos y horarios · Instalaciones y disponibilidad',
    fields: [
      { id: 'depositos_ids', label: 'Depósitos asociados', type: 'text', placeholder: 'Se conectará a datos reales', hint: 'Próximamente: selector de depósitos existentes' },
      { id: 'horario_lv_desde', label: 'Lun-Vie desde', type: 'time', row: 'row1' },
      { id: 'horario_lv_hasta', label: 'Lun-Vie hasta', type: 'time', row: 'row1' },
      { id: 'horario_sab_desde', label: 'Sábado desde', type: 'time', row: 'row2' },
      { id: 'horario_sab_hasta', label: 'Sábado hasta', type: 'time', row: 'row2' },
    ]
  },
  {
    id: 'tarifas',
    title: 'Tarifas',
    subtitle: 'Tarifas y configuración · Costos y condiciones',
    fields: [
      { id: 'tarifa_base',    label: 'Tarifa base',               type: 'number', placeholder: '0.00', row: 'row1' },
      { id: 'moneda',         label: 'Moneda',                    type: 'select',
        options: [{ value: 'UYU', label: 'UYU' }, { value: 'USD', label: 'USD' }, { value: 'ARS', label: 'ARS' }],
        row: 'row1'
      },
      { id: 'tiempo_entrega', label: 'Tiempo promedio entrega',   type: 'text',   placeholder: 'Ej: 24-48hs', row: 'row2' },
      { id: 'rating',         label: 'Rating inicial',            type: 'number', placeholder: '0.0',          row: 'row2' },
      { id: 'notas',          label: 'Observaciones',             type: 'textarea', placeholder: 'Condiciones especiales, acuerdos, notas...' },
    ]
  },
  {
    id: 'documentos',
    title: 'Docs',
    subtitle: 'Documentos · Contratos y habilitaciones',
    fields: [
      { id: 'doc_contrato',     label: 'Contrato de servicio',   type: 'image', hint: 'PDF, DOC hasta 10MB' },
      { id: 'doc_habilitacion', label: 'Habilitación / Licencia', type: 'image', hint: 'PDF, JPG, PNG hasta 10MB' },
      { id: 'doc_tarifario',    label: 'Tarifario completo',     type: 'image', hint: 'PDF, XLS, CSV hasta 10MB' },
    ]
  },
];

const TIPO_CFG: Record<string, { label: string; color: string; bg: string }> = {
  local:         { label: 'Local',          color: '#059669', bg: '#ECFDF5' },
  nacional:      { label: 'Nacional',       color: '#2563EB', bg: '#EFF6FF' },
  intercity:     { label: 'Intercity',      color: '#7C3AED', bg: '#F5F3FF' },
  internacional: { label: 'Internacional',  color: '#D97706', bg: '#FFFBEB' },
  propio:        { label: 'Propio',         color: '#059669', bg: '#ECFDF5' },
  tercero:       { label: 'Tercero',        color: '#2563EB', bg: '#EFF6FF' },
  courier:       { label: 'Courier',        color: '#7C3AED', bg: '#F5F3FF' },
};

function Stars({ n }: { n: number }) {
  return (
    <span style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
      {[1,2,3,4,5].map(i => (
        <Star key={i} size={11} color={i <= Math.round(n) ? '#F59E0B' : '#E5E7EB'} fill={i <= Math.round(n) ? '#F59E0B' : 'none'} />
      ))}
      <span style={{ fontSize: '11px', color: '#6B7280', marginLeft: '3px' }}>{n}</span>
    </span>
  );
}

export function TransportistasView({ onNavigate }: Props) {
  const [tab, setTab] = useState<Tab>('transportistas');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Transportista | null>(null);
  const [transportistas, setTransportistas] = useState<Transportista[]>([]);
  const [tramos, setTramos] = useState<Tramo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [transportistasData, tramosData] = await Promise.all([
        getTransportistas(),
        Promise.all((await getTransportistas()).map(t => getTramos(t.id))).then(arr => arr.flat())
      ]);

      // Adaptar transportistas
      const adaptedTransportistas: Transportista[] = transportistasData.map(t => ({
        id: t.id,
        nombre: t.nombre,
        tipo: t.tipo as 'nacional' | 'local' | 'internacional',
        logo: t.logo,
        contacto: t.contacto,
        email: t.email,
        telefono: t.telefono,
        rating: t.rating || 0,
        enviosActivos: t.envios_activos || 0,
        enviosTotales: t.envios_totales || 0,
        activo: t.activo ?? (t.estado === 'activo'),
        tiempoPromedio: t.tiempo_promedio,
        cobertura: Array.isArray(t.cobertura) ? t.cobertura : [],
      }));

      // Adaptar tramos
      const transportistasMap = new Map(transportistasData.map(t => [t.id, t]));
      const adaptedTramos: Tramo[] = tramosData.map(t => ({
        id: t.id,
        carrierId: t.transportista_id,
        carrier: transportistasMap.get(t.transportista_id)?.nombre || '',
        origen: t.origen,
        destino: t.destino,
        tipo: t.tipo as 'local' | 'intercity' | 'internacional',
        tiempoEstimado: t.tiempo_estimado,
        tarifaBase: t.tarifa_base,
        tarifaKg: t.tarifa_kg,
        activo: t.activo ?? (t.estado === 'activo'),
      }));

      setTransportistas(adaptedTransportistas);
      setTramos(adaptedTramos);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error cargando datos');
      console.error('Error cargando transportistas:', err);
    } finally {
      setLoading(false);
    }
  };

  const activos = transportistas.filter(t => t.activo).length;
  const totalEnviosActivos = transportistas.reduce((s, t) => s + (t.enviosActivos || 0), 0);

  const filteredCarriers = transportistas.filter(t =>
    !search || t.nombre.toLowerCase().includes(search.toLowerCase())
  );

  const filteredTramos = tramos.filter(t =>
    !search || t.carrier.toLowerCase().includes(search.toLowerCase()) ||
    t.origen.toLowerCase().includes(search.toLowerCase()) ||
    t.destino.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <OrangeHeader
          icon={Truck}
          title="Transportistas"
          subtitle="Cargando..."
          actions={[
            { label: '← Logística', onClick: () => onNavigate('logistica') },
          ]}
        />
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Loader2 size={32} color={ORANGE} style={{ animation: 'spin 1s linear infinite' }} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <OrangeHeader
          icon={Truck}
          title="Transportistas"
          subtitle={`Error: ${error}`}
          actions={[
            { label: '← Logística', onClick: () => onNavigate('logistica') },
            { label: '↻ Reintentar', primary: true, onClick: loadData },
          ]}
        />
      </div>
    );
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <OrangeHeader
        icon={Truck}
        title="Transportistas"
        subtitle={`${activos} carriers activos · ${totalEnviosActivos} envíos en curso`}
        actions={[
          { label: '← Logística', onClick: () => onNavigate('logistica') },
          { label: '+ Nuevo Carrier', primary: true, onClick: () => setDrawerOpen(true) },
        ]}
      />

      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', backgroundColor: '#F8F9FA' }}>
        {/* KPIs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '12px', padding: '20px 20px 0' }}>
          {[
            { label: 'Carriers Activos', value: activos, icon: Users, color: ORANGE },
            { label: 'Envíos en curso', value: totalEnviosActivos, icon: Truck, color: '#2563EB' },
            { label: 'Tramos configurados', value: tramos.filter(t=>t.activo).length, icon: MapPin, color: '#7C3AED' },
            { label: 'Rating promedio', value: transportistas.length > 0 ? (transportistas.reduce((s,t)=>s+(t.rating||0),0)/transportistas.length).toFixed(1) + '★' : '0★', icon: Star, color: '#F59E0B' },
          ].map(c => {
            const Icon = c.icon;
            return (
              <div key={c.label} style={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #E5E7EB', padding: '16px', display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: `${c.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={18} color={c.color} />
                </div>
                <div>
                  <div style={{ fontSize: '20px', fontWeight: 800, color: '#111' }}>{c.value}</div>
                  <div style={{ fontSize: '11px', color: '#6B7280' }}>{c.label}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '0', padding: '16px 20px 0', borderBottom: '1px solid #E5E7EB', backgroundColor: '#fff', marginTop: '16px' }}>
          {([['transportistas','Transportistas'],['tramos','Tramos & Zonas'],['tarifas','Simulador de Tarifas']] as [Tab,string][]).map(([id, label]) => (
            <button key={id} onClick={() => setTab(id)}
              style={{ padding: '10px 20px', border: 'none', backgroundColor: 'transparent', cursor: 'pointer', fontSize: '13px', fontWeight: tab === id ? 700 : 500, color: tab === id ? ORANGE : '#6B7280', borderBottom: tab === id ? `2px solid ${ORANGE}` : '2px solid transparent', transition: 'all 0.15s' }}>
              {label}
            </button>
          ))}
          <div style={{ flex: 1 }} />
          <div style={{ position: 'relative', padding: '6px 0' }}>
            <Search size={13} color="#9CA3AF" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar..."
              style={{ paddingLeft: '30px', paddingRight: '12px', paddingTop: '7px', paddingBottom: '7px', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '12px', outline: 'none', width: '180px' }} />
          </div>
        </div>

        {/* Contenido de tabs */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
          
          {/* Tab: Transportistas */}
          {tab === 'transportistas' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(340px,1fr))', gap: '12px' }}>
              {filteredCarriers.map(carrier => {
                const tipoCfg = TIPO_CFG[carrier.tipo] ?? { label: carrier.tipo, color: '#6B7280', bg: '#F3F4F6' };
                const isSelected = selected?.id === carrier.id;
                return (
                  <div key={carrier.id}
                    onClick={() => setSelected(isSelected ? null : carrier)}
                    style={{
                      backgroundColor: '#fff', borderRadius: '12px',
                      border: `1.5px solid ${isSelected ? ORANGE : carrier.activo ? '#E5E7EB' : '#F3F4F6'}`,
                      padding: '18px', cursor: 'pointer',
                      opacity: carrier.activo ? 1 : 0.6,
                      boxShadow: isSelected ? `0 0 0 3px ${ORANGE}22` : '0 1px 4px rgba(0,0,0,0.04)',
                      transition: 'all 0.15s',
                    }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '12px' }}>
                      <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', flexShrink: 0 }}>
                        {carrier.logo}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '14px', fontWeight: 800, color: '#111' }}>{carrier.nombre}</span>
                          <span style={{ fontSize: '10px', fontWeight: 700, color: tipoCfg.color, backgroundColor: tipoCfg.bg, padding: '2px 7px', borderRadius: '10px' }}>{tipoCfg.label}</span>
                          {!carrier.activo && <span style={{ fontSize: '10px', fontWeight: 700, color: '#9CA3AF', backgroundColor: '#F3F4F6', padding: '2px 7px', borderRadius: '10px' }}>Inactivo</span>}
                        </div>
                        <Stars n={carrier.rating || 0} />
                      </div>
                      <div style={{ width: '36px', height: '20px', borderRadius: '10px', backgroundColor: carrier.activo ? '#D1FAE5' : '#F3F4F6', display: 'flex', alignItems: 'center', padding: '0 2px', cursor: 'pointer', flexShrink: 0, justifyContent: carrier.activo ? 'flex-end' : 'flex-start' }}>
                        <div style={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: carrier.activo ? '#059669' : '#9CA3AF' }} />
                      </div>
                    </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px' }}>
                      <div style={{ fontSize: '11px', color: '#6B7280' }}>⏱ {carrier.tiempoPromedio || '—'}</div>
                      <div style={{ fontSize: '11px', color: '#6B7280' }}>📦 {carrier.enviosActivos || 0} activos</div>
                      <div style={{ fontSize: '11px', color: '#6B7280' }}>📊 {carrier.enviosTotales || 0} totales</div>
                      <div style={{ fontSize: '11px', color: '#6B7280' }}>☎ {carrier.telefono || '—'}</div>
                    </div>
                    {carrier.cobertura && carrier.cobertura.length > 0 && (
                      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                        {carrier.cobertura.map(z => (
                          <span key={z} style={{ fontSize: '10px', color: '#374151', backgroundColor: '#F3F4F6', padding: '2px 7px', borderRadius: '6px' }}>{z}</span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
              {/* Card agregar */}
              <div 
                onClick={() => setDrawerOpen(true)}
                style={{ backgroundColor: '#FAFAFA', borderRadius: '12px', border: '2px dashed #E5E7EB', padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '10px', cursor: 'pointer', minHeight: '160px' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: '#FFF4EC', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Plus size={22} color={ORANGE} />
                </div>
                <span style={{ fontSize: '13px', fontWeight: 700, color: ORANGE }}>Agregar Carrier</span>
                <span style={{ fontSize: '11px', color: '#9CA3AF', textAlign: 'center' }}>Conectar nuevo transportista al sistema</span>
              </div>
            </div>
          )}

          {/* Tab: Tramos */}
          {tab === 'tramos' && (
            <div style={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #E5E7EB', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#F9FAFB' }}>
                    {['Carrier', 'Origen', 'Destino', 'Tipo', 'Tiempo Est.', 'Tarifa Base', '$/Kg', 'Estado'].map(h => (
                      <th key={h} style={{ padding: '12px 14px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #E5E7EB' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredTramos.map((tramo, i) => {
                    const tipoCfg = TIPO_CFG[tramo.tipo] ?? { label: tramo.tipo, color: '#6B7280', bg: '#F3F4F6' };
                    return (
                      <tr key={tramo.id} style={{ borderBottom: i < filteredTramos.length - 1 ? '1px solid #F3F4F6' : 'none' }}>
                        <td style={{ padding: '12px 14px', fontSize: '13px', fontWeight: 600, color: '#374151' }}>{tramo.carrier}</td>
                        <td style={{ padding: '12px 14px', fontSize: '12px', color: '#6B7280' }}>{tramo.origen}</td>
                        <td style={{ padding: '12px 14px', fontSize: '12px', color: '#374151', fontWeight: 500 }}>{tramo.destino}</td>
                        <td style={{ padding: '12px 14px' }}>
                          <span style={{ fontSize: '10px', fontWeight: 700, color: tipoCfg.color, backgroundColor: tipoCfg.bg, padding: '3px 8px', borderRadius: '10px' }}>{tipoCfg.label}</span>
                        </td>
                        <td style={{ padding: '12px 14px', fontSize: '12px', color: '#374151', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Clock size={11} color="#9CA3AF" /> {tramo.tiempoEstimado || '—'}
                        </td>
                        <td style={{ padding: '12px 14px', fontSize: '13px', fontWeight: 700, color: '#111' }}>${(tramo.tarifaBase || 0).toLocaleString('es-AR')}</td>
                        <td style={{ padding: '12px 14px', fontSize: '12px', color: '#6B7280' }}>${tramo.tarifaKg || 0}/kg</td>
                        <td style={{ padding: '12px 14px' }}>
                          <span style={{ fontSize: '10px', fontWeight: 700, color: tramo.activo ? '#059669' : '#9CA3AF', backgroundColor: tramo.activo ? '#ECFDF5' : '#F3F4F6', padding: '3px 8px', borderRadius: '10px' }}>
                            {tramo.activo ? '● Activo' : '○ Inactivo'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Tab: Simulador de Tarifas */}
          {tab === 'tarifas' && (
            <div style={{ maxWidth: '560px' }}>
              <div style={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #E5E7EB', padding: '24px' }}>
                <h3 style={{ margin: '0 0 20px', fontSize: '15px', fontWeight: 800, color: '#111' }}>Simulador de Tarifa de Envío</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {[
                    { label: 'Peso (kg)', type: 'number', placeholder: 'Ej: 2.5' },
                    { label: 'Volumen (m³)', type: 'number', placeholder: 'Ej: 0.02' },
                    { label: 'Código Postal Origen', type: 'text', placeholder: 'Ej: C1001' },
                    { label: 'Código Postal Destino', type: 'text', placeholder: 'Ej: 5000' },
                  ].map(f => (
                    <div key={f.label}>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#374151', marginBottom: '6px' }}>{f.label}</label>
                      <input type={f.type} placeholder={f.placeholder}
                        style={{ width: '100%', padding: '10px 12px', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} />
                    </div>
                  ))}
                  <button style={{ marginTop: '6px', padding: '12px', border: 'none', borderRadius: '10px', backgroundColor: ORANGE, color: '#fff', fontSize: '14px', fontWeight: 700, cursor: 'pointer' }}>
                    Calcular tarifas disponibles
                  </button>
                </div>
                <div style={{ marginTop: '20px', padding: '14px', backgroundColor: '#F9FAFB', borderRadius: '10px', border: '1px solid #E5E7EB' }}>
                  <p style={{ margin: '0 0 10px', fontSize: '12px', fontWeight: 700, color: '#374151' }}>Tarifas estimadas:</p>
                  {[
                    { carrier: 'Express Delivery GBA', tiempo: 'Same day', precio: 1400 },
                    { carrier: 'OCA', tiempo: '24-48h', precio: 1680 },
                    { carrier: 'Correo Argentino', tiempo: '3-4 días', precio: 2450 },
                    { carrier: 'Andreani', tiempo: '2-3 días', precio: 2750 },
                  ].map(r => (
                    <div key={r.carrier} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #E5E7EB' }}>
                      <div>
                        <div style={{ fontSize: '12px', fontWeight: 600, color: '#111' }}>{r.carrier}</div>
                        <div style={{ fontSize: '11px', color: '#9CA3AF' }}>{r.tiempo}</div>
                      </div>
                      <div style={{ fontSize: '14px', fontWeight: 800, color: ORANGE }}>${r.precio.toLocaleString('es-AR')}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* DrawerForm */}
      <DrawerForm
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onSave={async (data) => {
          console.log('[TransportistasView] Guardar transportista:', data);
          // Por ahora solo log — conectar a Supabase en siguiente iteración
        }}
        title="Nuevo Carrier"
        icon={Truck}
        sheets={TRANSPORTISTA_SHEETS}
      />
    </div>
  );
}