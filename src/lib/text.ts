/** Split an identifier or sentence into lowercase words, honouring camelCase and acronym boundaries. */
export function splitWords(input: string): string[] {
  return input
    .replace(/([a-z\d])([A-Z])/g, '$1 $2') // fooBar -> foo Bar
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2') // HTTPServer -> HTTP Server
    .split(/[^A-Za-z0-9À-ɏ]+/)
    .filter(Boolean)
    .map((w) => w.toLowerCase());
}

const cap = (w: string) => w.charAt(0).toUpperCase() + w.slice(1);

export const caseConverters: { key: string; label: string; fn: (s: string) => string }[] = [
  { key: 'camel', label: 'camelCase', fn: (s) => splitWords(s).map((w, i) => (i ? cap(w) : w)).join('') },
  { key: 'pascal', label: 'PascalCase', fn: (s) => splitWords(s).map(cap).join('') },
  { key: 'snake', label: 'snake_case', fn: (s) => splitWords(s).join('_') },
  { key: 'kebab', label: 'kebab-case', fn: (s) => splitWords(s).join('-') },
  { key: 'constant', label: 'CONSTANT_CASE', fn: (s) => splitWords(s).join('_').toUpperCase() },
  { key: 'title', label: 'Title Case', fn: (s) => splitWords(s).map(cap).join(' ') },
  { key: 'sentence', label: 'Sentence case', fn: (s) => cap(splitWords(s).join(' ')) },
  { key: 'lower', label: 'lowercase', fn: (s) => s.toLowerCase() },
  { key: 'upper', label: 'UPPERCASE', fn: (s) => s.toUpperCase() },
  { key: 'slug', label: 'URL slug', fn: slugify },
];

export function slugify(s: string): string {
  return s
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '') // strip combining accents left by NFKD
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Apply a converter line-by-line so lists of identifiers convert cleanly. */
export function convertLines(input: string, fn: (s: string) => string): string {
  return input.split(/\r?\n/).map((line) => (line.trim() ? fn(line) : line)).join('\n');
}
