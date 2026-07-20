import fs from 'fs';
import path from 'path';
function walk(dir) {
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    const stat = fs.statSync(p);
    if (stat.isDirectory()) {
      walk(p);
    } else if (p.endsWith('.ts') || p.endsWith('.tsx') || p.endsWith('.js')) {
      const s = fs.readFileSync(p, 'utf8');
      const lines = s.split(/\r?\n/);
      lines.forEach((l, i) => {
        if (l.includes('language=en-US') || l.includes("language: 'en-US'") || l.includes('language: "en-US"') || l.includes("\"language\": \"en-US\"") ) {
          console.log(p + ':L' + (i + 1) + ': ' + l.trim());
        }
      });
    }
  }
}
const __dirname = path.dirname(process.argv[1]);
walk(path.resolve(__dirname, '..'));
