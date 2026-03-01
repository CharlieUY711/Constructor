const fs = require('fs');
['src/app/services/syncManifest.ts', 'src/app/AdminDashboard.tsx'].forEach(f => {
  const raw = fs.readFileSync(f);
  const hasBom = raw[0]===0xEF && raw[1]===0xBB && raw[2]===0xBF;
  const hasDoubleBom = raw[0]===0xC3 && raw[1]===0xAF;
  console.log(f, hasBom ? 'BOM!' : hasDoubleBom ? 'DOUBLE BOM!' : 'OK', '| starts:', raw.slice(0,6).toString('hex'));
});
