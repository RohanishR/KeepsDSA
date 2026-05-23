const fs = require('fs');
const path = require('path');

const srcDir = path.join(process.cwd(), 'src');

const replacements = [
  // Legacy color classes
  { regex: /bg-surface-container-lowest/g, replace: 'bg-card' },
  { regex: /bg-surface-container-highest/g, replace: 'bg-accent' },
  { regex: /bg-surface-container-high/g, replace: 'bg-muted/80' },
  { regex: /bg-surface-container-low/g, replace: 'bg-card/50' },
  { regex: /bg-surface-container/g, replace: 'bg-muted' },
  { regex: /bg-surface-variant/g, replace: 'bg-muted' },
  { regex: /bg-surface/g, replace: 'bg-background' },
  
  { regex: /text-on-surface-variant/g, replace: 'text-muted-foreground' },
  { regex: /text-on-surface/g, replace: 'text-foreground' },
  
  { regex: /border-outline-variant/g, replace: 'border-border' },
  { regex: /border-outline/g, replace: 'border-border' },
  { regex: /text-outline/g, replace: 'text-muted-foreground' },
  
  { regex: /bg-primary-container/g, replace: 'bg-primary/20' },
  { regex: /text-on-primary-container/g, replace: 'text-primary' },
  { regex: /text-on-primary/g, replace: 'text-primary-foreground' },
  
  { regex: /bg-secondary-container/g, replace: 'bg-secondary' },
  { regex: /text-on-secondary-container/g, replace: 'text-secondary-foreground' },
  
  { regex: /bg-error-container/g, replace: 'bg-destructive/20' },
  { regex: /text-on-error-container/g, replace: 'text-destructive' },
  { regex: /text-error/g, replace: 'text-destructive' },
  { regex: /bg-error/g, replace: 'bg-destructive' },
  { regex: /border-error/g, replace: 'border-destructive' },

  // Typography - Font family updates where specifically hardcoded in className
  // The global CSS handles h1, h2 etc., but we'll also replace specific font utility classes just in case
  { regex: /font-display-lg/g, replace: 'font-heading' },
  { regex: /font-headline-md/g, replace: 'font-heading' },
  { regex: /font-headline-lg/g, replace: 'font-heading' },
  { regex: /font-body-md/g, replace: 'font-sans' },
  { regex: /font-body-lg/g, replace: 'font-sans' },
  { regex: /font-label-sm/g, replace: 'font-subheading text-[12px] uppercase tracking-wider' },
  { regex: /font-label-md/g, replace: 'font-subheading text-[14px]' }
];

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        results.push(file);
      }
    }
  });
  return results;
}

const allFiles = walk(srcDir);
let changedCount = 0;

allFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;
  
  replacements.forEach(({ regex, replace }) => {
    content = content.replace(regex, replace);
  });
  
  if (content !== original) {
    fs.writeFileSync(file, content);
    console.log(`Updated ${path.relative(process.cwd(), file)}`);
    changedCount++;
  }
});

console.log(`Successfully updated ${changedCount} files.`);
