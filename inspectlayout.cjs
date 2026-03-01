const fs = require('fs');
const lines = fs.readFileSync('src/app/components/admin/ChecklistRoadmap.tsx', 'utf8').split('\n');
// Buscar el return principal y la estructura del layout
lines.forEach((line, i) => {
  if (/return\s*\(|<div|panel|Panel|aside|sidebar|flex|layout/i.test(line) && i < 250) {
    console.log(i+1, line.trim());
  }
});
