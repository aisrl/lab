'use client';

import React, { useState } from 'react';
import { Cpu, Clock, ShieldCheck, Terminal, ExternalLink, Check, Copy } from 'lucide-react';

export interface LabHeaderProps {
  pillar: string;
  title: string;
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
  time?: string;
  compute?: string;
  colabUrl?: string;
  githubPath?: string;
}

export function LabHeader({
  pillar,
  title,
  difficulty = 'Intermediate',
  time = '15-20 mins',
  compute = 'Laptop CPU / Docker',
  colabUrl,
  githubPath,
}: LabHeaderProps) {
  const [copied, setCopied] = useState(false);

  const difficultyColors = {
    Beginner: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    Intermediate: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    Advanced: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
  }[difficulty];

  const handleCopy = () => {
    if (!githubPath) return;
    navigator.clipboard.writeText(`cd ${githubPath} && pytest tests/`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="not-prose my-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-gradient-to-br from-zinc-50 to-zinc-100/60 dark:from-zinc-900/80 dark:to-zinc-950/40 p-5 shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-primary">
          {pillar}
        </span>
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${difficultyColors}`}>
            {difficulty}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full border border-zinc-200 dark:border-zinc-700/60 bg-white/70 dark:bg-zinc-800/60 px-2.5 py-0.5 text-xs font-medium text-zinc-700 dark:text-zinc-300">
            <Clock className="w-3 h-3 text-zinc-400" />
            {time}
          </span>
        </div>
      </div>

      <div className="mt-3">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          {title}
        </h2>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-zinc-600 dark:text-zinc-400">
        <div className="flex items-center gap-1.5">
          <Cpu className="w-4 h-4 text-zinc-500" />
          <span>Compute: <strong className="font-medium text-zinc-800 dark:text-zinc-200">{compute}</strong></span>
        </div>
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>Self-Grading: <strong className="font-medium text-zinc-800 dark:text-zinc-200">Pytest Local Suite</strong></span>
        </div>
      </div>

      {(colabUrl || githubPath) && (
        <div className="mt-4 flex flex-wrap items-center gap-2 pt-3 border-t border-zinc-200/80 dark:border-zinc-800/80">
          {colabUrl && (
            <a
              href={colabUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30 px-3 py-1.5 text-xs font-medium transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Open in Google Colab (Free T4)
            </a>
          )}
          {githubPath && (
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 rounded-lg bg-zinc-200/70 dark:bg-zinc-800 hover:bg-zinc-300/70 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 border border-zinc-300 dark:border-zinc-700 px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Terminal className="w-3.5 h-3.5" />}
              {copied ? 'Command Copied!' : `Copy pytest starter command`}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
