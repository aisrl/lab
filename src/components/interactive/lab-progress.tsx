'use client';

import { useState, useEffect } from 'react';

interface LabProgressProps {
  labId: string;
  totalPoints: number;
}

export function LabProgress({ labId, totalPoints }: LabProgressProps) {
  const [completed, setCompleted] = useState(false);

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

  return (
    <div className="not-prose mt-0 mb-6 flex items-baseline justify-between gap-4 border-y-2 border-fd-foreground py-2 text-[0.95rem]">
      <span className="text-fd-muted-foreground">Your score</span>
      <span className="font-mono text-sm text-fd-foreground" role="status" aria-live="polite">
        {completed ? `${totalPoints} / ${totalPoints}, passed` : `0 / ${totalPoints}, not completed yet`}
      </span>
    </div>
  );
}
