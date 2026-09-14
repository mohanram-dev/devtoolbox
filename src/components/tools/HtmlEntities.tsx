import { useMemo, useState } from 'react';
import { Checkbox, CopyButton, Segmented, TextArea, Toolbar } from './ui';

const NAMED: Record<string, string> = {
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  '©': '&copy;', '®': '&reg;', '™': '&trade;', '€': '&euro;', '£': '&pound;', '¥': '&yen;',
  '§': '&sect;', '°': '&deg;', '±': '&plusmn;', '×': '&times;', '÷': '&divide;',
  '—': '&mdash;', '–': '&ndash;', '…': '&hellip;', '«': '&laquo;', '»': '&raquo;',
  ' ': '&nbsp;', '←': '&larr;', '→': '&rarr;', '↑': '&uarr;', '↓': '&darr;',
};

export function encodeEntities(text: string, all: boolean): string {
  let out = '';
  for (const ch of text) {
    if (NAMED[ch]) out += NAMED[ch];
    else if (all && ch.codePointAt(0)! > 127) out += `&#${ch.codePointAt(0)};`;
    else out += ch;
  }
  return out;
}

export function decodeEntities(text: string): string {
  // The browser's parser knows every named entity; reading textContent decodes without executing anything.
  const el = document.createElement('textarea');
  el.innerHTML = text;
  return el.value;
}

export default function HtmlEntities() {
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [all, setAll] = useState(false);
  const [input, setInput] = useState('<a href="/?a=1&b=2">Tom & Jerry™ — “quotes”</a>');

  const output = useMemo(() => {
    if (!input) return '';
    return mode === 'encode' ? encodeEntities(input, all) : decodeEntities(input);
  }, [input, mode, all]);

  return (
    <div className="space-y-4">
      <Toolbar>
        <Segmented value={mode} onChange={setMode} options={[{ value: 'encode', label: 'Encode' }, { value: 'decode', label: 'Decode' }]} />
        {mode === 'encode' && <Checkbox label="Encode all non-ASCII as &#…;" checked={all} onChange={(e) => setAll(e.target.checked)} />}
      </Toolbar>
      <div className="grid gap-4 lg:grid-cols-2">
        <TextArea rows={8} value={input} onChange={(e) => setInput(e.target.value)} placeholder={mode === 'encode' ? 'Text or HTML to escape…' : 'Text with &amp; &lt; &#39; entities…'} aria-label="Input" />
        <div className="space-y-2">
          <TextArea rows={8} readOnly value={output} placeholder="Result" aria-label="Output" />
          <div className="flex justify-end"><CopyButton text={output} /></div>
        </div>
      </div>
    </div>
  );
}
