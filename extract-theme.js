const fs = require('fs');

const html = fs.readFileSync('./stitch-screens/dashboard.html', 'utf8');
const match = html.match(/tailwind\.config = (\{[\s\S]*?\})\s*</);
if (!match) throw new Error("Config not found");

// This is slightly malformed JSON (unquoted keys, etc.) so we'll eval it.
const config = eval('(' + match[1] + ')');

const extend = config.theme.extend;

let css = `@theme inline {\n`;

if (extend.colors) {
  for (const [k, v] of Object.entries(extend.colors)) {
    css += `  --color-${k}: ${v};\n`;
  }
}

if (extend.spacing) {
  for (const [k, v] of Object.entries(extend.spacing)) {
    css += `  --spacing-${k}: ${v};\n`;
  }
}

if (extend.fontFamily) {
  for (const [k, v] of Object.entries(extend.fontFamily)) {
    css += `  --font-${k}: ${v.map(f => `'${f}'`).join(', ')};\n`;
  }
}

if (extend.fontSize) {
  for (const [k, v] of Object.entries(extend.fontSize)) {
    css += `  --text-${k}: ${v[0]};\n`;
    css += `  --text-${k}--line-height: ${v[1].lineHeight};\n`;
    if (v[1].letterSpacing) css += `  --text-${k}--letter-spacing: ${v[1].letterSpacing};\n`;
    if (v[1].fontWeight) css += `  --text-${k}--font-weight: ${v[1].fontWeight};\n`;
  }
}

css += `}\n`;

fs.writeFileSync('./theme.css', css);
console.log("theme.css generated");
