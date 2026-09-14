import { useEffect, useMemo, useState } from 'react';
import { Button, CopyButton, ErrorMsg, Field, Input, Panel, ResultRow } from './ui';

function pad(n: number) { return String(n).padStart(2, '0'); }
/** Format a Date as the value expected by <input type="datetime-local"> (local time). */
function toLocalInput(d: Date) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

function relative(ms: number): string {
  const diff = ms - Date.now();
  const abs = Math.abs(diff);
  const units: [string, number][] = [['year', 31536e6], ['month', 2592e6], ['day', 864e5], ['hour', 36e5], ['minute', 6e4], ['second', 1e3]];
  for (const [name, size] of units) {
    if (abs >= size || name === 'second') {
      const n = Math.round(abs / size);
      return diff < 0 ? `${n} ${name}${n === 1 ? '' : 's'} ago` : `in ${n} ${name}${n === 1 ? '' : 's'}`;
    }
  }
  return '';
}

export default function TimestampConverter() {
  const [now, setNow] = useState(() => Date.now());
  const [ts, setTs] = useState('');
  const [local, setLocal] = useState(() => toLocalInput(new Date()));

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const fromTs = useMemo<{ error: string } | { d: Date; unit: string } | null>(() => {
    const raw = ts.trim();
    if (!raw) return null;
    if (!/^-?\d+(\.\d+)?$/.test(raw)) return { error: 'Enter a numeric timestamp (seconds or milliseconds).' };
    const n = Number(raw);
    const seconds = Math.abs(n) < 1e11; // < 1e11 seconds ≈ year 5138, so treat as seconds
    const d = new Date(seconds ? n * 1000 : n);
    if (isNaN(d.getTime())) return { error: 'Timestamp is out of range.' };
    return { d, unit: seconds ? 'seconds' : 'milliseconds' };
  }, [ts]);

  const fromDate = useMemo(() => {
    const d = new Date(local);
    return isNaN(d.getTime()) ? null : d;
  }, [local]);

  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;

  return (
    <div className="space-y-6">
      <Panel className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-xs uppercase tracking-wide muted">Current Unix time</div>
          <div className="font-mono text-3xl font-semibold tabular-nums">{Math.floor(now / 1000)}</div>
          <div className="font-mono text-xs muted">{now} ms</div>
        </div>
        <div className="flex gap-2">
          <CopyButton text={String(Math.floor(now / 1000))} label="Copy seconds" />
          <CopyButton text={String(now)} label="Copy ms" />
        </div>
      </Panel>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="space-y-3">
          <h3 className="font-semibold">Timestamp → Date</h3>
          <div className="flex gap-2">
            <Input value={ts} onChange={(e) => setTs(e.target.value)} placeholder="1700000000" className="flex-1" aria-label="Unix timestamp" />
            <Button onClick={() => setTs(String(Math.floor(Date.now() / 1000)))}>Now</Button>
          </div>
          {fromTs && 'error' in fromTs && <ErrorMsg>{fromTs.error}</ErrorMsg>}
          {fromTs && 'd' in fromTs && (
            <div>
              <p className="mb-1 text-xs muted">Interpreted as {fromTs.unit} · {relative(fromTs.d.getTime())}</p>
              <ResultRow label="ISO 8601" value={fromTs.d.toISOString()} />
              <ResultRow label="UTC" value={fromTs.d.toUTCString()} />
              <ResultRow label={`Local (${tz})`} value={fromTs.d.toLocaleString()} mono={false} />
              <ResultRow label="RFC 2822" value={fromTs.d.toString()} mono={false} />
            </div>
          )}
        </section>

        <section className="space-y-3">
          <h3 className="font-semibold">Date → Timestamp</h3>
          <Field label={`Local date & time (${tz})`}>
            <Input type="datetime-local" step={1} value={local} onChange={(e) => setLocal(e.target.value)} className="w-full" />
          </Field>
          {fromDate && (
            <div>
              <ResultRow label="Seconds" value={String(Math.floor(fromDate.getTime() / 1000))} />
              <ResultRow label="Milliseconds" value={String(fromDate.getTime())} />
              <ResultRow label="ISO 8601" value={fromDate.toISOString()} />
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
