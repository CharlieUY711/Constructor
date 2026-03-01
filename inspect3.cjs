const fs = require('fs');
const content = fs.readFileSync('src/app/services/pedidosApi.ts', 'utf8');
const lines = content.split('\n');
lines.forEach((line, i) => {
  if (i >= 4 && i <= 8) {
    console.log(i+1, JSON.stringify(line));
  }
});
