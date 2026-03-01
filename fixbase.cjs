const fs = require('fs');
const path = require('path');
const dir = 'src/app/services';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.ts') && f !== 'syncManifest.ts');

let fixed = 0;
files.forEach(f => {
  const filepath = path.join(dir, f);
  let content = fs.readFileSync(filepath, 'utf8');
  
  const before = content;
  // Reemplazar cualquier BASE que use projectId
  content = content.replace(
    /const BASE = https:\/\/\$\{projectId\}\.supabase\.co\/functions\/v1\/api\/(.+?);/g,
    (match, endpoint) => 'const BASE = ' + '/' + endpoint + ';'
  );

  if (content !== before) {
    fs.writeFileSync(filepath, content, 'utf8');
    fixed++;
    console.log('Fixed BASE:', f);
  }
});
console.log('Total fixed:', fixed);
