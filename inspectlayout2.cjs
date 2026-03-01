const fs = require('fs');
const lines = fs.readFileSync('src/app/components/admin/ChecklistRoadmap.tsx', 'utf8').split('\n');
lines.forEach((line, i) => {
  if (i >= 190 && i <= 260) {
    console.log(i+1, line.trim());
  }
});
