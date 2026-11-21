'use client';

import { useId, useState } from 'react';

interface HintProps {
  title?: string;
  children: React.ReactNode;
}

export function Hint({ title = 'Need a hint?', children }: HintProps) {
  const [isOpen, setIsOpen] = useState(false);
  const panelId = useId();

  return (
    <div className="not-prose my-3 border-l-[3px] border-fd-primary pl-4">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls={panelId}
        className="flex w-full cursor-pointer items-baseline justify-between gap-4 py-1.5 text-left text-[0.95rem] font-medium text-fd-foreground hover:text-fd-primary"
      >
        <span>{title}</span>
        <span aria-hidden="true" className="text-lg leading-none">{isOpen ? '−' : '+'}</span>
      </button>
      <div id={panelId} hidden={!isOpen} className="pb-2 pt-1 text-[0.95rem] leading-relaxed text-fd-foreground">
        {children}
      </div>
    </div>
  );
}
