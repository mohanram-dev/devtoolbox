import { useMemo, useState } from 'react';
import { marked } from 'marked';
import { CopyButton, Segmented, TextArea, Toolbar } from './ui';

const SAMPLE = `# Markdown Preview

Type on the left, see the result on the right.

## Features
- **Bold**, *italic*, ~~strikethrough~~
- [Links](https://example.com) and \`inline code\`
- Task lists:
  - [x] Write docs
  - [ ] Ship it

\`\`\`js
const greet = (name) => \`Hello, \${name}!\`;
\`\`\`

> Blockquotes work too.

| Tool | Status |
|------|--------|
| JSON | ✅ |
| YAML | ✅ |
`;

/** The input is the user's own text, but strip active content anyway so a pasted snippet can't run scripts. */
function sanitize(html: string): string {
  return html
    .replace(/<(script|iframe|object|embed|style)[\s\S]*?<\/\1>/gi, '')
    .replace(/\son\w+="[^"]*"/gi, '')
    .replace(/\son\w+='[^']*'/gi, '')
    .replace(/href="javascript:[^"]*"/gi, 'href="#"');
}

export default function MarkdownPreview() {
  const [input, setInput] = useState(SAMPLE);
  const [view, setView] = useState<'preview' | 'html'>('preview');

  const html = useMemo(() => sanitize(marked.parse(input, { gfm: true, breaks: false }) as string), [input]);

  return (
    <div className="space-y-4">
      <Toolbar>
        <Segmented value={view} onChange={setView} options={[{ value: 'preview', label: 'Preview' }, { value: 'html', label: 'HTML' }]} />
        <span className="muted text-xs">{input.split(/\s+/).filter(Boolean).length} words</span>
        <CopyButton text={html} label="Copy HTML" className="ml-auto" />
      </Toolbar>
      <div className="grid gap-4 lg:grid-cols-2">
        <TextArea rows={20} value={input} onChange={(e) => setInput(e.target.value)} placeholder="Write Markdown…" aria-label="Markdown input" />
        {view === 'preview' ? (
          <div className="md-preview surface-2 min-h-[10rem] overflow-auto rounded-xl border line p-5 font-sans text-[15px]" dangerouslySetInnerHTML={{ __html: html }} />
        ) : (
          <TextArea rows={20} readOnly value={html} aria-label="HTML output" />
        )}
      </div>
      <style>{`
        .md-preview h1,.md-preview h2,.md-preview h3{font-weight:700;letter-spacing:-.01em;margin:1.2em 0 .5em}
        .md-preview h1{font-size:1.75em}.md-preview h2{font-size:1.4em}.md-preview h3{font-size:1.15em}
        .md-preview p,.md-preview ul,.md-preview ol,.md-preview blockquote,.md-preview pre,.md-preview table{margin:.75em 0;line-height:1.65}
        .md-preview ul{list-style:disc;padding-left:1.5em}.md-preview ol{list-style:decimal;padding-left:1.5em}
        .md-preview a{color:var(--color-brand-500);text-decoration:underline}
        .md-preview code{font-family:var(--font-mono);font-size:.9em;background:var(--color-surface);border:1px solid var(--color-line);padding:.1em .35em;border-radius:.3em}
        .md-preview pre{background:var(--color-surface);border:1px solid var(--color-line);padding:.9em 1em;border-radius:.6em;overflow:auto}
        .md-preview pre code{border:0;padding:0;background:none}
        .md-preview blockquote{border-left:3px solid var(--color-brand-400);padding-left:1em;color:var(--color-ink-2)}
        .md-preview table{border-collapse:collapse;width:100%}.md-preview th,.md-preview td{border:1px solid var(--color-line);padding:.4em .7em;text-align:left}
        .md-preview th{background:var(--color-surface)}
        .md-preview hr{border:0;border-top:1px solid var(--color-line);margin:1.5em 0}
        .md-preview img{max-width:100%}
        .md-preview input[type=checkbox]{margin-right:.4em}
      `}</style>
    </div>
  );
}
