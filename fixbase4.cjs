const fs = require('fs');
const path = require('path');
const dir = 'src/app/services';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.ts') && f !== 'syncManifest.ts');

let fixed = 0;
files.forEach(f => {
  const filepath = path.join(dir, f);
  const raw = fs.readFileSync(filepath, 'utf8');
  const lines = raw.split('\n');
  let changed = false;
  
  // Filtrar l?neas que sean solo ";" suelto despu?s de un BASE
  const newLines = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].replace('\r', '');
    if (line.startsWith('const BASE =') && line.includes('') && !line.startsWith('const BASE = ')) {
      // Agregar backtick de apertura
      newLines.push('const BASE = ' + line.replace('const BASE = ', '') + '\r');
      changed = true;
    } else if (line.trim() === ';' && newLines.length > 0 && newLines[newLines.length-1].includes('const BASE =')) {
      // Saltar el ; suelto
      changed = true;
    } else {
      newLines.push(lines[i]);
    }
  }
  
  if (changed) {
    fs.writeFileSync(filepath, newLines.join('\n'), 'utf8');
    fixed++;
    console.log('Fixed:', f);
  }
});
console.log('Total fixed:', fixed);
