/** Minimal RFC 4180 CSV parser/serialiser — handles quotes, escaped quotes, newlines in fields. */

export function parseCsv(text: string, delimiter = ','): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let inQuotes = false;
  const src = text.replace(/\r\n?/g, '\n');

  for (let i = 0; i < src.length; i++) {
    const ch = src[i];
    if (inQuotes) {
      if (ch === '"') {
        if (src[i + 1] === '"') { field += '"'; i++; }
        else inQuotes = false;
      } else field += ch;
    } else if (ch === '"') inQuotes = true;
    else if (ch === delimiter) { row.push(field); field = ''; }
    else if (ch === '\n') { row.push(field); rows.push(row); row = []; field = ''; }
    else field += ch;
  }
  if (field !== '' || row.length) { row.push(field); rows.push(row); }
  return rows.filter((r) => !(r.length === 1 && r[0] === ''));
}

export function csvToJson(text: string, delimiter = ','): Record<string, string>[] {
  const [header, ...body] = parseCsv(text, delimiter);
  if (!header) return [];
  return body.map((r) => Object.fromEntries(header.map((h, i) => [h, r[i] ?? ''])));
}

function escapeField(v: unknown, delimiter: string): string {
  const s = v === null || v === undefined ? '' : typeof v === 'object' ? JSON.stringify(v) : String(v);
  return /["\n\r]/.test(s) || s.includes(delimiter) ? `"${s.replace(/"/g, '""')}"` : s;
}

/** Accepts an array of objects (or a single object) and returns CSV with a header row. */
export function jsonToCsv(data: unknown, delimiter = ','): string {
  const rows = Array.isArray(data) ? data : [data];
  if (!rows.length) return '';
  const objects: Record<string, unknown>[] = rows.map((r) =>
    r && typeof r === 'object' && !Array.isArray(r) ? (r as Record<string, unknown>) : { value: r },
  );
  const headers = Array.from(new Set(objects.flatMap((o) => Object.keys(o))));
  const lines = [headers.map((h) => escapeField(h, delimiter)).join(delimiter)];
  for (const o of objects) lines.push(headers.map((h) => escapeField(o[h], delimiter)).join(delimiter));
  return lines.join('\n');
}
