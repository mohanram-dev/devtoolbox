import { useEffect, useState } from 'react';
import { Button, Checkbox, CopyButton, Field, Input, TextArea, Toolbar } from './ui';

function uuidV4(): string {
  if (typeof crypto.randomUUID === 'function') return crypto.randomUUID();
  const b = crypto.getRandomValues(new Uint8Array(16));
  b[6] = (b[6] & 0x0f) | 0x40;
  b[8] = (b[8] & 0x3f) | 0x80;
  const h = Array.from(b, (x) => x.toString(16).padStart(2, '0')).join('');
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`;
}

export default function UuidGenerator() {
  const [count, setCount] = useState(5);
  const [upper, setUpper] = useState(false);
  const [noHyphens, setNoHyphens] = useState(false);
  const [braces, setBraces] = useState(false);
  const [list, setList] = useState<string[]>([]);

  const generate = () => setList(Array.from({ length: Math.min(1000, Math.max(1, count)) }, uuidV4));
  useEffect(generate, []); // eslint-disable-line react-hooks/exhaustive-deps

  const formatted = list
    .map((u) => {
      let s = noHyphens ? u.replace(/-/g, '') : u;
      if (upper) s = s.toUpperCase();
      return braces ? `{${s}}` : s;
    })
    .join('\n');

  return (
    <div className="space-y-4">
      <Toolbar>
        <Field label="How many">
          <Input type="number" min={1} max={1000} value={count} onChange={(e) => setCount(Number(e.target.value))} className="w-24" />
        </Field>
        <Checkbox label="Uppercase" checked={upper} onChange={(e) => setUpper(e.target.checked)} />
        <Checkbox label="No hyphens" checked={noHyphens} onChange={(e) => setNoHyphens(e.target.checked)} />
        <Checkbox label="Braces { }" checked={braces} onChange={(e) => setBraces(e.target.checked)} />
        <Button variant="primary" onClick={generate}>Generate</Button>
        <CopyButton text={formatted} label="Copy all" />
      </Toolbar>
      <TextArea rows={Math.min(20, Math.max(5, list.length + 1))} readOnly value={formatted} aria-label="Generated UUIDs" />
    </div>
  );
}
