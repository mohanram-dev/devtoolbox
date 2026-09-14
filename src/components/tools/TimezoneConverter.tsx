import { useEffect, useMemo, useState } from 'react';
import { Button, Field, Input, Toolbar } from './ui';

const POPULAR = ['UTC', 'America/New_York', 'America/Los_Angeles', 'America/Chicago', 'Europe/London', 'Europe/Berlin', 'Europe/Paris', 'Asia/Kolkata', 'Asia/Dubai', 'Asia/Singapore', 'Asia/Tokyo', 'Asia/Shanghai', 'Australia/Sydney', 'America/Sao_Paulo'];

const ALL_ZONES: string[] = (() => {
  try { return (Intl as unknown as { supportedValuesOf: (k: string) => string[] }).supportedValuesOf('timeZone'); } catch { return POPULAR; }
})();

function pad(n: number) { return String(n).padStart(2, '0'); }
function toLocalInput(d: Date) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/** Interpret a wall-clock datetime string as being in `zone`; returns the instant as a Date. */
function zonedToUtc(local: string, zone: string): Date {
  const guess = new Date(local + ':00Z');
  const asZone = new Date(guess.toLocaleString('en-US', { timeZone: zone }));
  const asUtc = new Date(guess.toLocaleString('en-US', { timeZone: 'UTC' }));
  return new Date(guess.getTime() - (asZone.getTime() - asUtc.getTime()));
}

function offsetLabel(d: Date, zone: string) {
  const parts = new Intl.DateTimeFormat('en-US', { timeZone: zone, timeZoneName: 'shortOffset' }).formatToParts(d);
  return parts.find((p) => p.type === 'timeZoneName')?.value ?? '';
}
function abbr(d: Date, zone: string) {
  const parts = new Intl.DateTimeFormat('en-US', { timeZone: zone, timeZoneName: 'short' }).formatToParts(d);
  return parts.find((p) => p.type === 'timeZoneName')?.value ?? '';
}

// Browsers sometimes report legacy aliases; map them to the canonical IANA name.
const ALIASES: Record<string, string> = { 'Asia/Calcutta': 'Asia/Kolkata', 'Asia/Saigon': 'Asia/Ho_Chi_Minh', 'Asia/Katmandu': 'Asia/Kathmandu', 'Asia/Rangoon': 'Asia/Yangon', 'Europe/Kiev': 'Europe/Kyiv', 'America/Buenos_Aires': 'America/Argentina/Buenos_Aires' };

export default function TimezoneConverter() {
  const rawLocal = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const localZone = ALIASES[rawLocal] ?? rawLocal;
  const [fromZone, setFromZone] = useState(localZone);
  const [when, setWhen] = useState(() => toLocalInput(new Date()));
  const [zones, setZones] = useState<string[]>(() => ['UTC', 'America/New_York', 'Europe/London', 'Asia/Kolkata', 'Asia/Tokyo'].filter((z) => z !== localZone));
  const [add, setAdd] = useState('');
  const [now, setNow] = useState(Date.now());
  useEffect(() => { const id = setInterval(() => setNow(Date.now()), 30000); return () => clearInterval(id); }, []);

  const instant = useMemo(() => zonedToUtc(when, fromZone), [when, fromZone]);

  const fmt = (zone: string) => new Intl.DateTimeFormat(undefined, { timeZone: zone, weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false }).format(instant);
  const dayDiff = (zone: string) => {
    const a = new Date(instant.toLocaleDateString('en-CA', { timeZone: fromZone }));
    const b = new Date(instant.toLocaleDateString('en-CA', { timeZone: zone }));
    const d = Math.round((b.getTime() - a.getTime()) / 864e5);
    return d === 0 ? '' : d > 0 ? ' (+1 day)' : ' (−1 day)';
  };

  const rows = [fromZone, ...zones];

  return (
    <div className="space-y-4">
      <Toolbar>
        <Field label="Date & time">
          <Input type="datetime-local" value={when} onChange={(e) => setWhen(e.target.value)} />
        </Field>
        <Field label="In time zone">
          <select value={fromZone} onChange={(e) => setFromZone(e.target.value)} className="surface-2 max-w-[16rem] rounded-lg border line px-2 py-1.5 text-sm">
            {[localZone, ...ALL_ZONES.filter((z) => z !== localZone)].map((z) => <option key={z}>{z}</option>)}
          </select>
        </Field>
        <Button onClick={() => setWhen(toLocalInput(new Date(now)))}>Now</Button>
      </Toolbar>

      <div className="card divide-y line overflow-hidden shadow-none">
        {rows.map((z, i) => (
          <div key={z} className={`flex flex-wrap items-center gap-x-4 gap-y-1 px-4 py-3 ${i === 0 ? 'bg-brand-50 dark:bg-brand-500/10' : ''}`}>
            <div className="w-56 min-w-0">
              <div className="truncate font-semibold">{z.replace(/_/g, ' ')}</div>
              <div className="muted text-xs">{abbr(instant, z) === offsetLabel(instant, z) ? offsetLabel(instant, z) : `${abbr(instant, z)} · ${offsetLabel(instant, z)}`}</div>
            </div>
            <div className="font-mono text-base">{fmt(z)}<span className="muted text-xs">{i ? dayDiff(z) : ' (source)'}</span></div>
            {i > 0 && <button type="button" onClick={() => setZones(zones.filter((x) => x !== z))} className="muted ml-auto text-xs hover:text-rose-500">remove</button>}
          </div>
        ))}
      </div>

      <Toolbar>
        <Field label="Add a zone">
          <input list="tz-list" value={add} onChange={(e) => setAdd(e.target.value)} className="surface-2 w-64 rounded-lg border line px-3 py-1.5 font-mono text-sm" placeholder="e.g. Europe/Madrid" />
          <datalist id="tz-list">{ALL_ZONES.map((z) => <option key={z} value={z} />)}</datalist>
        </Field>
        <Button onClick={() => { if (ALL_ZONES.includes(add) && !rows.includes(add)) { setZones([...zones, add]); setAdd(''); } }}>Add</Button>
        <div className="flex flex-wrap gap-1.5">
          {POPULAR.filter((z) => !rows.includes(z)).slice(0, 6).map((z) => (
            <button key={z} type="button" onClick={() => setZones([...zones, z])} className="badge hover:border-brand-400 hover:text-brand-500">{z.split('/').pop()!.replace(/_/g, ' ')}</button>
          ))}
        </div>
      </Toolbar>
    </div>
  );
}
