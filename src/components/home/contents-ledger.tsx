'use client';

import Link from 'next/link';
import { useId, useState } from 'react';

export type LedgerRow = { no: string; name: string; labs: number; status: 'Active' | 'Roadmap'; href: string };

type Filter = 'all' | 'Active' | 'Roadmap';

const options: { id: Filter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'Active', label: 'Active' },
  { id: 'Roadmap', label: 'Roadmap' },
];

export function ContentsLedger({ tutorial, rows }: { tutorial: string; rows: LedgerRow[] }) {
  const uid = useId();
  const [filter, setFilter] = useState<Filter>('all');
  const shown = rows.filter((r) => filter === 'all' || r.status === filter);
  const labs = shown.reduce((n, r) => n + r.labs, 0);

  return (
    <>
      <div className="ledger__cap">
        <h2 className="ledger__title">Curriculum</h2>
        <span className="ledger__note" role="status" aria-live="polite">
          {labs} labs{filter === 'all' ? ' planned' : ', ' + filter.toLowerCase()}
        </span>
      </div>
      <fieldset className="ledger__filter">
        <legend className="visually-hidden">Show pillars</legend>
        {options.map((o) => (
          <span key={o.id} className="ledger__opt">
            <input type="radio" name={`${uid}-f`} id={`${uid}-${o.id}`} checked={filter === o.id} onChange={() => setFilter(o.id)} />
            <label htmlFor={`${uid}-${o.id}`}>{o.label}</label>
          </span>
        ))}
      </fieldset>
      <table className="ledger">
        <thead>
          <tr>
            <th scope="col" className="c-no">No.</th>
            <th scope="col">Pillar</th>
            <th scope="col" className="c-num">Labs</th>
            <th scope="col" className="c-status">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr className="is-start">
            <td className="c-no num">00</td>
            <th scope="row"><Link href={tutorial}>Tutorial: prompt injection guard</Link></th>
            <td className="c-num num">1</td>
            <td className="c-status">Start here</td>
          </tr>
          {shown.map((r) => (
            <tr key={r.no} className={r.status === 'Roadmap' ? 'is-planned' : undefined}>
              <td className="c-no num">{r.no}</td>
              <th scope="row"><Link href={r.href}>{r.name}</Link></th>
              <td className="c-num num">{r.labs}</td>
              <td className="c-status">{r.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="ledger__foot">Labs per pillar as planned. Lab 12 is still to be written.</p>
    </>
  );
}
