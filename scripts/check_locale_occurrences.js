import fs from 'fs';
import path from 'path';
const files = [
  'lib/media-detail-cache.ts',
  'lib/media-above-fold-server.ts',
  'lib/server/actions.ts',
  'lib/server/tvshow-api.ts',
  'app/api/map/route.ts',
  'app/api/search/route.ts',
  'app/api/genre/[id]/route.ts',
  'app/api/person-search/route.ts',
  'app/api/country/[country]/route.ts',
  'app/person/[id]/page.tsx',
];
const base = path.resolve('C:\\Users\\musta\\Downloads\\New folder (2)\\NyumatFlix');
for (const f of files) {
  const p = path.join(base, f);
  if (!fs.existsSync(p)) {
    console.log(`${f}: NOT FOUND`);
    continue;
  }
  const s = fs.readFileSync(p, 'utf8');
  const lines = s.split(/\r?\n/);
  lines.forEach((l, i) => {
    if (l.includes('language') || l.includes('NEXT_LOCALE') || l.includes('useTranslations') || l.includes('router.refresh')) {
      console.log(`${f}:L${i+1}: ${l.trim()}`);
    }
  });
}
