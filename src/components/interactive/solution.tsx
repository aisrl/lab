'use client';

import { useState } from 'react';
import { KeyRound, ChevronDown, Eye, EyeOff } from 'lucide-react';

interface SolutionProps {
  title?: string;
  children: React.ReactNode;
}

export function Solution({ title = 'View Reference Solution', children }: SolutionProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="my-6 rounded-xl border border-zinc-300 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-900/40 overflow-hidden shadow-xs">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 text-left text-xs sm:text-sm font-semibold text-zinc-900 dark:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 transition-colors cursor-pointer"
      >
        <span className="flex items-center gap-2">
          <KeyRound className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          <span>{title}</span>
          <span className="text-[11px] font-normal text-zinc-500 font-mono hidden sm:inline">
            (Try solving it yourself first!)
          </span>
        </span>
        <div className="flex items-center gap-1.5 text-zinc-500 text-xs font-mono">
          <span>{isOpen ? 'Hide' : 'Reveal'}</span>
          <ChevronDown
            className={`w-4 h-4 transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </div>
      </button>

      {isOpen && (
        <div className="p-4 pt-3 border-t border-zinc-200 dark:border-zinc-800/80 text-xs sm:text-sm text-zinc-800 dark:text-zinc-200 leading-relaxed bg-white/70 dark:bg-black/30">
          <div className="mb-3 text-xs text-zinc-600 dark:text-zinc-400">
            Study this implementation to understand how the guardrail inspects plaintext, Base64, and hexadecimal encoding layers:
          </div>
          {children}
        </div>
      )}
    </div>
  );
}
