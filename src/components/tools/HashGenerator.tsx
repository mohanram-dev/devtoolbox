import { useEffect, useState } from 'react';
import { md5 } from '../../lib/md5';
import { Checkbox, ResultRow, TextArea, Toolbar } from './ui';

const ALGOS = ['SHA-1', 'SHA-256', 'SHA-384', 'SHA-512'] as const;

async function digest(algo: string, text: string): Promise<string> {
  const buf = await crypto.subtle.digest(algo, new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buf), (b) => b.toString(16).padStart(2, '0')).join('');
}

export default function HashGenerator() {
  const [input, setInput] = useState('');
  const [upper, setUpper] = useState(false);
  const [hashes, setHashes] = useState<Record<string, string>>({});

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const entries = await Promise.all(ALGOS.map(async (a) => [a, await digest(a, input)] as const));
      if (!cancelled) setHashes({ MD5: md5(input), ...Object.fromEntries(entries) });
    })();
    return () => { cancelled = true; };
  }, [input]);

  const fmt = (h = '') => (upper ? h.toUpperCase() : h);

  return (
    <div className="space-y-4">
      <TextArea rows={6} value={input} onChange={(e) => setInput(e.target.value)} placeholder="Text to hash…" aria-label="Text to hash" />
      <Toolbar>
        <Checkbox label="Uppercase hex" checked={upper} onChange={(e) => setUpper(e.target.checked)} />
        <span className="text-xs muted">{new TextEncoder().encode(input).length} bytes (UTF-8)</span>
      </Toolbar>
      <div>
        {['MD5', ...ALGOS].map((a) => (
          <ResultRow key={a} label={a} value={fmt(hashes[a])} />
        ))}
      </div>
    </div>
  );
}
