const fs = require('fs');
const path = require('path');
const dir = 'src/app/services';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.ts'));
files.forEach(f => {
  const content = fs.readFileSync(path.join(dir, f), 'utf8');
  if (content.includes('projectId') || content.includes('supabase.co/functions')) {
    console.log('PENDIENTE:', f);
  }
});
console.log('Verificacion completa');
