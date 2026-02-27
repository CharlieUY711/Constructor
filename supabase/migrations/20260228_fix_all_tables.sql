CREATE TABLE IF NOT EXISTS metodos_pago (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre text NOT NULL,
  tipo text NOT NULL CHECK (tipo IN ('pasarela', 'transferencia', 'efectivo', 'credito', 'otro')),
  proveedor text,
  descripcion text,
  instrucciones text,
  activo boolean NOT NULL DEFAULT true,
  orden integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_metodos_pago_activo ON metodos_pago(activo);
CREATE INDEX IF NOT EXISTS idx_metodos_pago_orden ON metodos_pago(orden);
CREATE INDEX IF NOT EXISTS idx_metodos_pago_tipo ON metodos_pago(tipo);

ALTER TABLE metodos_pago ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "service_role_metodos_pago" ON metodos_pago;
DROP POLICY IF EXISTS "authenticated_read_metodos_pago" ON metodos_pago;
DROP POLICY IF EXISTS "authenticated_full_metodos_pago" ON metodos_pago;
DROP POLICY IF EXISTS "anon_read_metodos_pago" ON metodos_pago;

CREATE POLICY "service_role_metodos_pago" 
  ON metodos_pago 
  FOR ALL 
  TO service_role 
  USING (true) 
  WITH CHECK (true);

CREATE POLICY "authenticated_read_metodos_pago" 
  ON metodos_pago 
  FOR SELECT 
  TO authenticated 
  USING (true);

CREATE POLICY "authenticated_full_metodos_pago" 
  ON metodos_pago 
  FOR ALL 
  TO authenticated 
  USING (true) 
  WITH CHECK (true);

CREATE POLICY "anon_read_metodos_pago" 
  ON metodos_pago 
  FOR SELECT 
  TO anon 
  USING (activo = true);

DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'envios') THEN
    DROP POLICY IF EXISTS "service_role_envios" ON envios;
    DROP POLICY IF EXISTS "authenticated_read_envios" ON envios;
    DROP POLICY IF EXISTS "authenticated_full_envios" ON envios;
    
    CREATE POLICY "service_role_envios" 
      ON envios 
      FOR ALL 
      TO service_role 
      USING (true) 
      WITH CHECK (true);
    
    CREATE POLICY "authenticated_read_envios" 
      ON envios 
      FOR SELECT 
      TO authenticated 
      USING (true);
    
    CREATE POLICY "authenticated_full_envios" 
      ON envios 
      FOR ALL 
      TO authenticated 
      USING (true) 
      WITH CHECK (true);
  END IF;
  
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'envios_75638143') THEN
    DROP POLICY IF EXISTS "service_role_envios" ON envios_75638143;
    DROP POLICY IF EXISTS "authenticated_read_envios" ON envios_75638143;
    DROP POLICY IF EXISTS "authenticated_full_envios" ON envios_75638143;
    
    CREATE POLICY "service_role_envios" 
      ON envios_75638143 
      FOR ALL 
      TO service_role 
      USING (true) 
      WITH CHECK (true);
    
    CREATE POLICY "authenticated_read_envios" 
      ON envios_75638143 
      FOR SELECT 
      TO authenticated 
      USING (true);
    
    CREATE POLICY "authenticated_full_envios" 
      ON envios_75638143 
      FOR ALL 
      TO authenticated 
      USING (true) 
      WITH CHECK (true);
  END IF;
  
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'envios_eventos') THEN
    DROP POLICY IF EXISTS "service_role_envios_eventos" ON envios_eventos;
    DROP POLICY IF EXISTS "authenticated_read_envios_eventos" ON envios_eventos;
    DROP POLICY IF EXISTS "authenticated_full_envios_eventos" ON envios_eventos;
    
    CREATE POLICY "service_role_envios_eventos" 
      ON envios_eventos 
      FOR ALL 
      TO service_role 
      USING (true) 
      WITH CHECK (true);
    
    CREATE POLICY "authenticated_read_envios_eventos" 
      ON envios_eventos 
      FOR SELECT 
      TO authenticated 
      USING (true);
    
    CREATE POLICY "authenticated_full_envios_eventos" 
      ON envios_eventos 
      FOR ALL 
      TO authenticated 
      USING (true) 
      WITH CHECK (true);
  END IF;
  
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'envios_eventos_75638143') THEN
    DROP POLICY IF EXISTS "service_role_envios_eventos" ON envios_eventos_75638143;
    DROP POLICY IF EXISTS "authenticated_read_envios_eventos" ON envios_eventos_75638143;
    DROP POLICY IF EXISTS "authenticated_full_envios_eventos" ON envios_eventos_75638143;
    
    CREATE POLICY "service_role_envios_eventos" 
      ON envios_eventos_75638143 
      FOR ALL 
      TO service_role 
      USING (true) 
      WITH CHECK (true);
    
    CREATE POLICY "authenticated_read_envios_eventos" 
      ON envios_eventos_75638143 
      FOR SELECT 
      TO authenticated 
      USING (true);
    
    CREATE POLICY "authenticated_full_envios_eventos" 
      ON envios_eventos_75638143 
      FOR ALL 
      TO authenticated 
      USING (true) 
      WITH CHECK (true);
  END IF;
END $$;

SELECT 
  'metodos_pago' as tabla,
  CASE 
    WHEN EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'metodos_pago')
    THEN 'EXISTE'
    ELSE 'NO EXISTE'
  END as estado,
  (SELECT COUNT(*) FROM metodos_pago) as registros,
  (SELECT COUNT(*) FROM pg_policies WHERE tablename = 'metodos_pago') as politicas;

SELECT 
  'envios' as tabla,
  CASE 
    WHEN EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'envios')
    THEN 'EXISTE'
    ELSE 'NO EXISTE'
  END as estado,
  (SELECT COUNT(*) FROM envios) as registros,
  (SELECT COUNT(*) FROM pg_policies WHERE tablename = 'envios') as politicas;

SELECT 
  'envios_75638143' as tabla,
  CASE 
    WHEN EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'envios_75638143')
    THEN 'EXISTE'
    ELSE 'NO EXISTE'
  END as estado,
  (SELECT COUNT(*) FROM envios_75638143) as registros,
  (SELECT COUNT(*) FROM pg_policies WHERE tablename = 'envios_75638143') as politicas;

SELECT 
  tablename,
  policyname,
  cmd,
  roles
FROM pg_policies
WHERE tablename IN ('metodos_pago', 'envios', 'envios_75638143', 'envios_eventos', 'envios_eventos_75638143')
ORDER BY tablename, policyname;
