const fs = require('fs');
const file = 'src/app/components/admin/AdminSidebar.tsx';
const raw = fs.readFileSync(file);
// Saltar los 6 bytes del BOM doble-codificado: c3 af c2 bb c2 bf
const clean = raw.slice(6).toString('utf8');
fs.writeFileSync(file, clean, 'utf8');
console.log('Primeros chars:', clean.slice(0, 20));
