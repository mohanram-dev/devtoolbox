import { useMemo, useState } from 'react';
import { ErrorMsg, Field, Input, ResultRow } from './ui';

const BASES = [
  { base: 2, label: 'Binary', prefix: '0b' },
  { base: 8, label: 'Octal', prefix: '0o' },
  { base: 10, label: 'Decimal', prefix: '' },
  { base: 16, label: 'Hexadecimal', prefix: '0x' },
  { base: 36, label: 'Base 36', prefix: '' },
];

const PREFIX_BASE: Record<string, number> = { '0b': 2, '0o': 8, '0x': 16 };

function parse(value: string, base: number): bigint | null {
  const raw = value.trim().toLowerCase().replace(/[\s_]/g, '');
  const neg0 = raw.startsWith('-');
  const prefix = (neg0 ? raw.slice(1) : raw).slice(0, 2);
  if (PREFIX_BASE[prefix]) base = PREFIX_BASE[prefix]; // an explicit prefix wins over the dropdown
  const s = raw.replace(/^(-?)(0b|0o|0x)/, '$1');
  if (!s) return null;
  const digits = '0123456789abcdefghijklmnopqrstuvwxyz'.slice(0, base);
  const neg = s.startsWith('-');
  const body = neg ? s.slice(1) : s;
  if (!body || [...body].some((c) => !digits.includes(c))) return null;
  let n = 0n;
  for (const c of body) n = n * BigInt(base) + BigInt(digits.indexOf(c));
  return neg ? -n : n;
}

const group = (s: string, size: number) => {
  const neg = s.startsWith('-');
  const body = neg ? s.slice(1) : s;
  const out = body.replace(new RegExp(`\\B(?=(\\w{${size}})+(?!\\w))`, 'g'), ' ');
  return (neg ? '-' : '') + out;
};

export default function BaseConverter() {
  const [value, setValue] = useState('255');
  const [from, setFrom] = useState(10);

  const n = useMemo(() => parse(value, from), [value, from]);
  const invalid = value.trim() !== '' && n === null;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end gap-3">
        <Field label="Number">
          <Input value={value} onChange={(e) => setValue(e.target.value)} className="w-64 font-mono text-lg" placeholder="255, 0xff, 0b1010…" aria-label="Number" />
        </Field>
        <Field label="Input base">
          <select value={from} onChange={(e) => setFrom(Number(e.target.value))} className="surface-2 rounded-lg border line px-2 py-2 text-sm">
            {BASES.map((b) => <option key={b.base} value={b.base}>{b.label} ({b.base})</option>)}
          </select>
        </Field>
      </div>
      {invalid && <ErrorMsg>Not a valid base-{from} number.</ErrorMsg>}
      {n !== null && (
        <div>
          {BASES.map((b) => {
            const raw = n.toString(b.base);
            const shown = b.base === 2 ? group(raw, 4) : b.base === 10 ? group(raw, 3) : b.base === 16 ? group(raw, 4) : raw;
            return <ResultRow key={b.base} label={b.label} value={(n < 0n ? '-' : '') + b.prefix + shown.replace(/^-/, '')} />;
          })}
          <ResultRow label="Bits needed" value={String((n < 0n ? -n : n).toString(2).length)} />
          {n >= 0n && n <= 0x10ffffn && n > 31n && <ResultRow label="Unicode char" value={String.fromCodePoint(Number(n))} mono={false} />}
        </div>
      )}
      <p className="muted text-xs">Arbitrary precision — numbers of any size are supported. Prefixes 0b, 0o and 0x are accepted; spaces and underscores are ignored.</p>
    </div>
  );
}
