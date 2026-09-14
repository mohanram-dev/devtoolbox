import { useMemo, useState } from 'react';
import beautify from 'js-beautify';

const { js, css, html } = beautify;
import { CopyButton, ErrorMsg, Segmented, TextArea, Toolbar } from './ui';

type Lang = 'html' | 'css' | 'js';

const SAMPLES: Record<Lang, string> = {
  html: '<!doctype html><html><head><title>Demo</title></head><body><div class="card"><h1>Hello</h1><p>Some <b>bold</b> text.</p><ul><li>One</li><li>Two</li></ul></div></body></html>',
  css: '.card{padding:1rem;border:1px solid #ddd;border-radius:.5rem}.card h1{font-size:1.5rem;margin:0 0 .5rem}@media (max-width:600px){.card{padding:.5rem}}',
  js: 'function greet(name){if(!name){return "Hello, stranger"}const parts=name.split(" ");return `Hello, ${parts[0]}!`}export default greet;',
};

/** Whitespace/comment minifiers. Deliberately conservative — no renaming, no dead-code removal. */
const minifiers: Record<Lang, (s: string) => string> = {
  css: (s) =>
    s
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/\s+/g, ' ')
      .replace(/\s*([{}:;,>])\s*/g, '$1')
      .replace(/;}/g, '}')
      .trim(),
  html: (s) =>
    s
      .replace(/<!--(?!\[if)[\s\S]*?-->/g, '')
      .replace(/>\s+</g, '><')
      .replace(/\s{2,}/g, ' ')
      .trim(),
  js: (s) =>
    s
      .replace(/^\s*\/\/.*$/gm, '')
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean)
      .join('\n'),
};

export default function CodeBeautifier() {
  const [lang, setLang] = useState<Lang>('html');
  const [mode, setMode] = useState<'beautify' | 'minify'>('beautify');
  const [indent, setIndent] = useState<'2' | '4' | 'tab'>('2');
  const [input, setInput] = useState(SAMPLES.html);

  const switchLang = (l: Lang) => { setLang(l); setInput(SAMPLES[l]); };

  const { output, error } = useMemo(() => {
    if (!input.trim()) return { output: '', error: '' };
    try {
      if (mode === 'minify') return { output: minifiers[lang](input), error: '' };
      const opts = { indent_size: indent === 'tab' ? 1 : Number(indent), indent_with_tabs: indent === 'tab', end_with_newline: true };
      const fn = lang === 'html' ? html : lang === 'css' ? css : js;
      return { output: fn(input, opts), error: '' };
    } catch (e) {
      return { output: '', error: (e as Error).message };
    }
  }, [input, lang, mode, indent]);

  const saved = input.length && output.length ? Math.round((1 - output.length / input.length) * 100) : 0;

  return (
    <div className="space-y-4">
      <Toolbar>
        <Segmented value={lang} onChange={switchLang} options={[{ value: 'html', label: 'HTML' }, { value: 'css', label: 'CSS' }, { value: 'js', label: 'JavaScript' }]} />
        <Segmented value={mode} onChange={setMode} options={[{ value: 'beautify', label: 'Beautify' }, { value: 'minify', label: 'Minify' }]} />
        {mode === 'beautify' && (
          <select value={indent} onChange={(e) => setIndent(e.target.value as typeof indent)} className="surface-2 rounded-lg border line px-2 py-1.5 text-sm" aria-label="Indent">
            <option value="2">2 spaces</option>
            <option value="4">4 spaces</option>
            <option value="tab">Tabs</option>
          </select>
        )}
        {mode === 'minify' && output && <span className="muted text-xs">{input.length} → {output.length} chars ({saved}% smaller)</span>}
        <CopyButton text={output} className="ml-auto" />
      </Toolbar>
      <div className="grid gap-4 lg:grid-cols-2">
        <TextArea rows={16} value={input} onChange={(e) => setInput(e.target.value)} placeholder={`Paste ${lang.toUpperCase()}…`} aria-label="Code input" />
        <TextArea rows={16} readOnly value={output} placeholder="Result" aria-label="Code output" />
      </div>
      <ErrorMsg>{error}</ErrorMsg>
      {mode === 'minify' && lang === 'js' && (
        <p className="muted text-xs">JavaScript minify removes comments and indentation only — it does not rename variables or rewrite code, so the result is always safe to run. Use a build tool (esbuild, terser) for aggressive compression.</p>
      )}
    </div>
  );
}
