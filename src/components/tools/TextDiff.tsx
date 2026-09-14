import { useMemo, useState } from 'react';
import { diffLines, diffWords, diffWordsWithSpace, type Change } from 'diff';
import { Checkbox, Segmented, TextArea, Toolbar } from './ui';

const A = `{
  "name": "devtoolbox",
  "version": "1.0.0",
  "private": false
}`;
const B = `{
  "name": "devtoolbox",
  "version": "1.1.0",
  "private": true,
  "license": "MIT"
}`;

export default function TextDiff() {
  const [left, setLeft] = useState(A);
  const [right, setRight] = useState(B);
  const [mode, setMode] = useState<'line' | 'word'>('line');
  const [ignoreWs, setIgnoreWs] = useState(false);

  const changes = useMemo<Change[]>(
    () => {
      if (mode === 'line') return diffLines(left, right, { ignoreWhitespace: ignoreWs });
      // diffWords already treats whitespace as insignificant; diffWordsWithSpace keeps it.
      return ignoreWs ? diffWords(left, right) : diffWordsWithSpace(left, right);
    },
    [left, right, mode, ignoreWs],
  );

  const added = changes.filter((c) => c.added).reduce((n, c) => n + (c.count ?? 0), 0);
  const removed = changes.filter((c) => c.removed).reduce((n, c) => n + (c.count ?? 0), 0);
  const unit = mode === 'line' ? 'lines' : 'words';

  return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-2">
        <TextArea rows={10} value={left} onChange={(e) => setLeft(e.target.value)} placeholder="Original text" aria-label="Original text" />
        <TextArea rows={10} value={right} onChange={(e) => setRight(e.target.value)} placeholder="Modified text" aria-label="Modified text" />
      </div>
      <Toolbar>
        <Segmented value={mode} onChange={setMode} options={[{ value: 'line', label: 'Lines' }, { value: 'word', label: 'Words' }]} />
        <Checkbox label="Ignore whitespace" checked={ignoreWs} onChange={(e) => setIgnoreWs(e.target.checked)} />
        <span className="text-sm muted">
          <span className="text-green-600">+{added}</span> / <span className="text-red-600">−{removed}</span> {unit}
        </span>
      </Toolbar>

      <pre className="overflow-x-auto rounded-xl surface-2 border line p-3 font-mono text-sm leading-6">
        {mode === 'line'
          ? changes.flatMap((c, i) =>
              c.value.replace(/\n$/, '').split('\n').map((line, j) => (
                <div
                  key={`${i}-${j}`}
                  className={
                    c.added
                      ? 'bg-green-100 text-green-900 dark:bg-green-900/40 dark:text-green-200'
                      : c.removed
                        ? 'bg-red-100 text-red-900 dark:bg-red-900/40 dark:text-red-200'
                        : ''
                  }
                >
                  <span className="mr-3 inline-block w-3 select-none muted opacity-70">{c.added ? '+' : c.removed ? '−' : ' '}</span>
                  {line || ' '}
                </div>
              )),
            )
          : changes.map((c, i) => (
              <span
                key={i}
                className={
                  c.added
                    ? 'rounded bg-green-200 dark:bg-green-800/60'
                    : c.removed
                      ? 'rounded bg-red-200 line-through dark:bg-red-800/60'
                      : ''
                }
              >
                {c.value}
              </span>
            ))}
      </pre>
    </div>
  );
}
