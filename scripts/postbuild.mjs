/**
 * Runs after `astro build`. The WordPress blog owns the domain root, so everything this
 * build produces must live under dist/tools/. Astro writes the sitemap to the dist root;
 * move it under /tools/ and rewrite the index so it points at the moved file.
 */
import { readdirSync, readFileSync, writeFileSync, renameSync, existsSync, rmSync } from 'node:fs';
import path from 'node:path';

const dist = path.resolve('dist');
const toolsDir = path.join(dist, 'tools');

for (const f of readdirSync(dist)) {
  if (!/^sitemap.*\.xml$/.test(f)) continue;
  let xml = readFileSync(path.join(dist, f), 'utf8');
  if (f === 'sitemap-index.xml') xml = xml.replace(/https:\/\/9blog\.in\/(sitemap-\d+\.xml)/g, 'https://9blog.in/tools/$1');
  writeFileSync(path.join(toolsDir, f), xml);
  rmSync(path.join(dist, f));
  console.log(`[postbuild] moved ${f} → tools/`);
}

// Anything else left at the dist root is a mistake (we only upload dist/tools).
const stray = readdirSync(dist).filter((f) => f !== 'tools');
if (stray.length) console.warn('[postbuild] WARNING: files outside dist/tools will NOT be deployed:', stray.join(', '));
else console.log('[postbuild] dist/ contains only tools/ — ready to upload');
