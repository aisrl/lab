'use client';

import { useState, useEffect } from 'react';
import { Award, CheckCircle } from 'lucide-react';

interface LabProgressProps {
  labId: string;
  totalPoints: number;
}

export function LabProgress({ labId, totalPoints }: LabProgressProps) {
  const [completed, setCompleted] = useState(false);

  const checkStatus = () => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(`aisrl_lab_${labId}`);
      setCompleted(saved === 'completed');
    }
  };

  useEffect(() => {
    checkStatus();
    const handleUpdate = () => checkStatus();
    window.addEventListener('aisrl_progress_updated', handleUpdate);
    return () => window.removeEventListener('aisrl_progress_updated', handleUpdate);
  }, [labId]);

  return (
    <div className="my-4 flex items-center justify-between p-3.5 rounded-xl border border-purple-300 dark:border-purple-900/50 bg-purple-50/90 dark:bg-purple-950/25 text-xs sm:text-sm shadow-xs">
      <div className="flex items-center gap-2">
        <Award className="w-4 h-4 text-purple-700 dark:text-purple-400" />
        <span className="text-zinc-800 dark:text-zinc-200 font-medium">Lab Score:</span>
        <span className="font-mono font-semibold text-purple-800 dark:text-purple-300">
          {completed ? `${totalPoints} / ${totalPoints} pts` : `0 / ${totalPoints} pts`}
        </span>
      </div>

      <div>
        {completed ? (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800/40 text-emerald-800 dark:text-emerald-300 text-xs font-mono font-medium">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Passed & Completed</span>
          </span>
        ) : (
          <span className="text-zinc-600 dark:text-zinc-400 font-mono text-xs">
            Not completed yet
          </span>
        )}
      </div>
    </div>
  );
}
