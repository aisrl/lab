'use client';

import { useEffect, useId, useState } from 'react';
import { awardPoints, getItemPoints, registerItem } from '@/lib/lab-progress';

export interface RubricItem {
  /** What a good answer says, written as a short phrase the learner sees after submitting. */
  label: string;
  /** Any one of these words or phrases shows the idea is present. Matched ignoring case. */
  anyOf: string[];
}

interface ShortAnswerProps {
  question: string;
  rubric: RubricItem[];
  /** A model answer, shown after the learner submits. */
  modelAnswer: string;
  labId?: string;
  id?: string;
  points?: number;
  /** Fewest characters accepted. Stops a one-word guess from scoring. */
  minLength?: number;
}

function slug(s: string) {
  return 'short-' + s.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 40);
}

export function ShortAnswer({ question, rubric, modelAnswer, labId, id, points = 5, minLength = 40 }: ShortAnswerProps) {
  const uid = useId();
  const itemId = id ?? slug(question);
  const [text, setText] = useState('');
  const [hits, setHits] = useState<boolean[] | null>(null);
  const [tooShort, setTooShort] = useState(false);
  const [earned, setEarned] = useState(0);

  useEffect(() => {
    if (!labId) return;
    registerItem(labId, itemId, points);
    setEarned(getItemPoints(labId, itemId));
  }, [labId, itemId, points]);

  useEffect(() => {
    const onReset = () => {
      setText('');
      setHits(null);
      setTooShort(false);
      setEarned(0);
    };
    window.addEventListener('aisrl_lab_reset', onReset);
    return () => window.removeEventListener('aisrl_lab_reset', onReset);
  }, []);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim().length < minLength) {
      setTooShort(true);
      return;
    }
    setTooShort(false);
    const lower = text.toLowerCase();
    const result = rubric.map((r) => r.anyOf.some((k) => lower.includes(k.toLowerCase())));
    setHits(result);
    // Points are shared across the rubric, rounded down. A retry can only raise the score.
    const pts = Math.floor((points * result.filter(Boolean).length) / rubric.length);
    setEarned((prev) => Math.max(prev, pts));
    if (labId && pts > 0) awardPoints(labId, itemId, pts);
  };

  const matched = hits ? hits.filter(Boolean).length : 0;

  return (
    <form onSubmit={submit} className="not-prose my-8 border-t-2 border-fd-foreground bg-fd-muted/60 px-5 pb-5 pt-4" noValidate>
      <div className="flex items-baseline justify-between gap-4">
        <p className="text-sm font-semibold text-fd-primary">Short answer</p>
        {labId && (
          <p className={`text-sm font-medium [font-variant-numeric:tabular-nums] ${earned > 0 ? 'text-fd-success' : 'text-fd-muted-foreground'}`}>
            {earned} / {points} points
          </p>
        )}
      </div>
      <label htmlFor={uid} className="mt-1 mb-3 block text-xl font-semibold leading-snug tracking-tight text-fd-foreground">
        {question}
      </label>
      <textarea
        id={uid}
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          setTooShort(false);
        }}
        rows={4}
        aria-invalid={tooShort}
        className="block w-full resize-y border border-fd-border bg-fd-background px-3 py-2 text-[0.95rem] leading-relaxed text-fd-foreground outline-none focus-visible:border-fd-primary"
        placeholder="Answer in your own words, in a sentence or two."
      />
      <div className="mt-3 flex flex-wrap items-center gap-4">
        <button type="submit" className="min-h-10 cursor-pointer border border-fd-foreground px-4 text-sm font-medium text-fd-foreground hover:bg-fd-background">
          Check my answer
        </button>
        {tooShort && <span className="text-sm font-semibold text-fd-error">Write a little more first, at least a full sentence.</span>}
      </div>

      {hits && (
        <div className="mt-5" role="status">
          <p className="text-sm font-medium text-fd-muted-foreground">
            You covered {matched} of {rubric.length} ideas. This check looks for key words, so it can miss a good answer in different words.
          </p>
          <ul className="mt-2 border-t-2 border-fd-foreground">
            {rubric.map((r, i) => (
              <li key={r.label} className={`flex items-baseline justify-between gap-4 border-b border-fd-border border-l-[3px] py-2 pl-4 text-[0.95rem] text-fd-foreground ${hits[i] ? 'border-l-fd-success' : 'border-l-fd-border'}`}>
                <span>{r.label}</span>
                <span className={`shrink-0 text-sm font-semibold ${hits[i] ? 'text-fd-success' : 'text-fd-muted-foreground'}`}>{hits[i] ? 'Covered' : 'Missing'}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 border-l-[3px] border-fd-foreground pl-4 text-[0.95rem] leading-relaxed text-fd-foreground">
            <p className="mb-1 text-sm font-semibold text-fd-muted-foreground">A model answer</p>
            <p>{modelAnswer}</p>
          </div>
        </div>
      )}
    </form>
  );
}
