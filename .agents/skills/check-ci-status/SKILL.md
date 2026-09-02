---
name: check-ci-status
description: Use when the user asks to check whether the current code passes CI, run local CI-equivalent quality gates, diagnose failures, apply safe fixes, and rerun verification. This skill is for FIT-AI/Jarvis repo CI checks and should not commit changes unless explicitly requested.
---

# Check CI Status

## Purpose

Verify the current branch against the local commands that most closely match CI. If a gate fails, fix actionable formatter, lint, type, build, or test failures, then rerun the relevant gate until it passes or the remaining issue is clearly blocked.

## Operating Rules

- Start with `git status --short` and preserve unrelated user changes.
- Prefer targeted gates for changed apps over full-repo gates. Run broader gates only when changes span shared/root behavior or the user asks for full CI.
- Auto-fix only deterministic issues: formatting, lint autofixes, imports, obvious type mismatches, broken tests caused by current changes, and stale snapshots/fixtures when the intended behavior is clear.
- Do not paper over failures by deleting tests, weakening assertions, adding broad ignores, or skipping CI checks.
- Do not commit unless the user explicitly asks. This skill verifies and fixes; `running-quality-gates` handles final commit flow.
- If a command fails because dependencies are missing or network access is required, follow normal approval flow before installing or downloading anything.

## App Detection

Map changed files to gates:

| Path | App | Primary gates |
| --- | --- | --- |
| `apps/fe/**` | FE | `pnpm --filter @jarvis/fe run format:write`, `pnpm --filter @jarvis/fe run lint:fix`, `pnpm --filter @jarvis/fe run test` |
| `apps/be/**` | BE | changed-files Prettier/ESLint first, then `pnpm --filter @jarvis/be run test` |
| `apps/ai-services/**` | AI services | `pnpm --filter @jarvis/ai-services run format`, `pnpm --filter @jarvis/ai-services run lint`, `pnpm --filter @jarvis/ai-services run check-types`, `pnpm --filter @jarvis/ai-services run test` |
| `apps/agentic/**` | Agentic | `poetry run ruff format .`, `poetry run ruff check . --fix`, `poetry run pytest` from `apps/agentic` |
| `apps/landing-page/**` | Landing page | `pnpm --filter @jarvis/landing-page run format`, `pnpm --filter @jarvis/landing-page run lint`, build if package scripts support it |
| `infra/devops/**` | DevOps | `shellcheck scripts/*.sh` from `infra/devops` when shell scripts changed |
| root config, workspace files, shared scripts | Root | run impacted app gates, then consider `pnpm run build` or `pnpm run test` if the change can affect all packages |

When there are no local changes, ask whether the user wants full CI verification or inspect the branch/PR context if available.

## Workflow

1. Inspect state:
   - `git status --short`
   - `git diff --name-only HEAD`
   - Check package scripts before inventing commands.
2. Select gates:
   - Use the app detection table.
   - For cross-app changes, run gates per app rather than one noisy root command.
3. Run fixable gates first:
   - Formatters before linters.
   - Lint with `--fix` or project `lint:fix` scripts before plain lint.
   - For FE/BE JS/JSX formatting, prefer changed-files-only when full format would rewrite unrelated files.
4. Run verification gates:
   - Typecheck/build where available.
   - Unit tests relevant to changed code.
   - Broader tests if the changed surface is shared or risky.
5. Fix failures:
   - Read the first meaningful error, inspect nearby code/tests, apply a scoped fix, rerun the failing command.
   - Continue until gates pass or the remaining failure needs missing services, secrets, unavailable network, or a product decision.
6. Report:
   - Commands run and pass/fail status.
   - Files changed by fixes.
   - Any remaining blockers with exact failing command and top error.

## Changed-Files-Only JS Fix

For `apps/fe` and `apps/be`, avoid full-repo format/lint when only a few JS/JSX files changed and local guidance says broad formatting creates churn:

```bash
CHANGED=$(git diff --name-only --diff-filter=ACMR HEAD -- '*.js' '*.jsx' && git diff --cached --name-only --diff-filter=ACMR -- '*.js' '*.jsx' && git ls-files --others --exclude-standard -- '*.js' '*.jsx')
if [ -n "$CHANGED" ]; then
  echo "$CHANGED" | sort -u | xargs npx prettier --write
  echo "$CHANGED" | sort -u | xargs npx eslint --fix
fi
```

Run that from the app directory only when the file paths are relative to that app. If running from repo root, pass paths exactly as reported by Git and use workspace tools available at root.

## Output Shape

Use a concise status format:

```text
CI Status - current branch

Passed:
- FE format/lint/test
- AI services typecheck/test

Fixed:
- apps/fe/src/...: removed unused import

Remaining:
- apps/be test: blocked by missing DATABASE_URL
```
