const fs = require('fs');
const file = 'src/app/components/admin/AdminSidebar.tsx';
const raw = fs.readFileSync(file);
const content = raw[0] === 0xEF && raw[1] === 0xBB && raw[2] === 0xBF
  ? raw.slice(3).toString('utf8')
  : raw.toString('utf8');
fs.writeFileSync(file, content, 'utf8');
console.log('BOM eliminado. Primeros chars:', content.slice(0, 10));
