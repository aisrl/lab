'use client';

import React, { useState } from 'react';

export interface LabHeaderProps {
  pillar: string;
  title: string;
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
  time?: string;
  compute?: string;
  colabUrl?: string;
  githubPath?: string;
  author?: string;
}

export function LabHeader({
  pillar,
  title,
  difficulty = 'Intermediate',
  time = '15-20 mins',
  compute = 'Laptop CPU / Docker',
  colabUrl,
  githubPath,
  author,
}: LabHeaderProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!githubPath) return;
    navigator.clipboard.writeText(`cd ${githubPath} && pytest tests/`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const rows: [string, string][] = [
    ['Pillar', pillar],
    ['Level', `${difficulty}, ${time}`],
    ['Runs on', compute],
    ['Graded by', 'A local pytest suite'],
  ];
  if (author) rows.push(['By', author]);

  return (
    <div className="not-prose mt-8 mb-0">
      <h2 className="font-semibold tracking-tight text-fd-foreground text-2xl sm:text-3xl mb-4">{title}</h2>
      <table className="w-full border-collapse text-[0.95rem]">
        <tbody>
          {rows.map(([k, v], i) => (
            <tr key={k} className={i === 0 ? 'border-t-2 border-fd-foreground' : 'border-t border-fd-border'}>
              <th scope="row" className="w-28 sm:w-40 py-2 pr-4 text-left align-baseline font-normal text-fd-muted-foreground">{k}</th>
              <td className="py-2 align-baseline text-fd-foreground">{v}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {(colabUrl || githubPath) && (
        <div className="flex flex-wrap gap-x-6 gap-y-2 border-t border-fd-border py-3 text-sm">
          {colabUrl && (
            <a href={colabUrl} target="_blank" rel="noopener noreferrer" className="font-medium text-fd-foreground underline decoration-fd-primary underline-offset-4 hover:decoration-2">
              Open in Google Colab
            </a>
          )}
          {githubPath && (
            <button
              type="button"
              onClick={handleCopy}
              className="cursor-pointer font-medium text-fd-foreground underline decoration-fd-primary underline-offset-4 hover:decoration-2"
            >
              {copied ? 'Copied the pytest command' : 'Copy the pytest command'}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
