const fs = require('fs');
const path = require('path');
const dir = 'src/app/services';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.ts') && f !== 'syncManifest.ts');

let fixed = 0;
files.forEach(f => {
  const filepath = path.join(dir, f);
  let content = fs.readFileSync(filepath, 'utf8');
  const before = content;
  
  // Corregir BASE mal formateado: agrega backtick de apertura y elimina ; extra
  content = content.replace(
    /const BASE = \$\{apiUrl\}\/([^\n]+);\s*\n;/g,
    (match, endpoint) => 'const BASE = ${apiUrl}/' + endpoint + ';\n'
  );

  if (content !== before) {
    fs.writeFileSync(filepath, content, 'utf8');
    fixed++;
    console.log('Fixed:', f);
  }
});
console.log('Total fixed:', fixed);
