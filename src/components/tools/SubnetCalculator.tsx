import { useMemo, useState } from 'react';
import { ErrorMsg, Input, Panel, ResultRow } from './ui';

const toInt = (ip: string) => ip.split('.').reduce((n, o) => (n << 8) + Number(o), 0) >>> 0;
const toIp = (n: number) => [24, 16, 8, 0].map((s) => (n >>> s) & 255).join('.');
const toBin = (n: number) => [24, 16, 8, 0].map((s) => ((n >>> s) & 255).toString(2).padStart(8, '0')).join('.');

function ipClass(first: number) {
  if (first < 128) return 'A';
  if (first < 192) return 'B';
  if (first < 224) return 'C';
  if (first < 240) return 'D (multicast)';
  return 'E (reserved)';
}
function scope(n: number) {
  const a = n >>> 24, b = (n >>> 16) & 255;
  if (a === 10 || (a === 172 && b >= 16 && b <= 31) || (a === 192 && b === 168)) return 'Private (RFC 1918)';
  if (a === 127) return 'Loopback';
  if (a === 169 && b === 254) return 'Link-local';
  if (a === 100 && b >= 64 && b <= 127) return 'Shared address space (CGNAT)';
  return 'Public';
}

export default function SubnetCalculator() {
  const [input, setInput] = useState('192.168.1.10/24');

  const result = useMemo(() => {
    const m = input.trim().match(/^(\d{1,3}(?:\.\d{1,3}){3})(?:\/(\d{1,2}))?(?:\s+(\d{1,3}(?:\.\d{1,3}){3}))?$/);
    if (!m) return { error: 'Enter an IPv4 address with a prefix (e.g. 10.0.0.0/8) or a netmask (e.g. 10.0.0.0 255.0.0.0).' };
    const ip = m[1];
    if (ip.split('.').some((o) => Number(o) > 255)) return { error: 'Each octet must be 0–255.' };
    let prefix: number;
    if (m[2] !== undefined) prefix = Number(m[2]);
    else if (m[3]) {
      const mask = toInt(m[3]);
      const bin = mask.toString(2).padStart(32, '0');
      if (!/^1*0*$/.test(bin)) return { error: 'That netmask is not contiguous.' };
      prefix = bin.indexOf('0') === -1 ? 32 : bin.indexOf('0');
    } else prefix = 24;
    if (prefix > 32) return { error: 'Prefix must be 0–32.' };

    const ipN = toInt(ip);
    const mask = prefix === 0 ? 0 : (0xffffffff << (32 - prefix)) >>> 0;
    const network = (ipN & mask) >>> 0;
    const broadcast = (network | (~mask >>> 0)) >>> 0;
    const total = 2 ** (32 - prefix);
    const usable = prefix >= 31 ? total : Math.max(0, total - 2);
    const firstHost = prefix >= 31 ? network : network + 1;
    const lastHost = prefix >= 31 ? broadcast : broadcast - 1;
    return { ip, ipN, prefix, mask, network, broadcast, total, usable, firstHost, lastHost };
  }, [input]);

  return (
    <div className="space-y-4">
      <Input value={input} onChange={(e) => setInput(e.target.value)} className="w-full font-mono text-lg" placeholder="192.168.1.10/24" aria-label="IP address and prefix" />
      {'error' in result ? (
        <ErrorMsg>{result.error}</ErrorMsg>
      ) : (
        <>
          <div className="grid gap-4 lg:grid-cols-2">
            <div>
              <ResultRow label="Network" value={`${toIp(result.network)}/${result.prefix}`} />
              <ResultRow label="Netmask" value={toIp(result.mask)} />
              <ResultRow label="Wildcard" value={toIp(~result.mask >>> 0)} />
              <ResultRow label="Broadcast" value={result.prefix >= 31 ? '—' : toIp(result.broadcast)} />
              <ResultRow label="First host" value={toIp(result.firstHost)} />
              <ResultRow label="Last host" value={toIp(result.lastHost)} />
            </div>
            <div>
              <ResultRow label="Total IPs" value={result.total.toLocaleString()} />
              <ResultRow label="Usable hosts" value={result.usable.toLocaleString()} />
              <ResultRow label="Class" value={ipClass(result.ipN >>> 24)} mono={false} />
              <ResultRow label="Scope" value={scope(result.ipN)} mono={false} />
              <ResultRow label="IP (binary)" value={toBin(result.ipN)} />
              <ResultRow label="Mask (binary)" value={toBin(result.mask)} />
            </div>
          </div>
          <Panel>
            <p className="muted mb-2 text-xs font-semibold uppercase tracking-wider">Prefix reference</p>
            <div className="grid grid-cols-2 gap-x-6 gap-y-1 font-mono text-xs sm:grid-cols-4">
              {[8, 16, 20, 22, 24, 25, 26, 27, 28, 29, 30, 32].map((p) => (
                <button key={p} type="button" onClick={() => setInput(`${result.ip}/${p}`)} className={`flex justify-between rounded px-1.5 py-0.5 text-left hover:bg-brand-50 dark:hover:bg-brand-500/10 ${p === result.prefix ? 'text-brand-500' : ''}`}>
                  <span>/{p}</span><span className="muted">{(2 ** (32 - p) - (p >= 31 ? 0 : 2)).toLocaleString()} hosts</span>
                </button>
              ))}
            </div>
          </Panel>
        </>
      )}
    </div>
  );
}
