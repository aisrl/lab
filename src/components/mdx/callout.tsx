import type { ReactNode } from 'react';

type Kind = 'info' | 'warn' | 'warning' | 'error' | 'success' | 'idea';

// Edge colour carries the meaning: red for attacks and failures, green for defences and passes,
// amber for caveats and threat-model notes, ink for plain information.
const edge: Record<Kind, string> = {
  info: 'border-fd-foreground',
  warn: 'border-fd-warning',
  warning: 'border-fd-warning',
  error: 'border-fd-error',
  success: 'border-fd-success',
  idea: 'border-fd-primary',
};

export function Callout({ type = 'info', title, children }: { type?: Kind; title?: ReactNode; children?: ReactNode }) {
  return (
    <div className={`not-prose my-6 border-l-[3px] bg-fd-muted/50 py-4 pl-5 pr-5 ${edge[type] ?? edge.info}`} role="note">
      {title && <p className="mb-1.5 text-base font-semibold tracking-tight text-fd-foreground">{title}</p>}
      <div className="text-[0.95rem] leading-relaxed text-fd-foreground [&>*:first-child]:mt-0 [&>*:last-child]:mb-0 [&_p]:my-2 [&_strong]:font-semibold">
        {children}
      </div>
    </div>
  );
}
