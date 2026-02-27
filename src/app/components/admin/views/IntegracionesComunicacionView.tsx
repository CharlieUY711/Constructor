/**
 * 📱 Integraciones Comunicación
 * WhatsApp, Resend, Gmail/SMTP, Meta, Twilio SMS
 */
import React, { useState, useEffect } from 'react';
import { OrangeHeader } from '../OrangeHeader';
import type { MainSection } from '../../../AdminDashboard';
import { ExternalLink, Settings2, CheckCircle2, AlertCircle, Clock, Zap, Smartphone, MessageSquare, Mail } from 'lucide-react';
import { getIntegraciones, updateIntegracion, pingIntegracion, getIntegracionLogs, type Integracion, type IntegracionLog } from '../../../services/integracionesApi';

interface Props { onNavigate: (section: MainSection) => void; }

const ORANGE = '#FF6835';

const STATUS_META: Record<string, { label: string; color: string; bg: string; Icon: any }> = {
  activo: { label: 'Activo', color: '#10B981', bg: '#D1FAE5', Icon: CheckCircle2 },
  inactivo: { label: 'Inactivo', color: '#9CA3AF', bg: '#F3F4F6', Icon: Clock },
  error: { label: 'Error', color: '#EF4444', bg: '#FEE2E2', Icon: AlertCircle },
  configurando: { label: 'Configurando', color: '#F59E0B', bg: '#FEF3C7', Icon: Zap },
};

// Campos específicos por proveedor
const PROVIDER_FIELDS: Record<string, Array<{ key: string; label: string; type: string; placeholder?: string }>> = {
  resend: [
    { key: 'apiKey', label: 'API Key', type: 'password', placeholder: 're_...' },
    { key: 'domain', label: 'Dominio verificado', type: 'text', placeholder: 'ejemplo.com' },
  ],
  whatsapp: [
    { key: 'accountSid', label: 'Account SID', type: 'text', placeholder: 'AC...' },
    { key: 'authToken', label: 'Auth Token', type: 'password', placeholder: '...' },
    { key: 'phoneNumber', label: 'Número de WhatsApp', type: 'text', placeholder: '+598...' },
  ],
  twilio: [
    { key: 'accountSid', label: 'Account SID', type: 'text', placeholder: 'AC...' },
    { key: 'authToken', label: 'Auth Token', type: 'password', placeholder: '...' },
    { key: 'phoneNumber', label: 'Número de teléfono', type: 'text', placeholder: '+598...' },
  ],
  gmail: [
    { key: 'host', label: 'Host SMTP', type: 'text', placeholder: 'smtp.gmail.com' },
    { key: 'port', label: 'Puerto', type: 'number', placeholder: '587' },
    { key: 'user', label: 'Usuario', type: 'text', placeholder: 'tu@email.com' },
    { key: 'password', label: 'Contraseña', type: 'password', placeholder: '...' },
  ],
  meta: [
    { key: 'appId', label: 'App ID', type: 'text', placeholder: '...' },
    { key: 'appSecret', label: 'App Secret', type: 'password', placeholder: '...' },
    { key: 'accessToken', label: 'Access Token', type: 'password', placeholder: '...' },
  ],
};

export function IntegracionesComunicacionView({ onNavigate }: Props) {
  const [integraciones, setIntegraciones] = useState<Integracion[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [configValues, setConfigValues] = useState<Record<string, Record<string, string>>>({});
  const [testingId, setTestingId] = useState<string | null>(null);
  const [logs, setLogs] = useState<Record<string, IntegracionLog[]>>({});
  const [logsLoading, setLogsLoading] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getIntegraciones({ tipo: 'comunicacion' });
        setIntegraciones(data);
        // Cargar config existente
        const initialConfig: Record<string, Record<string, string>> = {};
        data.forEach(int => {
          if (int.config && typeof int.config === 'object') {
            initialConfig[int.id] = int.config as Record<string, string>;
          }
        });
        setConfigValues(initialConfig);
      } catch (err) {
        console.error('Error cargando integraciones de comunicación:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleSave = async (integracion: Integracion) => {
    try {
      const config = configValues[integracion.id] || {};
      await updateIntegracion(integracion.id, {
        config,
        estado: 'configurando',
      });
      // Recargar
      const data = await getIntegraciones({ tipo: 'comunicacion' });
      setIntegraciones(data);
      setExpandedId(null);
    } catch (err) {
      console.error('Error guardando configuración:', err);
      alert('Error al guardar la configuración');
    }
  };

  const handlePing = async (integracion: Integracion) => {
    setTestingId(integracion.id);
    try {
      const result = await pingIntegracion(integracion.id);
      // Recargar
      const data = await getIntegraciones({ tipo: 'comunicacion' });
      setIntegraciones(data);
      // Cargar logs
      loadLogs(integracion.id);
    } catch (err) {
      console.error('Error en ping:', err);
      alert('Error al probar la conexión');
    } finally {
      setTestingId(null);
    }
  };

  const loadLogs = async (id: string) => {
    setLogsLoading(p => ({ ...p, [id]: true }));
    try {
      const data = await getIntegracionLogs(id, 10);
      setLogs(p => ({ ...p, [id]: data }));
    } catch (err) {
      console.error('Error cargando logs:', err);
    } finally {
      setLogsLoading(p => ({ ...p, [id]: false }));
    }
  };

  const getFields = (nombre: string) => PROVIDER_FIELDS[nombre] || [];

  const activeCount = integraciones.filter(i => i.estado === 'activo').length;

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <OrangeHeader
        icon={Smartphone}
        title="Comunicación"
        subtitle="WhatsApp, Resend, Gmail/SMTP, Meta, Twilio SMS — Envío de mensajes y notificaciones"
        actions={[{ label: '← Integraciones', onClick: () => onNavigate('integraciones') }]}
      />

      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 32px', backgroundColor: '#F8F9FA' }}>
        {/* Stats */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
          {[
            { label: 'Proveedores', value: loading ? '...' : integraciones.length, color: '#111827' },
            { label: 'Activas', value: loading ? '...' : activeCount, color: '#10B981' },
            { label: 'Inactivas', value: loading ? '...' : integraciones.filter(i => i.estado === 'inactivo').length, color: '#9CA3AF' },
          ].map((s, i) => (
            <div key={i} style={{
              flex: 1, backgroundColor: '#fff', borderRadius: 10, padding: '12px 16px',
              border: '1px solid #E5E7EB', textAlign: 'center',
            }}>
              <div style={{ fontSize: '1.5rem', fontWeight: '800', color: s.color }}>{s.value}</div>
              <div style={{ fontSize: '0.7rem', color: '#9CA3AF', marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 14 }}>
          {integraciones.map(integracion => {
            const sm = STATUS_META[integracion.estado] || STATUS_META.inactivo;
            const SIcon = sm.Icon;
            const isExp = expandedId === integracion.id;
            const fields = getFields(integracion.nombre);
            const config = configValues[integracion.id] || {};
            const integracionLogs = logs[integracion.id] || [];

            return (
              <div key={integracion.id} style={{
                backgroundColor: '#fff', borderRadius: 14,
                border: '1px solid #E5E7EB',
                overflow: 'hidden', transition: 'box-shadow 0.15s',
              }}>
                <div style={{ height: 3, backgroundColor: sm.color }} />

                <div style={{ padding: '16px 18px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 10 }}>
                    <div style={{
                      width: 42, height: 42, borderRadius: 10,
                      backgroundColor: '#F9FAFB',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '1.3rem', flexShrink: 0,
                    }}>
                      {integracion.nombre === 'whatsapp' ? '💬' : integracion.nombre === 'resend' ? '📧' : integracion.nombre === 'gmail' ? '📮' : integracion.nombre === 'meta' ? '📘' : '📱'}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: '800', color: '#111827', fontSize: '0.95rem', marginBottom: 4 }}>
                        {integracion.proveedor}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>{integracion.nombre}</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '4px 9px', backgroundColor: sm.bg, color: sm.color, borderRadius: 20, fontSize: '0.7rem', fontWeight: '700' }}>
                      <SIcon size={11} /> {sm.label}
                    </span>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button
                        onClick={() => {
                          if (isExp) {
                            setExpandedId(null);
                          } else {
                            setExpandedId(integracion.id);
                            if (integracionLogs.length === 0) loadLogs(integracion.id);
                          }
                        }}
                        style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '5px 12px', borderRadius: 7, border: 'none', backgroundColor: ORANGE, color: '#fff', fontSize: '0.72rem', fontWeight: '700', cursor: 'pointer' }}
                      >
                        <Settings2 size={11} /> {isExp ? 'Cerrar' : 'Configurar'}
                      </button>
                    </div>
                  </div>

                  {/* Expanded config */}
                  {isExp && (
                    <div style={{ marginTop: 14, padding: '14px', backgroundColor: '#F9FAFB', borderRadius: 10, border: '1px solid #E5E7EB' }}>
                      <p style={{ margin: '0 0 10px', fontSize: '0.72rem', fontWeight: '700', color: '#374151' }}>
                        Configuración — {integracion.proveedor}
                      </p>

                      {fields.length > 0 ? (
                        fields.map(field => (
                          <div key={field.key} style={{ marginBottom: 8 }}>
                            <label style={{ fontSize: '0.68rem', fontWeight: '700', color: '#9CA3AF', display: 'block', marginBottom: 3, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                              {field.label}
                            </label>
                            <input
                              type={field.type}
                              value={config[field.key] || ''}
                              onChange={e => setConfigValues(p => ({
                                ...p,
                                [integracion.id]: { ...(p[integracion.id] || {}), [field.key]: e.target.value },
                              }))}
                              placeholder={field.placeholder || `${field.label}...`}
                              style={{ width: '100%', padding: '7px 10px', border: '1.5px solid #E5E7EB', borderRadius: 7, fontSize: '0.8rem', outline: 'none', boxSizing: 'border-box', backgroundColor: '#fff' }}
                              onFocus={e => (e.target.style.borderColor = ORANGE)}
                              onBlur={e => (e.target.style.borderColor = '#E5E7EB')}
                            />
                          </div>
                        ))
                      ) : (
                        <p style={{ fontSize: '0.72rem', color: '#6B7280', fontStyle: 'italic' }}>
                          No se requieren credenciales adicionales para esta integración.
                        </p>
                      )}

                      <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                        <button
                          onClick={() => handleSave(integracion)}
                          style={{ flex: 1, padding: '8px', backgroundColor: ORANGE, color: '#fff', border: 'none', borderRadius: 7, fontSize: '0.78rem', fontWeight: '700', cursor: 'pointer' }}
                        >
                          Guardar
                        </button>
                        <button
                          onClick={() => handlePing(integracion)}
                          disabled={testingId === integracion.id}
                          style={{ padding: '8px 12px', backgroundColor: testingId === integracion.id ? '#E5E7EB' : '#10B981', color: testingId === integracion.id ? '#9CA3AF' : '#fff', border: 'none', borderRadius: 7, fontSize: '0.78rem', fontWeight: '700', cursor: testingId === integracion.id ? 'not-allowed' : 'pointer' }}
                        >
                          {testingId === integracion.id ? 'Probando...' : 'Test conexión'}
                        </button>
                      </div>

                      {/* Logs */}
                      {integracionLogs.length > 0 && (
                        <div style={{ marginTop: 14, padding: '10px', backgroundColor: '#fff', borderRadius: 7, border: '1px solid #E5E7EB' }}>
                          <p style={{ margin: '0 0 8px', fontSize: '0.7rem', fontWeight: '700', color: '#374151' }}>Últimos eventos</p>
                          <div style={{ maxHeight: 120, overflowY: 'auto' }}>
                            {integracionLogs.map(log => (
                              <div key={log.id} style={{ padding: '4px 0', fontSize: '0.68rem', color: '#6B7280', borderBottom: '1px solid #F3F4F6' }}>
                                <span style={{ fontWeight: '600' }}>{new Date(log.created_at).toLocaleString()}</span>
                                {' — '}
                                <span style={{ color: log.nivel === 'error' ? '#EF4444' : log.nivel === 'warning' ? '#F59E0B' : '#6B7280' }}>
                                  {log.mensaje}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {integraciones.length === 0 && !loading && (
          <div style={{ textAlign: 'center', padding: '48px 0', color: '#9CA3AF' }}>
            <p style={{ fontSize: '2rem', margin: '0 0 8px' }}>📱</p>
            <p style={{ fontWeight: '600' }}>No hay integraciones de comunicación configuradas</p>
          </div>
        )}
      </div>
    </div>
  );
}
