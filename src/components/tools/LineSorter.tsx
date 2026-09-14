import { useMemo, useState } from 'react';
import { Checkbox, CopyButton, Field, TextArea, Toolbar } from './ui';

type Sort = 'none' | 'az' | 'za' | 'numeric' | 'length' | 'shuffle' | 'reverse';

export default function LineSorter() {
  const [input, setInput] = useState('banana\napple\ncherry\napple\n\nBanana\n  date  \n10\n2');
  const [sort, setSort] = useState<Sort>('az');
  const [dedupe, setDedupe] = useState(true);
  const [caseInsensitive, setCaseInsensitive] = useState(false);
  const [trim, setTrim] = useState(true);
  const [dropEmpty, setDropEmpty] = useState(true);
  const [seed, setSeed] = useState(0);

  const { output, before, after, removed } = useMemo(() => {
    let lines = input.split(/\r?\n/);
    const before = lines.length;
    if (trim) lines = lines.map((l) => l.trim());
    if (dropEmpty) lines = lines.filter((l) => l !== '');
    let removed = 0;
    if (dedupe) {
      const seen = new Set<string>();
      lines = lines.filter((l) => {
        const k = caseInsensitive ? l.toLowerCase() : l;
        if (seen.has(k)) { removed++; return false; }
        seen.add(k); return true;
      });
    }
    const cmp = (a: string, b: string) => (caseInsensitive ? a.toLowerCase().localeCompare(b.toLowerCase()) : a.localeCompare(b));
    switch (sort) {
      case 'az': lines.sort(cmp); break;
      case 'za': lines.sort((a, b) => cmp(b, a)); break;
      case 'numeric': lines.sort((a, b) => (parseFloat(a) || 0) - (parseFloat(b) || 0) || cmp(a, b)); break;
      case 'length': lines.sort((a, b) => a.length - b.length || cmp(a, b)); break;
      case 'reverse': lines.reverse(); break;
      case 'shuffle': { let s = seed + 1; const rnd = () => { s = (s * 16807) % 2147483647; return s / 2147483647; }; for (let i = lines.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [lines[i], lines[j]] = [lines[j], lines[i]]; } break; }
    }
    return { output: lines.join('\n'), before, after: lines.length, removed };
  }, [input, sort, dedupe, caseInsensitive, trim, dropEmpty, seed]);

  return (
    <div className="space-y-4">
      <Toolbar>
        <Field label="Sort">
          <select value={sort} onChange={(e) => { setSort(e.target.value as Sort); setSeed((s) => s + 1); }} className="surface-2 rounded-lg border line px-2 py-1.5 text-sm">
            <option value="none">Keep order</option>
            <option value="az">A → Z</option>
            <option value="za">Z → A</option>
            <option value="numeric">Numeric</option>
            <option value="length">By length</option>
            <option value="reverse">Reverse</option>
            <option value="shuffle">Shuffle</option>
          </select>
        </Field>
        <Checkbox label="Remove duplicates" checked={dedupe} onChange={(e) => setDedupe(e.target.checked)} />
        <Checkbox label="Ignore case" checked={caseInsensitive} onChange={(e) => setCaseInsensitive(e.target.checked)} />
        <Checkbox label="Trim whitespace" checked={trim} onChange={(e) => setTrim(e.target.checked)} />
        <Checkbox label="Drop empty lines" checked={dropEmpty} onChange={(e) => setDropEmpty(e.target.checked)} />
      </Toolbar>
      <div className="grid gap-4 lg:grid-cols-2">
        <TextArea rows={14} value={input} onChange={(e) => setInput(e.target.value)} placeholder="One item per line…" aria-label="Input lines" />
        <div className="space-y-2">
          <TextArea rows={14} readOnly value={output} aria-label="Output lines" />
          <div className="flex items-center justify-between">
            <span className="muted text-xs">{before} → {after} lines{dedupe && removed > 0 && ` · ${removed} duplicate${removed === 1 ? '' : 's'} removed`}</span>
            <CopyButton text={output} />
          </div>
        </div>
      </div>
    </div>
  );
}
