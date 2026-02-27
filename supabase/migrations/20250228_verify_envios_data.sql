-- ═══════════════════════════════════════════════════════════════════════════════
-- Script de verificación — Verificar que los datos de envíos estén presentes
-- ═══════════════════════════════════════════════════════════════════════════════

-- Verificar que las tablas existen
SELECT 
  'Tablas' as tipo,
  COUNT(*) as cantidad
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('envios_75638143', 'envios_eventos_75638143');

-- Contar envíos
SELECT 
  'Envíos totales' as tipo,
  COUNT(*) as cantidad
FROM envios_75638143;

-- Contar eventos
SELECT 
  'Eventos totales' as tipo,
  COUNT(*) as cantidad
FROM envios_eventos_75638143;

-- Listar envíos con sus eventos
SELECT 
  e.numero,
  e.estado,
  e.carrier,
  e.tramo,
  e.destinatario,
  (SELECT COUNT(*) FROM envios_eventos_75638143 ev WHERE ev.envio_id = e.id) as eventos_count
FROM envios_75638143 e
ORDER BY e.fecha_creacion DESC
LIMIT 10;

-- Verificar políticas RLS
SELECT 
  schemaname,
  tablename,
  policyname,
  roles
FROM pg_policies
WHERE tablename IN ('envios_75638143', 'envios_eventos_75638143')
ORDER BY tablename, policyname;
