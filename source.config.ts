import { defineConfig } from 'fumadocs-mdx/config';
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';
import { remarkGitChangelog } from 'fumadocs-page-history/remark';

export default defineConfig({
  mdxOptions: {
    remarkPlugins: [
      remarkMath,
      [remarkGitChangelog, { repository: { url: 'https://github.com/aisrl/lab' } }],
    ],
    rehypePlugins: (v) => [rehypeKatex, ...v],
  },
});
