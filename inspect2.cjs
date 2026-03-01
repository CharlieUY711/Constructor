const fs = require('fs');
const lines = fs.readFileSync('src/app/components/admin/ChecklistRoadmap.tsx', 'utf8').split('\n');
lines.forEach((line, i) => {
  if (/^export|^function|^interface|^type |hideHeader|onNavigate/.test(line)) {
    console.log(i+1, line.trim());
  }
});
