const fs = require('fs');
const content = fs.readFileSync('src/app/services/pedidosApi.ts', 'utf8');
const lines = content.split('\n');
const baseLine = lines.find(l => l.includes('const BASE'));
console.log('Exact:', JSON.stringify(baseLine));
console.log('Hex:', Buffer.from(baseLine).toString('hex').match(/../g).join(' '));
