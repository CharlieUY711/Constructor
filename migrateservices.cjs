const fs = require('fs');
const path = require('path');
const dir = 'src/app/services';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.ts') && f !== 'syncManifest.ts');

files.forEach(f => {
  const filepath = path.join(dir, f);
  let content = fs.readFileSync(filepath, 'utf8');
  
  // Reemplazar import
  content = content.replace(
    /import \{ projectId, publicAnonKey \} from ['"]\/utils\/supabase\/info['"];/g,
    "import { apiUrl, publicAnonKey } from '../../utils/supabase/client';"
  );
  content = content.replace(
    /import \{ projectId, publicAnonKey \} from ['"]\.\.\/\.\.\/utils\/supabase\/info['"];/g,
    "import { apiUrl, publicAnonKey } from '../../utils/supabase/client';"
  );
  
  // Reemplazar BASE
  content = content.replace(
    /const BASE = https:\/\/\$\{projectId\}\.supabase\.co\/functions\/v1\/api\/([^]+);/g,
    "const BASE = \/;"
  );

  fs.writeFileSync(filepath, content, 'utf8');
  console.log('Migrado:', f);
});
