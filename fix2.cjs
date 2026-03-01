const fs = require('fs');
const file = 'src/app/components/OrchestratorShell.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  "import React from 'react';",
  "import React from 'react';\nimport { useOrchestrator } from '../../shells/DashboardShell/app/providers/OrchestratorProvider';"
);

content = content.replace(
  "  const entry = MODULE_MANIFEST.find(e => e.section === activeSection);",
  "  const { config } = useOrchestrator();\n  const modulos = config?.modulos ?? [];\n  const moduloActivo = modulos.length === 0 || modulos.includes(activeSection);\n  if (!moduloActivo) { onNavigate('dashboard'); return null; }\n  const entry = MODULE_MANIFEST.find(e => e.section === activeSection);"
);

fs.writeFileSync(file, content, 'utf8');
console.log('Done');
