import { useMemo, useState } from 'react';
import { csvToJson, jsonToCsv } from '../../lib/csv';
import { CopyButton, ErrorMsg, Field, Segmented, TextArea, Toolbar } from './ui';

const SAMPLE_CSV = 'id,name,email,active\n1,Ada Lovelace,ada@example.com,true\n2,"Grace, Hopper",grace@example.com,false';
const SAMPLE_JSON = '[\n  { "id": 1, "name": "Ada Lovelace", "email": "ada@example.com", "active": true },\n  { "id": 2, "name": "Grace, Hopper", "email": "grace@example.com", "active": false }\n]';

export default function JsonCsv() {
  const [mode, setMode] = useState<'csv2json' | 'json2csv'>('csv2json');
  const [delimiter, setDelimiter] = useState(',');
  const [input, setInput] = useState(SAMPLE_CSV);

  const switchMode = (m: typeof mode) => {
    setMode(m);
    setInput(m === 'csv2json' ? SAMPLE_CSV : SAMPLE_JSON);
  };

  const { output, error, count } = useMemo(() => {
    if (!input.trim()) return { output: '', error: '', count: 0 };
    try {
      if (mode === 'csv2json') {
        const rows = csvToJson(input, delimiter);
        return { output: JSON.stringify(rows, null, 2), error: '', count: rows.length };
      }
      const data = JSON.parse(input);
      const csv = jsonToCsv(data, delimiter);
      return { output: csv, error: '', count: Array.isArray(data) ? data.length : 1 };
    } catch (e) {
      return { output: '', error: (e as Error).message, count: 0 };
    }
  }, [input, mode, delimiter]);

  return (
    <div className="space-y-4">
      <Toolbar>
        <Segmented value={mode} onChange={switchMode} options={[{ value: 'csv2json', label: 'CSV → JSON' }, { value: 'json2csv', label: 'JSON → CSV' }]} />
        <Field label="Delimiter">
          <select
            value={delimiter}
            onChange={(e) => setDelimiter(e.target.value)}
            className="surface-2 rounded-lg border line px-2 py-1.5 text-sm"
          >
            <option value=",">Comma ,</option>
            <option value=";">Semicolon ;</option>
            <option value={'\t'}>Tab</option>
            <option value="|">Pipe |</option>
          </select>
        </Field>
        {count > 0 && <span className="muted text-xs">{count} row{count === 1 ? '' : 's'}</span>}
      </Toolbar>
      <div className="grid gap-4 lg:grid-cols-2">
        <TextArea rows={14} value={input} onChange={(e) => setInput(e.target.value)} placeholder={mode === 'csv2json' ? 'Paste CSV (first row = headers)…' : 'Paste a JSON array of objects…'} aria-label="Input" />
        <div className="space-y-2">
          <TextArea rows={14} readOnly value={output} placeholder="Result" aria-label="Output" />
          <div className="flex justify-end"><CopyButton text={output} /></div>
        </div>
      </div>
      <ErrorMsg>{error}</ErrorMsg>
    </div>
  );
}
