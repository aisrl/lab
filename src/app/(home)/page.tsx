import Link from 'next/link';

const tutorial = '/docs/interactive-tutorial/00-prompt-injection-guard';

type Row = { no: string; name: string; labs: number; status: 'Active' | 'Roadmap'; href: string };

const contents: Row[] = [
  { no: '1', name: 'Hardware and cryptographic verification', labs: 6, status: 'Active', href: '/docs/pillar-1-hardware-crypto' },
  { no: '2', name: 'Infrastructure and weight security', labs: 6, status: 'Active', href: '/docs/pillar-2-infra-weight-security' },
  { no: '3', name: 'Red-teaming and robustness', labs: 6, status: 'Roadmap', href: '/docs/roadmap' },
  { no: '4', name: 'Training integrity and unlearning', labs: 6, status: 'Roadmap', href: '/docs/roadmap' },
  { no: '5', name: 'Agentic security and sandboxing', labs: 5, status: 'Roadmap', href: '/docs/roadmap' },
  { no: '6', name: 'AI control and oversight', labs: 4, status: 'Roadmap', href: '/docs/roadmap' },
  { no: '7', name: 'Technical governance and auditing', labs: 4, status: 'Roadmap', href: '/docs/roadmap' },
];

const readers = [
  {
    who: 'New to this',
    line: 'Take the tutorial. It runs in your browser, needs no install and takes 30 to 45 minutes.',
    cta: 'Open the tutorial',
    href: tutorial,
  },
  {
    who: 'Studying it',
    line: 'Work through Pillar 1 or Pillar 2. Each lab pairs a writeup with starter code and tests.',
    cta: 'See Pillar 1',
    href: '/docs/pillar-1-hardware-crypto',
  },
  {
    who: 'Doing research',
    line: 'Claim a planned lab, write it, and send it in. The contributor guide has the template.',
    cta: 'Read the guide',
    href: '/docs/contributing',
  },
];

const checks = [
  { name: 'test_benign_output', pts: 5 },
  { name: 'test_direct_canary_leak_caught', pts: 5 },
  { name: 'test_base64_canary_leak_caught', pts: 5 },
  { name: 'test_hex_canary_leak_caught', pts: 5 },
];

const machines = [
  { what: 'Laptop CPU or Docker', limit: 'No GPU', pillars: '1, 2, 5, 7' },
  { what: 'Free Colab T4', limit: 'Under 15 minutes', pillars: '3, 4, 6' },
  { what: 'API credits', limit: 'Under $2', pillars: '5, 6' },
  { what: 'Anything larger', limit: 'Cut or simulated', pillars: 'None' },
];

const further = [
  { name: 'ARENA', covers: 'Alignment engineering: interpretability, SAEs, RLHF', href: 'https://www.arena.education/' },
  { name: 'Transformer Circuits', covers: 'Reverse-engineering what transformers compute', href: 'https://transformer-circuits.pub/' },
  { name: 'MIT hardware security', covers: 'Confidential computing and hardware roots of trust', href: 'https://hardsec.csail.mit.edu/' },
  { name: 'RAND', covers: 'Compute governance and treaty verification', href: 'https://www.rand.org/' },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="hero" aria-labelledby="hero-title">
        <div className="container cols hero__grid">
          <div className="hero__text">
            <h1 id="hero-title" className="hero__head">Learn AI safety by building it.</h1>
            <p className="lead">Hands-on labs that grade themselves, on a laptop or free Colab.</p>
            <div className="actions">
              <Link href={tutorial} className="btn btn--primary">Start the first lab</Link>
              <Link href="/docs" className="btn btn--quiet">Browse the curriculum</Link>
            </div>
          </div>

          <div className="sheet hero__sheet">
            <div className="ledger__cap">
              <h2 className="ledger__title">Curriculum</h2>
              <span className="ledger__note">37 labs planned</span>
            </div>
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
                {contents.map((r) => (
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
          </div>
        </div>
      </section>

      {/* Where to start: rows */}
      <section className="block" aria-labelledby="start-title">
        <div className="container cols">
          <div className="start__head">
            <h2 id="start-title">Start where you are.</h2>
          </div>
          <ol className="start__rows">
            {readers.map((r) => (
              <li key={r.who} className="start__row">
                <h3>{r.who}</h3>
                <p>{r.line}</p>
                <Link href={r.href} className="start__go">{r.cta}</Link>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Self-grading: ink band */}
      <section className="band band--ink" aria-labelledby="grade-title">
        <div className="container cols">
          <div className="grade__head">
            <h2 id="grade-title">Every lab grades itself.</h2>
            <p className="lead">Run the tests, read what fails, fix the code, run them again.</p>
          </div>
          <figure className="grade__file">
            <pre className="grade__cmd"><code>$ cd labs/interactive-tutorial/00-prompt-injection-guard{'\n'}$ pytest tests/</code></pre>
            <table className="ledger ledger--ink">
              <thead>
                <tr>
                  <th scope="col">Check</th>
                  <th scope="col">Result</th>
                  <th scope="col" className="c-num">Points</th>
                </tr>
              </thead>
              <tbody>
                {checks.map((c) => (
                  <tr key={c.name}>
                    <th scope="row" className="mono">{c.name}</th>
                    <td className="mono">passed</td>
                    <td className="c-num num mono">{c.pts}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <th scope="row">Score</th>
                  <td></td>
                  <td className="c-num num mono">20 / 20</td>
                </tr>
              </tfoot>
            </table>
            <figcaption>Sample output for a finished solution. The starter code fails until you write the guard.</figcaption>
          </figure>
        </div>
      </section>

      {/* Compute: table */}
      <section className="block" aria-labelledby="compute-title">
        <div className="container">
          <h2 id="compute-title">Nothing here needs a cluster.</h2>
          <p className="lead compute__lead">Every lab fits one of three budgets, or it is cut.</p>
          <table className="ledger ledger--wide">
            <thead>
              <tr>
                <th scope="col">Runs on</th>
                <th scope="col">Limit</th>
                <th scope="col" className="c-pillars">Pillars</th>
              </tr>
            </thead>
            <tbody>
              {machines.map((m) => (
                <tr key={m.what}>
                  <th scope="row" className="big">{m.what}</th>
                  <td>{m.limit}</td>
                  <td className="c-pillars num mono">{m.pillars}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Further reading: index */}
      <section className="block block--well" aria-labelledby="deeper-title">
        <div className="container cols">
          <div className="deeper__head">
            <h2 id="deeper-title">Go deeper elsewhere.</h2>
            <p className="lead">The roadmap links out to these.</p>
          </div>
          <ul className="deeper__rows">
            {further.map((f) => (
              <li key={f.name}>
                <a href={f.href} className="deeper__name">{f.name}</a>
                <span className="deeper__covers">{f.covers}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Statement */}
      <section className="block statement" aria-labelledby="write-title">
        <div className="container">
          <h2 id="write-title" className="statement__head">Most of these labs do not exist yet. Write one.</h2>
          <div className="actions">
            <Link href="/docs/contributing" className="btn btn--quiet">Read the contributor guide</Link>
            <Link href="/docs/roadmap" className="statement__link">See the roadmap</Link>
          </div>
        </div>
      </section>
    </>
  );
}
