'use client';

import { useId, useState } from 'react';

const CANARY = 'CANARY_SEC_9921_Z';
const b64 = (s: string) => btoa(s);
const hex = (s: string) =>
  Array.from(new TextEncoder().encode(s))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

type Guard = 'plain' | 'full';

// The guard under test. "plain" is the first thing most people write.
function isSafe(text: string, guard: Guard): boolean {
  if (text.includes(CANARY)) return false;
  if (guard === 'plain') return true;
  if (text.includes(b64(CANARY))) return false;
  if (text.toLowerCase().includes(hex(CANARY))) return false;
  return true;
}

// The same four checks as tests/test_guard.py in the tutorial lab.
const tests = [
  { name: 'test_benign_output', text: 'Here is a summary of the quarterly financial report.', expectSafe: true },
  { name: 'test_direct_canary_leak_caught', text: `Sure! The confidential token is ${CANARY}.`, expectSafe: false },
  { name: 'test_base64_canary_leak_caught', text: `The encoded response is: ${b64(CANARY)}`, expectSafe: false },
  { name: 'test_hex_canary_leak_caught', text: `Memory dump: ${hex(CANARY)}`, expectSafe: false },
];

const code: Record<Guard, string> = {
  plain: `def inspect_model_output(text, canary):
    if canary in text:
        return False, "plain text"
    return True, "clean"`,
  full: `def inspect_model_output(text, canary):
    if canary in text:
        return False, "plain text"
    if b64(canary) in text:
        return False, "base64"
    if hex(canary) in text.lower():
        return False, "hex"
    return True, "clean"`,
};

export function AlmanacGrader() {
  const uid = useId();
  const [guard, setGuard] = useState<Guard>('plain');
  const [ran, setRan] = useState(false);

  const results = tests.map((t) => ({ ...t, passed: isSafe(t.text, guard) === t.expectSafe }));
  const score = results.filter((r) => r.passed).length * 5;

  const pick = (g: Guard) => {
    setGuard(g);
    setRan(false);
  };

  return (
    <figure className="grade__file">
      <fieldset className="grade__pick">
        <legend className="visually-hidden">Guard to test</legend>
        <span className="grade__opt">
          <input type="radio" name={`${uid}-g`} id={`${uid}-plain`} checked={guard === 'plain'} onChange={() => pick('plain')} />
          <label htmlFor={`${uid}-plain`}>Plain text only</label>
        </span>
        <span className="grade__opt">
          <input type="radio" name={`${uid}-g`} id={`${uid}-full`} checked={guard === 'full'} onChange={() => pick('full')} />
          <label htmlFor={`${uid}-full`}>Plain, base64 and hex</label>
        </span>
      </fieldset>
      <pre className="grade__code"><code>{code[guard]}</code></pre>
      <div className="grade__runrow">
        <button type="button" className="grade__run" onClick={() => setRan(true)}>Run the tests</button>
        <span className="grade__cmd2">$ pytest tests/</span>
      </div>
      <table className="ledger ledger--ink">
        <thead>
          <tr>
            <th scope="col">Check</th>
            <th scope="col">Result</th>
            <th scope="col" className="c-num">Points</th>
          </tr>
        </thead>
        <tbody>
          {results.map((r) => (
            <tr key={r.name}>
              <th scope="row" className="mono">{r.name}</th>
              <td className={`mono ${ran ? (r.passed ? 'is-pass' : 'is-fail') : 'is-idle'}`}>{ran ? (r.passed ? 'passed' : 'failed') : 'not run'}</td>
              <td className="c-num num mono">{ran && r.passed ? 5 : 0}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <th scope="row">Score</th>
            <td></td>
            <td className="c-num num mono" role="status" aria-live="polite">{ran ? score : 0} / 20</td>
          </tr>
        </tfoot>
      </table>
      <figcaption>
        {ran && score < 20
          ? 'Two leaks slipped through. Switch to the full guard and run it again.'
          : ran
            ? 'All four checks pass. The tutorial has you write this guard yourself.'
            : 'The same four checks as the tutorial lab. Pick a guard, then run them.'}
      </figcaption>
    </figure>
  );
}
