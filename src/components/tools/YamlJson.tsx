import { useMemo, useState } from 'react';
import YAML from 'yaml';
import { CopyButton, ErrorMsg, Segmented, TextArea, Toolbar } from './ui';

const SAMPLE_YAML = `# Service config
name: devtoolbox
replicas: 3
ports:
  - 80
  - 443
env:
  NODE_ENV: production
  DEBUG: false`;
const SAMPLE_JSON = '{\n  "name": "devtoolbox",\n  "replicas": 3,\n  "ports": [80, 443],\n  "env": { "NODE_ENV": "production", "DEBUG": false }\n}';

export default function YamlJson() {
  const [mode, setMode] = useState<'yaml2json' | 'json2yaml'>('yaml2json');
  const [input, setInput] = useState(SAMPLE_YAML);

  const switchMode = (m: typeof mode) => {
    setMode(m);
    setInput(m === 'yaml2json' ? SAMPLE_YAML : SAMPLE_JSON);
  };

  const { output, error } = useMemo(() => {
    if (!input.trim()) return { output: '', error: '' };
    try {
      if (mode === 'yaml2json') return { output: JSON.stringify(YAML.parse(input), null, 2), error: '' };
      return { output: YAML.stringify(JSON.parse(input), { indent: 2, lineWidth: 0 }), error: '' };
    } catch (e) {
      return { output: '', error: (e as Error).message };
    }
  }, [input, mode]);

  return (
    <div className="space-y-4">
      <Toolbar>
        <Segmented value={mode} onChange={switchMode} options={[{ value: 'yaml2json', label: 'YAML → JSON' }, { value: 'json2yaml', label: 'JSON → YAML' }]} />
      </Toolbar>
      <div className="grid gap-4 lg:grid-cols-2">
        <TextArea rows={14} value={input} onChange={(e) => setInput(e.target.value)} placeholder={mode === 'yaml2json' ? 'Paste YAML…' : 'Paste JSON…'} aria-label="Input" />
        <div className="space-y-2">
          <TextArea rows={14} readOnly value={output} placeholder="Result" aria-label="Output" />
          <div className="flex justify-end"><CopyButton text={output} /></div>
        </div>
      </div>
      <ErrorMsg>{error}</ErrorMsg>
    </div>
  );
}
