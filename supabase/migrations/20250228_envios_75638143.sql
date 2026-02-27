-- ═══════════════════════════════════════════════════════════════════════════════
-- Tabla de Envíos — Módulo de Logística
-- Proyecto: qhnmxvexkizcsmivfuam
-- ═══════════════════════════════════════════════════════════════════════════════

-- Tabla principal de envíos
CREATE TABLE IF NOT EXISTS envios_75638143 (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  numero          text NOT NULL UNIQUE,  -- ENV-15000-001
  pedido_madre_id text,                  -- Referencia al pedido madre (puede ser UUID o número)
  numero_pedido   text,                  -- PED-15000 (para búsqueda rápida)
  
  -- Estado y tracking
  estado          text NOT NULL DEFAULT 'creado'
                  CHECK (estado IN ('creado','despachado','en_transito','en_deposito','en_reparto','entregado','fallido','devuelto')),
  tracking        text,                  -- Número de tracking del carrier
  
  -- Origen y destino
  origen          text NOT NULL,         -- Depósito Central — CABA
  destino         text NOT NULL,         -- Dirección completa
  destinatario    text NOT NULL,         -- Nombre del destinatario
  telefono        text,                  -- Teléfono del destinatario
  email           text,                  -- Email del destinatario
  
  -- Geocodificación (para Google Maps)
  lat_origen      numeric(10, 8),
  lng_origen      numeric(11, 8),
  lat_destino     numeric(10, 8),
  lng_destino     numeric(11, 8),
  
  -- Carrier y tramo
  carrier         text NOT NULL,         -- Correo Argentino, Andreani, OCA, etc.
  tramo           text NOT NULL DEFAULT 'local'
                  CHECK (tramo IN ('local','intercity','internacional','last_mile')),
  
  -- Multi-tramo (para envíos complejos)
  es_multi_tramo  boolean DEFAULT false,
  tramos          jsonb,                 -- Array de tramos: [{carrier, tramo, estado, fecha_estimada}]
  
  -- Dimensiones y peso
  peso            numeric(10, 2) DEFAULT 0,
  bultos          int DEFAULT 1,
  volumen         numeric(10, 2),        -- m³
  
  -- Fechas
  fecha_creacion  timestamptz DEFAULT now(),
  fecha_despacho  timestamptz,
  fecha_estimada  date,
  fecha_entrega   timestamptz,
  
  -- Acuse de recibo
  acuse_recibido  boolean DEFAULT false,
  acuse_fecha     timestamptz,
  acuse_firmado_por text,               -- Transportista o destinatario
  acuse_firma_url text,                 -- URL de la imagen de la firma
  
  -- Notas y metadata
  notas           text,
  metadata        jsonb,                 -- Datos adicionales flexibles
  
  created_at      timestamptz DEFAULT now(),
  updated_at      timestamptz DEFAULT now()
);

-- Tabla de eventos de tracking (historial de seguimiento)
CREATE TABLE IF NOT EXISTS envios_eventos_75638143 (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  envio_id        uuid NOT NULL REFERENCES envios_75638143(id) ON DELETE CASCADE,
  estado          text NOT NULL,
  descripcion     text NOT NULL,
  ubicacion       text,
  lat             numeric(10, 8),
  lng             numeric(11, 8),
  fecha           timestamptz DEFAULT now(),
  origen          text DEFAULT 'sistema'  -- 'sistema', 'carrier', 'manual'
                  CHECK (origen IN ('sistema','carrier','manual')),
  created_at      timestamptz DEFAULT now()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_envios_pedido_madre ON envios_75638143(pedido_madre_id);
CREATE INDEX IF NOT EXISTS idx_envios_numero_pedido ON envios_75638143(numero_pedido);
CREATE INDEX IF NOT EXISTS idx_envios_estado ON envios_75638143(estado);
CREATE INDEX IF NOT EXISTS idx_envios_carrier ON envios_75638143(carrier);
CREATE INDEX IF NOT EXISTS idx_envios_tramo ON envios_75638143(tramo);
CREATE INDEX IF NOT EXISTS idx_envios_fecha_creacion ON envios_75638143(fecha_creacion DESC);
CREATE INDEX IF NOT EXISTS idx_envios_eventos_envio ON envios_eventos_75638143(envio_id);
CREATE INDEX IF NOT EXISTS idx_envios_eventos_fecha ON envios_eventos_75638143(fecha DESC);

-- RLS
ALTER TABLE envios_75638143 ENABLE ROW LEVEL SECURITY;
ALTER TABLE envios_eventos_75638143 ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
DROP POLICY IF EXISTS "service_role_envios" ON envios_75638143;
CREATE POLICY "service_role_envios" ON envios_75638143 FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "service_role_envios_eventos" ON envios_eventos_75638143;
CREATE POLICY "service_role_envios_eventos" ON envios_eventos_75638143 FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Trigger para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_envios_updated_at ON envios_75638143;
CREATE TRIGGER update_envios_updated_at
  BEFORE UPDATE ON envios_75638143
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
