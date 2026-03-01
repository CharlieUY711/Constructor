const fs = require('fs');
const path = require('path');
const dir = 'src/app/services';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.ts'));
files.forEach(f => {
  const content = fs.readFileSync(path.join(dir, f), 'utf8');
  const hasHardcoded = content.includes('supabase.co') || content.includes('projectId') || content.includes('publicAnonKey');
  const hasClient = content.includes("from '../../utils/supabase/client'") || content.includes("from '../utils/supabase/client'");
  console.log(f, '| hardcoded:', hasHardcoded, '| usa client:', hasClient);
});
