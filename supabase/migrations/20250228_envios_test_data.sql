-- ═══════════════════════════════════════════════════════════════════════════════
-- Datos de prueba para Envíos — Módulo de Logística
-- Proyecto: qhnmxvexkizcsmivfuam
-- ═══════════════════════════════════════════════════════════════════════════════

-- Limpiar datos existentes (opcional, comentar si quieres mantener datos)
-- DELETE FROM envios_eventos_75638143;
-- DELETE FROM envios_75638143;

-- ── Envío 1: En reparto (local) ───────────────────────────────────────────────
INSERT INTO envios_75638143 (
  numero, pedido_madre_id, numero_pedido, estado, tracking,
  origen, destino, destinatario, telefono, email,
  carrier, tramo, peso, bultos,
  fecha_creacion, fecha_despacho, fecha_estimada
) VALUES (
  'ENV-15000-001',
  'pm1',
  'PED-15000',
  'en_reparto',
  'CA123456789AR',
  'Depósito Central — CABA',
  'Av. Corrientes 2145, CABA',
  'Martín García',
  '+5491123456789',
  'martin.garcia@example.com',
  'Correo Argentino',
  'local',
  1.2,
  2,
  '2024-01-15 10:30:00',
  '2024-01-15 14:00:00',
  '2024-01-17'
) ON CONFLICT (numero) DO NOTHING
RETURNING id;

-- Eventos del envío 1
DO $$
DECLARE
  envio_id_1 uuid;
BEGIN
  SELECT id INTO envio_id_1 FROM envios_75638143 WHERE numero = 'ENV-15000-001';
  
  IF envio_id_1 IS NOT NULL THEN
    INSERT INTO envios_eventos_75638143 (envio_id, estado, descripcion, ubicacion, fecha, origen) VALUES
      (envio_id_1, 'en_reparto', 'Salió para entrega', 'CABA Sur', '2024-01-17 09:15:00', 'carrier'),
      (envio_id_1, 'en_deposito', 'Llegó al centro de distribución', 'CABA Centro', '2024-01-16 18:30:00', 'carrier'),
      (envio_id_1, 'despachado', 'Despachado desde depósito', 'Depósito Central', '2024-01-15 14:00:00', 'sistema'),
      (envio_id_1, 'creado', 'Envío creado', 'Sistema', '2024-01-15 10:30:00', 'sistema');
  END IF;
END $$;

-- ── Envío 2: Despachado (intercity) ───────────────────────────────────────────
INSERT INTO envios_75638143 (
  numero, pedido_madre_id, numero_pedido, estado, tracking,
  origen, destino, destinatario, telefono,
  carrier, tramo, peso, bultos,
  fecha_creacion, fecha_despacho, fecha_estimada
) VALUES (
  'ENV-15000-002',
  'pm1',
  'PED-15000',
  'despachado',
  'AND789012',
  'Depósito Central — CABA',
  'Rivadavia 890, Córdoba',
  'Martín García (Cba)',
  '+5493512345678',
  'Andreani',
  'intercity',
  3.5,
  1,
  '2024-01-15 10:30:00',
  '2024-01-15 15:00:00',
  '2024-01-19'
) ON CONFLICT (numero) DO NOTHING
RETURNING id;

-- Eventos del envío 2
DO $$
DECLARE
  envio_id_2 uuid;
BEGIN
  SELECT id INTO envio_id_2 FROM envios_75638143 WHERE numero = 'ENV-15000-002';
  
  IF envio_id_2 IS NOT NULL THEN
    INSERT INTO envios_eventos_75638143 (envio_id, estado, descripcion, ubicacion, fecha, origen) VALUES
      (envio_id_2, 'despachado', 'En camino a Córdoba', 'CABA', '2024-01-15 15:00:00', 'sistema'),
      (envio_id_2, 'creado', 'Envío creado', 'Sistema', '2024-01-15 10:30:00', 'sistema');
  END IF;
END $$;

-- ── Envío 3: Entregado (local) ────────────────────────────────────────────────
INSERT INTO envios_75638143 (
  numero, pedido_madre_id, numero_pedido, estado, tracking,
  origen, destino, destinatario, telefono,
  carrier, tramo, peso, bultos,
  fecha_creacion, fecha_despacho, fecha_estimada, fecha_entrega,
  acuse_recibido, acuse_fecha, acuse_firmado_por
) VALUES (
  'ENV-15001-001',
  'pm2',
  'PED-15001',
  'entregado',
  'OCA456789',
  'Depósito Norte — GBA',
  'Mitre 340, San Isidro',
  'Sofía Rodríguez',
  '+5491123456789',
  'OCA',
  'local',
  0.8,
  1,
  '2024-01-12 09:00:00',
  '2024-01-12 14:00:00',
  '2024-01-14',
  '2024-01-14 11:22:00',
  true,
  '2024-01-14 11:22:00',
  'Sofía Rodríguez'
) ON CONFLICT (numero) DO NOTHING
RETURNING id;

-- Eventos del envío 3
DO $$
DECLARE
  envio_id_3 uuid;
BEGIN
  SELECT id INTO envio_id_3 FROM envios_75638143 WHERE numero = 'ENV-15001-001';
  
  IF envio_id_3 IS NOT NULL THEN
    INSERT INTO envios_eventos_75638143 (envio_id, estado, descripcion, ubicacion, fecha, origen) VALUES
      (envio_id_3, 'entregado', 'Entregado al destinatario', 'San Isidro', '2024-01-14 11:22:00', 'carrier'),
      (envio_id_3, 'en_reparto', 'En reparto local', 'GBA Norte', '2024-01-14 08:00:00', 'carrier'),
      (envio_id_3, 'en_deposito', 'En sucursal San Isidro', 'San Isidro', '2024-01-13 20:00:00', 'carrier'),
      (envio_id_3, 'despachado', 'Despachado', 'Depósito Norte', '2024-01-12 14:00:00', 'sistema'),
      (envio_id_3, 'creado', 'Envío creado', 'Sistema', '2024-01-12 09:00:00', 'sistema');
  END IF;
END $$;

-- ── Envío 4: En tránsito (intercity) ───────────────────────────────────────────
INSERT INTO envios_75638143 (
  numero, pedido_madre_id, numero_pedido, estado, tracking,
  origen, destino, destinatario,
  carrier, tramo, peso, bultos,
  fecha_creacion, fecha_despacho, fecha_estimada
) VALUES (
  'ENV-15002-001',
  'pm3',
  'PED-15002',
  'en_transito',
  'FDX334455',
  'Depósito Central — CABA',
  'Las Heras 1200, Mendoza',
  'Empresa Textil S.A.',
  'Fedex',
  'intercity',
  12.5,
  4,
  '2024-01-14 16:00:00',
  '2024-01-15 22:00:00',
  '2024-01-20'
) ON CONFLICT (numero) DO NOTHING
RETURNING id;

-- Eventos del envío 4
DO $$
DECLARE
  envio_id_4 uuid;
BEGIN
  SELECT id INTO envio_id_4 FROM envios_75638143 WHERE numero = 'ENV-15002-001';
  
  IF envio_id_4 IS NOT NULL THEN
    INSERT INTO envios_eventos_75638143 (envio_id, estado, descripcion, ubicacion, fecha, origen) VALUES
      (envio_id_4, 'en_transito', 'En ruta Mendoza', 'San Luis', '2024-01-16 06:30:00', 'carrier'),
      (envio_id_4, 'despachado', 'Salió hacia Mendoza', 'CABA', '2024-01-15 22:00:00', 'sistema'),
      (envio_id_4, 'creado', 'Envío creado', 'Sistema', '2024-01-14 16:00:00', 'sistema');
  END IF;
END $$;

-- ── Envío 5: Creado (pendiente) ────────────────────────────────────────────────
INSERT INTO envios_75638143 (
  numero, pedido_madre_id, numero_pedido, estado,
  origen, destino, destinatario,
  carrier, tramo, peso, bultos,
  fecha_creacion, fecha_estimada
) VALUES (
  'ENV-15002-002',
  'pm3',
  'PED-15002',
  'creado',
  'Depósito Central — CABA',
  'Av. San Martín 500, Rosario',
  'Empresa Textil S.A. — Suc. Rosario',
  'Andreani',
  'intercity',
  8.0,
  3,
  '2024-01-16 17:00:00',
  '2024-01-19'
) ON CONFLICT (numero) DO NOTHING
RETURNING id;

-- Eventos del envío 5
DO $$
DECLARE
  envio_id_5 uuid;
BEGIN
  SELECT id INTO envio_id_5 FROM envios_75638143 WHERE numero = 'ENV-15002-002';
  
  IF envio_id_5 IS NOT NULL THEN
    INSERT INTO envios_eventos_75638143 (envio_id, estado, descripcion, ubicacion, fecha, origen) VALUES
      (envio_id_5, 'creado', 'Envío creado', 'Sistema', '2024-01-16 17:00:00', 'sistema');
  END IF;
END $$;

-- ── Envío 6: Fallido (requiere atención) ──────────────────────────────────────
INSERT INTO envios_75638143 (
  numero, pedido_madre_id, numero_pedido, estado, tracking,
  origen, destino, destinatario,
  carrier, tramo, peso, bultos,
  fecha_creacion, fecha_estimada, notas
) VALUES (
  'ENV-15002-003',
  'pm3',
  'PED-15002',
  'fallido',
  'DHL889900',
  'Depósito Norte — GBA',
  'Urquiza 88, Tucumán',
  'Punto de entrega Tucumán',
  'DHL',
  'intercity',
  5.0,
  2,
  '2024-01-10 12:00:00',
  '2024-01-15',
  'Dirección incorrecta — devolver'
) ON CONFLICT (numero) DO NOTHING
RETURNING id;

-- Eventos del envío 6
DO $$
DECLARE
  envio_id_6 uuid;
BEGIN
  SELECT id INTO envio_id_6 FROM envios_75638143 WHERE numero = 'ENV-15002-003';
  
  IF envio_id_6 IS NOT NULL THEN
    INSERT INTO envios_eventos_75638143 (envio_id, estado, descripcion, ubicacion, fecha, origen) VALUES
      (envio_id_6, 'fallido', 'Dirección incorrecta — devolver', 'Tucumán', '2024-01-15 14:00:00', 'carrier'),
      (envio_id_6, 'en_reparto', 'Intentando entrega', 'Tucumán', '2024-01-13 09:00:00', 'carrier'),
      (envio_id_6, 'en_transito', 'En tránsito', 'Santiago del Estero', '2024-01-12 20:00:00', 'carrier'),
      (envio_id_6, 'despachado', 'Despachado', 'Depósito Norte', '2024-01-10 14:00:00', 'sistema'),
      (envio_id_6, 'creado', 'Envío creado', 'Sistema', '2024-01-10 12:00:00', 'sistema');
  END IF;
END $$;

-- ── Envío 7: En depósito (local) ────────────────────────────────────────────────
INSERT INTO envios_75638143 (
  numero, pedido_madre_id, numero_pedido, estado, tracking,
  origen, destino, destinatario,
  carrier, tramo, peso, bultos,
  fecha_creacion, fecha_despacho, fecha_estimada
) VALUES (
  'ENV-15003-001',
  'pm4',
  'PED-15003',
  'en_deposito',
  'CA987654321AR',
  'Depósito Sur — CABA',
  'Remedios de Escalada 234, Lomas de Zamora',
  'Lucas Fernández',
  'Correo Argentino',
  'local',
  0.5,
  1,
  '2024-01-16 12:00:00',
  '2024-01-16 16:00:00',
  '2024-01-18'
) ON CONFLICT (numero) DO NOTHING
RETURNING id;

-- Eventos del envío 7
DO $$
DECLARE
  envio_id_7 uuid;
BEGIN
  SELECT id INTO envio_id_7 FROM envios_75638143 WHERE numero = 'ENV-15003-001';
  
  IF envio_id_7 IS NOT NULL THEN
    INSERT INTO envios_eventos_75638143 (envio_id, estado, descripcion, ubicacion, fecha, origen) VALUES
      (envio_id_7, 'en_deposito', 'En sucursal Lomas', 'Lomas de Zamora', '2024-01-17 08:00:00', 'carrier'),
      (envio_id_7, 'despachado', 'Despachado', 'Depósito Sur', '2024-01-16 16:00:00', 'sistema'),
      (envio_id_7, 'creado', 'Envío creado', 'Sistema', '2024-01-16 12:00:00', 'sistema');
  END IF;
END $$;

-- Verificar datos insertados
SELECT 
  numero,
  estado,
  carrier,
  tramo,
  destinatario,
  (SELECT COUNT(*) FROM envios_eventos_75638143 WHERE envio_id = envios_75638143.id) as eventos_count
FROM envios_75638143
ORDER BY fecha_creacion DESC;
