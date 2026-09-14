import { useMemo, useState } from 'react';
import Ajv, { type ErrorObject } from 'ajv';
import { TextArea } from './ui';

const SAMPLE_SCHEMA = `{
  "$schema": "https://json-schema.org/draft-07/schema",
  "type": "object",
  "required": ["id", "email"],
  "properties": {
    "id": { "type": "integer", "minimum": 1 },
    "email": { "type": "string", "format": "email" },
    "role": { "type": "string", "enum": ["admin", "user"] },
    "tags": { "type": "array", "items": { "type": "string" }, "maxItems": 5 }
  },
  "additionalProperties": false
}`;
const SAMPLE_DATA = `{
  "id": 0,
  "email": "ada@example.com",
  "role": "owner",
  "tags": ["a", "b"],
  "extra": true
}`;

// Basic email check so the sample "format" keyword works without pulling in ajv-formats.
const ajv = new Ajv({ allErrors: true, strict: false });
ajv.addFormat('email', /^[^\s@]+@[^\s@]+\.[^\s@]+$/);
ajv.addFormat('uri', /^[a-z][a-z0-9+.-]*:/i);
ajv.addFormat('date', /^\d{4}-\d{2}-\d{2}$/);
ajv.addFormat('date-time', /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/);
ajv.addFormat('uuid', /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);

export default function JsonSchemaValidator() {
  const [schema, setSchema] = useState(SAMPLE_SCHEMA);
  const [data, setData] = useState(SAMPLE_DATA);

  const result = useMemo<{ state: 'idle' | 'valid' | 'invalid' | 'error'; errors?: ErrorObject[]; message?: string }>(() => {
    if (!schema.trim() || !data.trim()) return { state: 'idle' };
    let s: unknown, d: unknown;
    try { s = JSON.parse(schema); } catch (e) { return { state: 'error', message: `Schema is not valid JSON: ${(e as Error).message}` }; }
    try { d = JSON.parse(data); } catch (e) { return { state: 'error', message: `Data is not valid JSON: ${(e as Error).message}` }; }
    try {
      // Ajv only recognises a few exact $schema URIs; the keywords are the same, so drop it.
      const { $schema: _ignored, ...schemaBody } = s as Record<string, unknown>;
      const validate = ajv.compile(schemaBody);
      return validate(d) ? { state: 'valid' } : { state: 'invalid', errors: validate.errors ?? [] };
    } catch (e) {
      return { state: 'error', message: `Invalid schema: ${(e as Error).message}` };
    }
  }, [schema, data]);

  return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-2">
        <label className="block">
          <span className="muted mb-1 block text-xs font-semibold uppercase tracking-wider">JSON Schema</span>
          <TextArea rows={16} value={schema} onChange={(e) => setSchema(e.target.value)} aria-label="JSON Schema" />
        </label>
        <label className="block">
          <span className="muted mb-1 block text-xs font-semibold uppercase tracking-wider">JSON data</span>
          <TextArea rows={16} value={data} onChange={(e) => setData(e.target.value)} aria-label="JSON data" />
        </label>
      </div>

      {result.state === 'valid' && (
        <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300">✓ Valid — the data conforms to the schema.</p>
      )}
      {result.state === 'error' && (
        <p role="alert" className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 font-mono text-[13px] text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300">{result.message}</p>
      )}
      {result.state === 'invalid' && (
        <div className="rounded-lg border border-rose-200 bg-rose-50 p-3 dark:border-rose-500/30 dark:bg-rose-500/10">
          <p className="mb-2 text-sm font-semibold text-rose-700 dark:text-rose-300">✗ {result.errors!.length} validation error{result.errors!.length === 1 ? '' : 's'}</p>
          <ul className="space-y-1 font-mono text-[13px] text-rose-700 dark:text-rose-300">
            {result.errors!.map((e, i) => (
              <li key={i}>
                <span className="font-semibold">{e.instancePath || '(root)'}</span> {e.message}
                {e.params && Object.keys(e.params).length > 0 && <span className="opacity-70"> — {JSON.stringify(e.params)}</span>}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
