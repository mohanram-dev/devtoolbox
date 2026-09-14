import { useCallback, useState, type ReactNode, type TextareaHTMLAttributes, type ButtonHTMLAttributes } from 'react';

/** Copy-to-clipboard hook with a short "Copied" state. */
export function useCopy(timeout = 1500) {
  const [copied, setCopied] = useState(false);
  const copy = useCallback(
    async (text: string) => {
      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), timeout);
      } catch {
        /* clipboard unavailable (e.g. insecure context) — ignore */
      }
    },
    [timeout],
  );
  return { copied, copy };
}

export function CopyButton({ text, label = 'Copy', className = '' }: { text: string; label?: string; className?: string }) {
  const { copied, copy } = useCopy();
  return (
    <Button variant="ghost" onClick={() => copy(text)} disabled={!text} className={className}>
      {copied ? 'Copied ✓' : label}
    </Button>
  );
}

type Variant = 'primary' | 'secondary' | 'ghost';
const variants: Record<Variant, string> = {
  primary: 'bg-brand-gradient text-white shadow-[0_4px_14px_-4px_rgb(99_102_241/.6)] hover:brightness-110',
  secondary: 'border line bg-(--color-surface) text-(--color-ink) hover:bg-(--color-surface-2)',
  ghost: 'text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-500/10',
};

export function Button({
  variant = 'secondary',
  className = '',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return (
    <button
      type="button"
      {...props}
      className={`rounded-lg px-3.5 py-1.5 text-sm font-medium transition active:scale-[.98] disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${className}`}
    />
  );
}

export function TextArea({ className = '', ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      spellCheck={false}
      {...props}
      className={`w-full resize-y rounded-xl border line bg-(--color-surface-2) p-3.5 text-[13px] leading-6 text-(--color-ink) placeholder:text-(--color-ink-2)/60 transition focus:border-brand-400 focus:bg-(--color-surface) focus:outline-none focus:ring-4 focus:ring-brand-500/15 ${className}`}
    />
  );
}

export function Input({ className = '', ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      spellCheck={false}
      {...props}
      className={`rounded-lg border line bg-(--color-surface-2) px-3 py-1.5 text-sm text-(--color-ink) transition focus:border-brand-400 focus:bg-(--color-surface) focus:outline-none focus:ring-4 focus:ring-brand-500/15 ${className}`}
    />
  );
}

export function Checkbox({ label, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className="inline-flex cursor-pointer select-none items-center gap-2 text-sm">
      <input type="checkbox" {...props} className="h-4 w-4 rounded accent-brand-500" />
      {label}
    </label>
  );
}

export function Field({ label, children, hint }: { label: string; children: ReactNode; hint?: string }) {
  return (
    <label className="block">
      <span className="muted mb-1 block text-xs font-semibold uppercase tracking-wider">{label}</span>
      {children}
      {hint && <span className="muted mt-1 block text-xs">{hint}</span>}
    </label>
  );
}

export function Toolbar({ children }: { children: ReactNode }) {
  return <div className="flex flex-wrap items-center gap-2">{children}</div>;
}

export function Panel({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`surface-2 rounded-xl border line p-4 ${className}`}>
      {children}
    </div>
  );
}

export function ErrorMsg({ children }: { children: ReactNode }) {
  if (!children) return null;
  return (
    <p role="alert" className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 font-mono text-[13px] text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300">
      {children}
    </p>
  );
}

/** A labelled read-only result row with its own copy button. */
export function ResultRow({ label, value, mono = true }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-center gap-3 border-b line py-2.5 last:border-0">
      <span className="muted w-28 shrink-0 text-xs font-semibold uppercase tracking-wider">{label}</span>
      <code className={`min-w-0 flex-1 truncate text-[13px] ${mono ? 'font-mono' : 'font-sans'}`} title={value}>
        {value || <span className="muted">—</span>}
      </code>
      <CopyButton text={value} />
    </div>
  );
}

/** Two-state segmented control (e.g. Encode | Decode). */
export function Segmented<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
}) {
  return (
    <div className="surface-2 inline-flex rounded-lg border line p-0.5" role="tablist">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          role="tab"
          aria-selected={o.value === value}
          onClick={() => onChange(o.value)}
          className={`rounded-md px-3 py-1 text-sm font-medium transition ${
            o.value === value ? 'bg-(--color-surface) text-brand-500 shadow-sm' : 'muted hover:text-(--color-ink)'
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
