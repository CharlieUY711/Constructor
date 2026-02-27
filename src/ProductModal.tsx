import React, { useState, useRef, useEffect } from 'react';
import {
  X, ChevronRight, ChevronLeft, CheckCircle2, Upload,
  Image as ImageIcon, Video, Plus, RefreshCw, AlertCircle,
  Clock, Zap, Globe, ShoppingBag, MessageCircle, Sparkles,
} from 'lucide-react';

const ORANGE = '#FF6835';

/* ─────────────────────────────── Types ─────────────────────────────── */
export interface UploadedFile {
  id: string;
  name: string;
  url: string;        // blob URL para preview
  type: 'image' | 'video';
  size: string;
  file?: File;        // archivo real para subir a Storage
}

export interface ProductFormData {
  name: string; description: string; price: string; category: string;
  images: UploadedFile[]; videos: UploadedFile[];
  sku: string; barcode: string; brand: string;
  stock: string; minStock: string; weight: string;
  dimH: string; dimW: string; dimL: string;
  tags: string[]; discount: string; serialNumber: string;
  cost: string; supplier: string; taxRate: string; warranty: string;
  origin: string; material: string; color: string; size: string;
  seoTitle: string; seoDesc: string;
  sync: { store: boolean; ml: boolean; instagram: boolean; whatsapp: boolean };
  syncStatus: { store: SyncState; ml: SyncState; instagram: SyncState; whatsapp: SyncState };
  mlAttributes: Record<string, string>;
}

type SyncState = 'synced' | 'pending' | 'error' | 'disabled';
type Step = 0 | 1 | 2;
interface Props { product?: Partial<ProductFormData> | null; onClose: () => void; onSave: (data: ProductFormData) => void; }

/* ─────────────────── Mock product database ─────────────────── */
const ML_PRODUCTS = [
  { title: 'Nike Air Max 270 React', description: 'El Nike Air Max 270 React combina la unidad Air más grande de Nike hasta la fecha con la espuma React para una experiencia de amortiguación sin igual. Ideal para uso diario y actividades deportivas.', category: 'Moda y Accesorios', brand: 'Nike', emoji: '👟', attrs: { Modelo: 'Air Max 270 React', Material: 'Cuero sintético / mesh', Suela: 'Caucho', Cierre: 'Cordones', Temporada: 'Todo el año', Género: 'Unisex', 'País de origen': 'Vietnam' } },
  { title: 'Nike Air Force 1 Blancas', description: 'Las icónicas zapatillas Nike Air Force 1 en color blanco puro. Diseño atemporal con suela de goma y forro de tela.', category: 'Moda y Accesorios', brand: 'Nike', emoji: '👟', attrs: { Modelo: 'Air Force 1 Low', Material: 'Cuero genuino', Suela: 'Goma', Cierre: 'Cordones', Género: 'Unisex' } },
  { title: 'iPhone 14 Pro 128GB Deep Purple', description: 'iPhone 14 Pro con chip A16 Bionic, Dynamic Island, cámara principal de 48 MP y pantalla Super Retina XDR ProMotion 120Hz.', category: 'Tecnología', brand: 'Apple', emoji: '📱', attrs: { Almacenamiento: '128 GB', Color: 'Deep Purple', SO: 'iOS 16', Conectividad: '5G', Cámara: '48 MP triple', Batería: '3200 mAh', Pantalla: '6.1" OLED' } },
  { title: 'iPhone 14 128GB Midnight', description: 'iPhone 14 con chip A15 Bionic, cámara dual de 12 MP y pantalla Super Retina XDR.', category: 'Tecnología', brand: 'Apple', emoji: '📱', attrs: { Almacenamiento: '128 GB', Color: 'Midnight', SO: 'iOS 16', Conectividad: '5G', Cámara: '12 MP dual', Batería: '3279 mAh' } },
  { title: 'Samsung Galaxy S23 Ultra 256GB', description: 'Galaxy S23 Ultra con S Pen integrado, cámara de 200 MP y batería de 5000 mAh.', category: 'Tecnología', brand: 'Samsung', emoji: '📱', attrs: { Almacenamiento: '256 GB', Color: 'Phantom Black', SO: 'Android 13', Cámara: '200 MP', Batería: '5000 mAh', Pantalla: '6.8" Dynamic AMOLED' } },
  { title: 'Aceite de Oliva Extravirgen 5lt Colinas de Garzón', description: 'Aceite de oliva extravirgen premium, primera prensada en frío. Notas frutales y bajo nivel de acidez.', category: 'Alimentos y Bebidas', brand: 'Colinas de Garzón', emoji: '🫙', attrs: { 'Formato de venta': 'Unidad', Peso: '5 kg', 'Tipo de aceite': 'Extra virgen Blend', Envase: 'Botella vidrio', Volumen: '5 L' } },
  { title: 'Silla Ergonómica Mesh XT Pro', description: 'Silla de oficina ergonómica con respaldo de malla transpirable, soporte lumbar ajustable y reposabrazos 4D.', category: 'Hogar y Decoración', brand: 'OfficePro', emoji: '🪑', attrs: { 'Material tapizado': 'Mesh / Tela', 'Peso máximo': '120 kg', 'Altura ajustable': 'Sí', Color: 'Negro' } },
  { title: 'Cafetera Nespresso Essenza Mini', description: 'La cafetera Nespresso más compacta. Compatible con cápsulas OriginalLine, calienta en 25 segundos.', category: 'Electrodomésticos', brand: 'Nespresso', emoji: '☕', attrs: { Presión: '19 bares', Depósito: '0.6 L', Potencia: '1310 W' } },
  { title: 'Pelota de Fútbol Nike Premier League', description: 'Balón oficial Nike Premier League con tecnología de vuelo consistente y cubierta texturizada.', category: 'Deportes y Fitness', brand: 'Nike', emoji: '⚽', attrs: { Talla: '5', Material: 'PU sintético', Uso: 'Partido oficial' } },
  { title: 'Cafetera De Longhi Dedica Style', description: 'Cafetera espresso De Longhi con bomba de 15 bares, vaporizador de leche y diseño compacto.', category: 'Electrodomésticos', brand: 'De Longhi', emoji: '☕', attrs: { Presión: '15 bares', Depósito: '1.3 L', Potencia: '1300 W' } },
];

const SYNC_CFG: Record<SyncState, { label: string; color: string; bg: string; Icon: any }> = {
  synced:   { label: 'Sincronizado',  color: '#15803D', bg: '#DCFCE7', Icon: CheckCircle2 },
  pending:  { label: 'Pendiente',     color: '#B45309', bg: '#FEF3C7', Icon: Clock },
  error:    { label: 'Error',         color: '#DC2626', bg: '#FEE2E2', Icon: AlertCircle },
  disabled: { label: 'Desactivado',   color: '#9CA3AF', bg: '#F3F4F6', Icon: X },
};

const CATEGORIES = ['Alimentos y Bebidas','Higiene y Cuidado Personal','Tecnología','Moda y Accesorios','Hogar y Decoración','Herramientas y Mejoras','Electrodomésticos','Indumentaria','Bebés y Niños','Deportes y Fitness','Automotriz','Oficina y Librería','Mascotas','Juguetería','Salud y Bienestar','Limpieza del Hogar','Música e Instrumentos','Películas, Series y Entretenimiento','Contenido Adulto'];

/* ══════════════════════════ COMPONENT ══════════════════════════ */
export function ProductModal({ product, onClose, onSave }: Props) {
  const isNew = !product?.name;
  const [step, setStep]           = useState<Step>(0);
  const [stepDone, setStepDone]   = useState([false, false, false]);
  const [mlResults, setMlResults] = useState<typeof ML_PRODUCTS>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [mlImported, setMlImported]     = useState<string | null>(null);
  const [tagInput, setTagInput]         = useState('');
  const fileImgRef = useRef<HTMLInputElement>(null);
  const fileVidRef = useRef<HTMLInputElement>(null);
  const nameRef    = useRef<HTMLDivElement>(null);

  const [form, setForm] = useState<ProductFormData>({
    name: '', description: '', price: '', category: '',
    images: [], videos: [],
    sku: '', barcode: '', brand: '', stock: '0', minStock: '0',
    weight: '', dimH: '', dimW: '', dimL: '',
    tags: [], discount: '', serialNumber: '',
    cost: '', supplier: '', taxRate: '22', warranty: '12 meses',
    origin: '', material: '', color: '', size: '',
    seoTitle: '', seoDesc: '',
    sync: { store: true, ml: false, instagram: false, whatsapp: false },
    syncStatus: { store: 'pending', ml: 'disabled', instagram: 'disabled', whatsapp: 'disabled' },
    mlAttributes: {},
    ...product,
  });

  const set = (k: keyof ProductFormData, v: any) => setForm(p => ({ ...p, [k]: v }));

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (nameRef.current && !nameRef.current.contains(e.target as Node)) setShowDropdown(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleNameChange = (v: string) => {
    set('name', v);
    if (v.length < 2) { setMlResults([]); setShowDropdown(false); return; }
    const res = ML_PRODUCTS.filter(p =>
      p.title.toLowerCase().includes(v.toLowerCase()) ||
      p.brand.toLowerCase().includes(v.toLowerCase()) ||
      p.category.toLowerCase().includes(v.toLowerCase())
    );
    setMlResults(res);
    setShowDropdown(res.length > 0);
  };

  const applyML = (p: typeof ML_PRODUCTS[0]) => {
    setForm(prev => ({ ...prev, name: p.title, description: p.description, category: p.category, brand: p.brand, mlAttributes: p.attrs }));
    setMlImported(p.title);
    setShowDropdown(false);
    setMlResults([]);
  };

  /* ── File handlers — guardamos el File real junto al blob URL ── */
  const onFiles = (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'video') => {
    const newFiles: UploadedFile[] = Array.from(e.target.files || []).map(f => ({
      id: Math.random().toString(36).slice(2),
      name: f.name,
      url: URL.createObjectURL(f),
      type,
      size: `${(f.size / 1024).toFixed(0)} KB`,
      file: f,   // ← guardamos el File real
    }));
    const key = type === 'image' ? 'images' : 'videos';
    set(key, [...(form[key] as UploadedFile[]), ...newFiles]);
    e.target.value = '';
  };

  const removeFile = (id: string, type: 'image' | 'video') => {
    const key = type === 'image' ? 'images' : 'videos';
    set(key, (form[key] as UploadedFile[]).filter(f => f.id !== id));
  };

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !form.tags.includes(t)) { set('tags', [...form.tags, t]); setTagInput(''); }
  };

  const goNext = () => {
    const d = [...stepDone]; d[step] = true; setStepDone(d);
    setStep(s => Math.min(s + 1, 2) as Step);
  };

  const syncNow = (k: keyof typeof form.sync) => {
    set('syncStatus', { ...form.syncStatus, [k]: 'pending' });
    setTimeout(() => set('syncStatus', { ...form.syncStatus, [k]: Math.random() > 0.2 ? 'synced' : 'error' }), 1400);
  };

  const STEPS = [
    { label: 'Básica',     sub: 'Información esencial',  icon: '📦' },
    { label: 'Intermedia', sub: 'Inventario y logística', icon: '📊' },
    { label: 'Avanzada',   sub: 'SEO y sincronización',   icon: '⚙️' },
  ];

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '16px' }} onClick={onClose}>
      <div style={{ backgroundColor: '#FFF', borderRadius: '16px', width: '100%', maxWidth: '840px', maxHeight: '92vh', display: 'flex', flexDirection: 'column', boxShadow: '0 25px 60px rgba(0,0,0,0.25)' }} onClick={e => e.stopPropagation()}>

        {/* Header + Step tabs */}
        <div style={{ padding: '22px 28px 0', borderBottom: '1px solid #F3F4F6', flexShrink: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
            <div>
              <h2 style={{ margin: '0 0 2px', fontWeight: '900', fontSize: '1.1rem', color: '#111827' }}>
                {isNew ? '+ Nuevo Artículo' : `Editar: ${form.name || 'Artículo'}`}
              </h2>
              <p style={{ margin: 0, color: '#9CA3AF', fontSize: '0.75rem' }}>Completá los 3 pasos · Los campos con * son obligatorios</p>
            </div>
            <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF' }}><X size={20} /></button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', marginBottom: '-1px' }}>
            {STEPS.map((s, i) => {
              const active = step === i;
              const done = stepDone[i];
              return (
                <button key={i} onClick={() => setStep(i as Step)}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', border: `1.5px solid ${active ? ORANGE : done ? '#16A34A' : '#E5E7EB'}`, borderBottom: active ? `1.5px solid #FFF` : `1.5px solid ${done ? '#16A34A' : '#E5E7EB'}`, borderRadius: '9px 9px 0 0', backgroundColor: active ? '#FFF' : done ? '#F0FFF4' : '#F9FAFB', cursor: 'pointer', textAlign: 'left' }}>
                  <div style={{ width: '30px', height: '30px', borderRadius: '7px', backgroundColor: active ? ORANGE : done ? '#16A34A' : '#E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {done && !active ? <CheckCircle2 size={14} color="#FFF" /> : <span style={{ fontSize: '0.9rem' }}>{s.icon}</span>}
                  </div>
                  <div>
                    <p style={{ margin: 0, fontWeight: '700', fontSize: '0.82rem', color: active ? ORANGE : done ? '#16A34A' : '#374151' }}>{s.label}</p>
                    <p style={{ margin: 0, fontSize: '0.65rem', color: '#9CA3AF' }}>{s.sub}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Scrollable body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '22px 28px' }}>

          {/* ══ PASO 1 – BÁSICA ══ */}
          {step === 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <Field label="Nombre del Artículo *">
                <div ref={nameRef} style={{ position: 'relative' }}>
                  <input type="text" placeholder="Escribí el nombre para buscar y autocompletar datos…" value={form.name}
                    onChange={e => handleNameChange(e.target.value)}
                    onFocus={() => mlResults.length > 0 && setShowDropdown(true)}
                    style={{ ...inp, paddingRight: '90px' }} />
                  <span style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', display: 'flex', alignItems: 'center', gap: '3px', fontSize: '0.65rem', color: '#9CA3AF', pointerEvents: 'none' }}>
                    <Sparkles size={10} color={ORANGE} /> ML autocomplete
                  </span>
                  {showDropdown && mlResults.length > 0 && (
                    <div style={{ position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, backgroundColor: '#FFF', border: '1px solid #E5E7EB', borderRadius: '10px', boxShadow: '0 12px 32px rgba(0,0,0,0.14)', zIndex: 200, maxHeight: '260px', overflowY: 'auto' }}>
                      <div style={{ padding: '8px 12px 4px', borderBottom: '1px solid #F3F4F6', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <Sparkles size={11} color={ORANGE} />
                        <span style={{ fontSize: '0.7rem', fontWeight: '700', color: '#374151' }}>Resultados — seleccioná para autocompletar</span>
                      </div>
                      {mlResults.map((p, i) => (
                        <button key={i} onClick={() => applyML(p)}
                          style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', border: 'none', background: 'transparent', cursor: 'pointer', textAlign: 'left', borderBottom: i < mlResults.length - 1 ? '1px solid #F9FAFB' : 'none' }}
                          onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#FFF4EC')}
                          onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}>
                          <span style={{ fontSize: '1.3rem', flexShrink: 0 }}>{p.emoji}</span>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{ margin: '0 0 1px', fontWeight: '700', color: '#111827', fontSize: '0.82rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.title}</p>
                            <p style={{ margin: 0, fontSize: '0.7rem', color: '#9CA3AF' }}>{p.brand} · {p.category} · <span style={{ color: '#10B981' }}>{Object.keys(p.attrs).length} atributos ML</span></p>
                          </div>
                          <span style={{ padding: '2px 8px', backgroundColor: `${ORANGE}18`, color: ORANGE, borderRadius: '5px', fontSize: '0.65rem', fontWeight: '800', flexShrink: 0 }}>Usar</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                {mlImported && (
                  <div style={{ marginTop: '6px', display: 'flex', alignItems: 'center', gap: '6px', padding: '5px 10px', backgroundColor: '#F0FFF4', border: '1px solid #BBF7D0', borderRadius: '6px', fontSize: '0.72rem', color: '#15803D' }}>
                    <CheckCircle2 size={12} /> Datos importados: <strong>{mlImported}</strong>
                    <button onClick={() => { setMlImported(null); set('mlAttributes', {}); }} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF', padding: 0 }}>✕</button>
                  </div>
                )}
              </Field>

              <Field label="Descripción *">
                <textarea rows={5} placeholder="Descripción detallada del artículo…" value={form.description}
                  onChange={e => set('description', e.target.value)} style={{ ...inp, resize: 'vertical' }} />
              </Field>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <Field label="Precio *">
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)', color: '#6B7280', fontWeight: '700', fontSize: '0.875rem' }}>$</span>
                    <input type="number" step="0.01" value={form.price} onChange={e => set('price', e.target.value)} style={{ ...inp, paddingLeft: '24px' }} />
                  </div>
                </Field>
                <Field label="Categoría *">
                  <select value={form.category} onChange={e => set('category', e.target.value)} style={{ ...inp, backgroundColor: '#FFF' }}>
                    <option value="">Seleccionar categoría</option>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </Field>
              </div>

              {/* Imágenes */}
              <Field label="Imágenes * — mín. 1 foto">
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {form.images.map((img, idx) => (
                    <div key={img.id} style={{ position: 'relative', width: '88px', height: '88px', borderRadius: '8px', overflow: 'hidden', border: idx === 0 ? `2px solid ${ORANGE}` : '1px solid #E5E7EB' }}>
                      <img src={img.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      {idx === 0 && <span style={{ position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: `${ORANGE}CC`, color: '#FFF', fontSize: '0.58rem', fontWeight: '700', textAlign: 'center', padding: '2px' }}>Principal</span>}
                      <button onClick={() => removeFile(img.id, 'image')} style={{ position: 'absolute', top: '3px', right: '3px', width: '16px', height: '16px', borderRadius: '50%', backgroundColor: 'rgba(0,0,0,0.65)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <X size={9} color="#FFF" />
                      </button>
                    </div>
                  ))}
                  <button onClick={() => fileImgRef.current?.click()}
                    style={{ width: '88px', height: '88px', borderRadius: '8px', border: `2px dashed ${ORANGE}`, backgroundColor: '#FFF4EC', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '5px', color: ORANGE }}>
                    <Upload size={18} />
                    <span style={{ fontSize: '0.6rem', fontWeight: '700', textAlign: 'center', lineHeight: 1.3 }}>+ Foto</span>
                  </button>
                  <input ref={fileImgRef} type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={e => onFiles(e, 'image')} />
                </div>
                <p style={{ margin: '5px 0 0', fontSize: '0.7rem', color: '#9CA3AF' }}>La primera imagen es la foto principal.</p>
              </Field>

              {/* Videos */}
              <Field label="Videos del producto (opcional)">
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {form.videos.map(v => (
                    <div key={v.id} style={{ position: 'relative', width: '120px', height: '70px', borderRadius: '8px', border: '1px solid #E5E7EB', backgroundColor: '#F3F4F6', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '3px' }}>
                      <Video size={18} color="#6B7280" />
                      <span style={{ fontSize: '0.6rem', color: '#6B7280', maxWidth: '110px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', padding: '0 4px' }}>{v.name}</span>
                      <button onClick={() => removeFile(v.id, 'video')} style={{ position: 'absolute', top: '3px', right: '3px', width: '15px', height: '15px', borderRadius: '50%', backgroundColor: 'rgba(0,0,0,0.5)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <X size={8} color="#FFF" />
                      </button>
                    </div>
                  ))}
                  <button onClick={() => fileVidRef.current?.click()}
                    style={{ width: '120px', height: '70px', borderRadius: '8px', border: '2px dashed #9CA3AF', backgroundColor: '#F9FAFB', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '4px', color: '#6B7280' }}>
                    <Video size={15} />
                    <span style={{ fontSize: '0.6rem', fontWeight: '600' }}>+ Video</span>
                  </button>
                  <input ref={fileVidRef} type="file" accept="video/*" multiple style={{ display: 'none' }} onChange={e => onFiles(e, 'video')} />
                </div>
              </Field>

              {Object.keys(form.mlAttributes).length > 0 && (
                <div>
                  <p style={{ margin: '0 0 8px', fontWeight: '700', color: '#374151', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Sparkles size={13} color={ORANGE} /> Atributos importados de ML
                  </p>
                  <div style={{ border: '1px solid #E5E7EB', borderRadius: '8px', overflow: 'hidden' }}>
                    {Object.entries(form.mlAttributes).map(([k, v], i, arr) => (
                      <div key={k} style={{ display: 'flex', borderBottom: i < arr.length - 1 ? '1px solid #F3F4F6' : 'none', backgroundColor: i % 2 === 0 ? '#FAFAFA' : '#FFF' }}>
                        <span style={{ padding: '8px 12px', fontSize: '0.78rem', color: '#374151', fontWeight: '600', width: '42%', borderRight: '1px solid #F3F4F6' }}>{k}</span>
                        <span style={{ padding: '8px 12px', fontSize: '0.78rem', color: '#6B7280', flex: 1 }}>{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ══ PASO 2 – INTERMEDIA ══ */}
          {step === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                <Field label="SKU"><input type="text" placeholder="ELE-001" value={form.sku} onChange={e => set('sku', e.target.value)} style={inp} /></Field>
                <Field label="Código de Barras"><input type="text" placeholder="7501234567890" value={form.barcode} onChange={e => set('barcode', e.target.value)} style={inp} /></Field>
                <Field label="Marca"><input type="text" placeholder="Nike, Apple…" value={form.brand} onChange={e => set('brand', e.target.value)} style={inp} /></Field>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                <Field label="Stock Disponible"><input type="number" value={form.stock} onChange={e => set('stock', e.target.value)} style={inp} /></Field>
                <Field label="Stock Mínimo"><input type="number" value={form.minStock} onChange={e => set('minStock', e.target.value)} style={inp} /></Field>
                <Field label="Peso (kg)"><input type="number" step="0.01" value={form.weight} onChange={e => set('weight', e.target.value)} style={inp} /></Field>
              </div>
              <Field label="Dimensiones (cm)  Alto · Ancho · Largo">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                  {(['dimH','dimW','dimL'] as const).map((k, i) => (
                    <input key={k} type="number" placeholder={['Alto','Ancho','Largo'][i]} value={form[k]} onChange={e => set(k, e.target.value)} style={inp} />
                  ))}
                </div>
              </Field>
              <Field label="Número de Serie">
                <input type="text" placeholder="SN-XXXXXXXXXX" value={form.serialNumber} onChange={e => set('serialNumber', e.target.value)} style={inp} />
              </Field>
              <Field label="Etiquetas (Enter para agregar)">
                <div style={{ display: 'flex', gap: '6px', marginBottom: '6px', flexWrap: 'wrap' }}>
                  {form.tags.map(t => (
                    <span key={t} style={{ padding: '3px 9px', backgroundColor: `${ORANGE}18`, border: `1px solid ${ORANGE}33`, color: ORANGE, borderRadius: '20px', fontSize: '0.75rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '3px' }}>
                      {t}<button onClick={() => set('tags', form.tags.filter(x => x !== t))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: ORANGE, padding: 0, lineHeight: 1 }}>×</button>
                    </span>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input type="text" placeholder="Nueva etiqueta…" value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && addTag()} style={{ ...inp, flex: 1 }} />
                  <button onClick={addTag} style={{ padding: '9px 14px', backgroundColor: ORANGE, color: '#FFF', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}><Plus size={13} />Agregar</button>
                </div>
              </Field>
              <Field label="Descuento (%)">
                <input type="number" min="0" max="100" value={form.discount} onChange={e => set('discount', e.target.value)} style={{ ...inp, maxWidth: '180px' }} />
              </Field>
            </div>
          )}

          {/* ══ PASO 3 – AVANZADA ══ */}
          {step === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <Field label="Costo"><input type="number" step="0.01" value={form.cost} onChange={e => set('cost', e.target.value)} style={inp} /></Field>
                <Field label="Proveedor"><input type="text" value={form.supplier} onChange={e => set('supplier', e.target.value)} style={inp} /></Field>
                <Field label="Tasa Impuesto (%)"><input type="number" value={form.taxRate} onChange={e => set('taxRate', e.target.value)} style={inp} /></Field>
                <Field label="Garantía"><input type="text" placeholder="12 meses" value={form.warranty} onChange={e => set('warranty', e.target.value)} style={inp} /></Field>
                <Field label="País de Origen"><input type="text" value={form.origin} onChange={e => set('origin', e.target.value)} style={inp} /></Field>
                <Field label="Material"><input type="text" value={form.material} onChange={e => set('material', e.target.value)} style={inp} /></Field>
                <Field label="Color"><input type="text" value={form.color} onChange={e => set('color', e.target.value)} style={inp} /></Field>
                <Field label="Talle / Tamaño"><input type="text" placeholder="S, M, L, XL" value={form.size} onChange={e => set('size', e.target.value)} style={inp} /></Field>
              </div>

              <div style={{ borderRadius: '10px', border: '1px solid #E5E7EB', padding: '16px', backgroundColor: '#FAFAFA' }}>
                <p style={{ margin: '0 0 12px', fontWeight: '700', fontSize: '0.85rem', color: '#374151', display: 'flex', alignItems: 'center', gap: '5px' }}><Globe size={14} /> SEO</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <Field label="Título SEO">
                    <input type="text" value={form.seoTitle} onChange={e => set('seoTitle', e.target.value)} style={inp} />
                    <span style={{ fontSize: '0.68rem', color: form.seoTitle.length > 60 ? '#DC2626' : '#9CA3AF', marginTop: '2px', display: 'block' }}>{form.seoTitle.length}/60</span>
                  </Field>
                  <Field label="Descripción SEO">
                    <textarea rows={2} value={form.seoDesc} onChange={e => set('seoDesc', e.target.value)} style={{ ...inp, resize: 'vertical' }} />
                    <span style={{ fontSize: '0.68rem', color: form.seoDesc.length > 160 ? '#DC2626' : '#9CA3AF', marginTop: '2px', display: 'block' }}>{form.seoDesc.length}/160</span>
                  </Field>
                </div>
              </div>

              <div style={{ borderRadius: '10px', border: '1px solid #E5E7EB', padding: '16px', backgroundColor: '#FAFAFA' }}>
                <p style={{ margin: '0 0 12px', fontWeight: '700', fontSize: '0.85rem', color: '#374151', display: 'flex', alignItems: 'center', gap: '5px' }}><RefreshCw size={14} /> Sincronización por artículo</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {[
                    { k: 'store'     as const, label: 'Tienda propia',     sub: 'Charlie Marketplace', Icon: ShoppingBag,   color: ORANGE    },
                    { k: 'ml'        as const, label: 'Mercado Libre',      sub: 'Publicación en ML',   Icon: Zap,           color: '#E8A600' },
                    { k: 'instagram' as const, label: 'Instagram Shopping', sub: 'Catálogo IG',         Icon: ImageIcon,     color: '#E1306C' },
                    { k: 'whatsapp'  as const, label: 'WhatsApp Catalog',   sub: 'Catálogo WA Biz',     Icon: MessageCircle, color: '#25D366' },
                  ].map(({ k, label, sub, Icon, color }) => {
                    const on = form.sync[k];
                    const st = SYNC_CFG[on ? form.syncStatus[k] : 'disabled'];
                    return (
                      <div key={k} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', backgroundColor: '#FFF', borderRadius: '9px', border: `1px solid ${on ? color + '33' : '#E5E7EB'}` }}>
                        <div style={{ width: '34px', height: '34px', borderRadius: '8px', backgroundColor: color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <Icon size={16} color={color} />
                        </div>
                        <div style={{ flex: 1 }}>
                          <p style={{ margin: 0, fontWeight: '700', color: '#111827', fontSize: '0.82rem' }}>{label}</p>
                          <p style={{ margin: 0, fontSize: '0.68rem', color: '#9CA3AF' }}>{sub}</p>
                        </div>
                        {on && (
                          <span style={{ padding: '2px 7px', borderRadius: '20px', backgroundColor: st.bg, color: st.color, fontSize: '0.67rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '3px' }}>
                            <st.Icon size={9} /> {st.label}
                          </span>
                        )}
                        {on && form.syncStatus[k] !== 'synced' && (
                          <button onClick={() => syncNow(k)} style={{ padding: '4px 8px', backgroundColor: color + '18', color, border: `1px solid ${color}33`, borderRadius: '6px', fontWeight: '700', cursor: 'pointer', fontSize: '0.68rem', display: 'flex', alignItems: 'center', gap: '3px' }}>
                            <RefreshCw size={9} /> Sync
                          </button>
                        )}
                        <div onClick={() => {
                          const ns = { ...form.sync, [k]: !on };
                          const nst = { ...form.syncStatus, [k]: !on ? 'pending' : 'disabled' } as typeof form.syncStatus;
                          setForm(p => ({ ...p, sync: ns, syncStatus: nst }));
                        }} style={{ width: '36px', height: '20px', borderRadius: '10px', backgroundColor: on ? color : '#D1D5DB', cursor: 'pointer', position: 'relative', flexShrink: 0 }}>
                          <div style={{ position: 'absolute', top: '2px', left: on ? '18px' : '2px', width: '16px', height: '16px', borderRadius: '50%', backgroundColor: '#FFF', boxShadow: '0 1px 3px rgba(0,0,0,0.2)', transition: 'left 0.18s' }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: '14px 28px', borderTop: '1px solid #F3F4F6', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0, backgroundColor: '#FAFAFA', borderRadius: '0 0 16px 16px' }}>
          <button onClick={() => step > 0 ? setStep(s => (s - 1) as Step) : onClose()}
            style={{ padding: '9px 18px', border: '1px solid #E5E7EB', borderRadius: '9px', backgroundColor: '#FFF', color: '#374151', fontWeight: '600', cursor: 'pointer', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <ChevronLeft size={14} /> {step === 0 ? 'Cancelar' : 'Anterior'}
          </button>
          <span style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>Paso {step + 1} de 3</span>
          {step < 2 ? (
            <button onClick={goNext}
              style={{ padding: '9px 22px', backgroundColor: ORANGE, color: '#FFF', border: 'none', borderRadius: '9px', fontWeight: '800', cursor: 'pointer', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
              Siguiente <ChevronRight size={14} />
            </button>
          ) : (
            <button onClick={() => onSave(form)}
              style={{ padding: '9px 22px', backgroundColor: '#16A34A', color: '#FFF', border: 'none', borderRadius: '9px', fontWeight: '800', cursor: 'pointer', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <CheckCircle2 size={14} /> Guardar Artículo
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '600', color: '#374151', marginBottom: '4px' }}>{label}</label>
      {children}
    </div>
  );
}

const inp: React.CSSProperties = {
  width: '100%', padding: '9px 12px', border: '1px solid #E5E7EB', borderRadius: '8px',
  fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box', color: '#111827', backgroundColor: '#FFFFFF',
};
