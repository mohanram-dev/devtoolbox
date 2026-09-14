import { useMemo, useState } from 'react';
import { Panel, TextArea } from './ui';

const STOP = new Set('the a an and or but of to in on at for with by from as is are was were be been it its this that these those i you he she we they me him her us them my your his our their not no yes if then so than too very can will just do does did has have had'.split(' '));

export default function WordCounter() {
  const [text, setText] = useState('');

  const s = useMemo(() => {
    const words = text.match(/[\p{L}\p{N}'’-]+/gu) ?? [];
    const sentences = text.split(/[.!?]+(?:\s|$)/).filter((x) => x.trim()).length;
    const paragraphs = text.split(/\n\s*\n/).filter((x) => x.trim()).length;
    const freq = new Map<string, number>();
    for (const w of words) {
      const k = w.toLowerCase();
      if (!STOP.has(k) && k.length > 2) freq.set(k, (freq.get(k) ?? 0) + 1);
    }
    const top = [...freq].sort((a, b) => b[1] - a[1]).slice(0, 10);
    const minutes = words.length / 225;
    return {
      chars: [...text].length,
      charsNoSpace: [...text.replace(/\s/g, '')].length,
      words: words.length,
      sentences,
      paragraphs,
      lines: text ? text.split('\n').length : 0,
      avgWord: words.length ? (words.reduce((n, w) => n + w.length, 0) / words.length).toFixed(1) : '0',
      reading: minutes < 1 ? `${Math.max(1, Math.round(minutes * 60))} sec` : `${Math.round(minutes)} min`,
      speaking: `${Math.max(1, Math.round(words.length / 150))} min`,
      top,
      bytes: new TextEncoder().encode(text).length,
    };
  }, [text]);

  const stat = (label: string, value: string | number) => (
    <div className="surface-2 rounded-xl border line px-4 py-3">
      <div className="text-2xl font-bold tabular-nums">{value}</div>
      <div className="muted text-xs font-semibold uppercase tracking-wider">{label}</div>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {stat('Words', s.words)}
        {stat('Characters', s.chars)}
        {stat('No spaces', s.charsNoSpace)}
        {stat('Sentences', s.sentences)}
        {stat('Paragraphs', s.paragraphs)}
        {stat('Reading time', s.reading)}
      </div>
      <TextArea rows={12} value={text} onChange={(e) => setText(e.target.value)} placeholder="Type or paste your text…" className="font-sans text-[15px]" aria-label="Text" />
      <div className="grid gap-4 md:grid-cols-2">
        <Panel>
          <p className="muted mb-2 text-xs font-semibold uppercase tracking-wider">Details</p>
          <dl className="grid grid-cols-2 gap-y-1 text-sm">
            <dt className="muted">Lines</dt><dd className="font-mono">{s.lines}</dd>
            <dt className="muted">Avg. word length</dt><dd className="font-mono">{s.avgWord}</dd>
            <dt className="muted">Speaking time</dt><dd className="font-mono">{s.speaking}</dd>
            <dt className="muted">UTF-8 bytes</dt><dd className="font-mono">{s.bytes}</dd>
            <dt className="muted">Tweet (280)</dt><dd className="font-mono">{s.chars <= 280 ? `${280 - s.chars} left` : `${s.chars - 280} over`}</dd>
            <dt className="muted">Meta description (155)</dt><dd className="font-mono">{s.chars <= 155 ? `${155 - s.chars} left` : `${s.chars - 155} over`}</dd>
          </dl>
        </Panel>
        <Panel>
          <p className="muted mb-2 text-xs font-semibold uppercase tracking-wider">Top keywords</p>
          {s.top.length ? (
            <ul className="space-y-1 text-sm">
              {s.top.map(([w, c]) => (
                <li key={w} className="flex items-center gap-2">
                  <span className="w-28 truncate font-mono">{w}</span>
                  <span className="h-1.5 flex-1 rounded bg-(--color-line)"><span className="block h-full rounded bg-brand-500" style={{ width: `${(c / s.top[0][1]) * 100}%` }} /></span>
                  <span className="muted w-8 text-right font-mono text-xs">{c}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="muted text-sm">Keyword density appears here.</p>
          )}
        </Panel>
      </div>
    </div>
  );
}
