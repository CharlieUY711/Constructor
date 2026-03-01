const fs = require('fs');
const file = 'src/app/components/admin/AdminSidebar.tsx';
const raw = fs.readFileSync(file);
console.log('Primeros bytes:', raw[0].toString(16), raw[1].toString(16), raw[2].toString(16));
