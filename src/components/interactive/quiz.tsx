'use client';

import { useState } from 'react';
import { CheckCircle2, XCircle, HelpCircle } from 'lucide-react';

interface QuizProps {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export function Quiz({ question, options, correctIndex, explanation }: QuizProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState<boolean>(false);

  const isCorrect = selected === correctIndex;

  const handleSelect = (idx: number) => {
    if (submitted && isCorrect) return; // locked once correct
    setSelected(idx);
    setSubmitted(true);
  };

  const handleReset = () => {
    setSelected(null);
    setSubmitted(false);
  };

  return (
    <div className="my-6 rounded-xl border border-zinc-300 dark:border-zinc-800 bg-zinc-50/90 dark:bg-zinc-900/50 p-5 shadow-xs">
      <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-purple-700 dark:text-purple-400 font-bold mb-2">
        <HelpCircle className="w-4 h-4" />
        <span>Concept Check</span>
      </div>
      <h4 className="text-sm sm:text-base font-semibold text-zinc-900 dark:text-zinc-100 mb-4 leading-snug">
        {question}
      </h4>

      <div className="space-y-2">
        {options.map((opt, idx) => {
          let btnStyle =
            'border-zinc-300 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 text-zinc-800 dark:text-zinc-200';
          if (submitted) {
            if (idx === correctIndex) {
              btnStyle =
                'border-emerald-500 dark:border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 font-medium';
            } else if (idx === selected) {
              btnStyle =
                'border-rose-500 dark:border-rose-600 bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200';
            } else {
              btnStyle =
                'border-zinc-200 dark:border-zinc-800/40 bg-zinc-100/60 dark:bg-zinc-900/20 text-zinc-400 dark:text-zinc-500 opacity-60';
            }
          }

          return (
            <button
              key={idx}
              onClick={() => handleSelect(idx)}
              className={`w-full text-left p-3 rounded-lg border text-xs sm:text-sm transition-all flex items-center justify-between cursor-pointer ${btnStyle}`}
            >
              <span>{opt}</span>
              {submitted && idx === correctIndex && (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 ml-2" />
              )}
              {submitted && idx === selected && idx !== correctIndex && (
                <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 ml-2" />
              )}
            </button>
          );
        })}
      </div>

      {submitted && (
        <div
          className={`mt-4 p-3.5 rounded-lg border text-xs sm:text-sm leading-relaxed ${
            isCorrect
              ? 'border-emerald-300 dark:border-emerald-800/40 bg-emerald-50/90 dark:bg-emerald-950/20 text-emerald-950 dark:text-emerald-200'
              : 'border-rose-300 dark:border-rose-800/40 bg-rose-50/90 dark:bg-rose-950/20 text-rose-950 dark:text-rose-200'
          }`}
        >
          <div className="font-bold mb-1 flex items-center gap-1.5">
            {isCorrect ? '✓ Correct!' : '✗ Not quite.'}
          </div>
          <p className="opacity-95">{explanation}</p>
          {!isCorrect && (
            <button
              onClick={handleReset}
              className="mt-2 text-xs font-mono text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white underline cursor-pointer font-medium"
            >
              Try again
            </button>
          )}
        </div>
      )}
    </div>
  );
}
