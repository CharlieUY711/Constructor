const fs = require('fs');
const path = require('path');
const files = [
  'src/app/utils/moduleManifest.ts',
  'src/app/components/OrchestratorShell.tsx',
  'src/app/components/admin/AdminSidebar.tsx',
  'src/app/AdminDashboard.tsx',
  'src/app/App.tsx',
];
files.forEach(file => {
  if (!fs.existsSync(file)) return;
  const raw = fs.readFileSync(file);
  let start = 0;
  while (start < raw.length - 2 && raw[start] === 0xEF && raw[start+1] === 0xBB && raw[start+2] === 0xBF) start += 3;
  while (start < raw.length - 5 && raw[start] === 0xC3 && raw[start+1] === 0xAF && raw[start+2] === 0xC2 && raw[start+3] === 0xBB && raw[start+4] === 0xC2 && raw[start+5] === 0xBF) start += 6;
  const clean = raw.slice(start).toString('utf8');
  fs.writeFileSync(file, clean, 'utf8');
  console.log('Fixed:', file, '| starts with:', clean.slice(0, 15));
});
