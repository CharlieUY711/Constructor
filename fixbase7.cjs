const fs = require('fs');
const path = require('path');
const dir = 'src/app/services';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.ts') && f !== 'syncManifest.ts');
const BT = String.fromCharCode(96);
let fixed = 0;
files.forEach(f => {
  const filepath = path.join(dir, f);
  let content = fs.readFileSync(filepath, 'utf8');
  const before = content;
  content = content.replace(
    /const BASE = (\$\{apiUrl\}\/[^\n\r]+)/g,
    (match, url) => 'const BASE = ' + BT + url.replace(/`/g, '') + BT
  );
  if (content !== before) {
    fs.writeFileSync(filepath, content, 'utf8');
    fixed++;
    console.log('Fixed:', f);
  }
});
console.log('Total fixed:', fixed);
