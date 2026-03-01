import { createClient } from '@supabase/supabase-js';

const projectId = "qhnmxvexkizcsmivfuam";
const publicAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFobm14dmV4a2l6Y3NtaXZmdWFtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEyMjEyODEsImV4cCI6MjA4Njc5NzI4MX0.Ifz4fJYldIGZFzhBK5PPxQeqdYzO2ZKNQ5uo8j2mYmM";
const supabaseUrl = `https://${projectId}.supabase.co`;

const supabase = createClient(supabaseUrl, publicAnonKey);

const query = `
SELECT table_name, column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name IN ('envios', 'transportistas', 'vehiculos', 'routes', 'route_stops', 'tramos', 'depositos', 'inventario', 'entregas')
ORDER BY table_name, ordinal_position;
`;

async function executeQuery() {
  try {
    // Try using RPC to execute raw SQL
    const { data, error } = await supabase.rpc('exec_sql', { sql_query: query });
    
    if (error) {
      // If RPC doesn't exist, try direct query (won't work for information_schema)
      console.error('RPC error:', error.message);
      console.log('\n⚠️  No se puede ejecutar esta consulta directamente con la clave anónima.');
      console.log('Por favor, ejecuta esta consulta en el SQL Editor de Supabase Dashboard:\n');
      console.log(query);
      return;
    }
    
    console.log('Resultados:');
    console.log(JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Error:', err.message);
    console.log('\n⚠️  Esta consulta requiere acceso directo a la base de datos.');
    console.log('Por favor, ejecuta esta consulta en el SQL Editor de Supabase Dashboard:\n');
    console.log(query);
  }
}

executeQuery();
