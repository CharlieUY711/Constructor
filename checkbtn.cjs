const fs = require('fs');
const lines = fs.readFileSync('src/app/components/admin/views/IdeasBoardView.tsx', 'utf8').split('\n');
for (let i = 324; i <= 348; i++) {
  console.log(i+1, lines[i]);
}
