---
name: repo-explorer
description: Understand a repository and create a practical architecture and onboarding guide.
---

# Repository Explorer

Use this skill when the user asks you to understand, document, or onboard someone to a repository.

## Workflow

1. Inspect the repository structure, package manifests, configuration, entry points, tests, and documentation.
2. Trace the main execution or data flow. Prefer evidence from source code over assumptions.
3. Identify the commands needed to install, run, test, and build the project.
4. Write `PROJECT_OVERVIEW.md` unless the user requests another output path.
5. Include:
   - Executive summary
   - Architecture and data flow
   - Important directories and files
   - Setup and development commands
   - Dependencies and configuration
   - Risks, unknowns, and recommended next steps

Do not invent behavior or claim that a file exists without inspecting it. Keep the guide concise enough to be useful during onboarding.
