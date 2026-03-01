const fs = require('fs');
const file = 'src/app/components/admin/AdminSidebar.tsx';
const raw = fs.readFileSync(file);
console.log('Primeros 10 bytes:', Array.from(raw.slice(0,10)).map(b => b.toString(16).padStart(2,'0')).join(' '));
console.log('Tama?o:', raw.length);
