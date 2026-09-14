import { useState } from 'react';
import { Button, Checkbox, CopyButton, ErrorMsg, TextArea, Toolbar } from './ui';

const SAMPLE = '{"name":"DevToolbox","tools":["json","base64"],"free":true,"version":1}';

function sortKeys(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sortKeys);
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.keys(value as object)
        .sort()
        .map((k) => [k, sortKeys((value as Record<string, unknown>)[k])]),
    );
  }
  return value;
}

export default function JsonFormatter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [indent, setIndent] = useState<'2' | '4' | 'tab'>('2');
  const [sort, setSort] = useState(false);

  const run = (minify: boolean) => {
    if (!input.trim()) {
      setOutput('');
      setError('');
      return;
    }
    try {
      let parsed = JSON.parse(input);
      if (sort) parsed = sortKeys(parsed);
      const space = minify ? undefined : indent === 'tab' ? '\t' : Number(indent);
      setOutput(JSON.stringify(parsed, null, space));
      setError('');
    } catch (e) {
      setOutput('');
      setError((e as Error).message);
    }
  };

  return (
    <div className="space-y-4">
      <Toolbar>
        <Button variant="primary" onClick={() => run(false)}>Format</Button>
        <Button onClick={() => run(true)}>Minify</Button>
        <select
          value={indent}
          onChange={(e) => setIndent(e.target.value as typeof indent)}
          className="rounded-md surface-2 border line px-2 py-1.5 text-sm"
          aria-label="Indent size"
        >
          <option value="2">2 spaces</option>
          <option value="4">4 spaces</option>
          <option value="tab">Tabs</option>
        </select>
        <Checkbox label="Sort keys" checked={sort} onChange={(e) => setSort(e.target.checked)} />
        <Button variant="ghost" onClick={() => setInput(SAMPLE)}>Sample</Button>
        <Button variant="ghost" onClick={() => { setInput(''); setOutput(''); setError(''); }}>Clear</Button>
      </Toolbar>

      <div className="grid gap-4 lg:grid-cols-2">
        <TextArea rows={16} placeholder="Paste JSON here…" value={input} onChange={(e) => setInput(e.target.value)} aria-label="JSON input" />
        <div className="space-y-2">
          <TextArea rows={16} readOnly value={output} placeholder="Formatted output" aria-label="Formatted JSON" />
          <div className="flex justify-end">
            <CopyButton text={output} label="Copy output" />
          </div>
        </div>
      </div>
      <ErrorMsg>{error}</ErrorMsg>
    </div>
  );
}
