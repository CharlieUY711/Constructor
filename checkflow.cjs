const fs = require('fs');
const lines = fs.readFileSync('src/app/components/admin/views/IdeasBoardView.tsx', 'utf8').split('\n');
lines.forEach((line, i) => {
  if (/nodeDrag|nowheel|nopan|nodeClick|onNodeClick|stopPropagation/i.test(line)) {
    console.log(i+1, line.trim());
  }
});
