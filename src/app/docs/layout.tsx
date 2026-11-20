import { source } from '@/lib/source';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { Banner } from 'fumadocs-ui/components/banner';
import { baseOptions } from '@/lib/layout.shared';
import Link from 'next/link';

export default function Layout({ children }: LayoutProps<'/docs'>) {
  return (
    <>
      <Banner id="aisrl-7-pillar-curriculum-banner">
        <span>🚀 <strong>7-Pillar Master Curriculum Active:</strong> 37 submodules with local & Colab T4 compute limits.</span>{' '}
        <Link href="/docs/roadmap" className="underline font-semibold ml-1.5 hover:text-primary">
          View Roadmap &rarr;
        </Link>
      </Banner>
      <DocsLayout tree={source.getPageTree()} {...baseOptions()}>
        {children}
      </DocsLayout>
    </>
  );
}
