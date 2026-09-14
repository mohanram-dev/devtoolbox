import { useMemo, useState } from 'react';
import { CopyButton, ErrorMsg, Input, Panel, ResultRow } from './ui';

const DEFAULT_PORTS: Record<string, string> = { 'http:': '80', 'https:': '443', 'ftp:': '21', 'ws:': '80', 'wss:': '443' };

export default function UrlParser() {
  const [input, setInput] = useState('https://user:pass@www.example.com:8443/blog/posts/42?utm_source=newsletter&tag=js&tag=web&page=2#comments');

  const parsed = useMemo(() => {
    const s = input.trim();
    if (!s) return null;
    try {
      const u = new URL(s);
      const params = [...u.searchParams.entries()];
      const segments = u.pathname.split('/').filter(Boolean).map(decodeURIComponent);
      const hostParts = u.hostname.split('.');
      const domain = hostParts.length >= 2 ? hostParts.slice(-2).join('.') : u.hostname;
      const subdomain = hostParts.length > 2 ? hostParts.slice(0, -2).join('.') : '';
      const clean = `${u.origin}${u.pathname}`;
      return { u, params, segments, domain, subdomain, clean };
    } catch {
      return { error: 'Not a valid absolute URL — include the scheme, e.g. https://' };
    }
  }, [input]);

  return (
    <div className="space-y-4">
      <Input value={input} onChange={(e) => setInput(e.target.value)} className="w-full" placeholder="https://example.com/path?query=1#hash" aria-label="URL" />
      {parsed && 'error' in parsed && <ErrorMsg>{parsed.error}</ErrorMsg>}
      {parsed && !('error' in parsed) && (
        <>
          <div className="grid gap-4 lg:grid-cols-2">
            <div>
              <ResultRow label="Protocol" value={parsed.u.protocol} />
              <ResultRow label="Username" value={parsed.u.username} />
              <ResultRow label="Password" value={parsed.u.password} />
              <ResultRow label="Host" value={parsed.u.hostname} />
              <ResultRow label="Subdomain" value={parsed.subdomain} />
              <ResultRow label="Domain" value={parsed.domain} />
              <ResultRow label="Port" value={parsed.u.port || `${DEFAULT_PORTS[parsed.u.protocol] ?? ''} (default)`} />
            </div>
            <div>
              <ResultRow label="Origin" value={parsed.u.origin} />
              <ResultRow label="Path" value={parsed.u.pathname} />
              <ResultRow label="Query" value={parsed.u.search} />
              <ResultRow label="Hash" value={parsed.u.hash} />
              <ResultRow label="Without query" value={parsed.clean} />
              <ResultRow label="Path segments" value={parsed.segments.join(' › ')} mono={false} />
            </div>
          </div>
          <Panel>
            <div className="mb-2 flex items-center justify-between">
              <p className="muted text-xs font-semibold uppercase tracking-wider">Query parameters ({parsed.params.length})</p>
              <CopyButton text={JSON.stringify(Object.fromEntries(parsed.params), null, 2)} label="Copy as JSON" />
            </div>
            {parsed.params.length ? (
              <table className="w-full text-left text-sm">
                <thead className="muted text-xs uppercase"><tr><th className="py-1 pr-4">Key</th><th className="py-1">Value (decoded)</th></tr></thead>
                <tbody className="font-mono">
                  {parsed.params.map(([k, v], i) => (
                    <tr key={i} className="border-t line"><td className="py-1 pr-4">{k}</td><td className="py-1 break-all">{v || <span className="muted">(empty)</span>}</td></tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="muted text-sm">No query parameters.</p>
            )}
          </Panel>
        </>
      )}
    </div>
  );
}
