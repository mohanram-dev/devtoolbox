import { useMemo, useRef, useState } from 'react';
import { Button, CopyButton, ErrorMsg, Panel, ResultRow, Segmented, TextArea } from './ui';

function fmtBytes(n: number) {
  return n < 1024 ? `${n} B` : n < 1048576 ? `${(n / 1024).toFixed(1)} KB` : `${(n / 1048576).toFixed(2)} MB`;
}

export default function ImageBase64() {
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [dataUrl, setDataUrl] = useState('');
  const [file, setFile] = useState<{ name: string; type: string; size: number } | null>(null);
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const [drag, setDrag] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = (f?: File | null) => {
    if (!f) return;
    if (!f.type.startsWith('image/')) { setError('Please choose an image file (PNG, JPG, GIF, SVG, WebP…).'); return; }
    if (f.size > 10 * 1024 * 1024) { setError('Images over 10 MB are not supported.'); return; }
    const r = new FileReader();
    r.onload = () => { setDataUrl(r.result as string); setFile({ name: f.name, type: f.type, size: f.size }); setError(''); };
    r.readAsDataURL(f);
  };

  const rawBase64 = dataUrl.split(',')[1] ?? '';

  const decoded = useMemo(() => {
    const s = input.trim();
    if (!s) return null;
    if (s.startsWith('data:image/')) return s;
    if (/^[A-Za-z0-9+/=\s]+$/.test(s)) {
      const b = s.replace(/\s/g, '');
      const sig = b.slice(0, 5);
      const type = sig.startsWith('iVBOR') ? 'png' : sig.startsWith('/9j/') ? 'jpeg' : sig.startsWith('R0lGO') ? 'gif' : sig.startsWith('UklGR') ? 'webp' : sig.startsWith('PHN2Z') || sig.startsWith('PD94b') ? 'svg+xml' : 'png';
      return `data:image/${type};base64,${b}`;
    }
    return 'invalid';
  }, [input]);

  return (
    <div className="space-y-4">
      <Segmented value={mode} onChange={setMode} options={[{ value: 'encode', label: 'Image → Base64' }, { value: 'decode', label: 'Base64 → Image' }]} />

      {mode === 'encode' ? (
        <>
          <div
            onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
            onDragLeave={() => setDrag(false)}
            onDrop={(e) => { e.preventDefault(); setDrag(false); load(e.dataTransfer.files[0]); }}
            onClick={() => fileRef.current?.click()}
            className={`surface-2 grid cursor-pointer place-items-center rounded-xl border-2 border-dashed p-8 text-center transition ${drag ? 'border-brand-400 bg-brand-50 dark:bg-brand-500/10' : 'line'}`}
          >
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => load(e.target.files?.[0])} />
            <p className="font-medium">Drop an image here, or click to choose</p>
            <p className="muted mt-1 text-xs">PNG, JPG, GIF, SVG, WebP · up to 10 MB · never uploaded</p>
          </div>
          <ErrorMsg>{error}</ErrorMsg>
          {dataUrl && file && (
            <div className="grid gap-4 lg:grid-cols-[200px_1fr]">
              <Panel className="grid place-items-center"><img src={dataUrl} alt={file.name} className="max-h-40 max-w-full rounded" /></Panel>
              <div>
                <ResultRow label="File" value={`${file.name} · ${file.type} · ${fmtBytes(file.size)}`} mono={false} />
                <ResultRow label="Base64 size" value={`${fmtBytes(rawBase64.length)} (+${Math.round((rawBase64.length / file.size - 1) * 100)}%)`} mono={false} />
                <ResultRow label="Data URL" value={dataUrl} />
                <ResultRow label="CSS" value={`background-image: url("${dataUrl}");`} />
                <ResultRow label="HTML" value={`<img src="${dataUrl}" alt="">`} />
                <ResultRow label="Raw Base64" value={rawBase64} />
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-2">
            <TextArea rows={10} value={input} onChange={(e) => setInput(e.target.value)} placeholder="Paste a data URL or raw Base64 image string…" aria-label="Base64 input" />
            <Button variant="ghost" onClick={() => setInput('')}>Clear</Button>
          </div>
          <Panel className="grid min-h-[10rem] place-items-center">
            {decoded === 'invalid' ? (
              <ErrorMsg>That does not look like Base64 image data.</ErrorMsg>
            ) : decoded ? (
              <div className="space-y-3 text-center">
                <img src={decoded} alt="Decoded" className="mx-auto max-h-64 max-w-full rounded" onError={() => setError('Could not render — the data may be truncated or not an image.')} />
                <a href={decoded} download="image" className="text-sm text-brand-500 underline">Download image</a>
              </div>
            ) : (
              <p className="muted text-sm">Preview appears here</p>
            )}
          </Panel>
        </div>
      )}
      {mode === 'decode' && <ErrorMsg>{error}</ErrorMsg>}
      {dataUrl && mode === 'encode' && <div className="flex justify-end"><CopyButton text={dataUrl} label="Copy data URL" /></div>}
    </div>
  );
}
