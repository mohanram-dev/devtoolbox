import { useMemo, useState, type ReactNode } from 'react';
import { Checkbox, ErrorMsg, Input, Panel, TextArea, Toolbar } from './ui';

const FLAGS = [
  { f: 'g', label: 'global' },
  { f: 'i', label: 'ignore case' },
  { f: 'm', label: 'multiline' },
  { f: 's', label: 'dotAll' },
  { f: 'u', label: 'unicode' },
];

interface Match { index: number; text: string; groups: { name: string; value: string | undefined }[] }

export default function RegexTester() {
  const [pattern, setPattern] = useState('(?<year>\\d{4})-(?<month>\\d{2})-(?<day>\\d{2})');
  const [flags, setFlags] = useState('g');
  const [text, setText] = useState('Releases: 2024-01-15, 2024-06-30 and 2025-02-01.');

  const toggle = (f: string) => setFlags((cur) => (cur.includes(f) ? cur.replace(f, '') : cur + f));

  const { matches, error, highlighted } = useMemo(() => {
    if (!pattern) return { matches: [] as Match[], error: '', highlighted: text };
    let re: RegExp;
    try {
      re = new RegExp(pattern, flags);
    } catch (e) {
      return { matches: [] as Match[], error: (e as Error).message, highlighted: text };
    }
    const matches: Match[] = [];
    const nodes: ReactNode[] = [];
    let last = 0;
    let guard = 0;
    for (const m of re.global ? text.matchAll(re) : [text.match(re)].filter(Boolean) as RegExpMatchArray[]) {
      if (++guard > 5000) break;
      const idx = m.index ?? 0;
      const named = m.groups ? Object.entries(m.groups).map(([name, value]) => ({ name, value })) : [];
      const numbered = m.slice(1).map((value, i) => ({ name: String(i + 1), value }));
      matches.push({ index: idx, text: m[0], groups: [...numbered, ...named] });
      nodes.push(text.slice(last, idx));
      nodes.push(
        <mark key={idx + ':' + guard} className="rounded bg-yellow-200 px-0.5 dark:bg-yellow-700/60 dark:text-white">
          {m[0] || '​'}
        </mark>,
      );
      last = idx + m[0].length;
    }
    nodes.push(text.slice(last));
    return { matches, error: '', highlighted: nodes };
  }, [pattern, flags, text]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-mono muted opacity-70">/</span>
        <Input value={pattern} onChange={(e) => setPattern(e.target.value)} className="min-w-0 flex-1 font-mono" placeholder="pattern" aria-label="Regular expression" />
        <span className="font-mono muted opacity-70">/{flags}</span>
      </div>
      <Toolbar>
        {FLAGS.map(({ f, label }) => (
          <Checkbox key={f} label={`${f} — ${label}`} checked={flags.includes(f)} onChange={() => toggle(f)} />
        ))}
      </Toolbar>
      <ErrorMsg>{error}</ErrorMsg>

      <div className="grid gap-4 lg:grid-cols-2">
        <TextArea rows={10} value={text} onChange={(e) => setText(e.target.value)} placeholder="Test string…" aria-label="Test string" />
        <Panel className="min-h-[10rem] whitespace-pre-wrap break-words font-mono text-sm leading-6">{highlighted}</Panel>
      </div>

      <div>
        <h3 className="mb-2 text-sm font-semibold">
          {matches.length} match{matches.length === 1 ? '' : 'es'}
        </h3>
        {matches.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs uppercase muted">
                <tr><th className="py-1 pr-4">#</th><th className="py-1 pr-4">Index</th><th className="py-1 pr-4">Match</th><th className="py-1">Groups</th></tr>
              </thead>
              <tbody>
                {matches.slice(0, 200).map((m, i) => (
                  <tr key={i} className="border-t line align-top">
                    <td className="py-1 pr-4 muted">{i + 1}</td>
                    <td className="py-1 pr-4 font-mono">{m.index}</td>
                    <td className="py-1 pr-4 font-mono">{m.text}</td>
                    <td className="py-1 font-mono text-xs">
                      {m.groups.map((g) => (
                        <div key={g.name}><span className="muted">{g.name}:</span> {g.value ?? <em>undefined</em>}</div>
                      ))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
