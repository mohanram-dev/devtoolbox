import { useEffect, useState } from 'react';
import { Checkbox, ErrorMsg, Field, Input, ResultRow, TextArea, Toolbar } from './ui';

const ALGOS = ['SHA-1', 'SHA-256', 'SHA-384', 'SHA-512'] as const;

function hexToBytes(hex: string): Uint8Array {
  const clean = hex.replace(/^0x/, '').replace(/\s/g, '');
  if (clean.length % 2 || /[^0-9a-f]/i.test(clean)) throw new Error('Key is not valid hex.');
  return Uint8Array.from(clean.match(/../g) ?? [], (h) => parseInt(h, 16));
}

async function hmac(algo: string, key: Uint8Array, message: string) {
  const k = await crypto.subtle.importKey('raw', key.buffer as ArrayBuffer, { name: 'HMAC', hash: algo }, false, ['sign']);
  const sig = new Uint8Array(await crypto.subtle.sign('HMAC', k, new TextEncoder().encode(message)));
  return {
    hex: Array.from(sig, (b) => b.toString(16).padStart(2, '0')).join(''),
    b64: btoa(String.fromCharCode(...sig)),
  };
}

export default function HmacGenerator() {
  const [message, setMessage] = useState('{"user":"ada","amount":100}');
  const [key, setKey] = useState('my-secret-key');
  const [keyIsHex, setKeyIsHex] = useState(false);
  const [out, setOut] = useState<Record<string, { hex: string; b64: string }>>({});
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const k = keyIsHex ? hexToBytes(key) : new TextEncoder().encode(key);
        if (!k.length) { setOut({}); setError(''); return; }
        const entries = await Promise.all(ALGOS.map(async (a) => [a, await hmac(a, k, message)] as const));
        if (!cancelled) { setOut(Object.fromEntries(entries)); setError(''); }
      } catch (e) {
        if (!cancelled) { setOut({}); setError((e as Error).message); }
      }
    })();
    return () => { cancelled = true; };
  }, [message, key, keyIsHex]);

  return (
    <div className="space-y-4">
      <Field label="Message">
        <TextArea rows={5} value={message} onChange={(e) => setMessage(e.target.value)} aria-label="Message" />
      </Field>
      <Toolbar>
        <Field label="Secret key">
          <Input value={key} onChange={(e) => setKey(e.target.value)} className="w-80" aria-label="Secret key" />
        </Field>
        <Checkbox label="Key is hex-encoded" checked={keyIsHex} onChange={(e) => setKeyIsHex(e.target.checked)} />
      </Toolbar>
      <ErrorMsg>{error}</ErrorMsg>
      {ALGOS.map((a) => (
        <div key={a}>
          <ResultRow label={`HMAC-${a}`} value={out[a]?.hex ?? ''} />
          <ResultRow label="  base64" value={out[a]?.b64 ?? ''} />
        </div>
      ))}
    </div>
  );
}
