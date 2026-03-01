const fs = require('fs');
const file = 'src/app/components/admin/views/IdeasBoardView.tsx';
let content = fs.readFileSync(file, 'utf8');
content = content.replace(
  'onClick={(e) => { e.stopPropagation(); setShowPromoteModal(true); }}',
  'onMouseDown={(e) => e.stopPropagation()} onClick={(e) => { e.stopPropagation(); e.preventDefault(); setShowPromoteModal(true); }}'
);
fs.writeFileSync(file, content, 'utf8');
console.log('Done. Has change?', content.includes('onMouseDown={(e) => e.stopPropagation()}'));
