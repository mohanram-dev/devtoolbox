import { useEffect, useState } from 'react';
import { Button, Checkbox, CopyButton, Field, Input, Segmented, TextArea, Toolbar } from './ui';

const WORDS = `lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua enim ad minim veniam quis nostrud exercitation ullamco laboris nisi aliquip ex ea commodo consequat duis aute irure in reprehenderit voluptate velit esse cillum fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt culpa qui officia deserunt mollit anim id est laborum`.split(' ');
const OPENING = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit';

const rand = (n: number) => Math.floor(Math.random() * n);
const pick = () => WORDS[rand(WORDS.length)];

function sentence(): string {
  const len = 6 + rand(10);
  const words = Array.from({ length: len }, pick);
  if (len > 9) words[3 + rand(3)] += ',';
  return words.join(' ').replace(/^./, (c) => c.toUpperCase()) + '.';
}
function paragraph(): string {
  return Array.from({ length: 3 + rand(4) }, sentence).join(' ');
}

export default function LoremIpsum() {
  const [unit, setUnit] = useState<'paragraphs' | 'sentences' | 'words'>('paragraphs');
  const [count, setCount] = useState(3);
  const [classic, setClassic] = useState(true);
  const [html, setHtml] = useState(false);
  const [text, setText] = useState('');

  const generate = () => {
    const n = Math.min(200, Math.max(1, count));
    let parts: string[];
    if (unit === 'paragraphs') parts = Array.from({ length: n }, paragraph);
    else if (unit === 'sentences') parts = [Array.from({ length: n }, sentence).join(' ')];
    else parts = [Array.from({ length: n }, pick).join(' ').replace(/^./, (c) => c.toUpperCase()) + '.'];
    if (classic) parts[0] = parts[0].replace(/^[^.]*?(?=[,.])/, OPENING);
    setText(html ? parts.map((p) => `<p>${p}</p>`).join('\n') : parts.join('\n\n'));
  };
  useEffect(generate, [unit, count, classic, html]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="space-y-4">
      <Toolbar>
        <Field label="Count">
          <Input type="number" min={1} max={200} value={count} onChange={(e) => setCount(Number(e.target.value))} className="w-20" />
        </Field>
        <Segmented value={unit} onChange={setUnit} options={[{ value: 'paragraphs', label: 'Paragraphs' }, { value: 'sentences', label: 'Sentences' }, { value: 'words', label: 'Words' }]} />
        <Checkbox label='Start with "Lorem ipsum…"' checked={classic} onChange={(e) => setClassic(e.target.checked)} />
        <Checkbox label="Wrap in <p>" checked={html} onChange={(e) => setHtml(e.target.checked)} />
        <Button variant="primary" onClick={generate}>Regenerate</Button>
        <CopyButton text={text} />
      </Toolbar>
      <TextArea rows={14} readOnly value={text} className="font-sans" aria-label="Generated text" />
      <p className="muted text-xs">{text.split(/\s+/).filter(Boolean).length} words · {text.length} characters</p>
    </div>
  );
}
