import { useMemo, useState } from 'react';
import { Button, CopyButton, Field, Input, ResultRow, Segmented, Toolbar } from './ui';

interface Stop { color: string; pos: number }

const PRESETS: { name: string; stops: Stop[]; angle: number }[] = [
  { name: 'Indigo → Violet', stops: [{ color: '#6366f1', pos: 0 }, { color: '#a855f7', pos: 100 }], angle: 120 },
  { name: 'Sunset', stops: [{ color: '#f97316', pos: 0 }, { color: '#ec4899', pos: 50 }, { color: '#8b5cf6', pos: 100 }], angle: 45 },
  { name: 'Ocean', stops: [{ color: '#0ea5e9', pos: 0 }, { color: '#22d3ee', pos: 100 }], angle: 90 },
  { name: 'Forest', stops: [{ color: '#064e3b', pos: 0 }, { color: '#10b981', pos: 100 }], angle: 180 },
  { name: 'Mono', stops: [{ color: '#0f172a', pos: 0 }, { color: '#475569', pos: 100 }], angle: 135 },
  { name: 'Peach', stops: [{ color: '#fecaca', pos: 0 }, { color: '#fde68a', pos: 100 }], angle: 60 },
];

export default function GradientGenerator() {
  const [type, setType] = useState<'linear' | 'radial' | 'conic'>('linear');
  const [angle, setAngle] = useState(120);
  const [stops, setStops] = useState<Stop[]>(PRESETS[0].stops);

  const css = useMemo(() => {
    const list = [...stops].sort((a, b) => a.pos - b.pos).map((s) => `${s.color} ${s.pos}%`).join(', ');
    if (type === 'linear') return `linear-gradient(${angle}deg, ${list})`;
    if (type === 'radial') return `radial-gradient(circle at center, ${list})`;
    return `conic-gradient(from ${angle}deg at 50% 50%, ${list})`;
  }, [type, angle, stops]);

  const update = (i: number, patch: Partial<Stop>) => setStops(stops.map((s, j) => (j === i ? { ...s, ...patch } : s)));
  const tailwind = `bg-[${css.replace(/\s/g, '_')}]`;

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="space-y-4">
        <div className="h-64 w-full rounded-2xl border line shadow-inner" style={{ backgroundImage: css }} aria-label="Gradient preview" />
        <ResultRow label="CSS" value={`background-image: ${css};`} />
        <ResultRow label="Tailwind" value={tailwind} />
        <div className="flex items-center justify-between">
          <span className="muted text-xs font-semibold uppercase tracking-wider">Presets</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button key={p.name} type="button" onClick={() => { setStops(p.stops); setAngle(p.angle); }} className="flex items-center gap-2 rounded-lg border line px-2 py-1 text-xs hover:border-brand-400">
              <span className="h-5 w-8 rounded" style={{ backgroundImage: `linear-gradient(${p.angle}deg, ${p.stops.map((s) => `${s.color} ${s.pos}%`).join(', ')})` }} />
              {p.name}
            </button>
          ))}
        </div>
      </div>
      <div className="space-y-4">
        <Segmented value={type} onChange={setType} options={[{ value: 'linear', label: 'Linear' }, { value: 'radial', label: 'Radial' }, { value: 'conic', label: 'Conic' }]} />
        {type !== 'radial' && (
          <Field label={`Angle: ${angle}°`}>
            <Input type="range" min={0} max={360} value={angle} onChange={(e) => setAngle(Number(e.target.value))} className="w-full accent-brand-500" />
          </Field>
        )}
        <div className="space-y-2">
          <span className="muted block text-xs font-semibold uppercase tracking-wider">Colour stops</span>
          {stops.map((s, i) => (
            <div key={i} className="flex items-center gap-2">
              <input type="color" value={s.color} onChange={(e) => update(i, { color: e.target.value })} className="h-9 w-10 cursor-pointer rounded border line bg-transparent" aria-label={`Stop ${i + 1} colour`} />
              <Input value={s.color} onChange={(e) => update(i, { color: e.target.value })} className="w-24" aria-label={`Stop ${i + 1} hex`} />
              <Input type="number" min={0} max={100} value={s.pos} onChange={(e) => update(i, { pos: Number(e.target.value) })} className="w-16" aria-label={`Stop ${i + 1} position`} />
              <span className="muted text-xs">%</span>
              {stops.length > 2 && <button type="button" onClick={() => setStops(stops.filter((_, j) => j !== i))} className="muted text-xs hover:text-rose-500">✕</button>}
            </div>
          ))}
          {stops.length < 6 && <Button variant="ghost" onClick={() => setStops([...stops, { color: '#ffffff', pos: 100 }])}>+ Add stop</Button>}
        </div>
        <Toolbar><CopyButton text={`background-image: ${css};`} label="Copy CSS" /></Toolbar>
      </div>
    </div>
  );
}
