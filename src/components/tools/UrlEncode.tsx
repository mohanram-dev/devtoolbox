import { useMemo, useState } from 'react';
import { CopyButton, ErrorMsg, Segmented, TextArea, Toolbar } from './ui';

export default function UrlEncode() {
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [scope, setScope] = useState<'component' | 'full'>('component');
  const [input, setInput] = useState('');

  const { output, error } = useMemo(() => {
    if (!input) return { output: '', error: '' };
    try {
      if (mode === 'encode') {
        return { output: scope === 'component' ? encodeURIComponent(input) : encodeURI(input), error: '' };
      }
      return { output: decodeURIComponent(input.replace(/\+/g, ' ')), error: '' };
    } catch (e) {
      return { output: '', error: (e as Error).message };
    }
  }, [input, mode, scope]);

  return (
    <div className="space-y-4">
      <Toolbar>
        <Segmented value={mode} onChange={setMode} options={[{ value: 'encode', label: 'Encode' }, { value: 'decode', label: 'Decode' }]} />
        {mode === 'encode' && (
          <Segmented
            value={scope}
            onChange={setScope}
            options={[{ value: 'component', label: 'Component' }, { value: 'full', label: 'Full URL' }]}
          />
        )}
      </Toolbar>
      <div className="grid gap-4 lg:grid-cols-2">
        <TextArea rows={8} value={input} onChange={(e) => setInput(e.target.value)} placeholder={mode === 'encode' ? 'Text or URL to encode…' : 'Encoded string to decode…'} aria-label="Input" />
        <div className="space-y-2">
          <TextArea rows={8} readOnly value={output} placeholder="Result" aria-label="Output" />
          <div className="flex justify-end"><CopyButton text={output} /></div>
        </div>
      </div>
      <ErrorMsg>{error}</ErrorMsg>
    </div>
  );
}
