const fs = require('fs');
const file = 'src/app/services/syncManifest.ts';
let content = fs.readFileSync(file, 'utf8');
content = content.replace(/\s*name: entry\.section,\r?\n/, '\n');
fs.writeFileSync(file, content, 'utf8');
console.log('Done');
console.log('Has name?', content.includes('name: entry.section'));
