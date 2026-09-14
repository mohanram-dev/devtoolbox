import { useMemo, useState } from 'react';
import { CopyButton, Field, Input, Panel, TextArea } from './ui';

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

export default function MetaTagGenerator() {
  const [f, setF] = useState({
    title: 'DevToolbox – Free developer tools',
    description: 'Fast, private developer utilities that run in your browser.',
    url: 'https://devtools.9blog.in/',
    image: 'https://devtools.9blog.in/og.png',
    siteName: 'DevToolbox',
    twitter: '@devtoolbox',
    type: 'website',
    locale: 'en_US',
    keywords: '',
    author: '',
    robots: 'index, follow',
    themeColor: '#6366f1',
  });
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setF({ ...f, [k]: e.target.value });

  const html = useMemo(() => {
    const L: string[] = [];
    L.push('<!-- Primary -->');
    L.push(`<title>${esc(f.title)}</title>`);
    L.push(`<meta name="title" content="${esc(f.title)}">`);
    L.push(`<meta name="description" content="${esc(f.description)}">`);
    if (f.keywords) L.push(`<meta name="keywords" content="${esc(f.keywords)}">`);
    if (f.author) L.push(`<meta name="author" content="${esc(f.author)}">`);
    L.push(`<meta name="robots" content="${esc(f.robots)}">`);
    if (f.url) L.push(`<link rel="canonical" href="${esc(f.url)}">`);
    if (f.themeColor) L.push(`<meta name="theme-color" content="${esc(f.themeColor)}">`);
    L.push('', '<!-- Open Graph (Facebook, LinkedIn, WhatsApp) -->');
    L.push(`<meta property="og:type" content="${esc(f.type)}">`);
    if (f.url) L.push(`<meta property="og:url" content="${esc(f.url)}">`);
    L.push(`<meta property="og:title" content="${esc(f.title)}">`);
    L.push(`<meta property="og:description" content="${esc(f.description)}">`);
    if (f.image) L.push(`<meta property="og:image" content="${esc(f.image)}">`);
    if (f.siteName) L.push(`<meta property="og:site_name" content="${esc(f.siteName)}">`);
    if (f.locale) L.push(`<meta property="og:locale" content="${esc(f.locale)}">`);
    L.push('', '<!-- Twitter / X -->');
    L.push(`<meta name="twitter:card" content="${f.image ? 'summary_large_image' : 'summary'}">`);
    if (f.url) L.push(`<meta name="twitter:url" content="${esc(f.url)}">`);
    L.push(`<meta name="twitter:title" content="${esc(f.title)}">`);
    L.push(`<meta name="twitter:description" content="${esc(f.description)}">`);
    if (f.image) L.push(`<meta name="twitter:image" content="${esc(f.image)}">`);
    if (f.twitter) L.push(`<meta name="twitter:site" content="${esc(f.twitter)}">`);
    return L.join('\n');
  }, [f]);

  const tl = f.title.length, dl = f.description.length;
  const warn = (n: number, max: number) => (n > max ? 'text-rose-500' : n > max * 0.9 ? 'text-amber-500' : 'muted');

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-3">
        <Field label={`Title (${tl}/60)`}><Input value={f.title} onChange={set('title')} className={`w-full font-sans ${warn(tl, 60)}`} /></Field>
        <Field label={`Description (${dl}/155)`}><TextArea rows={3} value={f.description} onChange={set('description')} className="font-sans" /></Field>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Canonical URL"><Input value={f.url} onChange={set('url')} className="w-full" /></Field>
          <Field label="Image URL (1200×630)"><Input value={f.image} onChange={set('image')} className="w-full" /></Field>
          <Field label="Site name"><Input value={f.siteName} onChange={set('siteName')} className="w-full font-sans" /></Field>
          <Field label="Twitter handle"><Input value={f.twitter} onChange={set('twitter')} className="w-full" /></Field>
          <Field label="OG type">
            <select value={f.type} onChange={set('type')} className="surface-2 w-full rounded-lg border line px-2 py-1.5 text-sm">
              {['website', 'article', 'product', 'profile', 'video.other', 'music.song'].map((t) => <option key={t}>{t}</option>)}
            </select>
          </Field>
          <Field label="Locale"><Input value={f.locale} onChange={set('locale')} className="w-full" /></Field>
          <Field label="Keywords (optional)"><Input value={f.keywords} onChange={set('keywords')} className="w-full font-sans" placeholder="comma, separated" /></Field>
          <Field label="Author (optional)"><Input value={f.author} onChange={set('author')} className="w-full font-sans" /></Field>
          <Field label="Robots">
            <select value={f.robots} onChange={set('robots')} className="surface-2 w-full rounded-lg border line px-2 py-1.5 text-sm">
              {['index, follow', 'noindex, follow', 'index, nofollow', 'noindex, nofollow'].map((t) => <option key={t}>{t}</option>)}
            </select>
          </Field>
          <Field label="Theme colour"><Input value={f.themeColor} onChange={set('themeColor')} className="w-full" /></Field>
        </div>
      </div>
      <div className="space-y-3">
        <Panel className="p-0">
          <div className="border-b line px-4 py-2 text-xs font-semibold uppercase tracking-wider muted">Search preview</div>
          <div className="p-4 font-sans">
            <div className="text-xs text-emerald-700 dark:text-emerald-400">{f.url || 'https://example.com/'}</div>
            <div className="text-lg text-[#1a0dab] dark:text-[#8ab4f8]">{f.title.slice(0, 60)}{tl > 60 && '…'}</div>
            <div className="muted text-sm">{f.description.slice(0, 155)}{dl > 155 && '…'}</div>
          </div>
        </Panel>
        <div className="flex items-center justify-between">
          <span className="muted text-xs font-semibold uppercase tracking-wider">Generated tags</span>
          <CopyButton text={html} label="Copy HTML" />
        </div>
        <TextArea rows={22} readOnly value={html} aria-label="Generated meta tags" />
      </div>
    </div>
  );
}
