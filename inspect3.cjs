const fs = require('fs');
const lines = fs.readFileSync('src/app/components/admin/ChecklistRoadmap.tsx', 'utf8').split('\n');
[778, 831, 926, 1107].forEach(n => {
  console.log('\n--- L?nea', n, '---');
  for (let i = Math.max(0,n-5); i <= Math.min(lines.length-1, n+3); i++) {
    console.log(i+1, lines[i]);
  }
});
