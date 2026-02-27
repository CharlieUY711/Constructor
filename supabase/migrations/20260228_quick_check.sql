-- Verificación rápida del estado de las tablas

-- 1. Verificar metodos_pago
SELECT 
  'metodos_pago' as tabla,
  EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'metodos_pago') as existe,
  (SELECT COUNT(*) FROM metodos_pago) as registros,
  (SELECT COUNT(*) FROM pg_policies WHERE tablename = 'metodos_pago') as politicas_rls;

-- 2. Verificar envios_75638143
SELECT 
  'envios_75638143' as tabla,
  EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'envios_75638143') as existe,
  (SELECT COUNT(*) FROM envios_75638143) as registros,
  (SELECT COUNT(*) FROM pg_policies WHERE tablename = 'envios_75638143') as politicas_rls;

-- 3. Verificar envios_eventos_75638143
SELECT 
  'envios_eventos_75638143' as tabla,
  EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'envios_eventos_75638143') as existe,
  (SELECT COUNT(*) FROM envios_eventos_75638143) as registros,
  (SELECT COUNT(*) FROM pg_policies WHERE tablename = 'envios_eventos_75638143') as politicas_rls;

-- 4. Listar políticas RLS
SELECT 
  tablename,
  policyname,
  cmd,
  roles
FROM pg_policies
WHERE tablename IN ('metodos_pago', 'envios_75638143', 'envios_eventos_75638143')
ORDER BY tablename, policyname;
