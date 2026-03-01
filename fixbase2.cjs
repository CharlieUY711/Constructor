const fs = require('fs');
const path = require('path');
const dir = 'src/app/services';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.ts') && f !== 'syncManifest.ts');

let fixed = 0;
files.forEach(f => {
  const filepath = path.join(dir, f);
  let content = fs.readFileSync(filepath, 'utf8');
  const before = content;
  
  const lines = content.split('\n');
  const newLines = lines.map(line => {
    if (line.includes('const BASE =') && line.includes('projectId') && line.includes('supabase.co/functions/v1/api/')) {
      const match = line.match(/api\/([^]+)/);
      if (match) {
        return 'const BASE = ${apiUrl}/' + match[1] + ';';
      }
    }
    return line;
  });
  
  content = newLines.join('\n');
  if (content !== before) {
    fs.writeFileSync(filepath, content, 'utf8');
    fixed++;
    console.log('Fixed:', f);
  }
});
console.log('Total fixed:', fixed);
