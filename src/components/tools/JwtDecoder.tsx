import { useMemo, useState } from 'react';
import { decodeBase64 } from './Base64';
import { Button, CopyButton, ErrorMsg, Panel, TextArea, Toolbar } from './ui';

const SAMPLE =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE5MTYyMzkwMjJ9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

const TIME_CLAIMS: Record<string, string> = { exp: 'Expires', iat: 'Issued at', nbf: 'Not before', auth_time: 'Auth time' };

export default function JwtDecoder() {
  const [token, setToken] = useState('');

  const result = useMemo<null | { error: string } | { header: unknown; payload: Record<string, unknown>; signature: string; times: { k: string; label: string; value: number; date: Date }[]; expired: boolean | null }>(() => {
    const raw = token.trim().replace(/^Bearer\s+/i, '');
    if (!raw) return null;
    const parts = raw.split('.');
    if (parts.length !== 3) return { error: `Expected 3 segments separated by dots, found ${parts.length}.` };
    try {
      const header = JSON.parse(decodeBase64(parts[0]));
      const payload = JSON.parse(decodeBase64(parts[1]));
      const now = Date.now() / 1000;
      const times = Object.entries(TIME_CLAIMS)
        .filter(([k]) => typeof payload[k] === 'number')
        .map(([k, label]) => ({ k, label, value: payload[k] as number, date: new Date(payload[k] * 1000) }));
      const expired = typeof payload.exp === 'number' ? payload.exp < now : null;
      return { header, payload, signature: parts[2], times, expired };
    } catch {
      return { error: 'Could not decode token — header or payload is not valid Base64URL-encoded JSON.' };
    }
  }, [token]);

  return (
    <div className="space-y-4">
      <Toolbar>
        <Button variant="ghost" onClick={() => setToken(SAMPLE)}>Sample token</Button>
        <Button variant="ghost" onClick={() => setToken('')}>Clear</Button>
      </Toolbar>
      <TextArea rows={5} value={token} onChange={(e) => setToken(e.target.value)} placeholder="Paste a JWT (eyJ…)" aria-label="JWT" />

      {result && 'error' in result && <ErrorMsg>{result.error}</ErrorMsg>}

      {result && !('error' in result) && (
        <>
          {result.expired !== null && (
            <p
              className={`rounded-md px-3 py-2 text-sm font-medium ${
                result.expired ? 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300' : 'bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300'
              }`}
            >
              {result.expired ? 'This token has expired.' : 'This token is not expired.'}
            </p>
          )}
          {result.times.length > 0 && (
            <Panel>
              <ul className="space-y-1 text-sm">
                {result.times.map((t) => (
                  <li key={t.k} className="flex flex-wrap gap-x-3">
                    <span className="w-24 font-medium muted">{t.label}</span>
                    <code className="font-mono">{t.value}</code>
                    <span className="muted">→ {t.date.toLocaleString()}</span>
                  </li>
                ))}
              </ul>
            </Panel>
          )}
          <div className="grid gap-4 lg:grid-cols-2">
            <Section title="Header" json={result.header} />
            <Section title="Payload" json={result.payload} />
          </div>
          <div>
            <h3 className="mb-1 text-sm font-semibold">Signature</h3>
            <code className="block break-all rounded-md surface-2 border line p-3 font-mono text-xs">{result.signature}</code>
            <p className="mt-1 text-xs muted">Signature is shown but not verified — verification requires the signing key.</p>
          </div>
        </>
      )}
    </div>
  );
}

function Section({ title, json }: { title: string; json: unknown }) {
  const text = JSON.stringify(json, null, 2);
  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <h3 className="text-sm font-semibold">{title}</h3>
        <CopyButton text={text} />
      </div>
      <pre className="overflow-x-auto rounded-md surface-2 border line p-3 font-mono text-xs leading-5">{text}</pre>
    </div>
  );
}
