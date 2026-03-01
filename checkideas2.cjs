const fs = require('fs');
const lines = fs.readFileSync('src/app/components/admin/ChecklistRoadmap.tsx', 'utf8').split('\n');
lines.forEach((line, i) => {
  if (/[Ii]deas\s*[Pp]romovidas|showIdeasTab|ideasPromovidas/i.test(line)) {
    console.log(i+1, line.trim());
  }
});
