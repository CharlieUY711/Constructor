const fs = require('fs');
const content = fs.readFileSync('src/app/utils/moduleManifest.ts', 'utf8');
const matches = content.match(/section:\s*['"]([^'"]+)['"]/g);
const logistica = matches
  .map(m => m.replace(/section:\s*['"]/, '').replace(/['"]/, ''))
  .filter(m => ['logistica','envios','transportistas','rutas','fulfillment',
    'produccion','abastecimiento','mapa-envios','tracking-publico',
    'metodos-envio','couriers'].includes(m));
console.log('M?dulos log?sticos en manifest:', logistica);
