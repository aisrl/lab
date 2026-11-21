'use client';

import { useId, useState } from 'react';

interface SolutionProps {
  title?: string;
  children: React.ReactNode;
}

export function Solution({ title = 'View the reference solution', children }: SolutionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const panelId = useId();

  return (
    <div className="not-prose my-6 border-l-[3px] border-fd-foreground pl-4">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls={panelId}
        className="flex w-full cursor-pointer items-baseline justify-between gap-4 py-1.5 text-left text-[0.95rem] font-medium text-fd-foreground hover:text-fd-primary"
      >
        <span>
          {title}
          <span className="ml-3 font-normal text-fd-muted-foreground">Try it yourself first.</span>
        </span>
        <span aria-hidden="true" className="text-lg leading-none">{isOpen ? '−' : '+'}</span>
      </button>
      <div id={panelId} hidden={!isOpen} className="pb-2 pt-2 text-[0.95rem] leading-relaxed text-fd-foreground">
        <p className="mb-3 text-fd-muted-foreground">
          Study how this implementation checks plain text, Base64 and hexadecimal.
        </p>
        {children}
      </div>
    </div>
  );
}
