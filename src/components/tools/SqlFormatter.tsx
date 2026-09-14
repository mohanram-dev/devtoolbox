import { useMemo, useState } from 'react';
import { format, type SqlLanguage } from 'sql-formatter';
import { Button, CopyButton, ErrorMsg, Field, TextArea, Toolbar } from './ui';

const DIALECTS: { value: SqlLanguage; label: string }[] = [
  { value: 'sql', label: 'Standard SQL' },
  { value: 'mysql', label: 'MySQL' },
  { value: 'postgresql', label: 'PostgreSQL' },
  { value: 'sqlite', label: 'SQLite' },
  { value: 'tsql', label: 'SQL Server (T-SQL)' },
  { value: 'plsql', label: 'Oracle (PL/SQL)' },
  { value: 'bigquery', label: 'BigQuery' },
  { value: 'snowflake', label: 'Snowflake' },
  { value: 'mariadb', label: 'MariaDB' },
];

const SAMPLE = `select u.id, u.name, count(o.id) as orders, sum(o.total) as revenue from users u left join orders o on o.user_id = u.id where u.created_at >= '2026-01-01' and u.status in ('active','trial') group by u.id, u.name having count(o.id) > 0 order by revenue desc limit 20;`;

export default function SqlFormatter() {
  const [input, setInput] = useState(SAMPLE);
  const [dialect, setDialect] = useState<SqlLanguage>('sql');
  const [keywordCase, setKeywordCase] = useState<'upper' | 'lower' | 'preserve'>('upper');
  const [indent, setIndent] = useState<'2' | '4' | 'tab'>('2');
  const [minify, setMinify] = useState(false);

  const { output, error } = useMemo(() => {
    if (!input.trim()) return { output: '', error: '' };
    try {
      if (minify) return { output: input.replace(/\s*\n\s*/g, ' ').replace(/\s{2,}/g, ' ').trim(), error: '' };
      return {
        output: format(input, { language: dialect, keywordCase, tabWidth: indent === 'tab' ? 4 : Number(indent), useTabs: indent === 'tab' }),
        error: '',
      };
    } catch (e) {
      return { output: '', error: (e as Error).message };
    }
  }, [input, dialect, keywordCase, indent, minify]);

  const sel = 'surface-2 rounded-lg border line px-2 py-1.5 text-sm';

  return (
    <div className="space-y-4">
      <Toolbar>
        <Field label="Dialect">
          <select value={dialect} onChange={(e) => setDialect(e.target.value as SqlLanguage)} className={sel}>
            {DIALECTS.map((d) => <option key={d.value} value={d.value}>{d.label}</option>)}
          </select>
        </Field>
        <Field label="Keywords">
          <select value={keywordCase} onChange={(e) => setKeywordCase(e.target.value as typeof keywordCase)} className={sel}>
            <option value="upper">UPPERCASE</option>
            <option value="lower">lowercase</option>
            <option value="preserve">Preserve</option>
          </select>
        </Field>
        <Field label="Indent">
          <select value={indent} onChange={(e) => setIndent(e.target.value as typeof indent)} className={sel}>
            <option value="2">2 spaces</option>
            <option value="4">4 spaces</option>
            <option value="tab">Tabs</option>
          </select>
        </Field>
        <Button variant={minify ? 'primary' : 'secondary'} onClick={() => setMinify(!minify)}>{minify ? 'Minified' : 'Minify'}</Button>
        <CopyButton text={output} className="ml-auto" />
      </Toolbar>
      <div className="grid gap-4 lg:grid-cols-2">
        <TextArea rows={16} value={input} onChange={(e) => setInput(e.target.value)} placeholder="Paste SQL…" aria-label="SQL input" />
        <TextArea rows={16} readOnly value={output} placeholder="Formatted SQL" aria-label="Formatted SQL" />
      </div>
      <ErrorMsg>{error}</ErrorMsg>
    </div>
  );
}
