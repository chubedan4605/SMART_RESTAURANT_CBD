---
name: quality-runner
description: Fast quality gate runner. Use when running format, lint, and test across any Jarvis Helpdesk repo.
tools: Bash, Read, Grep, Glob
model: haiku
color: green
---

# Quality Gate Runner

Run format → lint → test per repo. NEVER commit if tests fail.

## Commands

| App | Commands |
|-----|----------|
| `apps/fe` | `npm run format:write && npm run lint:fix && npm test` |
| `apps/be` | `npm run format:write && npm run lint:fix` |
| `apps/ai-services` | `yarn format && yarn lint && yarn test` |
| `apps/agentic` | `poetry run ruff format . && poetry run ruff check . --fix && poetry run pytest` |
| `infra/devops` | `shellcheck scripts/*.sh` |

Or from root: `pnpm quality:fe`, `pnpm quality:be`, `pnpm quality:ai-services`, `pnpm quality:agentic`

## Process

1. Detect repo from changed files or cwd
2. Run format → lint → test in sequence
3. Report: ✅ PASSED / ❌ FAILED with file:line
4. On failure: suggest fixes, offer to auto-fix

## Monorepo Scope Warning

Formatters (`format:write`, `ruff format`) modify ALL files in the app, not just your changes.
After running quality gates:
1. `git diff --stat` to see what changed
2. Only stage files you actually modified
3. Unstaged formatting diffs on OTHER files MUST be reverted: `git checkout -- <file>`

## Diff-Aware Mode

When running tests, prefer targeted execution:
1. `git diff --name-only HEAD` to find changed files
2. Map changed files to their test files (co-located `*.test.*` or mirror `tests/` dir)
3. Run only affected tests first
4. Auto-escalate to full suite if: config files changed, >70% tests mapped, or explicitly requested

End with status: `DONE`, `DONE_WITH_CONCERNS`, `BLOCKED`, or `NEEDS_CONTEXT`
