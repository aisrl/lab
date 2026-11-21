import Link from 'next/link';
import { appName, gitConfig } from '@/lib/shared';
import './home.css';

const github = `https://github.com/${gitConfig.user}/${gitConfig.repo}`;

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <div className="home">
      <a className="skip" href="#main">Skip to content</a>
      <header className="nav">
        <div className="container nav__row">
          <Link href="/" className="nav__mark" aria-label={`${appName}, home`}>
            {appName}
          </Link>
          <nav aria-label="Main" className="nav__links">
            <Link href="/docs">Curriculum</Link>
            <Link href="/docs/roadmap">Roadmap</Link>
            <Link href="/docs/contributing">Contribute</Link>
            <a href={github}>GitHub</a>
            <Link href="/docs/interactive-tutorial/00-prompt-injection-guard" className="btn btn--quiet btn--nav">
              Start a lab
            </Link>
          </nav>
        </div>
      </header>
      <main id="main">{children}</main>
      <footer className="foot">
        <div className="container foot__row">
          <p className="foot__sign">
            Maintained by the <a href="https://sites.gatech.edu/aisrl/">AI Security Research Lab (AISRL)</a> at Georgia Tech. Written in the open; corrections and new labs are welcome.
          </p>
          <ul className="foot__links">
            <li><Link href="/docs">Curriculum</Link></li>
            <li><Link href="/docs/contributing">Contribute</Link></li>
            <li><a href={github}>GitHub</a></li>
            <li><a href="/llms.txt">llms.txt</a></li>
            <li><a href="/llms-full.txt">llms-full.txt</a></li>
          </ul>
        </div>
      </footer>
    </div>
  );
}
