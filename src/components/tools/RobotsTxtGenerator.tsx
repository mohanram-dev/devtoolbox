import { useMemo, useState } from 'react';
import { Button, Checkbox, CopyButton, Field, Input, TextArea, Toolbar } from './ui';

interface Rule { agent: string; disallow: string; allow: string; delay: string }

const AI_BOTS = ['GPTBot', 'ChatGPT-User', 'ClaudeBot', 'anthropic-ai', 'Google-Extended', 'CCBot', 'Bytespider', 'PerplexityBot', 'Applebot-Extended', 'meta-externalagent'];
const PRESETS = [
  { label: 'Allow everything', rules: [{ agent: '*', disallow: '', allow: '', delay: '' }] },
  { label: 'WordPress', rules: [{ agent: '*', disallow: '/wp-admin/\n/wp-includes/\n/?s=', allow: '/wp-admin/admin-ajax.php', delay: '' }] },
  { label: 'Block everything', rules: [{ agent: '*', disallow: '/', allow: '', delay: '' }] },
  { label: 'Staging site', rules: [{ agent: '*', disallow: '/', allow: '', delay: '' }] },
];

export default function RobotsTxtGenerator() {
  const [rules, setRules] = useState<Rule[]>([{ agent: '*', disallow: '/admin/\n/private/', allow: '', delay: '' }]);
  const [sitemap, setSitemap] = useState('https://devtools.9blog.in/sitemap-index.xml');
  const [blockAi, setBlockAi] = useState(false);
  const [host, setHost] = useState('');

  const update = (i: number, k: keyof Rule, v: string) => setRules(rules.map((r, j) => (j === i ? { ...r, [k]: v } : r)));

  const output = useMemo(() => {
    const L: string[] = [];
    for (const r of rules) {
      L.push(`User-agent: ${r.agent || '*'}`);
      const dis = r.disallow.split('\n').map((s) => s.trim()).filter(Boolean);
      const al = r.allow.split('\n').map((s) => s.trim()).filter(Boolean);
      al.forEach((p) => L.push(`Allow: ${p}`));
      if (dis.length) dis.forEach((p) => L.push(`Disallow: ${p}`));
      else if (!al.length) L.push('Disallow:');
      if (r.delay) L.push(`Crawl-delay: ${r.delay}`);
      L.push('');
    }
    if (blockAi) {
      L.push('# Block AI training crawlers');
      for (const b of AI_BOTS) L.push(`User-agent: ${b}`, 'Disallow: /', '');
    }
    if (host) L.push(`Host: ${host}`, '');
    sitemap.split('\n').map((s) => s.trim()).filter(Boolean).forEach((s) => L.push(`Sitemap: ${s}`));
    return L.join('\n').trim() + '\n';
  }, [rules, sitemap, blockAi, host]);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-4">
        <Toolbar>
          {PRESETS.map((p) => <Button key={p.label} variant="ghost" onClick={() => setRules(p.rules)}>{p.label}</Button>)}
        </Toolbar>
        {rules.map((r, i) => (
          <div key={i} className="surface-2 space-y-2 rounded-xl border line p-3">
            <div className="flex items-center gap-2">
              <Field label="User-agent"><Input value={r.agent} onChange={(e) => update(i, 'agent', e.target.value)} className="w-40" placeholder="*" /></Field>
              <Field label="Crawl-delay"><Input value={r.delay} onChange={(e) => update(i, 'delay', e.target.value)} className="w-20" placeholder="—" /></Field>
              {rules.length > 1 && <Button variant="ghost" onClick={() => setRules(rules.filter((_, j) => j !== i))} className="ml-auto">Remove</Button>}
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              <Field label="Disallow (one per line)"><TextArea rows={3} value={r.disallow} onChange={(e) => update(i, 'disallow', e.target.value)} placeholder="/admin/" /></Field>
              <Field label="Allow (one per line)"><TextArea rows={3} value={r.allow} onChange={(e) => update(i, 'allow', e.target.value)} placeholder="/admin/public/" /></Field>
            </div>
          </div>
        ))}
        <Button onClick={() => setRules([...rules, { agent: 'Googlebot', disallow: '', allow: '', delay: '' }])}>+ Add user-agent block</Button>
        <Field label="Sitemap URL(s), one per line"><TextArea rows={2} value={sitemap} onChange={(e) => setSitemap(e.target.value)} /></Field>
        <Field label="Host (Yandex only, optional)"><Input value={host} onChange={(e) => setHost(e.target.value)} className="w-full" placeholder="example.com" /></Field>
        <Checkbox label="Block AI training crawlers (GPTBot, ClaudeBot, CCBot…)" checked={blockAi} onChange={(e) => setBlockAi(e.target.checked)} />
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="muted text-xs font-semibold uppercase tracking-wider">robots.txt</span>
          <CopyButton text={output} />
        </div>
        <TextArea rows={22} readOnly value={output} aria-label="Generated robots.txt" />
        <p className="muted text-xs">Save as <code>robots.txt</code> in your site root so it is served at <code>https://yourdomain.com/robots.txt</code>.</p>
      </div>
    </div>
  );
}
