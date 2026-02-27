/**
 * 🔗 Webhooks
 * Configurá webhooks para recibir eventos externos
 */
import React, { useState, useEffect } from 'react';
import { OrangeHeader } from '../OrangeHeader';
import type { MainSection } from '../../../AdminDashboard';
import { Webhook as WebhookIcon, Plus, Trash2, ToggleLeft, ToggleRight, Zap, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { getWebhooks, createWebhook, updateWebhook, deleteWebhook, type Webhook } from '../../../services/integracionesApi';

interface Props { onNavigate: (section: MainSection) => void; }

const ORANGE = '#FF6835';

const EVENTOS_DISPONIBLES = [
  { id: 'pedido.creado', label: 'Pedido creado' },
  { id: 'pedido.actualizado', label: 'Pedido actualizado' },
  { id: 'pago.confirmado', label: 'Pago confirmado' },
  { id: 'pago.fallido', label: 'Pago fallido' },
  { id: 'envio.actualizado', label: 'Envío actualizado' },
  { id: 'usuario.registrado', label: 'Usuario registrado' },
];

export function WebhooksView({ onNavigate }: Props) {
  const [webhooks, setWebhooks] = useState<Webhook[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newWebhook, setNewWebhook] = useState<{ nombre: string; url: string; eventos: string[]; secret?: string }>({
    nombre: '',
    url: '',
    eventos: [],
  });
  const [testingId, setTestingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    loadWebhooks();
  }, []);

  const loadWebhooks = async () => {
    try {
      const data = await getWebhooks();
      setWebhooks(data);
    } catch (err) {
      console.error('Error cargando webhooks:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!newWebhook.nombre.trim() || !newWebhook.url.trim()) {
      alert('El nombre y la URL son requeridos');
      return;
    }
    try {
      await createWebhook({
        ...newWebhook,
        estado: 'activo',
      });
      setNewWebhook({ nombre: '', url: '', eventos: [] });
      setShowModal(false);
      await loadWebhooks();
    } catch (err) {
      console.error('Error creando webhook:', err);
      alert('Error al crear el webhook');
    }
  };

  const handleUpdate = async (id: string, data: Partial<Webhook>) => {
    try {
      await updateWebhook(id, data);
      await loadWebhooks();
    } catch (err) {
      console.error('Error actualizando webhook:', err);
      alert('Error al actualizar el webhook');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este webhook?')) return;
    setDeletingId(id);
    try {
      await deleteWebhook(id);
      await loadWebhooks();
    } catch (err) {
      console.error('Error eliminando webhook:', err);
      alert('Error al eliminar el webhook');
    } finally {
      setDeletingId(null);
    }
  };

  const handleTest = async (webhook: Webhook) => {
    setTestingId(webhook.id);
    try {
      // TODO: implementar test real
      await new Promise(resolve => setTimeout(resolve, 1500));
      alert('Webhook de prueba enviado');
    } catch (err) {
      console.error('Error en test:', err);
      alert('Error al enviar el webhook de prueba');
    } finally {
      setTestingId(null);
    }
  };

  const activeCount = webhooks.filter(w => w.estado === 'activo').length;

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <OrangeHeader
        icon={WebhookIcon}
        title="Webhooks"
        subtitle="Configurá webhooks para recibir eventos externos y notificaciones en tiempo real"
        actions={[{ label: '← Integraciones', onClick: () => onNavigate('integraciones') }]}
      />

      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 32px', backgroundColor: '#F8F9FA' }}>
        {/* Stats */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
          {[
            { label: 'Webhooks', value: loading ? '...' : webhooks.length, color: '#111827' },
            { label: 'Activos', value: loading ? '...' : activeCount, color: '#10B981' },
            { label: 'Inactivos', value: loading ? '...' : webhooks.filter(w => w.estado === 'inactivo').length, color: '#9CA3AF' },
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

        {/* Botón Nuevo Webhook */}
        <div style={{ marginBottom: 20 }}>
          <button
            onClick={() => {
              setEditingId(null);
              setNewWebhook({ nombre: '', url: '', eventos: [] });
              setShowModal(true);
            }}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '10px 16px', borderRadius: 8,
              backgroundColor: ORANGE, color: '#fff', border: 'none',
              fontSize: '0.85rem', fontWeight: '700', cursor: 'pointer',
            }}
          >
            <Plus size={16} /> Nuevo Webhook
          </button>
        </div>

        {/* Lista de Webhooks */}
        <div style={{ display: 'grid', gap: 12 }}>
          {webhooks.map(webhook => (
            <div key={webhook.id} style={{
              backgroundColor: '#fff', borderRadius: 12,
              border: '1px solid #E5E7EB',
              padding: '16px 20px',
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span style={{ fontWeight: '800', color: '#111827', fontSize: '0.95rem' }}>{webhook.nombre}</span>
                    <span style={{
                      padding: '2px 8px', borderRadius: 12, fontSize: '0.65rem', fontWeight: '700',
                      backgroundColor: webhook.estado === 'activo' ? '#D1FAE5' : '#F3F4F6',
                      color: webhook.estado === 'activo' ? '#10B981' : '#6B7280',
                    }}>
                      {webhook.estado === 'activo' ? 'Activo' : 'Inactivo'}
                    </span>
                  </div>
                  <code style={{
                    padding: '4px 8px', borderRadius: 4, backgroundColor: '#F9FAFB',
                    border: '1px solid #E5E7EB', fontSize: '0.75rem', fontFamily: 'monospace',
                    color: '#374151', display: 'inline-block',
                  }}>
                    {webhook.url}
                  </code>
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button
                    onClick={() => handleTest(webhook)}
                    disabled={testingId === webhook.id}
                    style={{
                      padding: '6px 10px', borderRadius: 6, border: '1px solid #E5E7EB',
                      backgroundColor: testingId === webhook.id ? '#F3F4F6' : '#EFF6FF',
                      color: testingId === webhook.id ? '#9CA3AF' : '#2563EB',
                      cursor: testingId === webhook.id ? 'not-allowed' : 'pointer',
                      fontSize: '0.72rem', fontWeight: '600',
                      display: 'flex', alignItems: 'center', gap: 4,
                    }}
                  >
                    <Zap size={12} /> {testingId === webhook.id ? 'Enviando...' : 'Test'}
                  </button>
                  <button
                    onClick={() => handleUpdate(webhook.id, { estado: webhook.estado === 'activo' ? 'inactivo' : 'activo' })}
                    style={{
                      padding: '6px 10px', borderRadius: 6, border: 'none',
                      backgroundColor: webhook.estado === 'activo' ? '#F3F4F6' : '#D1FAE5',
                      color: webhook.estado === 'activo' ? '#6B7280' : '#10B981',
                      cursor: 'pointer',
                      fontSize: '0.72rem', fontWeight: '600',
                      display: 'flex', alignItems: 'center', gap: 4,
                    }}
                  >
                    {webhook.estado === 'activo' ? <ToggleLeft size={16} /> : <ToggleRight size={16} />}
                  </button>
                  <button
                    onClick={() => handleDelete(webhook.id)}
                    disabled={deletingId === webhook.id}
                    style={{
                      padding: '6px 10px', borderRadius: 6, border: 'none',
                      backgroundColor: deletingId === webhook.id ? '#F3F4F6' : '#FEE2E2',
                      color: deletingId === webhook.id ? '#9CA3AF' : '#EF4444',
                      cursor: deletingId === webhook.id ? 'not-allowed' : 'pointer',
                      fontSize: '0.72rem', fontWeight: '600',
                      display: 'flex', alignItems: 'center', gap: 4,
                    }}
                  >
                    <Trash2 size={12} /> {deletingId === webhook.id ? 'Eliminando...' : 'Eliminar'}
                  </button>
                </div>
              </div>

              {/* Eventos */}
              <div style={{ marginBottom: 8 }}>
                <span style={{ fontSize: '0.7rem', color: '#9CA3AF', fontWeight: '700' }}>Eventos: </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 4 }}>
                  {webhook.eventos.length > 0 ? (
                    webhook.eventos.map(evento => (
                      <span key={evento} style={{
                        padding: '2px 8px', borderRadius: 4, fontSize: '0.68rem', fontWeight: '600',
                        backgroundColor: '#EFF6FF', color: '#2563EB',
                      }}>
                        {EVENTOS_DISPONIBLES.find(e => e.id === evento)?.label || evento}
                      </span>
                    ))
                  ) : (
                    <span style={{ fontSize: '0.68rem', color: '#9CA3AF', fontStyle: 'italic' }}>Sin eventos</span>
                  )}
                </div>
              </div>

              {/* Estado del último intento */}
              {webhook.ultimo_intento && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.7rem', color: '#6B7280' }}>
                  <span>Último intento: {new Date(webhook.ultimo_intento).toLocaleString()}</span>
                  {webhook.ultimo_status && (
                    <>
                      <span>•</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        {webhook.ultimo_status >= 200 && webhook.ultimo_status < 300 ? (
                          <><CheckCircle2 size={12} color="#10B981" /> {webhook.ultimo_status}</>
                        ) : (
                          <><XCircle size={12} color="#EF4444" /> {webhook.ultimo_status}</>
                        )}
                      </span>
                    </>
                  )}
                  {webhook.intentos_fallidos > 0 && (
                    <>
                      <span>•</span>
                      <span style={{ color: '#EF4444', fontWeight: '600' }}>
                        {webhook.intentos_fallidos} intentos fallidos
                      </span>
                    </>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {webhooks.length === 0 && !loading && (
          <div style={{ textAlign: 'center', padding: '48px 0', color: '#9CA3AF' }}>
            <p style={{ fontSize: '2rem', margin: '0 0 8px' }}>🔗</p>
            <p style={{ fontWeight: '600' }}>No hay webhooks configurados</p>
          </div>
        )}
      </div>

      {/* Modal crear/editar Webhook */}
      {showModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000,
        }}>
          <div style={{
            backgroundColor: '#fff', borderRadius: 12, padding: '24px',
            width: '90%', maxWidth: 500, maxHeight: '90vh', overflowY: 'auto',
          }}>
            <h3 style={{ margin: '0 0 20px', fontSize: '1rem', fontWeight: '800', color: '#111827' }}>
              {editingId ? 'Editar Webhook' : 'Nuevo Webhook'}
            </h3>
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: '0.7rem', fontWeight: '700', color: '#9CA3AF', display: 'block', marginBottom: 6 }}>
                Nombre *
              </label>
              <input
                type="text"
                value={newWebhook.nombre}
                onChange={e => setNewWebhook(p => ({ ...p, nombre: e.target.value }))}
                placeholder="Ej: Webhook de producción"
                style={{
                  width: '100%', padding: '9px 12px', border: '1.5px solid #E5E7EB', borderRadius: 8,
                  fontSize: '0.85rem', outline: 'none', boxSizing: 'border-box',
                }}
                onFocus={e => (e.target.style.borderColor = ORANGE)}
                onBlur={e => (e.target.style.borderColor = '#E5E7EB')}
              />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: '0.7rem', fontWeight: '700', color: '#9CA3AF', display: 'block', marginBottom: 6 }}>
                URL *
              </label>
              <input
                type="url"
                value={newWebhook.url}
                onChange={e => setNewWebhook(p => ({ ...p, url: e.target.value }))}
                placeholder="https://tu-servidor.com/webhook"
                style={{
                  width: '100%', padding: '9px 12px', border: '1.5px solid #E5E7EB', borderRadius: 8,
                  fontSize: '0.85rem', outline: 'none', boxSizing: 'border-box',
                }}
                onFocus={e => (e.target.style.borderColor = ORANGE)}
                onBlur={e => (e.target.style.borderColor = '#E5E7EB')}
              />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: '0.7rem', fontWeight: '700', color: '#9CA3AF', display: 'block', marginBottom: 8 }}>
                Eventos
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {EVENTOS_DISPONIBLES.map(evento => (
                  <label key={evento.id} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={newWebhook.eventos.includes(evento.id)}
                      onChange={e => {
                        if (e.target.checked) {
                          setNewWebhook(p => ({ ...p, eventos: [...p.eventos, evento.id] }));
                        } else {
                          setNewWebhook(p => ({ ...p, eventos: p.eventos.filter(id => id !== evento.id) }));
                        }
                      }}
                      style={{ cursor: 'pointer' }}
                    />
                    <span style={{ fontSize: '0.8rem', color: '#374151' }}>{evento.label}</span>
                  </label>
                ))}
              </div>
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: '0.7rem', fontWeight: '700', color: '#9CA3AF', display: 'block', marginBottom: 6 }}>
                Secret (opcional)
              </label>
              <input
                type="password"
                value={newWebhook.secret || ''}
                onChange={e => setNewWebhook(p => ({ ...p, secret: e.target.value }))}
                placeholder="Secret para verificar firma"
                style={{
                  width: '100%', padding: '9px 12px', border: '1.5px solid #E5E7EB', borderRadius: 8,
                  fontSize: '0.85rem', outline: 'none', boxSizing: 'border-box',
                }}
                onFocus={e => (e.target.style.borderColor = ORANGE)}
                onBlur={e => (e.target.style.borderColor = '#E5E7EB')}
              />
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={handleCreate}
                disabled={!newWebhook.nombre.trim() || !newWebhook.url.trim()}
                style={{
                  flex: 1, padding: '10px', borderRadius: 8,
                  backgroundColor: (newWebhook.nombre.trim() && newWebhook.url.trim()) ? ORANGE : '#E5E7EB',
                  color: (newWebhook.nombre.trim() && newWebhook.url.trim()) ? '#fff' : '#9CA3AF',
                  border: 'none', fontSize: '0.85rem', fontWeight: '700',
                  cursor: (newWebhook.nombre.trim() && newWebhook.url.trim()) ? 'pointer' : 'not-allowed',
                }}
              >
                {editingId ? 'Actualizar' : 'Crear Webhook'}
              </button>
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingId(null);
                }}
                style={{
                  padding: '10px 16px', borderRadius: 8, border: '1px solid #E5E7EB',
                  backgroundColor: '#fff', color: '#6B7280', fontSize: '0.85rem', fontWeight: '600',
                  cursor: 'pointer',
                }}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
