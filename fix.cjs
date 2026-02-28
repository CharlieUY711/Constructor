const fs = require('fs');
const file = 'src/app/utils/moduleManifest.ts';
let content = fs.readFileSync(file, 'utf8');
content = content.replace(/component: ([A-Z]\w+),/g, (_, name) => {
  return "component: React.lazy(() => import('../components/admin/views/" + name + "').then(m => ({ default: m." + name + " }))),";
});
fs.writeFileSync(file, content, 'utf8');
console.log('Done');
