const fs = require('fs');
const lines = fs.readFileSync('src/app/components/admin/views/IdeasBoardView.tsx', 'utf8').split('\n');
lines.forEach((line, i) => {
  if (/fetch|supabase|projectId|BASE|api\/ideas|api\/roadmap|import/i.test(line) && i < 60) {
    console.log(i+1, line.trim());
  }
});
