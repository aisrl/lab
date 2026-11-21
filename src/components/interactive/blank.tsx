'use client';

import { useEffect, useId, useState } from 'react';
import { awardPoints, getItemPoints, registerItem } from '@/lib/lab-progress';

interface BlankProps {
  /** The sentence, with ___ where the blank goes. */
  prompt: string;
  /** Every answer that counts. Plain strings match ignoring case and spacing; wrap a pattern in slashes, like "/^b(ase)?64$/i", to match a regular expression. */
  answers: string[];
  explanation: string;
  labId?: string;
  id?: string;
  points?: number;
}

function matches(input: string, answers: string[]) {
  const v = input.trim();
  return answers.some((a) => {
    const re = a.match(/^\/(.+)\/([a-z]*)$/);
    if (re) {
      try {
        return new RegExp(re[1], re[2]).test(v);
      } catch {
        return false;
      }
    }
    return v.toLowerCase() === a.trim().toLowerCase();
  });
}

function slug(s: string) {
  return 'blank-' + s.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 40);
}

export function Blank({ prompt, answers, explanation, labId, id, points = 5 }: BlankProps) {
  const uid = useId();
  const itemId = id ?? slug(prompt);
  const [value, setValue] = useState('');
  const [result, setResult] = useState<'idle' | 'right' | 'wrong'>('idle');
  const [wrongTries, setWrongTries] = useState(0);
  const [earned, setEarned] = useState(0);

  useEffect(() => {
    if (!labId) return;
    registerItem(labId, itemId, points);
    setEarned(getItemPoints(labId, itemId));
  }, [labId, itemId, points]);

  useEffect(() => {
    const onReset = () => {
      setValue('');
      setResult('idle');
      setWrongTries(0);
      setEarned(0);
    };
    window.addEventListener('aisrl_lab_reset', onReset);
    return () => window.removeEventListener('aisrl_lab_reset', onReset);
  }, []);

  const [before, after] = prompt.split('___');

  const check = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim() || result === 'right') return;
    if (matches(value, answers)) {
      const pts = wrongTries === 0 ? points : Math.floor(points / 2);
      setResult('right');
      setEarned(pts);
      if (labId) awardPoints(labId, itemId, pts);
    } else {
      setResult('wrong');
      setWrongTries((n) => n + 1);
    }
  };

  return (
    <form onSubmit={check} className="not-prose my-8 border-t-2 border-fd-foreground bg-fd-muted/60 px-5 pb-5 pt-4" noValidate>
      <div className="flex items-baseline justify-between gap-4">
        <p className="text-sm font-semibold text-fd-primary">Fill in the blank</p>
        {labId && (
          <p className={`text-sm font-medium [font-variant-numeric:tabular-nums] ${earned > 0 ? 'text-fd-success' : 'text-fd-muted-foreground'}`}>
            {earned} / {points} points
          </p>
        )}
      </div>
      <label htmlFor={uid} className="mt-1 mb-4 block text-xl font-semibold leading-relaxed tracking-tight text-fd-foreground">
        {before}
        <input
          id={uid}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            if (result === 'wrong') setResult('idle');
          }}
          readOnly={result === 'right'}
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
          aria-invalid={result === 'wrong'}
          className={`mx-2 inline-block w-44 border-0 border-b-2 bg-fd-background px-2 py-0.5 text-center font-mono text-base font-medium text-fd-foreground outline-none focus-visible:border-fd-primary ${
            result === 'right' ? 'border-fd-success' : result === 'wrong' ? 'border-fd-error' : 'border-fd-foreground'
          }`}
        />
        {after}
      </label>

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={result === 'right'}
          className="min-h-10 cursor-pointer border border-fd-foreground px-4 text-sm font-medium text-fd-foreground hover:bg-fd-background disabled:cursor-not-allowed disabled:opacity-55"
        >
          Check answer
        </button>
        {result === 'right' && <span className="text-sm font-semibold text-fd-success">Correct</span>}
        {result === 'wrong' && <span className="text-sm font-semibold text-fd-error">Not quite. Try again.</span>}
      </div>

      {result === 'right' && (
        <div className="mt-4 border-l-[3px] border-fd-success pl-4 text-[0.95rem] leading-relaxed text-fd-foreground" role="status">
          <p>{explanation}</p>
        </div>
      )}
    </form>
  );
}
