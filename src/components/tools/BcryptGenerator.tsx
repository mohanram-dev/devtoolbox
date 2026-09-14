import { useEffect, useState } from 'react';
import { hash, compare } from 'bcryptjs';
import { Button, ErrorMsg, Field, Input, Panel, ResultRow, Segmented, Toolbar } from './ui';

export default function BcryptGenerator() {
  const [mode, setMode] = useState<'hash' | 'verify'>('hash');
  const [password, setPassword] = useState('correct horse battery staple');
  const [rounds, setRounds] = useState(10);
  const [output, setOutput] = useState('');
  const [busy, setBusy] = useState(false);
  const [ms, setMs] = useState(0);
  const [checkHash, setCheckHash] = useState('');
  const [verdict, setVerdict] = useState<null | boolean | 'error'>(null);

  const generate = async () => {
    setBusy(true);
    const t = performance.now();
    try {
      setOutput(await hash(password, rounds));
      setMs(Math.round(performance.now() - t));
    } finally {
      setBusy(false);
    }
  };
  useEffect(() => { generate(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const verify = async () => {
    try { setVerdict(await compare(password, checkHash.trim())); } catch { setVerdict('error'); }
  };
  useEffect(() => { if (mode === 'verify' && checkHash.trim()) verify(); else setVerdict(null); }, [password, checkHash, mode]); // eslint-disable-line react-hooks/exhaustive-deps

  const parts = output.match(/^\$(2[abxy])\$(\d\d)\$(.{22})(.{31})$/);

  return (
    <div className="space-y-4">
      <Toolbar>
        <Segmented value={mode} onChange={setMode} options={[{ value: 'hash', label: 'Generate hash' }, { value: 'verify', label: 'Verify hash' }]} />
      </Toolbar>
      <Field label="Password / plain text">
        <Input value={password} onChange={(e) => setPassword(e.target.value)} className="w-full" aria-label="Password" />
      </Field>

      {mode === 'hash' ? (
        <>
          <Toolbar>
            <Field label={`Cost factor: ${rounds} (2^${rounds} = ${(2 ** rounds).toLocaleString()} iterations)`}>
              <Input type="range" min={4} max={15} value={rounds} onChange={(e) => setRounds(Number(e.target.value))} className="w-56 accent-brand-500" />
            </Field>
            <Button variant="primary" onClick={generate} disabled={busy}>{busy ? 'Hashing…' : 'Generate'}</Button>
            {ms > 0 && <span className="muted text-xs">took {ms} ms</span>}
          </Toolbar>
          <ResultRow label="bcrypt hash" value={output} />
          {parts && (
            <Panel>
              <p className="muted mb-2 text-xs font-semibold uppercase tracking-wider">Hash anatomy</p>
              <div className="flex flex-wrap gap-x-1 font-mono text-sm">
                <span className="rounded bg-sky-100 px-1 dark:bg-sky-500/20" title="Algorithm version">${parts[1]}</span>
                <span className="rounded bg-amber-100 px-1 dark:bg-amber-500/20" title="Cost factor">${parts[2]}</span>
                <span className="rounded bg-emerald-100 px-1 dark:bg-emerald-500/20" title="22-char salt">${parts[3]}</span>
                <span className="rounded bg-violet-100 px-1 dark:bg-violet-500/20" title="31-char hash">{parts[4]}</span>
              </div>
              <p className="muted mt-2 text-xs">version · cost · salt (22 chars) · hash (31 chars). The salt is random, so hashing the same password twice gives different output — that is expected.</p>
            </Panel>
          )}
        </>
      ) : (
        <>
          <Field label="bcrypt hash to check against">
            <Input value={checkHash} onChange={(e) => setCheckHash(e.target.value)} className="w-full" placeholder="$2b$10$…" aria-label="Hash" />
          </Field>
          {verdict === true && <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300">✓ Match — the password produces this hash.</p>}
          {verdict === false && <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300">✗ No match.</p>}
          {verdict === 'error' && <ErrorMsg>That does not look like a valid bcrypt hash.</ErrorMsg>}
        </>
      )}
    </div>
  );
}
