'use client';

import { useState } from 'react';
import { Lightbulb, ChevronDown } from 'lucide-react';

interface HintProps {
  title?: string;
  children: React.ReactNode;
}

export function Hint({ title = 'Need a Hint?', children }: HintProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="my-4 rounded-xl border border-amber-300 dark:border-amber-900/40 bg-amber-50/70 dark:bg-amber-950/20 overflow-hidden shadow-2xs">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-3.5 text-left text-xs sm:text-sm font-semibold text-amber-950 dark:text-amber-200 hover:bg-amber-100/60 dark:hover:bg-amber-900/30 transition-colors cursor-pointer"
      >
        <span className="flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          <span>{title}</span>
        </span>
        <ChevronDown
          className={`w-4 h-4 text-amber-700 dark:text-amber-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div className="p-4 pt-3 border-t border-amber-200 dark:border-amber-900/40 text-xs sm:text-sm text-zinc-800 dark:text-zinc-200 leading-relaxed bg-white/60 dark:bg-black/30">
          {children}
        </div>
      )}
    </div>
  );
}
