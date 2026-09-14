import { useMemo, useState } from 'react';
import { ErrorMsg, Input, Panel, ResultRow } from './ui';

interface RGB { r: number; g: number; b: number; a: number }

function parseColor(input: string): RGB | null {
  const s = input.trim().toLowerCase();
  let m: RegExpMatchArray | null;
  if ((m = s.match(/^#?([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/))) {
    let h = m[1];
    if (h.length <= 4) h = [...h].map((c) => c + c).join('');
    const n = parseInt(h.padEnd(8, 'f'), 16);
    return { r: (n >>> 24) & 255, g: (n >>> 16) & 255, b: (n >>> 8) & 255, a: (n & 255) / 255 };
  }
  if ((m = s.match(/^rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)(?:[,\s/]+([\d.]+%?))?\s*\)$/))) {
    return { r: +m[1], g: +m[2], b: +m[3], a: parseAlpha(m[4]) };
  }
  if ((m = s.match(/^hsla?\(\s*([\d.]+)(?:deg)?[,\s]+([\d.]+)%?[,\s]+([\d.]+)%?(?:[,\s/]+([\d.]+%?))?\s*\)$/))) {
    return { ...hslToRgb(+m[1], +m[2], +m[3]), a: parseAlpha(m[4]) };
  }
  return null;
}

function parseAlpha(v?: string): number {
  if (v === undefined) return 1;
  return v.endsWith('%') ? parseFloat(v) / 100 : parseFloat(v);
}

function hslToRgb(h: number, s: number, l: number) {
  s /= 100; l /= 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, 9 - k(n), 1));
  return { r: Math.round(f(0) * 255), g: Math.round(f(8) * 255), b: Math.round(f(4) * 255) };
}

function rgbToHsl({ r, g, b }: RGB) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return { h: 0, s: 0, l: l * 100 };
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = max === r ? (g - b) / d + (g < b ? 6 : 0) : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return { h: h * 60, s: s * 100, l: l * 100 };
}

function luminance({ r, g, b }: RGB) {
  const f = (c: number) => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}
function contrast(l1: number, l2: number) { return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05); }

const hex2 = (n: number) => Math.round(n).toString(16).padStart(2, '0');
const r1 = (n: number) => Math.round(n * 10) / 10;

export default function ColorConverter() {
  const [input, setInput] = useState('#6366f1');
  const color = useMemo(() => parseColor(input), [input]);

  const out = useMemo(() => {
    if (!color) return null;
    const { r, g, b, a } = color;
    const hsl = rgbToHsl(color);
    const hex = `#${hex2(r)}${hex2(g)}${hex2(b)}`;
    const lum = luminance(color);
    return {
      hex: a < 1 ? `${hex}${hex2(a * 255)}` : hex,
      rgb: a < 1 ? `rgba(${r}, ${g}, ${b}, ${r1(a)})` : `rgb(${r}, ${g}, ${b})`,
      hsl: a < 1 ? `hsla(${r1(hsl.h)}, ${r1(hsl.s)}%, ${r1(hsl.l)}%, ${r1(a)})` : `hsl(${r1(hsl.h)}, ${r1(hsl.s)}%, ${r1(hsl.l)}%)`,
      modern: `rgb(${r} ${g} ${b}${a < 1 ? ` / ${r1(a)}` : ''})`,
      onWhite: contrast(lum, 1),
      onBlack: contrast(lum, 0),
    };
  }, [color]);

  const grade = (c: number) => (c >= 7 ? 'AAA' : c >= 4.5 ? 'AA' : c >= 3 ? 'AA large' : 'Fail');

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <Input value={input} onChange={(e) => setInput(e.target.value)} className="flex-1 font-mono" placeholder="#1e90ff, rgb(30,144,255), hsl(210,100%,56%)" aria-label="Color" />
        <input
          type="color"
          value={out?.hex.slice(0, 7) ?? '#000000'}
          onChange={(e) => setInput(e.target.value)}
          className="h-10 w-14 cursor-pointer rounded border line bg-transparent"
          aria-label="Color picker"
        />
      </div>
      {!color && input.trim() && <ErrorMsg>Could not parse that color. Try #RRGGBB, rgb(r, g, b) or hsl(h, s%, l%).</ErrorMsg>}
      {out && (
        <div className="grid gap-4 lg:grid-cols-[200px_1fr]">
          <div className="h-40 rounded-xl border line" style={{ background: out.rgb }} />
          <div>
            <ResultRow label="HEX" value={out.hex} />
            <ResultRow label="RGB" value={out.rgb} />
            <ResultRow label="HSL" value={out.hsl} />
            <ResultRow label="CSS (modern)" value={out.modern} />
          </div>
        </div>
      )}
      {out && (
        <Panel>
          <h3 className="mb-2 text-sm font-semibold">WCAG contrast</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-md p-3" style={{ background: out.rgb, color: '#fff' }}>
              White text · {out.onWhite.toFixed(2)}:1 · {grade(out.onWhite)}
            </div>
            <div className="rounded-md p-3" style={{ background: out.rgb, color: '#000' }}>
              Black text · {out.onBlack.toFixed(2)}:1 · {grade(out.onBlack)}
            </div>
          </div>
        </Panel>
      )}
    </div>
  );
}
