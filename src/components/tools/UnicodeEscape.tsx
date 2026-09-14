import { useMemo, useState } from 'react';
import { CopyButton, ErrorMsg, Field, Segmented, TextArea, Toolbar } from './ui';

type Style = 'js' | 'css' | 'html' | 'python' | 'java';

const encoders: Record<Style, (ch: string, cp: number) => string> = {
  js: (_, cp) => (cp > 0xffff ? `\\u{${cp.toString(16)}}` : `\\u${cp.toString(16).padStart(4, '0')}`),
  css: (_, cp) => `\\${cp.toString(16)} `,
  html: (_, cp) => `&#x${cp.toString(16).toUpperCase()};`,
  python: (_, cp) => (cp > 0xffff ? `\\U${cp.toString(16).padStart(8, '0')}` : `\\u${cp.toString(16).padStart(4, '0')}`),
  java: (ch) => Array.from(ch, (c) => `\\u${c.charCodeAt(0).toString(16).padStart(4, '0')}`).join(''),
};

function encode(text: string, style: Style, all: boolean): string {
  let out = '';
  for (const ch of text) {
    const cp = ch.codePointAt(0)!;
    out += !all && cp < 128 ? ch : encoders[style](ch, cp);
  }
  return out;
}

function decode(text: string): string {
  return text
    .replace(/\\u\{([0-9a-f]+)\}/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/\\U([0-9a-f]{8})/g, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/\\u([0-9a-f]{4})/gi, (_, h) => String.fromCharCode(parseInt(h, 16)))
    .replace(/\\x([0-9a-f]{2})/gi, (_, h) => String.fromCharCode(parseInt(h, 16)))
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/U\+([0-9a-f]{4,6})/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)));
}

export default function UnicodeEscape() {
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [style, setStyle] = useState<Style>('js');
  const [all, setAll] = useState(false);
  const [input, setInput] = useState('Café ☕ → “smart quotes” 🚀');

  const { output, error } = useMemo(() => {
    if (!input) return { output: '', error: '' };
    try {
      return { output: mode === 'encode' ? encode(input, style, all) : decode(input), error: '' };
    } catch (e) {
      return { output: '', error: (e as Error).message };
    }
  }, [input, mode, style, all]);

  const chars = Array.from(input);

  return (
    <div className="space-y-4">
      <Toolbar>
        <Segmented value={mode} onChange={setMode} options={[{ value: 'encode', label: 'Escape' }, { value: 'decode', label: 'Unescape' }]} />
        {mode === 'encode' && (
          <>
            <Field label="Style">
              <select value={style} onChange={(e) => setStyle(e.target.value as Style)} className="surface-2 rounded-lg border line px-2 py-1.5 text-sm">
                <option value="js">JavaScript / JSON \uXXXX</option>
                <option value="python">Python \uXXXX / \UXXXXXXXX</option>
                <option value="java">Java / C# \uXXXX (UTF-16)</option>
                <option value="css">CSS \XXXX</option>
                <option value="html">HTML &amp;#xXXXX;</option>
              </select>
            </Field>
            <label className="inline-flex items-center gap-2 text-sm"><input type="checkbox" checked={all} onChange={(e) => setAll(e.target.checked)} className="h-4 w-4 accent-brand-500" />Escape ASCII too</label>
          </>
        )}
      </Toolbar>
      <div className="grid gap-4 lg:grid-cols-2">
        <TextArea rows={6} value={input} onChange={(e) => setInput(e.target.value)} placeholder={mode === 'encode' ? 'Text with Unicode…' : '\\u00e9 \\u{1F680} &#x2192; U+2603 …'} aria-label="Input" />
        <div className="space-y-2">
          <TextArea rows={6} readOnly value={output} placeholder="Result" aria-label="Output" />
          <div className="flex justify-end"><CopyButton text={output} /></div>
        </div>
      </div>
      <ErrorMsg>{error}</ErrorMsg>
      {mode === 'encode' && chars.length > 0 && chars.length <= 64 && (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="muted uppercase"><tr><th className="py-1 pr-3">Char</th><th className="py-1 pr-3">Code point</th><th className="py-1 pr-3">Decimal</th><th className="py-1">UTF-8 bytes</th></tr></thead>
            <tbody className="font-mono">
              {chars.map((ch, i) => {
                const cp = ch.codePointAt(0)!;
                const bytes = Array.from(new TextEncoder().encode(ch), (b) => b.toString(16).padStart(2, '0')).join(' ');
                return (
                  <tr key={i} className="border-t line">
                    <td className="py-1 pr-3 text-base">{ch === ' ' ? '␠' : ch}</td>
                    <td className="py-1 pr-3">U+{cp.toString(16).toUpperCase().padStart(4, '0')}</td>
                    <td className="py-1 pr-3">{cp}</td>
                    <td className="py-1">{bytes}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
