'use client';

import { useState } from 'react';

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
    <div className="not-prose my-8">
      <p className="text-sm font-medium text-fd-muted-foreground">Concept check</p>
      <h4 className="mt-1 mb-4 text-lg font-semibold leading-snug tracking-tight text-fd-foreground">{question}</h4>

      <ul className="border-t-2 border-fd-foreground">
        {options.map((opt, idx) => {
          const isRight = submitted && idx === correctIndex;
          const isWrong = submitted && idx === selected && idx !== correctIndex;
          const dimmed = submitted && !isRight && !isWrong;
          return (
            <li key={idx} className="border-b border-fd-border">
              <button
                type="button"
                onClick={() => handleSelect(idx)}
                aria-pressed={submitted && idx === selected}
                className={`flex w-full cursor-pointer items-baseline justify-between gap-4 border-l-[3px] py-3 pl-4 pr-1 text-left text-[0.95rem] transition-colors duration-150 ${
                  isRight
                    ? 'border-fd-success font-medium text-fd-foreground'
                    : isWrong
                      ? 'border-fd-error text-fd-foreground'
                      : dimmed
                        ? 'border-transparent text-fd-muted-foreground'
                        : 'border-transparent text-fd-foreground hover:border-fd-primary hover:bg-fd-muted'
                }`}
              >
                <span>{opt}</span>
                {isRight && <span className="shrink-0 text-sm font-medium text-fd-success">Correct</span>}
                {isWrong && <span className="shrink-0 text-sm font-medium text-fd-error">Not quite</span>}
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
