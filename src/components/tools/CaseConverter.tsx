import { useState } from 'react';
import { caseConverters, convertLines } from '../../lib/text';
import { CopyButton, TextArea } from './ui';

export default function CaseConverter() {
  const [input, setInput] = useState('Hello World from DevToolbox');

  return (
    <div className="space-y-4">
      <TextArea rows={4} value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type or paste text (one item per line)…" aria-label="Input text" />
      <div className="grid gap-3 sm:grid-cols-2">
        {caseConverters.map((c) => {
          const value = convertLines(input, c.fn);
          return (
            <div key={c.key} className="rounded-lg border line p-3">
              <div className="mb-1 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wide muted">{c.label}</span>
                <CopyButton text={value} />
              </div>
              <pre className="overflow-x-auto whitespace-pre-wrap break-words font-mono text-sm">{value || ' '}</pre>
            </div>
          );
        })}
      </div>
    </div>
  );
}
