'use client';

import { useState } from 'react';
import { resetLab, useLabProgress } from '@/lib/lab-progress';

interface LabProgressProps {
  labId: string;
  /** Optional. The total is the sum of every graded element on the page. This is only shown until they load. */
  totalPoints?: number;
}

const STEP = 5;

export function LabProgress({ labId, totalPoints = 0 }: LabProgressProps) {
  const { earned, total: registered } = useLabProgress(labId);
  const [confirming, setConfirming] = useState(false);

  const total = registered || totalPoints;
  const done = total > 0 && earned >= total;
  const cells = Math.max(1, Math.round(total / STEP));
  const filled = Math.min(cells, Math.round(earned / STEP));

  const reset = () => {
    resetLab(labId);
    setConfirming(false);
  };

  return (
    <div className="not-prose mt-0 mb-8 border-y-2 border-fd-foreground py-4">
      <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-3">
        <div>
          <p className="text-sm text-fd-muted-foreground">Your score</p>
          <p
            className="mt-1 font-semibold leading-none tracking-tight text-fd-foreground text-4xl sm:text-5xl [font-variant-numeric:tabular-nums]"
            role="status"
            aria-live="polite"
          >
            {earned}
            <span className="text-fd-muted-foreground"> / {total}</span>
          </p>
        </div>
        <div className="flex-1 min-w-[12rem] max-w-sm">
          <div className="flex gap-1.5" aria-hidden="true">
            {Array.from({ length: cells }).map((_, i) => (
              <span
                key={i}
                className={`h-3 flex-1 border transition-colors duration-300 ${
                  i < filled ? (done ? 'border-fd-success bg-fd-success' : 'border-fd-primary bg-fd-primary') : 'border-fd-foreground/40 bg-transparent'
                }`}
              />
            ))}
          </div>
          <p className={`mt-2 text-sm font-medium ${done ? 'text-fd-success' : 'text-fd-muted-foreground'}`}>
            {done ? 'Complete. Every part is done.' : earned > 0 ? 'In progress. Points count as you answer.' : 'Not started. Answer the questions and run the autograder.'}
          </p>
        </div>
      </div>
      <div className="mt-3 flex items-baseline gap-4 text-sm">
        {confirming ? (
          <>
            <span className="text-fd-muted-foreground">Clear your score and start the lab over?</span>
            <button type="button" onClick={reset} className="cursor-pointer font-medium text-fd-error underline underline-offset-4 hover:decoration-2">
              Yes, reset
            </button>
            <button type="button" onClick={() => setConfirming(false)} className="cursor-pointer font-medium text-fd-foreground underline decoration-fd-primary underline-offset-4 hover:decoration-2">
              Cancel
            </button>
          </>
        ) : (
          <button type="button" onClick={() => setConfirming(true)} className="cursor-pointer font-medium text-fd-foreground underline decoration-fd-primary underline-offset-4 hover:decoration-2">
            Reset this lab
          </button>
        )}
      </div>
    </div>
  );
}
