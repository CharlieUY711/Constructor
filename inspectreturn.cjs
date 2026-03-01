const fs = require('fs');
const lines = fs.readFileSync('src/app/components/admin/ChecklistRoadmap.tsx', 'utf8').split('\n');
lines.forEach((line, i) => {
  if (i >= 780 && i <= 870) {
    console.log(i+1, line.trim());
  }
});
