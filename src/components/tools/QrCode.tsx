import { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { Button, ErrorMsg, Field, Input, TextArea, Toolbar } from './ui';

type Level = 'L' | 'M' | 'Q' | 'H';

export default function QrCode() {
  const [text, setText] = useState('https://devtools.9blog.in/');
  const [size, setSize] = useState(256);
  const [level, setLevel] = useState<Level>('M');
  const [fg, setFg] = useState('#000000');
  const [bg, setBg] = useState('#ffffff');
  const [error, setError] = useState('');
  const [svg, setSvg] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    if (!text) { setError(''); setSvg(''); return; }
    const opts = { errorCorrectionLevel: level, width: size, margin: 2, color: { dark: fg, light: bg } };
    QRCode.toCanvas(canvasRef.current, text, opts)
      .then(() => QRCode.toString(text, { ...opts, type: 'svg' }))
      .then((s) => { setSvg(s); setError(''); })
      .catch((e) => setError((e as Error).message));
  }, [text, size, level, fg, bg]);

  const download = (type: 'png' | 'svg') => {
    const a = document.createElement('a');
    if (type === 'png') a.href = canvasRef.current!.toDataURL('image/png');
    else a.href = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }));
    a.download = `qr-code.${type}`;
    a.click();
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_auto]">
      <div className="space-y-4">
        <TextArea rows={4} value={text} onChange={(e) => setText(e.target.value)} placeholder="URL, text, Wi-Fi string, vCard…" aria-label="QR content" />
        <Toolbar>
          <Field label={`Size: ${size}px`}>
            <Input type="range" min={128} max={1024} step={32} value={size} onChange={(e) => setSize(Number(e.target.value))} className="w-40 accent-brand-500" />
          </Field>
          <Field label="Error correction">
            <select value={level} onChange={(e) => setLevel(e.target.value as Level)} className="surface-2 rounded-lg border line px-2 py-1.5 text-sm">
              <option value="L">L — 7%</option>
              <option value="M">M — 15%</option>
              <option value="Q">Q — 25%</option>
              <option value="H">H — 30%</option>
            </select>
          </Field>
          <Field label="Foreground"><input type="color" value={fg} onChange={(e) => setFg(e.target.value)} className="h-9 w-12 cursor-pointer rounded border line bg-transparent" /></Field>
          <Field label="Background"><input type="color" value={bg} onChange={(e) => setBg(e.target.value)} className="h-9 w-12 cursor-pointer rounded border line bg-transparent" /></Field>
        </Toolbar>
        <ErrorMsg>{error}</ErrorMsg>
        <Toolbar>
          <Button variant="primary" onClick={() => download('png')} disabled={!text || !!error}>Download PNG</Button>
          <Button onClick={() => download('svg')} disabled={!svg}>Download SVG</Button>
        </Toolbar>
        <p className="muted text-xs">{text.length} characters · higher error correction lets the code survive damage or a logo overlay, at the cost of density.</p>
      </div>
      <div className="surface-2 flex items-center justify-center rounded-xl border line p-4">
        <canvas ref={canvasRef} className="max-w-full rounded" style={{ width: Math.min(size, 280), height: Math.min(size, 280) }} aria-label="QR code preview" />
      </div>
    </div>
  );
}
