'use client';

import { use, useId, useSyncExternalStore } from 'react';

export function Mermaid({ chart }: { chart: string }) {
  // `false` on the server and during hydration
  const isClient = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  if (!isClient) return null;
  return <MermaidContent chart={chart} />;
}

const cache = new Map<string, Promise<{ svg: string; bindFunctions?: (container: Element) => void }>>();

function cachePromise<T>(key: string, setPromise: () => Promise<T>): Promise<T> {
  const cached = cache.get(key);
  if (cached) return cached as Promise<T>;

  const promise = setPromise();
  cache.set(key, promise as any);
  return promise;
}

function subscribeTheme(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributeFilter: ['class'] });
  return () => observer.disconnect();
}

function MermaidContent({ chart }: { chart: string }) {
  const rawId = useId();
  const id = 'mermaid_' + rawId.replace(/[^a-zA-Z0-9_-]/g, '_');
  const theme = useSyncExternalStore(subscribeTheme, () =>
    document.documentElement.classList.contains('dark') ? 'dark' : 'default',
  );
  const { default: mermaid } = use(cachePromise('mermaid', () => import('mermaid')));

  mermaid.initialize({
    startOnLoad: false,
    securityLevel: 'loose',
    fontFamily: 'inherit',
    themeCSS: 'margin: 1.5rem auto 0;',
    theme: theme === 'dark' ? 'dark' : 'base',
    themeVariables: {
      fontFamily: 'inherit',
      fontSize: '14px',
      background: 'transparent',
      primaryColor: '#e6e9ee',
      primaryTextColor: '#161b24',
      primaryBorderColor: '#2b3340',
      secondaryColor: '#d5d9df',
      tertiaryColor: '#e6e9ee',
      lineColor: '#3a4350',
      textColor: '#161b24',
      edgeLabelBackground: '#e6e9ee',
      clusterBkg: '#dde1e7',
      clusterBorder: '#7c8592',
      noteBkgColor: '#e6e9ee',
      noteBorderColor: '#2b3340',
    },
  });

  const { svg, bindFunctions } = use(
    cachePromise(`${chart}-${theme}`, () => {
      return mermaid.render(id, chart.replaceAll('\\n', '\n'));
    }),
  );

  return (
    <div
      className="not-prose my-6 flex justify-center overflow-x-auto border-y border-fd-border py-5"
      ref={(container) => {
        if (container) bindFunctions?.(container);
      }}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
