import { useMemo, useState } from 'react';
import { Button, Checkbox, CopyButton, Field, Input, ResultRow, Toolbar } from './ui';

interface Layer { x: number; y: number; blur: number; spread: number; color: string; opacity: number; inset: boolean }

const DEFAULT: Layer = { x: 0, y: 8, blur: 24, spread: -4, color: '#0f172a', opacity: 25, inset: false };
const PRESETS: { name: string; layers: Layer[] }[] = [
  { name: 'Soft', layers: [{ x: 0, y: 4, blur: 16, spread: -4, color: '#0f172a', opacity: 12, inset: false }] },
  { name: 'Card', layers: [{ x: 0, y: 1, blur: 2, spread: 0, color: '#0f172a', opacity: 6, inset: false }, { x: 0, y: 8, blur: 24, spread: -8, color: '#0f172a', opacity: 18, inset: false }] },
  { name: 'Floating', layers: [{ x: 0, y: 20, blur: 40, spread: -12, color: '#0f172a', opacity: 30, inset: false }] },
  { name: 'Glow', layers: [{ x: 0, y: 0, blur: 24, spread: 2, color: '#6366f1', opacity: 45, inset: false }] },
  { name: 'Inset', layers: [{ x: 0, y: 2, blur: 6, spread: 0, color: '#0f172a', opacity: 25, inset: true }] },
  { name: 'Hard', layers: [{ x: 6, y: 6, blur: 0, spread: 0, color: '#0f172a', opacity: 100, inset: false }] },
];

const rgba = (hex: string, a: number) => {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${(a / 100).toFixed(2)})`;
};

export default function BoxShadowGenerator() {
  const [layers, setLayers] = useState<Layer[]>(PRESETS[1].layers);
  const [radius, setRadius] = useState(16);
  const [bg, setBg] = useState<'light' | 'dark'>('light');

  const css = useMemo(
    () => layers.map((l) => `${l.inset ? 'inset ' : ''}${l.x}px ${l.y}px ${l.blur}px ${l.spread}px ${rgba(l.color, l.opacity)}`).join(',\n  '),
    [layers],
  );
  const update = (i: number, patch: Partial<Layer>) => setLayers(layers.map((l, j) => (j === i ? { ...l, ...patch } : l)));

  const slider = (i: number, key: 'x' | 'y' | 'blur' | 'spread', min: number, max: number) => (
    <Field label={`${key === 'x' ? 'Offset X' : key === 'y' ? 'Offset Y' : key === 'blur' ? 'Blur' : 'Spread'}: ${layers[i][key]}px`}>
      <Input type="range" min={min} max={max} value={layers[i][key]} onChange={(e) => update(i, { [key]: Number(e.target.value) })} className="w-full accent-brand-500" />
    </Field>
  );

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
      <div className="space-y-4">
        <div className={`grid h-72 place-items-center rounded-2xl border line ${bg === 'light' ? 'bg-slate-100' : 'bg-slate-800'}`}>
          <div className={`h-32 w-48 ${bg === 'light' ? 'bg-white' : 'bg-slate-700'}`} style={{ boxShadow: css.replace(/\n\s*/g, ' '), borderRadius: radius }} />
        </div>
        <Toolbar>
          <Button variant={bg === 'light' ? 'primary' : 'secondary'} onClick={() => setBg('light')}>Light</Button>
          <Button variant={bg === 'dark' ? 'primary' : 'secondary'} onClick={() => setBg('dark')}>Dark</Button>
          <Field label={`Radius: ${radius}px`}><Input type="range" min={0} max={48} value={radius} onChange={(e) => setRadius(Number(e.target.value))} className="w-32 accent-brand-500" /></Field>
        </Toolbar>
        <ResultRow label="CSS" value={`box-shadow: ${css.replace(/\n\s*/g, ' ')};`} />
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p) => <Button key={p.name} variant="ghost" onClick={() => setLayers(p.layers)}>{p.name}</Button>)}
        </div>
      </div>
      <div className="space-y-3">
        {layers.map((l, i) => (
          <div key={i} className="surface-2 space-y-2 rounded-xl border line p-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider muted">Layer {i + 1}</span>
              {layers.length > 1 && <button type="button" onClick={() => setLayers(layers.filter((_, j) => j !== i))} className="muted text-xs hover:text-rose-500">remove</button>}
            </div>
            {slider(i, 'x', -50, 50)}
            {slider(i, 'y', -50, 50)}
            {slider(i, 'blur', 0, 100)}
            {slider(i, 'spread', -50, 50)}
            <div className="flex items-center gap-2">
              <input type="color" value={l.color} onChange={(e) => update(i, { color: e.target.value })} className="h-8 w-10 cursor-pointer rounded border line bg-transparent" aria-label="Shadow colour" />
              <Field label={`Opacity ${l.opacity}%`}><Input type="range" min={0} max={100} value={l.opacity} onChange={(e) => update(i, { opacity: Number(e.target.value) })} className="w-28 accent-brand-500" /></Field>
              <Checkbox label="Inset" checked={l.inset} onChange={(e) => update(i, { inset: e.target.checked })} />
            </div>
          </div>
        ))}
        {layers.length < 4 && <Button onClick={() => setLayers([...layers, DEFAULT])}>+ Add layer</Button>}
        <CopyButton text={`box-shadow: ${css.replace(/\n\s*/g, ' ')};`} label="Copy CSS" />
      </div>
    </div>
  );
}
