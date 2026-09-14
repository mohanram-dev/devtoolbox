import { useMemo, useState } from 'react';
import { Checkbox, Input, Panel, ResultRow } from './ui';

const WHO = ['Owner', 'Group', 'Others'] as const;
const PERMS = [{ bit: 4, label: 'Read', ch: 'r' }, { bit: 2, label: 'Write', ch: 'w' }, { bit: 1, label: 'Execute', ch: 'x' }] as const;

const PRESETS = [
  { v: '755', use: 'Directories, scripts' },
  { v: '644', use: 'Regular files' },
  { v: '600', use: 'Private keys, .env' },
  { v: '700', use: 'Private directories' },
  { v: '777', use: 'World-writable (avoid)' },
  { v: '664', use: 'Group-editable files' },
];

const toSymbolic = (n: number) => PERMS.map((p) => (n & p.bit ? p.ch : '-')).join('');

export default function ChmodCalculator() {
  const [bits, setBits] = useState<[number, number, number]>([7, 5, 5]);
  const [special, setSpecial] = useState({ setuid: false, setgid: false, sticky: false });

  const octal = bits.join('');
  const specialDigit = (special.setuid ? 4 : 0) + (special.setgid ? 2 : 0) + (special.sticky ? 1 : 0);
  const symbolic = useMemo(() => {
    let s = bits.map(toSymbolic).join('');
    const chars = s.split('');
    if (special.setuid) chars[2] = bits[0] & 1 ? 's' : 'S';
    if (special.setgid) chars[5] = bits[1] & 1 ? 's' : 'S';
    if (special.sticky) chars[8] = bits[2] & 1 ? 't' : 'T';
    return chars.join('');
  }, [bits, special]);

  const fromOctal = (v: string) => {
    const m = v.replace(/[^0-7]/g, '').slice(-4);
    if (m.length < 3) return;
    const digits = m.split('').map(Number);
    const [a, b, c] = digits.slice(-3);
    setBits([a, b, c]);
    if (digits.length === 4) setSpecial({ setuid: !!(digits[0] & 4), setgid: !!(digits[0] & 2), sticky: !!(digits[0] & 1) });
  };

  const toggle = (who: number, bit: number) =>
    setBits((b) => { const n = [...b] as typeof bits; n[who] ^= bit; return n; });

  const full = specialDigit ? `${specialDigit}${octal}` : octal;

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-3">
        {WHO.map((who, i) => (
          <Panel key={who}>
            <div className="mb-2 flex items-center justify-between">
              <span className="font-semibold">{who}</span>
              <span className="font-mono text-lg text-brand-500">{bits[i]}</span>
            </div>
            <div className="flex flex-col gap-1.5">
              {PERMS.map((p) => (
                <Checkbox key={p.ch} label={`${p.label} (${p.bit})`} checked={!!(bits[i] & p.bit)} onChange={() => toggle(i, p.bit)} />
              ))}
            </div>
          </Panel>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <Checkbox label="setuid (4)" checked={special.setuid} onChange={(e) => setSpecial({ ...special, setuid: e.target.checked })} />
        <Checkbox label="setgid (2)" checked={special.setgid} onChange={(e) => setSpecial({ ...special, setgid: e.target.checked })} />
        <Checkbox label="sticky (1)" checked={special.sticky} onChange={(e) => setSpecial({ ...special, sticky: e.target.checked })} />
        <label className="ml-auto flex items-center gap-2 text-sm">
          <span className="muted">Octal</span>
          <Input value={full} onChange={(e) => fromOctal(e.target.value)} className="w-24 text-center font-mono text-lg" maxLength={4} aria-label="Octal permission" />
        </label>
      </div>

      <div>
        <ResultRow label="Octal" value={full} />
        <ResultRow label="Symbolic" value={`-${symbolic}`} />
        <ResultRow label="chmod" value={`chmod ${full} filename`} />
        <ResultRow label="chmod -R" value={`chmod -R ${full} directory/`} />
        <ResultRow label="Symbolic form" value={`chmod u=${toSymbolic(bits[0]).replace(/-/g, '')},g=${toSymbolic(bits[1]).replace(/-/g, '')},o=${toSymbolic(bits[2]).replace(/-/g, '')} filename`} />
      </div>

      <div>
        <p className="muted mb-2 text-xs font-semibold uppercase tracking-wider">Common presets</p>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button key={p.v} type="button" onClick={() => fromOctal(p.v)} className={`badge transition hover:border-brand-400 hover:text-brand-500 ${octal === p.v && !specialDigit ? 'border-brand-400 text-brand-500' : ''}`}>
              <span className="font-mono">{p.v}</span> · {p.use}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
