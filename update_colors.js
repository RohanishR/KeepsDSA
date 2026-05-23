const fs = require('fs');
const path = require('path');

const filesToUpdate = [
  'src/components/problems/ProblemWorkspace.tsx',
  'src/components/problems/AddSolutionForm.tsx',
  'src/components/problems/NotesEditor.tsx',
  'src/components/problems/SolutionViewer.tsx',
  'src/app/(app)/dashboard/DashboardClient.tsx',
  'src/app/(app)/problem/[slug]/page.tsx'
];

const replacements = [
  { regex: /bg-surface-container-lowest/g, replace: 'bg-card' },
  { regex: /bg-surface-container-highest/g, replace: 'bg-accent' },
  { regex: /bg-surface-container-high/g, replace: 'bg-muted/80' },
  { regex: /bg-surface-container-low/g, replace: 'bg-card/50' },
  { regex: /bg-surface-container/g, replace: 'bg-muted' },
  { regex: /bg-surface/g, replace: 'bg-background' },
  { regex: /text-on-surface-variant/g, replace: 'text-muted-foreground' },
  { regex: /text-on-surface/g, replace: 'text-foreground' },
  { regex: /border-outline-variant/g, replace: 'border-border' },
  { regex: /bg-\[\#1e1e1e\]/g, replace: 'bg-background' },
  { regex: /bg-\[\#252526\]/g, replace: 'bg-card' },
  { regex: /border-\[\#3c3c3c\]/g, replace: 'border-border' },
  { regex: /border-\[\#4d4d4d\]/g, replace: 'border-border' },
  { regex: /text-\[\#cccccc\]/g, replace: 'text-foreground' },
  { regex: /text-\[\#858585\]/g, replace: 'text-muted-foreground' },
  { regex: /text-error/g, replace: 'text-destructive' },
  { regex: /bg-error/g, replace: 'bg-destructive' },
  { regex: /border-error/g, replace: 'border-destructive' }
];

filesToUpdate.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    replacements.forEach(({ regex, replace }) => {
      content = content.replace(regex, replace);
    });
    fs.writeFileSync(filePath, content);
    console.log(`Updated ${file}`);
  } else {
    console.log(`File not found: ${file}`);
  }
});
