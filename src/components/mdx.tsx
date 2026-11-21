import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';
import { Tab, Tabs } from 'fumadocs-ui/components/tabs';
import { Step, Steps } from 'fumadocs-ui/components/steps';
import { File, Files, Folder } from 'fumadocs-ui/components/files';
import { Card, Cards } from 'fumadocs-ui/components/card';
import { Accordion, Accordions } from 'fumadocs-ui/components/accordion';
import { Callout } from './mdx/callout';
import { TypeTable } from 'fumadocs-ui/components/type-table';
import { InlineTOC } from 'fumadocs-ui/components/inline-toc';
import { Banner } from 'fumadocs-ui/components/banner';
import { ImageZoom } from 'fumadocs-ui/components/image-zoom';
import { Mermaid } from './mdx/mermaid';
import { Split, SplitMedia, SplitText } from './mdx/split';

// Custom AISRL Interactive Components
import { Quiz } from './interactive/quiz';
import { Blank } from './interactive/blank';
import { ShortAnswer } from './interactive/short-answer';
import { PythonRunner } from './interactive/python-runner';
import { Hint } from './interactive/hint';
import { LabProgress } from './interactive/lab-progress';
import { Solution } from './interactive/solution';
import { LabHeader } from './interactive/lab-header';

export function getMDXComponents(components?: MDXComponents) {
  return {
    ...defaultMdxComponents,
    img: (props: any) => <ImageZoom {...props} />,
    // Fumadocs Built-in Components
    Tab,
    Tabs,
    Step,
    Steps,
    File,
    Files,
    Folder,
    FileTree: Files,
    Card,
    Cards,
    Accordion,
    Accordions,
    Callout,
    TypeTable,
    InlineTOC,
    Banner,
    ImageZoom,
    Mermaid,
    Split,
    SplitMedia,
    SplitText,

    // AISRL Interactive Components
    Quiz,
    Blank,
    ShortAnswer,
    PythonRunner,
    Hint,
    LabProgress,
    Solution,
    LabHeader,
    ...components,
  } satisfies MDXComponents;
}

export const useMDXComponents = getMDXComponents;

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
