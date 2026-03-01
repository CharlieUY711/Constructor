const fs = require('fs');
const content = fs.readFileSync('src/app/utils/moduleManifest.ts', 'utf8');
const matches = content.match(/section:\s*['"]([^'"]+)['"]/g);
console.log('M?dulos encontrados:', matches ? matches.length : 0);
if (matches) matches.slice(0,5).forEach(m => console.log(' ', m));
