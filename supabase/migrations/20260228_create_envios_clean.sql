-- ═══════════════════════════════════════════════════════════════════════════════
-- Migración: envios_75638143 → envios (sin sufijo)
-- Regla del proyecto: CERO sufijos en nombres de tablas
-- ═══════════════════════════════════════════════════════════════════════════════

-- Crear tabla envios sin sufijo
CREATE TABLE IF NOT EXISTS envios (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  numero          text NOT NULL UNIQUE,  -- ENV-15000-001
  pedido_madre_id uuid,                  -- Referencia al pedido madre
  pedido_id       uuid,                   -- Referencia al pedido específico
  numero_pedido   text,                   -- PED-15000 (para búsqueda rápida)
  
  -- Estado y tracking
  estado          text NOT NULL DEFAULT 'pendiente'
                  CHECK (estado IN ('pendiente','preparando','en_camino','entregado','devuelto','cancelado','creado','despachado','en_transito','en_deposito','en_reparto','fallido')),
  tracking        text,                  -- Número de tracking del carrier
  tracking_number text,                  -- Alias para tracking
  
  -- Origen y destino
  origen          text,                  -- Depósito Central — CABA (texto o JSONB)
  destino         text,                  -- Dirección completa (texto o JSONB)
  destinatario    text,                  -- Nombre del destinatario
  telefono        text,                  -- Teléfono del destinatario
  email           text,                  -- Email del destinatario
  
  -- Geocodificación (para Google Maps)
  lat_origen      numeric(10, 8),
  lng_origen      numeric(11, 8),
  lat_destino     numeric(10, 8),
  lng_destino     numeric(11, 8),
  
  -- Carrier y tramo
  carrier         text,                  -- Correo Argentino, Andreani, OCA, etc.
  tramo           text DEFAULT 'local'
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
  acuse           jsonb,                 -- Datos completos del acuse
  
  -- Eventos y tracking
  eventos         jsonb DEFAULT '[]',    -- Array de eventos de tracking
  
  -- Notas y metadata
  notas           text,
  metadata        jsonb,                 -- Datos adicionales flexibles
  
  created_at      timestamptz DEFAULT now(),
  updated_at      timestamptz DEFAULT now()
);

-- Tabla de eventos de tracking (historial de seguimiento)
CREATE TABLE IF NOT EXISTS envios_eventos (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  envio_id        uuid NOT NULL REFERENCES envios(id) ON DELETE CASCADE,
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
CREATE INDEX IF NOT EXISTS idx_envios_pedido_madre ON envios(pedido_madre_id);
CREATE INDEX IF NOT EXISTS idx_envios_pedido_id ON envios(pedido_id);
CREATE INDEX IF NOT EXISTS idx_envios_numero_pedido ON envios(numero_pedido);
CREATE INDEX IF NOT EXISTS idx_envios_estado ON envios(estado);
CREATE INDEX IF NOT EXISTS idx_envios_carrier ON envios(carrier);
CREATE INDEX IF NOT EXISTS idx_envios_tramo ON envios(tramo);
CREATE INDEX IF NOT EXISTS idx_envios_fecha_creacion ON envios(fecha_creacion DESC);
CREATE INDEX IF NOT EXISTS idx_envios_eventos_envio ON envios_eventos(envio_id);
CREATE INDEX IF NOT EXISTS idx_envios_eventos_fecha ON envios_eventos(fecha DESC);

-- RLS
ALTER TABLE envios ENABLE ROW LEVEL SECURITY;
ALTER TABLE envios_eventos ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
DROP POLICY IF EXISTS "service_role_envios" ON envios;
CREATE POLICY "service_role_envios" ON envios FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "service_role_envios_eventos" ON envios_eventos;
CREATE POLICY "service_role_envios_eventos" ON envios_eventos FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Trigger para actualizar updated_at automáticamente
DROP TRIGGER IF EXISTS update_envios_updated_at ON envios;
CREATE TRIGGER update_envios_updated_at
  BEFORE UPDATE ON envios
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Migrar datos existentes desde la tabla con sufijo (si existe y tiene datos)
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'envios_75638143') THEN
    INSERT INTO envios (
      id, numero, pedido_madre_id, numero_pedido, estado, tracking, origen, destino,
      destinatario, telefono, email, lat_origen, lng_origen, lat_destino, lng_destino,
      carrier, tramo, es_multi_tramo, tramos, peso, bultos, volumen,
      fecha_creacion, fecha_despacho, fecha_estimada, fecha_entrega,
      acuse_recibido, acuse_fecha, acuse_firmado_por, acuse_firma_url,
      notas, metadata, created_at, updated_at
    )
    SELECT 
      id, numero, 
      CASE WHEN pedido_madre_id ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' 
           THEN pedido_madre_id::uuid ELSE NULL END as pedido_madre_id,
      numero_pedido, estado, tracking, origen, destino,
      destinatario, telefono, email, lat_origen, lng_origen, lat_destino, lng_destino,
      carrier, tramo, es_multi_tramo, tramos, peso, bultos, volumen,
      fecha_creacion, fecha_despacho, fecha_estimada, fecha_entrega,
      acuse_recibido, acuse_fecha, acuse_firmado_por, acuse_firma_url,
      notas, metadata, created_at, updated_at
    FROM envios_75638143
    ON CONFLICT (id) DO NOTHING;
    
    -- Migrar eventos
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'envios_eventos_75638143') THEN
      INSERT INTO envios_eventos (
        id, envio_id, estado, descripcion, ubicacion, lat, lng, fecha, origen, created_at
      )
      SELECT id, envio_id, estado, descripcion, ubicacion, lat, lng, fecha, origen, created_at
      FROM envios_eventos_75638143
      ON CONFLICT (id) DO NOTHING;
    END IF;
    
    RAISE NOTICE 'Datos migrados desde envios_75638143 a envios';
  ELSE
    RAISE NOTICE 'Tabla envios_75638143 no existe, se creó tabla envios vacía';
  END IF;
END $$;
