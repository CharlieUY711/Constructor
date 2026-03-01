const fs = require('fs');
const file = 'src/utils/supabase/info.ts';
let content = fs.readFileSync(file, 'utf8');
content = content.replace(
  'sb_publishable_sB3F5T731PMqPXMOFq8pVg_Trg4AbeW',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFobm14dmV4a2l6Y3NtaXZmdWFtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEyMjEyODEsImV4cCI6MjA4Njc5NzI4MX0.Ifz4fJYldIGZFzhBK5PPxQeqdYzO2ZKNQ5uo8j2mYmM'
);
fs.writeFileSync(file, content, 'utf8');
console.log('Done');
