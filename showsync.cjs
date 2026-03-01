const fs = require('fs');
const file = 'src/app/services/syncManifest.ts';
let content = fs.readFileSync(file, 'utf8');
console.log(content);
