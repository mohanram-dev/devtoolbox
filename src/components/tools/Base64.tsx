import { useMemo, useState } from 'react';
import { Checkbox, CopyButton, ErrorMsg, Segmented, TextArea, Toolbar } from './ui';

export function encodeBase64(text: string, urlSafe: boolean): string {
  const bytes = new TextEncoder().encode(text);
  let bin = '';
  bytes.forEach((b) => (bin += String.fromCharCode(b)));
  const b64 = btoa(bin);
  return urlSafe ? b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '') : b64;
}

export function decodeBase64(b64: string): string {
  const normalised = b64.trim().replace(/-/g, '+').replace(/_/g, '/').replace(/\s+/g, '');
  const padded = normalised + '='.repeat((4 - (normalised.length % 4)) % 4);
  const bin = atob(padded);
  const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
  return new TextDecoder('utf-8', { fatal: true }).decode(bytes);
}

export default function Base64() {
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [urlSafe, setUrlSafe] = useState(false);
  const [input, setInput] = useState('');

  const { output, error } = useMemo(() => {
    if (!input) return { output: '', error: '' };
    try {
      return { output: mode === 'encode' ? encodeBase64(input, urlSafe) : decodeBase64(input), error: '' };
    } catch {
      return { output: '', error: 'Invalid Base64 input — check for stray characters or a truncated string.' };
    }
  }, [input, mode, urlSafe]);

  return (
    <div className="space-y-4">
      <Toolbar>
        <Segmented value={mode} onChange={setMode} options={[{ value: 'encode', label: 'Encode' }, { value: 'decode', label: 'Decode' }]} />
        {mode === 'encode' && <Checkbox label="URL-safe" checked={urlSafe} onChange={(e) => setUrlSafe(e.target.checked)} />}
      </Toolbar>
      <div className="grid gap-4 lg:grid-cols-2">
        <TextArea rows={10} value={input} onChange={(e) => setInput(e.target.value)} placeholder={mode === 'encode' ? 'Text to encode…' : 'Base64 to decode…'} aria-label="Input" />
        <div className="space-y-2">
          <TextArea rows={10} readOnly value={output} placeholder="Result" aria-label="Output" />
          <div className="flex justify-end"><CopyButton text={output} /></div>
        </div>
      </div>
      <ErrorMsg>{error}</ErrorMsg>
    </div>
  );
}
