# Contributing to AISRL Labs

Welcome to the AI Safety Research Lab! We are building hands-on labs and writeups for technical AI safety and security.

## How to Contribute

1. **Pick or Claim a Module**: Check the curriculum roadmap and confirm your topic with the project lead.
2. **Create a Feature Branch**:
   ```bash
   git checkout -b feature/pillar-X-module-name
   ```
3. **Where Your Files Go**:
   - **Documentation / Writeup**: Add your guide in `content/docs/pillar-X/your-module.mdx`.
   - **Lab Code / Tests**: Add your starter code, solution, and test suite in `labs/pillar-X/your-module/`.
4. **Follow the Module Template**: Use `content/docs/template-module.mdx` as your starter guide.
5. **Test Your Work**:
   - Make sure local documentation builds: `pnpm build` or `npm run build`.
   - Make sure your lab tests pass: `pytest`.
6. **Open a Pull Request**: Submit your PR against `main` for review.
