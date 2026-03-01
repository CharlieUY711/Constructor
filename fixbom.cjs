const fs = require('fs');
const file = 'src/app/components/admin/AdminSidebar.tsx';
let content = fs.readFileSync(file, 'utf8');
// Eliminar BOM si existe
if (content.charCodeAt(0) === 0xFEFF) {
  content = content.slice(1);
  console.log('BOM eliminado');
}
fs.writeFileSync(file, content, 'utf8');
console.log('Done');
