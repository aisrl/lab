'use client';

import { useState, useEffect } from 'react';

interface LabProgressProps {
  labId: string;
  totalPoints: number;
}

const STEP = 5;

export function LabProgress({ labId, totalPoints }: LabProgressProps) {
  const [completed, setCompleted] = useState(false);
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    const check = () => {
      try {
        setCompleted(localStorage.getItem(`aisrl_lab_${labId}`) === 'completed');
      } catch {
        setCompleted(false);
      }
    };
    check();
    window.addEventListener('aisrl_progress_updated', check);
    return () => window.removeEventListener('aisrl_progress_updated', check);
  }, [labId]);

  const reset = () => {
    try {
      localStorage.removeItem(`aisrl_lab_${labId}`);
    } catch {
      /* storage unavailable: nothing to clear */
    }
    setCompleted(false);
    setConfirming(false);
    window.dispatchEvent(new CustomEvent('aisrl_lab_reset', { detail: { labId } }));
    window.dispatchEvent(new Event('aisrl_progress_updated'));
  };

  const cells = Math.max(1, Math.round(totalPoints / STEP));
  const earned = completed ? totalPoints : 0;

  return (
    <div className="not-prose mt-0 mb-8 border-y-2 border-fd-foreground py-4" role="status" aria-live="polite">
      <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-3">
        <div>
          <p className="text-sm text-fd-muted-foreground">Your score</p>
          <p className="mt-1 font-semibold leading-none tracking-tight text-fd-foreground text-4xl sm:text-5xl [font-variant-numeric:tabular-nums]">
            {earned}
            <span className="text-fd-muted-foreground"> / {totalPoints}</span>
          </p>
        </div>
        <div className="flex-1 min-w-[12rem] max-w-sm">
          <div className="flex gap-1.5" aria-hidden="true">
            {Array.from({ length: cells }).map((_, i) => (
              <span
                key={i}
                className={`h-3 flex-1 border transition-colors duration-300 ${
                  completed ? 'border-fd-success bg-fd-success' : 'border-fd-foreground/40 bg-transparent'
                }`}
              />
            ))}
          </div>
          <p className={`mt-2 text-sm font-medium ${completed ? 'text-fd-success' : 'text-fd-muted-foreground'}`}>
            {completed ? 'Passed. All checks are green.' : 'Not completed yet. Run the autograder below.'}
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
