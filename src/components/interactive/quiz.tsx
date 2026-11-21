'use client';

import { useState } from 'react';

interface QuizProps {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const letters = ['A', 'B', 'C', 'D', 'E', 'F'];

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
    <div className="not-prose my-8 border-t-2 border-fd-foreground bg-fd-muted/60 px-5 pb-5 pt-4">
      <p className="text-sm font-semibold text-fd-primary">Concept check</p>
      <h4 className="mt-1 mb-4 text-xl font-semibold leading-snug tracking-tight text-fd-foreground">{question}</h4>

      <ul className="space-y-2">
        {options.map((opt, idx) => {
          const isRight = submitted && idx === correctIndex;
          const isWrong = submitted && idx === selected && idx !== correctIndex;
          const dimmed = submitted && !isRight && !isWrong;
          return (
            <li key={idx}>
              <button
                type="button"
                onClick={() => handleSelect(idx)}
                aria-pressed={submitted && idx === selected}
                className={`flex w-full cursor-pointer items-start gap-4 border border-l-[3px] bg-fd-background px-4 py-3 text-left text-[0.95rem] transition-colors duration-150 ${
                  isRight
                    ? 'border-fd-border border-l-fd-success'
                    : isWrong
                      ? 'border-fd-border border-l-fd-error'
                      : dimmed
                        ? 'border-fd-border border-l-fd-border text-fd-muted-foreground'
                        : 'border-fd-border border-l-fd-border text-fd-foreground hover:border-l-fd-primary hover:bg-fd-popover'
                }`}
              >
                <span className="mt-0.5 w-5 shrink-0 font-mono text-sm text-fd-muted-foreground" aria-hidden="true">{letters[idx]}</span>
                <span className="flex-1">{opt}</span>
                {isRight && <span className="shrink-0 text-sm font-semibold text-fd-success">Correct</span>}
                {isWrong && <span className="shrink-0 text-sm font-semibold text-fd-error">Not quite</span>}
              </button>
            </li>
          );
        })}
      </ul>

      {submitted && (
        <div
          className={`mt-4 border-l-[3px] pl-4 text-[0.95rem] leading-relaxed text-fd-foreground ${
            isCorrect ? 'border-fd-success' : 'border-fd-error'
          }`}
          role="status"
        >
          <p>{explanation}</p>
          {!isCorrect && (
            <button
              type="button"
              onClick={handleReset}
              className="mt-2 cursor-pointer text-sm font-medium text-fd-foreground underline decoration-fd-primary underline-offset-4 hover:decoration-2"
            >
              Try again
            </button>
          )}
        </div>
      )}
    </div>
  );
}
