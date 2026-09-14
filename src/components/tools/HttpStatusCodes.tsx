import { useMemo, useState } from 'react';
import { CLASSES, HTTP_STATUS } from '../../lib/httpStatus';
import { Input } from './ui';

export default function HttpStatusCodes() {
  const [q, setQ] = useState('');
  const [cls, setCls] = useState<number | 0>(0);

  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    return HTTP_STATUS.filter((h) => (!cls || Math.floor(h.code / 100) === cls) && (!s || String(h.code).includes(s) || h.name.toLowerCase().includes(s) || h.desc.toLowerCase().includes(s)));
  }, [q, cls]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <Input value={q} onChange={(e) => setQ(e.target.value)} className="min-w-0 flex-1 font-sans" placeholder="Search by code or name — 404, timeout, redirect…" aria-label="Search status codes" />
        <div className="flex flex-wrap gap-1.5">
          <button type="button" onClick={() => setCls(0)} className={`badge ${!cls ? 'border-brand-400 text-brand-500' : ''}`}>All</button>
          {[1, 2, 3, 4, 5].map((c) => (
            <button key={c} type="button" onClick={() => setCls(c)} className={`badge ${cls === c ? 'border-brand-400 text-brand-500' : ''}`}>{c}xx</button>
          ))}
        </div>
      </div>
      <p className="muted text-xs">{list.length} of {HTTP_STATUS.length} codes</p>
      <div className="grid gap-2">
        {list.map((h) => {
          const c = CLASSES[Math.floor(h.code / 100)];
          return (
            <div key={h.code} id={`c${h.code}`} className="card flex gap-4 p-4 shadow-none">
              <span className={`grid h-12 w-16 shrink-0 place-items-center rounded-lg font-mono text-lg font-bold ${c.tone}`}>{h.code}</span>
              <div className="min-w-0">
                <div className="flex flex-wrap items-baseline gap-x-2">
                  <span className="font-semibold">{h.name}</span>
                  <span className="muted text-xs">{c.name}</span>
                </div>
                <p className="muted mt-0.5 text-sm leading-6">{h.desc}</p>
              </div>
            </div>
          );
        })}
        {!list.length && <p className="muted py-6 text-center text-sm">No status codes match “{q}”.</p>}
      </div>
    </div>
  );
}
