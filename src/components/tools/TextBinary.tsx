import { useMemo, useState } from 'react';
import { CopyButton, ErrorMsg, Field, Segmented, TextArea, Toolbar } from './ui';

type Fmt = 'binary' | 'hex' | 'decimal' | 'octal';
const RADIX: Record<Fmt, number> = { binary: 2, hex: 16, decimal: 10, octal: 8 };
const PAD: Record<Fmt, number> = { binary: 8, hex: 2, decimal: 0, octal: 0 };

function encode(text: string, fmt: Fmt, sep: string): string {
  const bytes = new TextEncoder().encode(text);
  return Array.from(bytes, (b) => b.toString(RADIX[fmt]).padStart(PAD[fmt], '0')).join(sep);
}

function decode(input: string, fmt: Fmt): string {
  const tokens = input.trim().split(/[\s,]+/).filter(Boolean);
  if (!tokens.length) return '';
  const bytes = tokens.flatMap((t) => {
    // Allow unseparated binary/hex streams like 0100100001101001 or 4869
    const chunk = fmt === 'binary' ? 8 : fmt === 'hex' ? 2 : 0;
    const parts = chunk && t.length > chunk ? t.match(new RegExp(`.{1,${chunk}}`, 'g'))! : [t];
    return parts.map((p) => {
      const n = parseInt(p, RADIX[fmt]);
      if (Number.isNaN(n) || n < 0 || n > 255) throw new Error(`"${p}" is not a valid ${fmt} byte.`);
      return n;
    });
  });
  return new TextDecoder('utf-8', { fatal: false }).decode(Uint8Array.from(bytes));
}

export default function TextBinary() {
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [fmt, setFmt] = useState<Fmt>('binary');
  const [sep, setSep] = useState(' ');
  const [input, setInput] = useState('Hello, World!');

  const { output, error } = useMemo(() => {
    if (!input) return { output: '', error: '' };
    try {
      return { output: mode === 'encode' ? encode(input, fmt, sep) : decode(input, fmt), error: '' };
    } catch (e) {
      return { output: '', error: (e as Error).message };
    }
  }, [input, mode, fmt, sep]);

  return (
    <div className="space-y-4">
      <Toolbar>
        <Segmented value={mode} onChange={setMode} options={[{ value: 'encode', label: 'Text → Code' }, { value: 'decode', label: 'Code → Text' }]} />
        <Segmented value={fmt} onChange={setFmt} options={[{ value: 'binary', label: 'Binary' }, { value: 'hex', label: 'Hex' }, { value: 'decimal', label: 'Decimal' }, { value: 'octal', label: 'Octal' }]} />
        {mode === 'encode' && (
          <Field label="Separator">
            <select value={sep} onChange={(e) => setSep(e.target.value)} className="surface-2 rounded-lg border line px-2 py-1.5 text-sm">
              <option value=" ">Space</option>
              <option value="">None</option>
              <option value=",">Comma</option>
              <option value={'\n'}>New line</option>
            </select>
          </Field>
        )}
      </Toolbar>
      <div className="grid gap-4 lg:grid-cols-2">
        <TextArea rows={8} value={input} onChange={(e) => setInput(e.target.value)} placeholder={mode === 'encode' ? 'Text to encode…' : '01001000 01101001 …'} aria-label="Input" />
        <div className="space-y-2">
          <TextArea rows={8} readOnly value={output} placeholder="Result" aria-label="Output" />
          <div className="flex items-center justify-between">
            <span className="muted text-xs">{mode === 'encode' ? `${new TextEncoder().encode(input).length} bytes (UTF-8)` : `${output.length} characters`}</span>
            <CopyButton text={output} />
          </div>
        </div>
      </div>
      <ErrorMsg>{error}</ErrorMsg>
    </div>
  );
}
