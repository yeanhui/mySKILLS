# @yeanhui/myskills

Portable AI skills for VS Code Copilot Agent mode:

- **repo-explorer** - creates a repository architecture and onboarding guide.
- **research-brief** - creates a concise research brief with citations.
- **idea-to-execution** - turns an idea into an implementation plan.

Repository: <https://github.com/yeanhui/mySKILLS>

## Use in a project

Requirements: Node.js 18+ and VS Code with GitHub Copilot Agent mode.

From the project folder, run:

```bash
npx @yeanhui/myskills@latest init
```

This creates:

```text
.github/skills/
├── repo-explorer/SKILL.md
├── research-brief/SKILL.md
└── idea-to-execution/SKILL.md
```

Then open Copilot Chat in Agent mode and ask:

```text
Use the repo-explorer skill to create an onboarding guide for this repository.
```

The other skills can be used with requests such as:

```text
Use the research-brief skill to compare PostgreSQL and MongoDB, with citations.
Use the idea-to-execution skill to plan dark mode for this web application.
```

The agent creates the requested Markdown artifacts in your project. Use `--force` to replace existing skill files:

```bash
npx @yeanhui/myskills@latest init --force
```

## Development

```bash
npm install
npm test
npm pack --dry-run
```

## Test privately with a local npm registry (Verdaccio)

Before publishing to the public npm registry, verify the package end-to-end against a local
registry running in Node.js:

1. Start the local registry (keep this terminal running):

   ```bash
   npm run registry:start
   ```

   Verdaccio listens on <http://localhost:4873> and stores packages under `.verdaccio/` (gitignored).

2. In a second terminal, create a throwaway npm user on the local registry (any credentials, stored only in `.verdaccio/htpasswd`):

   ```bash
   npm adduser --registry http://localhost:4873
   ```

3. Publish the current code to the local registry only:

   ```bash
   npm run publish:local
   ```

4. Consume it from a scratch directory exactly like a real user would, pointing npx at the local registry:

   ```bash
   cd (mktemp -d)   # or any empty test folder
   npx --registry http://localhost:4873 @yeanhui/myskills@latest init
   ```

   Confirm `.github/skills/*/SKILL.md` is created as expected.

5. Repeat step 3 (bump the version first with `npm version patch`) to test updates, then tear down the
   registry and delete `.verdaccio/` when done.

Once this passes, you can publish for real with `npm publish --access public` (or the automated
workflow below) against the public registry - no code changes are needed, only the `--registry` flag differs.

## Automated npm publishing

Publishing runs automatically after a pull request is merged into `main`.

1. In npm package settings, configure a **Trusted Publisher** for GitHub Actions with owner `yeanhui`, repository `mySKILLS`, workflow filename `publish.yml`, and no environment. The filename is case-sensitive and must be the filename only, not the `.github/workflows/` path.
2. Merge a pull request into `main`.
3. GitHub Actions runs `npm test`.
4. If the version already exists on npm, the workflow increments the patch version.
5. GitHub publishes the package with OIDC provenance, then commits the new version to `main`.

The workflow uses npm 11.5.1 for Trusted Publishing, ignores its own release commit, and creates one npm release per merge. Published npm versions are immutable. Manual releases require a version bump before `npm publish`.

The normal Agent Skills workflow does not require an API key. The package also retains an optional standalone CLI mode for OpenAI-compatible providers, which requires `OPENAI_API_KEY`.
