import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { appName, gitConfig } from './shared';

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: appName,
    },
    links: [
      {
        text: 'Overview',
        url: '/docs',
        active: 'nested-url',
      },
      {
        text: 'Interactive Lab',
        url: '/docs/interactive-tutorial/00-prompt-injection-guard',
      },
      {
        text: 'Roadmap',
        url: '/docs/roadmap',
      },
      {
        text: 'Contributing',
        url: '/docs/contributing',
      },
    ],
    githubUrl: `https://github.com/${gitConfig.user}/${gitConfig.repo}`,
  };
}
