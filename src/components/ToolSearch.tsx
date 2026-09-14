import { useMemo, useState } from 'react';

interface Item { slug: string; name: string; tagline: string; category: string; keywords: string[] }

/** Client-side filter over the tool list. Renders nothing until the user types, so SSR cards stay visible. */
export default function ToolSearch({ tools }: { tools: Item[] }) {
  const [q, setQ] = useState('');
  const results = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return [];
    return tools.filter((t) => [t.name, t.tagline, t.category, ...t.keywords].some((v) => v.toLowerCase().includes(s)));
  }, [q, tools]);

  return (
    <div className="relative mx-auto max-w-xl">
      <svg className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-(--color-ink-2)" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
      </svg>
      <input
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search tools… (e.g. jwt, base64, cron)"
        aria-label="Search tools"
        className="card w-full py-3.5 pl-12 pr-4 font-sans text-base text-(--color-ink) shadow-(--shadow-card) transition placeholder:text-(--color-ink-2)/70 focus:border-brand-400 focus:outline-none focus:ring-4 focus:ring-brand-500/15"
        autoComplete="off"
      />
      {q.trim() && (
        <ul className="card absolute z-10 mt-2 w-full overflow-hidden p-1.5 text-left shadow-(--shadow-card-hover)">
          {results.length === 0 && <li className="muted px-3 py-3 text-sm">No tools match “{q}”.</li>}
          {results.slice(0, 8).map((t) => (
            <li key={t.slug}>
              <a href={`/tools/${t.slug}/`} className="block rounded-lg px-3 py-2.5 transition hover:bg-(--color-surface-2)">
                <span className="block text-sm font-semibold">{t.name}</span>
                <span className="muted block text-xs">{t.tagline}</span>
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
