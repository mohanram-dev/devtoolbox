import { useMemo, useState } from 'react';
import cronstrue from 'cronstrue';
import { CronExpressionParser } from 'cron-parser';
import { Button, ErrorMsg, Input, Panel, Toolbar } from './ui';

const PRESETS = [
  { label: 'Every minute', expr: '* * * * *' },
  { label: 'Every 15 min', expr: '*/15 * * * *' },
  { label: 'Hourly', expr: '0 * * * *' },
  { label: 'Daily at midnight', expr: '0 0 * * *' },
  { label: 'Weekdays 9am', expr: '0 9 * * 1-5' },
  { label: 'Monthly (1st)', expr: '0 0 1 * *' },
];

const FIELDS_5 = ['minute', 'hour', 'day (month)', 'month', 'day (week)'];

export default function CronParser() {
  const [expr, setExpr] = useState('*/15 9-17 * * 1-5');

  const result = useMemo<{ error: string } | { description: string; next: Date[]; parts: string[]; labels: string[] } | null>(() => {
    const trimmed = expr.trim();
    if (!trimmed) return null;
    try {
      const description = cronstrue.toString(trimmed, { use24HourTimeFormat: false, verbose: true });
      const it = CronExpressionParser.parse(trimmed);
      const next = Array.from({ length: 10 }, () => it.next().toDate());
      const parts = trimmed.split(/\s+/);
      const labels = parts.length === 6 ? ['second', ...FIELDS_5] : FIELDS_5;
      return { description, next, parts, labels };
    } catch (e) {
      return { error: String((e as Error).message ?? e).replace(/^Error:\s*/, '') };
    }
  }, [expr]);

  return (
    <div className="space-y-4">
      <Input value={expr} onChange={(e) => setExpr(e.target.value)} className="w-full font-mono text-lg" placeholder="* * * * *" aria-label="Cron expression" />
      <Toolbar>
        {PRESETS.map((p) => (
          <Button key={p.expr} variant="ghost" onClick={() => setExpr(p.expr)}>{p.label}</Button>
        ))}
      </Toolbar>

      {result && 'error' in result && <ErrorMsg>{result.error}</ErrorMsg>}

      {result && !('error' in result) && (
        <>
          <p className="text-xl font-semibold">“{result.description}”</p>
          <div className="flex flex-wrap gap-2">
            {result.parts.map((p, i) => (
              <div key={i} className="rounded-md surface-2 border line px-3 py-1.5 text-center">
                <div className="font-mono text-base">{p}</div>
                <div className="text-[11px] uppercase tracking-wide muted">{result.labels[i] ?? '?'}</div>
              </div>
            ))}
          </div>
          <Panel>
            <h3 className="mb-2 text-sm font-semibold">Next 10 runs (local time, {Intl.DateTimeFormat().resolvedOptions().timeZone})</h3>
            <ol className="space-y-1 font-mono text-sm">
              {result.next.map((d, i) => (
                <li key={i} className="flex gap-3">
                  <span className="w-5 muted opacity-70">{i + 1}.</span>
                  <span>{d.toLocaleString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                </li>
              ))}
            </ol>
          </Panel>
        </>
      )}
    </div>
  );
}
