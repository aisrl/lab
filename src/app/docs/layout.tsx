import { source } from '@/lib/source';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { baseOptions } from '@/lib/layout.shared';
import Link from 'next/link';

export default function Layout({ children }: LayoutProps<'/docs'>) {
  return (
    <>
      <div className="aisrl-notice">
        <p>
          Seven pillars, 37 labs planned.{' '}
          <Link href="/docs/roadmap">See the roadmap</Link>
        </p>
      </div>
      <DocsLayout tree={source.getPageTree()} {...baseOptions()} themeSwitch={{ enabled: false }}>
        {children}
      </DocsLayout>
    </>
  );
}
