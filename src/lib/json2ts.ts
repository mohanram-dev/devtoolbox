/**
 * Infer TypeScript interfaces from a JSON value. Nested objects become their own
 * interfaces; arrays of objects are merged so optional keys are marked with `?`.
 */

type Shape =
  | { kind: 'primitive'; name: string }
  | { kind: 'array'; item: Shape }
  | { kind: 'object'; props: Map<string, { shape: Shape; optional: boolean }> }
  | { kind: 'union'; members: Shape[] };

function infer(v: unknown): Shape {
  if (v === null) return { kind: 'primitive', name: 'null' };
  if (Array.isArray(v)) {
    if (!v.length) return { kind: 'array', item: { kind: 'primitive', name: 'unknown' } };
    return { kind: 'array', item: v.map(infer).reduce(merge) };
  }
  if (typeof v === 'object') {
    const props = new Map<string, { shape: Shape; optional: boolean }>();
    for (const [k, val] of Object.entries(v as object)) props.set(k, { shape: infer(val), optional: false });
    return { kind: 'object', props };
  }
  return { kind: 'primitive', name: typeof v };
}

function merge(a: Shape, b: Shape): Shape {
  if (a.kind === 'object' && b.kind === 'object') {
    const props = new Map(a.props);
    for (const [k, pb] of b.props) {
      const pa = props.get(k);
      props.set(k, pa ? { shape: merge(pa.shape, pb.shape), optional: pa.optional || pb.optional } : { ...pb, optional: true });
    }
    for (const [k, pa] of a.props) if (!b.props.has(k)) props.set(k, { ...pa, optional: true });
    return { kind: 'object', props };
  }
  if (a.kind === 'array' && b.kind === 'array') return { kind: 'array', item: merge(a.item, b.item) };
  if (a.kind === 'primitive' && a.name === 'unknown') return b;
  if (b.kind === 'primitive' && b.name === 'unknown') return a;
  if (a.kind === 'primitive' && b.kind === 'primitive' && a.name === b.name) return a;
  const members = [...(a.kind === 'union' ? a.members : [a]), ...(b.kind === 'union' ? b.members : [b])];
  const dedup = members.filter((m, i) => members.findIndex((o) => JSON.stringify(render(o, 'X', [])) === JSON.stringify(render(m, 'X', []))) === i);
  return dedup.length === 1 ? dedup[0] : { kind: 'union', members: dedup };
}

const pascal = (s: string) =>
  s.replace(/[^A-Za-z0-9]+(.)?/g, (_, c) => (c ? c.toUpperCase() : '')).replace(/^./, (c) => c.toUpperCase()).replace(/^(\d)/, '_$1') || 'Item';
const singular = (s: string) => (s.endsWith('ies') ? s.slice(0, -3) + 'y' : s.endsWith('s') && !s.endsWith('ss') ? s.slice(0, -1) : s);
const safeKey = (k: string) => (/^[A-Za-z_$][\w$]*$/.test(k) ? k : JSON.stringify(k));

/** Returns the type expression and pushes any interfaces it needed into `out`. */
function render(shape: Shape, hint: string, out: string[]): string {
  switch (shape.kind) {
    case 'primitive':
      return shape.name;
    case 'array': {
      const inner = render(shape.item, singular(hint), out);
      return shape.item.kind === 'union' ? `(${inner})[]` : `${inner}[]`;
    }
    case 'union':
      return shape.members.map((m) => render(m, hint, out)).join(' | ');
    case 'object': {
      const name = pascal(hint);
      const lines = [...shape.props].map(([k, { shape: s, optional }]) => `  ${safeKey(k)}${optional ? '?' : ''}: ${render(s, k, out)};`);
      out.push(`export interface ${name} {\n${lines.join('\n')}\n}`);
      return name;
    }
  }
}

export function jsonToTs(json: unknown, rootName = 'Root'): string {
  const shape = infer(json);
  const out: string[] = [];
  const type = render(shape, rootName, out);
  if (shape.kind !== 'object') out.push(`export type ${pascal(rootName)} = ${type};`);
  // Nested interfaces are pushed first; reverse so the root appears at the top.
  return out.reverse().join('\n\n') + '\n';
}
