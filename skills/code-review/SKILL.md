---
name: code-review
description: Review a code change or pull request for bugs, security issues, and maintainability, and produce a structured Markdown review.
---

# Code Review

Use this skill when the user asks you to review a diff, pull request, or set of code changes before merging.

## Workflow

1. Identify the scope of the change: a git diff, a specific set of files, or a pull request. Ask for clarification if the scope is ambiguous.
2. Read the changed code and enough surrounding context to judge correctness. Prefer evidence from the source over assumptions.
3. Check for: correctness bugs, security issues (see OWASP Top 10), error handling gaps, missing tests, and maintainability concerns.
4. Write `code-review.md` unless the user requests another output path.
5. Include:
   - Summary of the change
   - Bugs and correctness issues
   - Security concerns
   - Style and maintainability suggestions
   - Missing tests or documentation
   - Overall verdict (approve, approve with comments, or request changes)

Do not invent issues that are not supported by the diff. Distinguish must-fix issues from optional suggestions.
