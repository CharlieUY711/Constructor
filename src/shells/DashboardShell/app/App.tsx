import { useState, useCallback } from 'react';

// ── Images ────────────────────────────────────────────────────────────────────
const IMG_CASE    = 'https://images.unsplash.com/photo-1574682592200-948fd815c4f0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600';
const IMG_EARBUDS = 'https://images.unsplash.com/photo-1762553159827-7a5d2167b55d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600';
const IMG_KITCHEN = 'https://images.unsplash.com/photo-1768875845344-5663fa9acf15?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600';
const IMG_PETBED  = 'https://images.unsplash.com/photo-1749703174207-257698ceb352?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600';
const IMG_TV      = 'https://images.unsplash.com/photo-1730909352933-614f1673ac21?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600';
const IMG_SHOES   = 'https://images.unsplash.com/photo-1761942028138-794f1d151e59?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600';
const IMG_IPHONE  = 'https://images.unsplash.com/photo-1635425730507-26c324aadbc5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600';
const IMG_MACBOOK = 'https://images.unsplash.com/photo-1574529395396-21637c4cf5df?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600';
const IMG_BIKE    = 'https://images.unsplash.com/photo-1571081790807-6933479d240f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600';
const IMG_SONY    = 'https://images.unsplash.com/photo-1764557159396-419b85356035?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600';
const IMG_WEIGHTS = 'https://images.unsplash.com/photo-1710746904729-f3ad9f682bb9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600';
const IMG_CHAIR   = 'https://images.unsplash.com/photo-1528045535275-50e5d46dbae8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600';

// Sample videos (BigBuckBunny clips — always available)
const VID_MKT = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
const VID_SH  = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4';

// ── Types ─────────────────────────────────────────────────────────────────────
interface MktProduct {
  id: number; img: string; d: string; n: string;
  p: string; o: string | null; b: string | null; bt: string;
  desc: string; r: number; rv: number; q: string; vid?: string;
}
interface ShProduct {
  id: number; img: string; d: string; n: string;
  p: string; og: string; c: number;
  desc: string; r: number; rv: number; q: string; vid?: string;
}
interface CartItem { id: number; img: string; n: string; p: string; pNum: number; m: 'mkt' | 'sh'; }
interface HistItem { id: number; m: 'mkt' | 'sh'; img: string; n: string; }

// ── Helpers ───────────────────────────────────────────────────────────────────
const parsePrice = (p: string) => parseInt(p.replace(/[\$\.]/g, ''), 10);
const fmtNum = (n: number) => '$' + n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');

// ── Data ──────────────────────────────────────────────────────────────────────
const MP: MktProduct[] = [
  { id:1, img:IMG_CASE,    d:'Celulares', n:'Funda iPhone 15 silicona premium',  p:'$472',    o:'$590',   b:'-20%', bt:'',   desc:'Silicona líquida premium, compatible con carga inalámbrica. Protección para bordes y cámara. Disponible en 8 colores.', r:4.3, rv:89,  q:'¿Es compatible con MagSafe? Sí, totalmente.' },
  { id:2, img:IMG_EARBUDS, d:'Electro',   n:'Auriculares TWS noise cancel',       p:'$1.890',  o:null,     b:'Nuevo',bt:'cy', desc:'Cancelación activa de ruido con 3 modos. 8hs + 22hs con estuche. Resistencia IPX4, driver 13mm, aptX.', r:4.7, rv:203, q:'¿Funciona con Android e iOS? Sí, ambos.', vid: VID_MKT },
  { id:3, img:IMG_KITCHEN, d:'Hogar',     n:'Set organizadores cocina x6',        p:'$890',    o:null,     b:null,   bt:'',   desc:'Set 6 piezas: 3 rectangular + 2 cuadrado + 1 redondo. Tapa hermética, BPA free, apto microondas y lavavajillas.', r:4.1, rv:56,  q:'¿Son apilables? Sí, ahorra espacio.' },
  { id:4, img:IMG_PETBED,  d:'Mascotas',  n:'Cama premium mascotas talle L',      p:'$1.290',  o:null,     b:'Top',  bt:'cy', desc:'Relleno memory foam ortopédico, funda extraíble lavable. Para mascotas hasta 25kg. Antideslizante.', r:4.8, rv:142, q:'¿La funda se lava en lavarropas? Sí, a 40°.' },
  { id:5, img:IMG_TV,      d:'Electro',   n:'Smart TV 43" 4K Android TV',         p:'$18.500', o:'$22.000',b:'-16%', bt:'',   desc:'Panel VA 4K UHD, Android TV 11, Chromecast built-in, HDMI 2.1 ×3, USB ×2, WiFi 5GHz, 60Hz, HDR10.', r:4.5, rv:317, q:'¿Tiene Netflix y YouTube? Sí, preinstalados.' },
  { id:6, img:IMG_SHOES,   d:'Moda',      n:'Zapatillas running urbanas',          p:'$2.890',  o:null,     b:'Nuevo',bt:'cy', desc:'Upper mesh transpirable, suela EVA amortiguada doble densidad, refuerzo talón. Talles 36-45. Unisex.', r:4.4, rv:78,  q:'¿Tallaje normal? Sí, talla normal.' },
  { id:7, img:IMG_KITCHEN, d:'Hogar',     n:'Termo acero 1L doble pared',         p:'$650',    o:'$780',   b:'-17%', bt:'',   desc:'Acero inox 18/8 grado alimenticio. Doble pared al vacío. Mantiene frío 24hs, caliente 12hs. Boca 4.5cm.', r:4.6, rv:231, q:'¿Entra una bolsita de té? Sí, perfectamente.' },
  { id:8, img:IMG_PETBED,  d:'Mascotas',  n:'Comedero automático 3L',             p:'$1.890',  o:null,     b:'Nuevo',bt:'cy', desc:'Temporizador con 6 porciones programables, pantalla LCD, altavoz para grabar voz. Capacidad 3L.', r:4.6, rv:94,  q:'¿Funciona sin luz? Tiene batería de respaldo.' },
];

const SH: ShProduct[] = [
  { id:10, img:IMG_IPHONE,  d:'Celulares', n:'iPhone 13 128GB · Muy bueno',            p:'$11.500', og:'Nuevo $18.000', c:4, desc:'Batería 91% (verificado). Sin rayones en pantalla ni cuerpo. Con caja original, cargador y funda.', r:4.8, rv:12, q:'¿Tiene Face ID funcionando? Sí, perfecto.', vid: VID_SH },
  { id:11, img:IMG_MACBOOK, d:'Electro',   n:'MacBook Air M1 8GB · Excelente',          p:'$28.000', og:'Nuevo $42.000', c:5, desc:'Sin uso visible. Batería 45 ciclos. Caja original, cargador MagSafe. macOS Sonoma actualizado.', r:5.0, rv:8,  q:'¿Tiene rayones? Sin rayones, excelente estado.' },
  { id:12, img:IMG_BIKE,    d:'Deporte',   n:'Bicicleta mtb Rod 29 · Buen estado',      p:'$8.500',  og:'Nuevo $14.000', c:3, desc:'Frenos hidráulicos Shimano, 21 velocidades. Neumáticos Kenda nuevos. Cuadro aluminio.', r:4.2, rv:5,  q:'¿Incluye candado? No, se vende sola.' },
  { id:13, img:IMG_SONY,    d:'Electro',   n:'Sony WH-1000XM4 · Muy bueno',             p:'$4.200',  og:'Nuevo $7.500',  c:4, desc:'Estuche y cable originales. ANC funcionando perfectamente. Batería 95% de capacidad.', r:4.9, rv:15, q:'¿Conecta a dos dispositivos? Sí, multipoint.' },
  { id:14, img:IMG_WEIGHTS, d:'Deporte',   n:'Pesas ajustables 20kg set',               p:'$3.800',  og:'Nuevo $6.200',  c:3, desc:'Set completo: barra + 10 discos goma (1.25–5kg). Marcas de uso normales. Funcional al 100%.', r:4.3, rv:7,  q:'¿Pesan exacto? Sí, verificadas en balanza.' },
  { id:15, img:IMG_CHAIR,   d:'Hogar',     n:'Sillón reclinable cuero eco · Muy bueno', p:'$6.900',  og:'Nuevo $12.000', c:4, desc:'Motor eléctrico silencioso, 3 posiciones. Cuero eco sin grietas. Un año de uso. Retiro mdeo.', r:4.7, rv:9,  q:'¿Tiene garantía? Se puede transferir al comprador.' },
  { id:16, img:IMG_IPHONE,  d:'Celulares', n:'Samsung S22 128GB · Muy bueno',           p:'$9.800',  og:'Nuevo $16.000', c:4, desc:'Pantalla sin rayones. Batería 88% (medida con AccuBattery). Con cargador original.', r:4.6, rv:11, q:'¿Tiene microSD? No tiene expansión de almacenamiento.' },
  { id:17, img:IMG_MACBOOK, d:'Electro',   n:'iPad Air 5ta gen · Excelente',            p:'$19.500', og:'Nuevo $29.000', c:5, desc:'Sin uso visible. Apple Pencil 2da gen + Smart Folio incluidos. iCloud borrado, listo para usar.', r:4.9, rv:6,  q:'¿Tiene cellular? No, es Wi-Fi únicamente.' },
];

const COND = ['','Regular','Buen estado','Buen estado','Muy bueno','Excelente'];
const DEPTS = [
  '⚡ Electro','👗 Moda','🏠 Hogar','🛒 Almacén','🐾 Mascotas','🏍️ Motos',
  '🧼 Limpieza','💊 Salud','⚽ Deporte','📱 Celulares','🔧 Ferretería','📚 Librería',
  '🍼 Bebés','🎮 Gaming','🌿 Jardín','🚗 Autos','💄 Belleza','🍕 Delivery',
];

// ── Icons ─────────────────────────────────────────────────────────────────────
const IconHome   = () => <svg className="oddy-nico" viewBox="0 0 24 24"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/></svg>;
const IconGrid   = () => <svg className="oddy-nico" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>;
const IconShield = () => <svg className="oddy-nico" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
const IconSearch = () => <svg className="oddy-nico" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>;
const IconUser   = () => <svg className="oddy-nico" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
const IconBag    = () => <svg viewBox="0 0 24 24"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>;
const IconSrchSm = () => <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>;
const IconCart   = () => <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>;
// White play triangle for video button
const IconPlay   = () => (
  <svg viewBox="0 0 12 12" width="10" height="10" fill="#222" stroke="none">
    <path d="M2.5 1.5 L10 6 L2.5 10.5 Z" />
  </svg>
);

// ── Sub-components ────────────────────────────────────────────────────────────
function Dots({ count }: { count: number }) {
  return (
    <div className="oddy-crow">
      {[1,2,3,4,5].map(i => <div key={i} className={`oddy-cd${i <= count ? ' on' : ''}`} />)}
    </div>
  );
}

function Stars({ r, rv, label }: { r: number; rv: number; label: string }) {
  const filled = Math.round(r);
  return (
    <div className="oddy-stars">
      <span className="oddy-stars-ico">{'★'.repeat(filled)}{'☆'.repeat(5 - filled)}</span>
      <span className="oddy-stars-txt">{r.toFixed(1)} · {rv} {label}</span>
    </div>
  );
}

// ── Market Flip Card ──────────────────────────────────────────────────────────
function FlipCard({ p, onAdd, onFlipped }: {
  p: MktProduct; onAdd: () => void; onFlipped: () => void;
}) {
  const [flipped, setFlipped]   = useState(false);
  const [playing, setPlaying]   = useState(false);
  const [label,   setLabel]     = useState('Agregar');
  const [btnStyle, setBtnStyle] = useState<React.CSSProperties>({});

  const handleFlip = () => {
    const next = !flipped;
    setFlipped(next);
    if (next) onFlipped();
  };
  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAdd();
    setLabel('✓ Listo'); setBtnStyle({ background: '#1A8A48' });
    setTimeout(() => { setLabel('Agregar'); setBtnStyle({}); }, 1100);
  };

  return (
    <div id={`fc${p.id}`} className={`oddy-fc${flipped ? ' flipped' : ''}`} onClick={handleFlip}>
      <div className="oddy-fi">

        {/* ── FRONT FACE ── */}
        <div className="oddy-ff">
          <div className="oddy-cimg">
            {/* Video plays in-place replacing the photo */}
            {playing && p.vid ? (
              <video
                className="oddy-vid-frame"
                src={p.vid}
                autoPlay muted loop playsInline
                onClick={e => { e.stopPropagation(); setPlaying(false); }}
              />
            ) : (
              <>
                <img src={p.img} alt={p.n} />
                {/* White play button overlay — only when video exists */}
                {p.vid && (
                  <button
                    className="oddy-play-btn"
                    onClick={e => { e.stopPropagation(); setPlaying(true); }}
                    aria-label="Reproducir video"
                  >
                    <IconPlay />
                  </button>
                )}
              </>
            )}
            {!playing && p.b && <div className={`oddy-cbdg${p.bt ? ` ${p.bt}` : ''}`}>{p.b}</div>}
          </div>
          <div className="oddy-cbody">
            <div className="oddy-cdept">{p.d}</div>
            <div className="oddy-cname">{p.n}</div>
            <div className="oddy-cprice">
              {p.o && <span className="old">{p.o}</span>}
              {p.p}
            </div>
          </div>
        </div>

        {/* ── BACK FACE: ghost image + full expanded info ── */}
        <div className="oddy-fb">
          <img className="oddy-ghost-img" src={p.img} alt="" aria-hidden="true" />
          <div className="oddy-fb-content">
            <div className="oddy-fb-dept">{p.d}</div>
            <div className="oddy-fb-name">{p.n}</div>
            <div className="oddy-fb-price-row">
              <span className="oddy-fb-price">{p.p}</span>
              {p.o && <span className="oddy-fb-old">{p.o}</span>}
            </div>
            <Stars r={p.r} rv={p.rv} label="reseñas" />
            <div className="oddy-fb-desc">{p.desc}</div>
            <div className="oddy-qrow">💬 {p.q}</div>
            <button className="oddy-fb-add" style={btnStyle} onClick={handleAdd}>
              <IconCart />{label}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

// ── SH Slide Card ─────────────────────────────────────────────────────────────
function SlideCard({ p, isOpen, dir, onToggle, onAdd }: {
  p: ShProduct; isOpen: boolean; dir: 'right' | 'left';
  onToggle: () => void; onAdd: () => void;
}) {
  const [playing, setPlaying] = useState(false);
  const [label,   setLabel]   = useState('Agregar');
  const [style,   setStyle]   = useState<React.CSSProperties>({});

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAdd();
    setLabel('✓ Listo'); setStyle({ background: '#1A8A48' });
    setTimeout(() => { setLabel('Agregar'); setStyle({}); }, 1100);
  };

  return (
    <div className="oddy-card-slot">
      {/* Static card */}
      <div
        id={`ec${p.id}`}
        className={`oddy-ec${isOpen ? ' sh-open' : ''}`}
        onClick={onToggle}
      >
        <div className="oddy-eimg">
          {playing && p.vid ? (
            <video
              className="oddy-vid-frame"
              src={p.vid}
              autoPlay muted loop playsInline
              onClick={e => { e.stopPropagation(); setPlaying(false); }}
            />
          ) : (
            <>
              <img src={p.img} alt={p.n} />
              {p.vid && (
                <button
                  className="oddy-play-btn"
                  onClick={e => { e.stopPropagation(); setPlaying(true); }}
                  aria-label="Reproducir video"
                >
                  <IconPlay />
                </button>
              )}
            </>
          )}
          {!playing && <div className="oddy-cbdg lm">Usado</div>}
        </div>
        <div className="oddy-ebody">
          <div className="oddy-cdept">{p.d}</div>
          <Dots count={p.c} />
          <div className="oddy-cname">{p.n}</div>
          <div className="oddy-cprice">{p.p}</div>
        </div>
      </div>

      {/* Sliding panel — ghost image + full info */}
      <div className={`oddy-panel-wrap dir-${dir}${isOpen ? ' open' : ''}`}>
        <div className="oddy-panel-inner">
          <img className="oddy-ghost-img" src={p.img} alt="" aria-hidden="true" />
          <div className="oddy-panel-body">
            <div className="oddy-panel-dept">{p.d} · {COND[p.c]}</div>
            <Dots count={p.c} />
            <div className="oddy-panel-name">{p.n}</div>
            <div className="oddy-panel-price">{p.p}</div>
            <div className="oddy-panel-orig">{p.og}</div>
            <Stars r={p.r} rv={p.rv} label="ventas" />
            <div className="oddy-panel-desc">{p.desc}</div>
            <div className="oddy-qrow">💬 {p.q}</div>
            <button className="oddy-panel-add" style={style} onClick={handleAdd}>
              <IconCart />{label}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Cross-sell sticky bar ─────────────────────────────────────────────────────
// Sits right below the hero, becomes sticky on scroll (stays under header+deptstrip)
function CrossSellBar({ isSH }: { isSH: boolean }) {
  const items  = isSH ? MP : SH;
  const label  = isSH ? '♻️ También en 2da Mano' : '🛍️ También en Market';
  return (
    <div className="oddy-cs-sticky">
      <span className="oddy-cs-lbl">{label}</span>
      <div className="oddy-cs-scroller">
        {items.map(p => (
          <div key={p.id} className="oddy-cs-thumb">
            <img src={p.img} alt={p.n} />
            <div className="oddy-cs-thumb-p">{p.p}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main App ──────────────────────────────────────────────────────────────────
export default function App() {
  const [mode,       setMode]       = useState<'mkt' | 'sh'>('mkt');
  const [activeDept, setActiveDept] = useState(0);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [hist,       setHist]       = useState<HistItem[]>([]);
  const [flash,      setFlash]      = useState(false);
  const [flashText,  setFlashText]  = useState('MARKET');
  const [flashKey,   setFlashKey]   = useState(0);
  const [showCart,   setShowCart]   = useState(false);

  // Pre-populated cart: 2 Market + 1 SH
  const [cartItems, setCartItems] = useState<CartItem[]>([
    { id:2,  img:IMG_EARBUDS, n:'Auriculares TWS noise cancel', p:'$1.890',  pNum:1890,  m:'mkt' },
    { id:5,  img:IMG_TV,      n:'Smart TV 43" 4K Android TV',   p:'$18.500', pNum:18500, m:'mkt' },
    { id:10, img:IMG_IPHONE,  n:'iPhone 13 128GB · Muy bueno',  p:'$11.500', pNum:11500, m:'sh'  },
  ]);

  const isSH = mode === 'sh';

  const addToCart = useCallback((p: MktProduct | ShProduct, m: 'mkt' | 'sh') => {
    setCartItems(prev => {
      if (prev.find(i => i.id === p.id && i.m === m)) return prev;
      return [...prev, { id:p.id, img:p.img, n:p.n, p:p.p, pNum:parsePrice(p.p), m }];
    });
  }, []);

  const addToHist = useCallback((id: number, m: 'mkt' | 'sh') => {
    const arr = m === 'mkt' ? MP : SH;
    const p = arr.find(x => x.id === id);
    if (!p) return;
    setHist(prev => {
      const filtered = prev.filter(h => !(h.id === id && h.m === m));
      return [{ id, m, img: p.img, n: p.n }, ...filtered].slice(0, 5);
    });
  }, []);

  const toggleMode = useCallback((silent = false) => {
    if (!silent) { setFlash(true); setFlashKey(k => k + 1); }
    setTimeout(() => {
      setMode(prev => {
        const next = prev === 'mkt' ? 'sh' : 'mkt';
        setFlashText(next === 'sh' ? 'SEGUNDA MANO' : 'ODDY MARKET');
        return next;
      });
      if (!silent) setTimeout(() => setFlash(false), 500);
    }, silent ? 0 : 200);
  }, []);

  const handleFlipped = (id: number) => addToHist(id, 'mkt');

  const handleExpand = (id: number) => {
    setExpandedId(prev => prev === id ? null : id);
    addToHist(id, 'sh');
  };

  const handleHistClick = (item: HistItem) => {
    if (item.m !== mode) {
      toggleMode(true);
      setTimeout(() => {
        if (item.m === 'sh') setExpandedId(item.id);
        document.getElementById(`${item.m === 'mkt' ? 'fc' : 'ec'}${item.id}`)
          ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    } else {
      if (item.m === 'sh') setExpandedId(item.id);
      document.getElementById(`${item.m === 'mkt' ? 'fc' : 'ec'}${item.id}`)
        ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const panelDir = (idx: number): 'right' | 'left' => idx % 4 < 2 ? 'right' : 'left';

  const cartTotal = cartItems.reduce((s, i) => s + i.pNum, 0);

  return (
    <div data-sh={isSH ? 'true' : undefined}>
      {/* FLASH */}
      <div className={`oddy-flash${flash ? ' show' : ''}`}>
        <div key={flashKey} className="oddy-fw">{flashText}</div>
      </div>

      {/* ── TOPBAR ── */}
      <header className="oddy-tb">
        <div className="oddy-logo">{isSH ? 'ODDY 2DA' : 'ODDY'}</div>
        <div className="oddy-srch">
          <IconSrchSm />
          <input type="text" placeholder={isSH ? 'Buscar en segunda mano…' : 'Buscar en 18 departamentos…'} />
        </div>
        <div className="oddy-tbr">
          <div className="oddy-mpill" onClick={() => toggleMode()}>
            <div className="oddy-mdot" />
            <span>{isSH ? '2DA MANO' : 'MARKET'}</span>
          </div>

          {/* Cart button + hover dropdown */}
          <div
            className="oddy-cart-wrap"
            onMouseEnter={() => setShowCart(true)}
            onMouseLeave={() => setShowCart(false)}
          >
            <div className="oddy-ibtn">
              <IconBag />
              <div className="oddy-bdg">{cartItems.length}</div>
            </div>

            {showCart && cartItems.length > 0 && (
              <div className="oddy-cart-drop">
                <div className="oddy-cart-list">
                  {cartItems.map(item => (
                    <div key={`${item.m}-${item.id}`} className="oddy-cart-ci">
                      <img src={item.img} alt={item.n} />
                      {/* Orange price = Market, Green = Segunda Mano */}
                      <span className={`oddy-cart-ptag ${item.m}`}>{item.p}</span>
                    </div>
                  ))}
                </div>
                {/* Total — just the number on gray */}
                <div className="oddy-cart-foot">
                  <span className="oddy-cart-foot-lbl">Total</span>
                  {fmtNum(cartTotal)}
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* DEPT STRIP */}
      <div className="oddy-dstrip">
        {DEPTS.map((d, i) => {
          const [emoji, ...rest] = d.split(' ');
          return (
            <div key={i} className={`oddy-dchip${activeDept === i ? ' on' : ''}`} onClick={() => setActiveDept(i)}>
              <em>{emoji}</em>{rest.join(' ')}
            </div>
          );
        })}
      </div>

      {/* MAIN */}
      <main className="oddy-main">
        {/* HERO */}
        <div className="oddy-hero">
          <div className="oddy-hero-in">
            <div className="oddy-hstripe" />
            <div className="oddy-hlbl">
              {isSH ? 'Uruguay · Segunda Mano · Verificado' : 'Uruguay · 18 departamentos'}
            </div>
            <h1 className="oddy-htitle">
              {isSH ? <>LO MEJOR<br />USADO DE <em>UY</em></> : <>TODO LO<br />QUE <em>NECESITÁS</em></>}
            </h1>
            <p className="oddy-hsub">
              {isSH
                ? 'Productos verificados por ODDY. Precios reales, condición real.'
                : 'Desde una funda hasta una moto. Todo en un solo lugar, con entrega en todo Uruguay.'}
            </p>
            <div className="oddy-hrow">
              <button className="oddy-bp">{isSH ? 'Ver publicaciones' : 'Explorar ahora'}</button>
              <button className="oddy-bo">Ver ofertas</button>
            </div>
          </div>
          <div className="oddy-hstats">
            <div className="oddy-hst"><div className="oddy-hstn">18</div><div className="oddy-hstl">Deptos</div></div>
            <div className="oddy-hst">
              <div className="oddy-hstn">{isSH ? '2.4K' : '12K+'}</div>
              <div className="oddy-hstl">{isSH ? 'Publicaciones' : 'Productos'}</div>
            </div>
            <div className="oddy-hst"><div className="oddy-hstn">24h</div><div className="oddy-hstl">Entrega UY</div></div>
          </div>
        </div>

        {/* ── MARKET ── */}
        {!isSH && (
          <>
            {/* Sticky cross-sell bar — below hero, floats up on scroll */}
            <CrossSellBar isSH={false} />

            <div className="oddy-shdr">
              <div className="oddy-stitle">DESTACADOS</div>
              <span className="oddy-slink">Ver más →</span>
            </div>
            <div className="oddy-grid">
              {MP.map(p => (
                <div key={p.id} className="oddy-card-slot">
                  <FlipCard
                    p={p}
                    onAdd={() => addToCart(p, 'mkt')}
                    onFlipped={() => handleFlipped(p.id)}
                  />
                </div>
              ))}
            </div>

            {/* SH Banner */}
            <div className="oddy-shban">
              <div className="oddy-shlbar" />
              <div className="oddy-shban-in">
                <div className="oddy-shtag"><div className="oddy-shlv" /><span className="oddy-shtxt">Segunda Mano</span></div>
                <div className="oddy-shtitle">DALE UNA<br /><span>SEGUNDA</span> VIDA</div>
                <div className="oddy-shsub">Productos verificados. Precios reales, condición real.</div>
                <div className="oddy-shnums">
                  <div><div className="oddy-shnv">2.4K</div><div className="oddy-shnl">Publicaciones</div></div>
                  <div><div className="oddy-shnv">98%</div><div className="oddy-shnl">Satisfacción</div></div>
                </div>
                <button className="oddy-shcta" onClick={() => toggleMode()}>Ir a Segunda Mano →</button>
              </div>
              <div className="oddy-shsts">
                <div className="oddy-shst"><div className="oddy-shstn">847</div><div className="oddy-shstl">Esta semana</div></div>
                <div className="oddy-shst"><div className="oddy-shstn">$450</div><div className="oddy-shstl">Precio medio</div></div>
                <div className="oddy-shst"><div className="oddy-shstn">18</div><div className="oddy-shstl">Categorías</div></div>
              </div>
            </div>
            <div className="oddy-sp" />
          </>
        )}

        {/* ── SEGUNDA MANO ── */}
        {isSH && (
          <>
            {/* Sticky cross-sell bar — below hero, floats up on scroll */}
            <CrossSellBar isSH={true} />

            <div className="oddy-shdr">
              <div className="oddy-stitle">PUBLICACIONES</div>
              <span className="oddy-slink">Ver todas →</span>
            </div>
            <div className="oddy-grid">
              {SH.map((p, idx) => (
                <SlideCard
                  key={p.id}
                  p={p}
                  isOpen={expandedId === p.id}
                  dir={panelDir(idx)}
                  onToggle={() => handleExpand(p.id)}
                  onAdd={() => addToCart(p, 'sh')}
                />
              ))}
            </div>
            <div className="oddy-sp" />
          </>
        )}
      </main>

      {/* HISTORY BAR */}
      <div className="oddy-hbar">
        <div className="oddy-hlbltxt">Vistos</div>
        {Array.from({ length: 5 }, (_, i) => {
          const h = hist[i];
          return h ? (
            <div key={`${h.id}-${h.m}`} className="oddy-hi" onClick={() => handleHistClick(h)}>
              <img src={h.img} alt={h.n} />
              <div className="oddy-htip">{h.n}</div>
            </div>
          ) : (
            <div key={`empty-${i}`} className="oddy-hemp" />
          );
        })}
        {/* Mode-switch shortcut */}
        <div
          className={`oddy-mode-tab ${isSH ? 'to-mkt' : 'to-sh'}`}
          onClick={() => toggleMode()}
          title={isSH ? 'Ir a Market' : 'Ir a Segunda Mano'}
        >
          {isSH ? 'M' : '2'}
        </div>
      </div>

      {/* BOTTOM NAV */}
      <nav className="oddy-bnav">
        <div className="oddy-ni on"><IconHome /><span className="oddy-nlbl">Inicio</span></div>
        <div className="oddy-ni"><IconGrid /><span className="oddy-nlbl">Deptos</span></div>
        <div className="oddy-ni-sh" onClick={() => toggleMode()}><IconShield /><span className="oddy-nlbl">2da Mano</span></div>
        <div className="oddy-ni"><IconSearch /><span className="oddy-nlbl">Buscar</span></div>
        <div className="oddy-ni"><IconUser /><span className="oddy-nlbl">Mi cuenta</span></div>
      </nav>
    </div>
  );
}