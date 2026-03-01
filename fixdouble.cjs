const fs = require('fs');
const file = 'src/app/components/admin/AdminSidebar.tsx';
const raw = fs.readFileSync(file);
// El archivo tiene encoding doble - decodificar como latin1 y re-encodear
let content = raw.toString('latin1');
// Eliminar BOM doble codificado
content = content.replace(/^\xef\xbb\xbf/, '');
// Re-encodear correctamente
const fixed = Buffer.from(content, 'latin1').toString('utf8');
// Eliminar cualquier BOM restante
const clean = fixed.charCodeAt(0) === 0xFEFF ? fixed.slice(1) : fixed;
fs.writeFileSync(file, clean, 'utf8');
console.log('Primeros chars:', clean.slice(0, 15));
