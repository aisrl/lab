import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';
import { Quiz } from './interactive/quiz';
import { PythonRunner } from './interactive/python-runner';
import { Hint } from './interactive/hint';
import { LabProgress } from './interactive/lab-progress';
import { Solution } from './interactive/solution';

export function getMDXComponents(components?: MDXComponents) {
  return {
    ...defaultMdxComponents,
    Quiz,
    PythonRunner,
    Hint,
    LabProgress,
    Solution,
    ...components,
  } satisfies MDXComponents;
}

export const useMDXComponents = getMDXComponents;

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
