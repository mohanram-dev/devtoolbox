import { useMemo, useState } from 'react';
import { Button, Checkbox, Field, Input, Panel, Toolbar } from './ui';

const iso = (d: Date) => d.toISOString().slice(0, 10);

function diffYMD(a: Date, b: Date) {
  let y = b.getUTCFullYear() - a.getUTCFullYear();
  let m = b.getUTCMonth() - a.getUTCMonth();
  let d = b.getUTCDate() - a.getUTCDate();
  if (d < 0) { m--; d += new Date(Date.UTC(b.getUTCFullYear(), b.getUTCMonth(), 0)).getUTCDate(); }
  if (m < 0) { y--; m += 12; }
  return { y, m, d };
}

function businessDays(a: Date, b: Date) {
  let n = 0;
  const cur = new Date(a);
  while (cur < b) {
    const wd = cur.getUTCDay();
    if (wd !== 0 && wd !== 6) n++;
    cur.setUTCDate(cur.getUTCDate() + 1);
  }
  return n;
}

export default function DateDifference() {
  const today = iso(new Date());
  const [from, setFrom] = useState('2000-01-01');
  const [to, setTo] = useState(today);
  const [includeEnd, setIncludeEnd] = useState(false);

  const r = useMemo(() => {
    const a0 = new Date(from + 'T00:00:00Z');
    const b0 = new Date(to + 'T00:00:00Z');
    if (isNaN(a0.getTime()) || isNaN(b0.getTime())) return null;
    const [a, b] = a0 <= b0 ? [a0, b0] : [b0, a0];
    const end = includeEnd ? new Date(b.getTime() + 864e5) : b;
    const days = Math.round((end.getTime() - a.getTime()) / 864e5);
    const ymd = diffYMD(a, end);
    return {
      days, weeks: Math.floor(days / 7), remDays: days % 7, months: ymd.y * 12 + ymd.m, ymd,
      hours: days * 24, minutes: days * 1440, seconds: days * 86400,
      business: businessDays(a, end),
      negative: a0 > b0,
      weekdayFrom: a.toLocaleDateString(undefined, { weekday: 'long', timeZone: 'UTC' }),
      weekdayTo: b.toLocaleDateString(undefined, { weekday: 'long', timeZone: 'UTC' }),
    };
  }, [from, to, includeEnd]);

  const stat = (label: string, value: string | number) => (
    <div className="surface-2 rounded-xl border line px-4 py-3">
      <div className="text-2xl font-bold tabular-nums">{typeof value === 'number' ? value.toLocaleString() : value}</div>
      <div className="muted text-xs font-semibold uppercase tracking-wider">{label}</div>
    </div>
  );

  return (
    <div className="space-y-4">
      <Toolbar>
        <Field label="From"><Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} /></Field>
        <Field label="To"><Input type="date" value={to} onChange={(e) => setTo(e.target.value)} /></Field>
        <Button onClick={() => setTo(today)}>Today</Button>
        <Button variant="ghost" onClick={() => { setFrom(to); setTo(from); }}>Swap</Button>
        <Checkbox label="Include end date" checked={includeEnd} onChange={(e) => setIncludeEnd(e.target.checked)} />
      </Toolbar>
      {r && (
        <>
          <p className="text-lg">
            <span className="font-semibold">{r.ymd.y} year{r.ymd.y === 1 ? '' : 's'}, {r.ymd.m} month{r.ymd.m === 1 ? '' : 's'}, {r.ymd.d} day{r.ymd.d === 1 ? '' : 's'}</span>
            <span className="muted"> {r.negative ? '(end date is before start date — shown as absolute)' : ''}</span>
          </p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {stat('Total days', r.days)}
            {stat('Weeks', `${r.weeks}${r.remDays ? ` + ${r.remDays}d` : ''}`)}
            {stat('Months (approx.)', r.months)}
            {stat('Business days', r.business)}
            {stat('Hours', r.hours)}
            {stat('Minutes', r.minutes)}
            {stat('Seconds', r.seconds)}
            {stat('Weekdays', `${r.weekdayFrom.slice(0, 3)} → ${r.weekdayTo.slice(0, 3)}`)}
          </div>
          <Panel>
            <p className="muted text-xs">Business days exclude Saturdays and Sundays only — public holidays are not considered. Months are counted calendar-wise (Jan 31 → Feb 28 is one month).</p>
          </Panel>
        </>
      )}
    </div>
  );
}
