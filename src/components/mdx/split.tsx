import type { ReactNode } from 'react';

type Size = 'sm' | 'md' | 'lg';

/**
 * A figure beside text. `side` is where the figure sits and `size` is how much of the row it takes
 * (sm is a third, md is five twelfths, lg is half). On a phone the figure comes first, then the text.
 * Put one SplitMedia and one SplitText inside.
 */
export function Split({
  side = 'left',
  size = 'md',
  align = 'start',
  children,
}: {
  side?: 'left' | 'right';
  size?: Size;
  align?: 'start' | 'center';
  children: ReactNode;
}) {
  return (
    <div
      data-side={side}
      data-size={size}
      className={`split my-8 grid grid-cols-1 gap-x-10 gap-y-5 md:grid-cols-12 ${align === 'center' ? 'items-center' : 'items-start'}`}
    >
      <style>{`
        .split[data-side="right"] > .split-media { order: 2; }
        .split[data-size="sm"] > .split-media { grid-column: span 4 / span 4; }
        .split[data-size="md"] > .split-media { grid-column: span 5 / span 5; }
        .split[data-size="lg"] > .split-media { grid-column: span 6 / span 6; }
        .split[data-size="sm"] > .split-text { grid-column: span 8 / span 8; }
        .split[data-size="md"] > .split-text { grid-column: span 7 / span 7; }
        .split[data-size="lg"] > .split-text { grid-column: span 6 / span 6; }
        @media (max-width: 47.99rem) {
          .split > .split-media, .split > .split-text { grid-column: 1 / -1 !important; order: 0 !important; }
        }
      `}</style>
      {children}
    </div>
  );
}

/** The figure: a diagram, an image, or any component. Tall figures are fine; they keep their shape. */
export function SplitMedia({ caption, children }: { caption?: ReactNode; children: ReactNode }) {
  return (
    <figure className="split-media not-prose m-0 min-w-0">
      <div className="[&_img]:h-auto [&_img]:max-w-full [&_svg]:h-auto [&_svg]:max-w-full">{children}</div>
      {caption && (
        <figcaption className="mt-2 border-t border-fd-border pt-2 text-sm italic leading-snug text-fd-muted-foreground">{caption}</figcaption>
      )}
    </figure>
  );
}

/** The words beside the figure. Markdown, callouts and maths all work in here. */
export function SplitText({ children }: { children: ReactNode }) {
  return <div className="split-text min-w-0 [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">{children}</div>;
}
