import { useEffect, useState } from 'react';
import { Button, Checkbox, CopyButton, Field, Input, Toolbar } from './ui';

const SETS = {
  lower: 'abcdefghijklmnopqrstuvwxyz',
  upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  digits: '0123456789',
  symbols: '!@#$%^&*()-_=+[]{};:,.<>?/~',
};
const AMBIGUOUS = /[O0Il1|`'"]/g;

/** Uniform random integer in [0, n) using rejection sampling (no modulo bias). */
function randInt(n: number): number {
  const max = Math.floor(0x100000000 / n) * n;
  const buf = new Uint32Array(1);
  let x: number;
  do { crypto.getRandomValues(buf); x = buf[0]; } while (x >= max);
  return x % n;
}

function generate(length: number, opts: Record<keyof typeof SETS, boolean>, avoidAmbiguous: boolean): string {
  const pools = (Object.keys(SETS) as (keyof typeof SETS)[])
    .filter((k) => opts[k])
    .map((k) => (avoidAmbiguous ? SETS[k].replace(AMBIGUOUS, '') : SETS[k]));
  if (!pools.length) return '';
  const all = pools.join('');
  // Guarantee at least one character from each selected class, then fill and shuffle.
  const chars = pools.map((p) => p[randInt(p.length)]);
  while (chars.length < length) chars.push(all[randInt(all.length)]);
  for (let i = chars.length - 1; i > 0; i--) {
    const j = randInt(i + 1);
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }
  return chars.join('');
}

export default function PasswordGenerator() {
  const [length, setLength] = useState(20);
  const [opts, setOpts] = useState({ lower: true, upper: true, digits: true, symbols: true });
  const [avoid, setAvoid] = useState(false);
  const [password, setPassword] = useState('');

  const regen = () => setPassword(generate(length, opts, avoid));
  useEffect(regen, [length, opts, avoid]); // eslint-disable-line react-hooks/exhaustive-deps

  const poolSize = (Object.keys(SETS) as (keyof typeof SETS)[])
    .filter((k) => opts[k])
    .reduce((n, k) => n + (avoid ? SETS[k].replace(AMBIGUOUS, '').length : SETS[k].length), 0);
  const entropy = poolSize ? Math.round(length * Math.log2(poolSize)) : 0;
  const strength = entropy >= 100 ? 'Very strong' : entropy >= 70 ? 'Strong' : entropy >= 50 ? 'OK' : 'Weak';
  const bar = Math.min(100, Math.round((entropy / 128) * 100));

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 rounded-xl surface-2 border line p-3">
        <code className="min-w-0 flex-1 break-all font-mono text-lg">{password || <span className="muted opacity-70">Select at least one character set</span>}</code>
        <Button onClick={regen} aria-label="Regenerate">↻</Button>
        <CopyButton text={password} />
      </div>
      <div>
        <div className="mb-1 flex justify-between text-xs muted">
          <span>{strength}</span>
          <span>{entropy} bits of entropy</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded bg-(--color-line)">
          <div className={`h-full ${entropy >= 70 ? 'bg-green-500' : entropy >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${bar}%` }} />
        </div>
      </div>
      <Toolbar>
        <Field label={`Length: ${length}`}>
          <Input type="range" min={8} max={128} value={length} onChange={(e) => setLength(Number(e.target.value))} className="w-48 accent-brand-500" />
        </Field>
        <Checkbox label="a-z" checked={opts.lower} onChange={(e) => setOpts({ ...opts, lower: e.target.checked })} />
        <Checkbox label="A-Z" checked={opts.upper} onChange={(e) => setOpts({ ...opts, upper: e.target.checked })} />
        <Checkbox label="0-9" checked={opts.digits} onChange={(e) => setOpts({ ...opts, digits: e.target.checked })} />
        <Checkbox label="!@#$" checked={opts.symbols} onChange={(e) => setOpts({ ...opts, symbols: e.target.checked })} />
        <Checkbox label="Avoid ambiguous (O/0, l/1)" checked={avoid} onChange={(e) => setAvoid(e.target.checked)} />
      </Toolbar>
    </div>
  );
}
