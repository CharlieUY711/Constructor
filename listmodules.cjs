const fs = require('fs');
const content = fs.readFileSync('src/app/utils/moduleManifest.ts', 'utf8');
const matches = content.match(/section:\s*['"]([^'"]+)['"]/g);
matches.forEach(m => console.log(m.replace(/section:\s*['"]/, '').replace(/['"]/, '')));
