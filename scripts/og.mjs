/**
 * Generates Open Graph images (1200×630 PNG) for the home page and every tool.
 * Runs before `astro build` (see package.json). Output: public/og.png, public/og/<slug>.png
 *
 * Uses satori (HTML → SVG with a bundled font, no system fonts needed) + resvg (SVG → PNG).
 * Run with: node --experimental-strip-types scripts/og.mjs
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { TOOLS } from '../src/data/tools.ts';
import { ICON_PATHS } from '../src/lib/icons.ts';
import { SITE } from '../src/config.ts';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const fontsDir = path.join(root, 'scripts', 'fonts');
const outDir = path.join(root, 'public', 'tools', 'og');
mkdirSync(outDir, { recursive: true });

const fonts = [
  { name: 'Inter', data: readFileSync(path.join(fontsDir, 'Inter-Regular.ttf')), weight: 400, style: 'normal' },
  { name: 'Inter', data: readFileSync(path.join(fontsDir, 'Inter-Bold.ttf')), weight: 700, style: 'normal' },
];

const TINT = {
  Formatters: ['#0ea5e9', '#e0f2fe'],
  Encoders: ['#8b5cf6', '#ede9fe'],
  Generators: ['#10b981', '#d1fae5'],
  Converters: ['#f59e0b', '#fef3c7'],
  Testing: ['#f43f5e', '#ffe4e6'],
};

const host = new URL(SITE.url).host;

// satori takes React-like element objects: { type, props: { children, style } }
const h = (type, props, ...children) => ({
  type,
  props: { ...props, children: children.length === 0 ? undefined : children.length === 1 ? children[0] : children },
});

function iconSvg(name, color, size) {
  const inner = ICON_PATHS[name] ?? ICON_PATHS.zap;
  // satori needs real element children, so parse the tiny subset of SVG tags the icon set uses.
  const children = [...inner.matchAll(/<(path|circle|rect|ellipse)\s+([^>]*?)\s*\/>/g)].map(([, tag, attrs]) => {
    const props = Object.fromEntries([...attrs.matchAll(/([\w-]+)="([^"]*)"/g)].map(([, k, v]) => [k, v]));
    return { type: tag, props };
  });
  return {
    type: 'svg',
    props: {
      width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: color,
      'stroke-width': 2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round',
      children,
    },
  };
}

function card({ title, subtitle, category, icon }) {
  const [accent, soft] = TINT[category] ?? ['#6366f1', '#e0e7ff'];
  return h('div', {
    style: {
      width: 1200, height: 630, display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
      padding: 64, fontFamily: 'Inter', color: '#e6e9f2',
      backgroundColor: '#0b1020',
      backgroundImage: 'radial-gradient(circle at 85% 15%, rgba(99,102,241,0.45), transparent 45%), radial-gradient(circle at 10% 90%, rgba(168,85,247,0.35), transparent 45%)',
    },
  },
    // header
    h('div', { style: { display: 'flex', alignItems: 'center', gap: 16 } },
      h('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'center', width: 52, height: 52, borderRadius: 14, backgroundImage: 'linear-gradient(120deg,#4f46e5,#9333ea)', color: '#fff', fontSize: 20, fontWeight: 700 } }, '</>'),
      h('div', { style: { fontSize: 30, fontWeight: 700 } }, SITE.name),
      category
        ? h('div', { style: { marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10, padding: '10px 20px', borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', fontSize: 22, color: '#c7cbe0' } },
            h('div', { style: { width: 12, height: 12, borderRadius: 999, backgroundColor: accent } }), h('div', {}, category))
        : null,
    ),
    // body
    h('div', { style: { display: 'flex', alignItems: 'center', gap: 40 } },
      icon
        ? h('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'center', width: 140, height: 140, borderRadius: 32, backgroundColor: soft, flexShrink: 0 } }, iconSvg(icon, accent, 76))
        : null,
      h('div', { style: { display: 'flex', flexDirection: 'column', gap: 18, flex: 1, minWidth: 0 } },
        h('div', { style: { fontSize: title.length > 40 ? 46 : title.length > 28 ? 54 : 64, fontWeight: 700, lineHeight: 1.1, letterSpacing: -1.5 } }, title),
        h('div', { style: { fontSize: 28, lineHeight: 1.4, color: '#98a2b8' } }, subtitle),
      ),
    ),
    // footer
    h('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 24, color: '#98a2b8' } },
      h('div', { style: { display: 'flex', gap: 28 } },
        h('div', {}, '✓ Free'), h('div', {}, '✓ No sign-up'), h('div', {}, '✓ Runs in your browser')),
      h('div', { style: { color: '#c7cbe0', fontWeight: 700 } }, host),
    ),
  );
}

async function render(node, file) {
  const svg = await satori(node, { width: 1200, height: 630, fonts });
  const png = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } }).render().asPng();
  writeFileSync(file, png);
}

const force = process.argv.includes('--force');
const toolsMtime = statSync(path.join(root, 'src', 'data', 'tools.ts')).mtimeMs;
let made = 0;

await render(card({ title: `${TOOLS.length} free developer tools, right in your browser.`, subtitle: SITE.description, category: null, icon: null }), path.join(root, 'public', 'tools', 'og', 'site.png'));
made++;

for (const t of TOOLS) {
  const file = path.join(outDir, `${t.slug}.png`);
  if (!force && existsSync(file) && statSync(file).mtimeMs > toolsMtime) continue; // unchanged
  await render(card({ title: t.name.replace(/\s*\(.*\)$/, ''), subtitle: t.tagline, category: t.category, icon: t.slug }), file);
  made++;
}
console.log(`[og] generated ${made} image(s) → public/og.png, public/og/*.png`);
