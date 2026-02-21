/**
 * 🖼️ Editor de Imágenes Pro
 * CSS Filters + Canvas export + Remove BG + Frame 1200×1200. Sin dependencias externas.
 */
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { WorkspaceShell } from '../workspace/WorkspaceShell';
import type { MainSection } from '../../../AdminDashboard';
import {
  Upload, FlipHorizontal, FlipVertical, Download,
  ZoomIn, ZoomOut, RotateCcw, RotateCw, Eraser, Loader,
} from 'lucide-react';

interface Props { onNavigate: (s: MainSection) => void; }

interface Adjustments {
  brightness: number; contrast: number; saturation: number;
  hue: number; blur: number; sepia: number; opacity: number;
}
const DEFAULT_ADJ: Adjustments = {
  brightness: 100, contrast: 100, saturation: 100,
  hue: 0, blur: 0, sepia: 0, opacity: 100,
};

const FILTER_PRESETS = [
  { name: 'Original', values: DEFAULT_ADJ },
  { name: 'Vívido',   values: { ...DEFAULT_ADJ, brightness: 110, contrast: 115, saturation: 150 } },
  { name: 'Cool',     values: { ...DEFAULT_ADJ, hue: 190, saturation: 120 } },
  { name: 'Cálido',   values: { ...DEFAULT_ADJ, hue: 20, brightness: 105, saturation: 110 } },
  { name: 'B&N',      values: { ...DEFAULT_ADJ, saturation: 0 } },
  { name: 'Vintage',  values: { ...DEFAULT_ADJ, sepia: 60, contrast: 90, brightness: 95 } },
  { name: 'Fade',     values: { ...DEFAULT_ADJ, contrast: 80, brightness: 105, saturation: 80, opacity: 90 } },
  { name: 'Noir',     values: { ...DEFAULT_ADJ, saturation: 0, contrast: 130, brightness: 90 } },
];

function buildFilter(adj: Adjustments): string {
  return [
    `brightness(${adj.brightness}%)`,
    `contrast(${adj.contrast}%)`,
    `saturate(${adj.saturation}%)`,
    `hue-rotate(${adj.hue}deg)`,
    `blur(${adj.blur}px)`,
    `sepia(${adj.sepia}%)`,
    `opacity(${adj.opacity}%)`,
  ].join(' ');
}

function gcd(a: number, b: number): number { return b === 0 ? a : gcd(b, a % b); }
function aspectRatioStr(w: number, h: number): string {
  const d = gcd(w, h);
  const rw = w / d, rh = h / d;
  if (rw > 20 || rh > 20) return `${(w / h).toFixed(2)}:1`;
  return `${rw}:${rh}`;
}

/* ─────────────────────────────── LEFT PANEL ─────────────────────────────── */
function LeftPanel({ adj, setAdj, onUpload, onRemoveBg, removingBg, hasImage }: {
  adj: Adjustments; setAdj: (a: Adjustments) => void;
  onUpload: () => void; onRemoveBg: () => void;
  removingBg: boolean; hasImage: boolean;
}) {
  const S = (key: keyof Adjustments, label: string, min: number, max: number, step = 1) => (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <label style={{ fontSize: '0.68rem', fontWeight: '600', color: '#374151' }}>{label}</label>
        <span style={{ fontSize: '0.68rem', color: '#9CA3AF', fontWeight: '600' }}>
          {adj[key]}{key === 'hue' ? '°' : key === 'blur' ? 'px' : '%'}
        </span>
      </div>
      <input type="range" min={min} max={max} step={step} value={adj[key]}
        onChange={e => setAdj({ ...adj, [key]: Number(e.target.value) })}
        style={{ width: '100%', accentColor: '#FF6835', cursor: 'pointer', height: 3 }} />
    </div>
  );

  return (
    <div style={{ padding: '10px 12px' }}>
      {/* Upload */}
      <button onClick={onUpload}
        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '8px', borderRadius: 8, border: '1.5px dashed #FFD4C2', backgroundColor: '#FFF4F0', color: '#FF6835', cursor: 'pointer', fontSize: '0.75rem', fontWeight: '700', marginBottom: 8 }}>
        <Upload size={13} /> Cargar imagen
      </button>

      {/* Remove BG */}
      <button onClick={onRemoveBg} disabled={!hasImage || removingBg}
        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '8px', borderRadius: 8, border: '1.5px solid', borderColor: hasImage ? '#818CF8' : '#E5E7EB', backgroundColor: hasImage ? '#EEF2FF' : '#F9FAFB', color: hasImage ? '#4F46E5' : '#9CA3AF', cursor: hasImage && !removingBg ? 'pointer' : 'not-allowed', fontSize: '0.75rem', fontWeight: '700', marginBottom: 12, transition: 'all 0.15s' }}>
        {removingBg
          ? <><Loader size={13} style={{ animation: 'spin 0.8s linear infinite' }} /> Procesando...</>
          : <><Eraser size={13} /> Quitar fondo</>
        }
      </button>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>

      {/* Filter presets */}
      <p style={sLabel}>Filtros predefinidos</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 12 }}>
        {FILTER_PRESETS.map(p => (
          <button key={p.name} onClick={() => setAdj(p.values)}
            style={{ padding: '4px 8px', borderRadius: 5, border: '1px solid #E5E7EB', backgroundColor: JSON.stringify(adj) === JSON.stringify(p.values) ? '#FF6835' : '#fff', color: JSON.stringify(adj) === JSON.stringify(p.values) ? '#fff' : '#374151', cursor: 'pointer', fontSize: '0.65rem', fontWeight: '600' }}>
            {p.name}
          </button>
        ))}
      </div>

      {/* Adjustments */}
      <p style={sLabel}>Ajustes</p>
      {S('brightness', 'Brillo', 0, 200)}
      {S('contrast', 'Contraste', 0, 200)}
      {S('saturation', 'Saturación', 0, 200)}
      {S('hue', 'Tono', -180, 180)}
      {S('sepia', 'Sepia', 0, 100)}
      {S('blur', 'Desenfoque', 0, 20)}
      {S('opacity', 'Opacidad', 10, 100)}

      <button onClick={() => setAdj(DEFAULT_ADJ)}
        style={{ width: '100%', padding: '6px', borderRadius: 7, border: '1px solid #E5E7EB', backgroundColor: '#F9FAFB', color: '#6B7280', cursor: 'pointer', fontSize: '0.72rem', fontWeight: '600' }}>
        ↺ Restablecer ajustes
      </button>
    </div>
  );
}

/* ─────────────────────────────── CANVAS ─────────────────────────────────── */
function ImageCanvas({
  imageSrc, adj, rotation, setRotation, flipH, setFlipH, flipV, setFlipV,
  zoom, onZoom, onLoad, imgDims,
}: {
  imageSrc: string | null; adj: Adjustments;
  rotation: number; setRotation: (r: number) => void;
  flipH: boolean; setFlipH: (v: boolean) => void;
  flipV: boolean; setFlipV: (v: boolean) => void;
  zoom: number; onZoom: (z: number) => void;
  onLoad: (w: number, h: number) => void;
  imgDims: { w: number; h: number } | null;
}) {
  const canvasAreaRef = useRef<HTMLDivElement>(null);
  const [frameSize, setFrameSize] = useState(400);

  /* Compute frame size based on container */
  useEffect(() => {
    const el = canvasAreaRef.current;
    if (!el) return;
    const update = () => {
      const { width, height } = el.getBoundingClientRect();
      setFrameSize(Math.min(width - 40, height - 160));
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const transform = [
    `rotate(${rotation}deg)`,
    `scaleX(${flipH ? -1 : 1})`,
    `scaleY(${flipV ? -1 : 1})`,
  ].join(' ');

  const aspectLabel = imgDims ? aspectRatioStr(imgDims.w, imgDims.h) : null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>

      {/* ── Toolbar ── */}
      <div style={{ height: 44, backgroundColor: '#fff', borderBottom: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', padding: '0 10px', gap: 6, flexShrink: 0, flexWrap: 'nowrap', overflowX: 'auto' }}>

        {/* Zoom */}
        <button onClick={() => onZoom(Math.max(25, zoom - 10))} style={tbBtn}><ZoomOut size={13} /></button>
        <span style={tbVal}>{zoom}%</span>
        <button onClick={() => onZoom(Math.min(200, zoom + 10))} style={tbBtn}><ZoomIn size={13} /></button>
        <input type="range" min={25} max={200} step={5} value={zoom}
          onChange={e => onZoom(Number(e.target.value))}
          style={{ width: 72, accentColor: '#FF6835', cursor: 'pointer', flexShrink: 0 }} />
        <button onClick={() => onZoom(100)} style={{ ...tbBtn, fontSize: '0.63rem', fontWeight: '700', padding: '4px 7px', width: 'auto', minWidth: 28 }}>1:1</button>

        {/* Separator */}
        <div style={tbSep} />

        {/* Rotation dial */}
        <button onClick={() => setRotation((rotation - 1 + 360) % 360)} style={tbBtn}><RotateCcw size={13} /></button>
        <span style={tbVal}>{rotation}°</span>
        <button onClick={() => setRotation((rotation + 1) % 360)} style={tbBtn}><RotateCw size={13} /></button>
        <input type="range" min={0} max={359} step={1} value={rotation}
          onChange={e => setRotation(Number(e.target.value))}
          style={{ width: 72, accentColor: '#FF6835', cursor: 'pointer', flexShrink: 0 }} />
        <button onClick={() => setRotation(0)} style={{ ...tbBtn, fontSize: '0.63rem', fontWeight: '700', padding: '4px 7px', width: 'auto', minWidth: 28 }}>0°</button>

        {/* Separator */}
        <div style={tbSep} />

        {/* Flip */}
        <button onClick={() => setFlipH(!flipH)}
          title="Flip Horizontal"
          style={{ ...tbBtn, backgroundColor: flipH ? '#EFF6FF' : '#fff', color: flipH ? '#3B82F6' : '#374151', border: `1px solid ${flipH ? '#BFDBFE' : '#E5E7EB'}` }}>
          <FlipHorizontal size={14} />
        </button>
        <button onClick={() => setFlipV(!flipV)}
          title="Flip Vertical"
          style={{ ...tbBtn, backgroundColor: flipV ? '#EFF6FF' : '#fff', color: flipV ? '#3B82F6' : '#374151', border: `1px solid ${flipV ? '#BFDBFE' : '#E5E7EB'}` }}>
          <FlipVertical size={14} />
        </button>

        {/* Separator + Aspect ratio */}
        {aspectLabel && (
          <>
            <div style={tbSep} />
            <span style={{ fontSize: '0.68rem', fontWeight: '700', color: '#6B7280', whiteSpace: 'nowrap', userSelect: 'none' }}>
              {aspectLabel}
            </span>
            {imgDims && (
              <span style={{ fontSize: '0.65rem', color: '#9CA3AF', whiteSpace: 'nowrap', userSelect: 'none' }}>
                {imgDims.w}×{imgDims.h}
              </span>
            )}
          </>
        )}
      </div>

      {/* ── Canvas area ── */}
      <div
        ref={canvasAreaRef}
        style={{ flex: 1, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#C8C8C8', position: 'relative' }}
      >
        {/* 1200×1200 frame */}
        <div style={{
          width: frameSize, height: frameSize,
          flexShrink: 0,
          backgroundColor: '#fff',
          backgroundImage: 'repeating-conic-gradient(#D1D5DB 0% 25%, transparent 0% 50%)',
          backgroundSize: '20px 20px',
          position: 'relative',
          boxShadow: '0 2px 16px rgba(0,0,0,0.18)',
          overflow: 'hidden',
        }}>
          {/* Frame label */}
          <div style={{ position: 'absolute', bottom: 6, right: 8, fontSize: '0.6rem', fontWeight: '700', color: 'rgba(0,0,0,0.3)', pointerEvents: 'none', userSelect: 'none', letterSpacing: '0.05em' }}>
            1200 × 1200 px
          </div>

          {/* Image */}
          {imageSrc && (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
              <div style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'center', transition: 'transform 0.12s' }}>
                <img
                  src={imageSrc} alt="editor"
                  onLoad={e => { const img = e.currentTarget; onLoad(img.naturalWidth, img.naturalHeight); }}
                  style={{ maxWidth: frameSize, maxHeight: frameSize, display: 'block', transform, filter: buildFilter(adj) }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Empty state (shown only when no image AND overlay inside frame already shows nothing) */}
        {!imageSrc && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
            <div style={{ fontSize: '3.5rem', marginBottom: 10 }}>🖼️</div>
            <p style={{ fontSize: '0.88rem', fontWeight: '700', color: '#fff', margin: '0 0 4px', textShadow: '0 1px 4px rgba(0,0,0,0.3)' }}>Sin imagen cargada</p>
            <p style={{ fontSize: '0.75rem', margin: 0, color: 'rgba(255,255,255,0.75)', textShadow: '0 1px 3px rgba(0,0,0,0.25)' }}>Usá "Cargar imagen" o arrastrá un archivo aquí</p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────── PROPERTIES ─────────────────────────────── */
function PropertiesPanel({ imageSrc, adj, rotation, flipH, flipV, imgDims, onExport }: {
  imageSrc: string | null; adj: Adjustments; rotation: number; flipH: boolean; flipV: boolean;
  imgDims: { w: number; h: number } | null; onExport: (format: 'png' | 'jpeg', quality: number) => void;
}) {
  const [format, setFormat] = useState<'png' | 'jpeg'>('png');
  const [quality, setQuality] = useState(90);

  const activeFilters = Object.entries(adj).filter(([k, v]) => v !== (DEFAULT_ADJ as Record<string, number>)[k]).length;

  return (
    <div>
      {imgDims && (
        <>
          <p style={pLabel}>Dimensiones</p>
          <p style={{ fontSize: '0.78rem', color: '#111827', fontWeight: '700', marginBottom: 4 }}>{imgDims.w} × {imgDims.h} px</p>
          <p style={{ fontSize: '0.68rem', color: '#9CA3AF', marginBottom: 8 }}>{aspectRatioStr(imgDims.w, imgDims.h)}</p>
        </>
      )}

      <p style={pLabel}>Estado actual</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 12 }}>
        {rotation > 0 && <Chip color="#FF6835">↻ {rotation}°</Chip>}
        {flipH && <Chip color="#3B82F6">↔ Flip H</Chip>}
        {flipV && <Chip color="#3B82F6">↕ Flip V</Chip>}
        {activeFilters > 0 && <Chip color="#10B981">✓ {activeFilters} ajuste{activeFilters > 1 ? 's' : ''}</Chip>}
        {!rotation && !flipH && !flipV && activeFilters === 0 && <span style={{ fontSize: '0.72rem', color: '#9CA3AF' }}>Sin modificaciones</span>}
      </div>

      <p style={pLabel}>Exportar</p>
      <div style={{ display: 'flex', gap: 5, marginBottom: 8 }}>
        {(['png', 'jpeg'] as const).map(f => (
          <button key={f} onClick={() => setFormat(f)}
            style={{ flex: 1, padding: '6px', borderRadius: 6, border: `1.5px solid ${format === f ? '#FF6835' : '#E5E7EB'}`, backgroundColor: format === f ? '#FFF4F0' : '#fff', color: format === f ? '#FF6835' : '#374151', cursor: 'pointer', fontSize: '0.72rem', fontWeight: '700', textTransform: 'uppercase' }}>
            .{f === 'jpeg' ? 'JPG' : 'PNG'}
          </button>
        ))}
      </div>
      {format === 'jpeg' && (
        <div style={{ marginBottom: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
            <label style={{ fontSize: '0.68rem', fontWeight: '600', color: '#374151' }}>Calidad</label>
            <span style={{ fontSize: '0.68rem', color: '#9CA3AF' }}>{quality}%</span>
          </div>
          <input type="range" min={10} max={100} step={5} value={quality} onChange={e => setQuality(Number(e.target.value))}
            style={{ width: '100%', accentColor: '#FF6835', cursor: 'pointer', height: 3 }} />
        </div>
      )}
      <button onClick={() => imageSrc && onExport(format, quality)} disabled={!imageSrc}
        style={{ width: '100%', padding: '9px', borderRadius: 8, border: 'none', backgroundColor: imageSrc ? '#FF6835' : '#E5E7EB', color: imageSrc ? '#fff' : '#9CA3AF', cursor: imageSrc ? 'pointer' : 'not-allowed', fontSize: '0.78rem', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
        <Download size={13} /> Descargar .{format === 'jpeg' ? 'JPG' : 'PNG'}
      </button>
      {!imageSrc && <p style={{ fontSize: '0.7rem', color: '#9CA3AF', textAlign: 'center', marginTop: 8 }}>Cargá una imagen para exportar</p>}
    </div>
  );
}

/* ── Shared style tokens ── */
const Chip = ({ children, color }: { children: React.ReactNode; color: string }) => (
  <span style={{ padding: '2px 7px', borderRadius: 4, backgroundColor: `${color}15`, color, fontSize: '0.65rem', fontWeight: '700' }}>{children}</span>
);
const sLabel: React.CSSProperties = { fontSize: '0.6rem', fontWeight: '800', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 6px' };
const pLabel: React.CSSProperties = { fontSize: '0.62rem', fontWeight: '700', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 4px' };
const tbBtn: React.CSSProperties = { width: 28, height: 28, borderRadius: 6, border: '1px solid #E5E7EB', backgroundColor: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#374151', flexShrink: 0 };
const tbVal: React.CSSProperties = { fontSize: '0.72rem', fontWeight: '700', color: '#374151', minWidth: 36, textAlign: 'center', userSelect: 'none', flexShrink: 0 };
const tbSep: React.CSSProperties = { width: 1, height: 20, backgroundColor: '#E5E7EB', margin: '0 2px', flexShrink: 0 };

/* ─────────────────────────────── MAIN ───────────────────────────────────── */
export function EditorImagenesWorkspace({ onNavigate }: Props) {
  const [imageSrc, setImageSrc]   = useState<string | null>(null);
  const [imageName, setImageName] = useState('imagen');
  const [adj, setAdj]             = useState<Adjustments>(DEFAULT_ADJ);
  const [rotation, setRotation]   = useState(0);
  const [flipH, setFlipH]         = useState(false);
  const [flipV, setFlipV]         = useState(false);
  const [zoom, setZoom]           = useState(100);
  const [imgDims, setImgDims]     = useState<{ w: number; h: number } | null>(null);
  const [removingBg, setRemovingBg] = useState(false);
  const fileRef                    = useRef<HTMLInputElement>(null);

  const handleFileLoad = (file: File) => {
    const reader = new FileReader();
    reader.onload = e => {
      setImageSrc(e.target?.result as string);
      setImageName(file.name.replace(/\.[^.]+$/, ''));
      setAdj(DEFAULT_ADJ); setRotation(0); setFlipH(false); setFlipV(false); setZoom(100);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) handleFileLoad(file);
  }, []);

  /* ── Remove Background ── */
  const handleRemoveBg = useCallback(() => {
    if (!imageSrc) return;
    setRemovingBg(true);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      const W = canvas.width, H = canvas.height;

      /* Sample background from all 4 corners (5×5 each) */
      const sample = (cx: number, cy: number) => {
        let r = 0, g = 0, b = 0, n = 0;
        for (let dy = -4; dy <= 4; dy++) {
          for (let dx = -4; dx <= 4; dx++) {
            const px = Math.max(0, Math.min(W - 1, cx + dx));
            const py = Math.max(0, Math.min(H - 1, cy + dy));
            const i = (py * W + px) * 4;
            r += data[i]; g += data[i + 1]; b += data[i + 2]; n++;
          }
        }
        return { r: r / n, g: g / n, b: b / n };
      };
      const corners = [sample(0, 0), sample(W - 1, 0), sample(0, H - 1), sample(W - 1, H - 1)];
      const bg = {
        r: corners.reduce((s, c) => s + c.r, 0) / 4,
        g: corners.reduce((s, c) => s + c.g, 0) / 4,
        b: corners.reduce((s, c) => s + c.b, 0) / 4,
      };

      const TOLERANCE = 42;
      const dist = (i: number) => {
        const dr = data[i] - bg.r, dg = data[i + 1] - bg.g, db = data[i + 2] - bg.b;
        return Math.sqrt(dr * dr + dg * dg + db * db);
      };

      /* Flood-fill from edges */
      const visited = new Uint8Array(W * H);
      const stack: number[] = [];
      for (let x = 0; x < W; x++) { stack.push(x, 0); stack.push(x, H - 1); }
      for (let y = 1; y < H - 1; y++) { stack.push(0, y); stack.push(W - 1, y); }

      while (stack.length > 0) {
        const y = stack.pop()!, x = stack.pop()!;
        if (x < 0 || x >= W || y < 0 || y >= H) continue;
        const idx = y * W + x;
        if (visited[idx]) continue;
        visited[idx] = 1;
        if (dist(idx * 4) <= TOLERANCE) {
          data[idx * 4 + 3] = 0;
          stack.push(x + 1, y, x - 1, y, x, y + 1, x, y - 1);
        }
      }

      ctx.putImageData(imageData, 0, 0);
      setImageSrc(canvas.toDataURL('image/png'));
      setRemovingBg(false);
    };
    img.onerror = () => setRemovingBg(false);
    img.src = imageSrc;
  }, [imageSrc]);

  /* ── Export ── */
  const handleExport = (format: 'png' | 'jpeg', quality: number) => {
    if (!imageSrc) return;
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth; canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d')!;
      ctx.filter = buildFilter(adj);
      const cx = canvas.width / 2, cy = canvas.height / 2;
      ctx.translate(cx, cy);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
      ctx.drawImage(img, -cx, -cy);
      const url = canvas.toDataURL(`image/${format}`, quality / 100);
      const a = document.createElement('a');
      a.href = url; a.download = `${imageName}.${format === 'jpeg' ? 'jpg' : 'png'}`; a.click();
    };
    img.src = imageSrc;
  };

  return (
    <>
      <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }}
        onChange={e => { const f = e.target.files?.[0]; if (f) handleFileLoad(f); }} />
      <WorkspaceShell
        toolId="editor-imagenes"
        onNavigate={onNavigate}
        leftPanel={
          <LeftPanel
            adj={adj} setAdj={setAdj}
            onUpload={() => fileRef.current?.click()}
            onRemoveBg={handleRemoveBg}
            removingBg={removingBg}
            hasImage={!!imageSrc}
          />
        }
        canvas={
          <div style={{ height: '100%' }} onDragOver={e => e.preventDefault()} onDrop={handleDrop}>
            <ImageCanvas
              imageSrc={imageSrc} adj={adj}
              rotation={rotation} setRotation={setRotation}
              flipH={flipH} setFlipH={setFlipH}
              flipV={flipV} setFlipV={setFlipV}
              zoom={zoom} onZoom={setZoom}
              onLoad={(w, h) => setImgDims({ w, h })}
              imgDims={imgDims}
            />
          </div>
        }
        properties={
          <PropertiesPanel
            imageSrc={imageSrc} adj={adj} rotation={rotation}
            flipH={flipH} flipV={flipV} imgDims={imgDims}
            onExport={handleExport}
          />
        }
        actions={imageSrc ? (
          <>
            <span style={{ fontSize: '0.68rem', color: '#71717A' }}>{imageName}</span>
            <button onClick={() => handleExport('png', 100)}
              style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '4px 10px', borderRadius: 5, border: 'none', backgroundColor: '#FF6835', color: '#fff', cursor: 'pointer', fontSize: '0.72rem', fontWeight: '700' }}>
              <Download size={12} /> Exportar
            </button>
          </>
        ) : undefined}
      />
    </>
  );
}
