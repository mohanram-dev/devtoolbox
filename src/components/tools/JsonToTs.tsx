import { useMemo, useState } from 'react';
import { jsonToTs } from '../../lib/json2ts';
import { CopyButton, ErrorMsg, Field, Input, TextArea, Toolbar } from './ui';

const SAMPLE = `{
  "id": 42,
  "name": "Ada",
  "email": null,
  "tags": ["admin", "ops"],
  "address": { "city": "London", "zip": "N1" },
  "orders": [
    { "id": 1, "total": 9.99, "shipped": true },
    { "id": 2, "total": 24.5, "shipped": false, "note": "gift" }
  ]
}`;

export default function JsonToTs() {
  const [input, setInput] = useState(SAMPLE);
  const [root, setRoot] = useState('User');

  const { output, error } = useMemo(() => {
    if (!input.trim()) return { output: '', error: '' };
    try {
      return { output: jsonToTs(JSON.parse(input), root || 'Root'), error: '' };
    } catch (e) {
      return { output: '', error: (e as Error).message };
    }
  }, [input, root]);

  return (
    <div className="space-y-4">
      <Toolbar>
        <Field label="Root interface name">
          <Input value={root} onChange={(e) => setRoot(e.target.value)} className="w-40" />
        </Field>
        <CopyButton text={output} label="Copy TypeScript" className="ml-auto" />
      </Toolbar>
      <div className="grid gap-4 lg:grid-cols-2">
        <TextArea rows={18} value={input} onChange={(e) => setInput(e.target.value)} placeholder="Paste JSON…" aria-label="JSON input" />
        <TextArea rows={18} readOnly value={output} placeholder="TypeScript interfaces" aria-label="TypeScript output" />
      </div>
      <ErrorMsg>{error}</ErrorMsg>
    </div>
  );
}
