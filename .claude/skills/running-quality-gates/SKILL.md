---
name: running-quality-gates
description: "Run format, lint, test quality gates and commit if all pass. Use after code review to finalize changes."
---

# Running Quality Gates & Commit

Detect repo → format → lint → test → commit (if all pass).

## Commands by Repo

| App | Commands |
|-----|----------|
| `apps/fe` | Format + lint changed `.js`/`.jsx` files only (see below) |
| `apps/be` | Format + lint changed `.js` files only (see below) |
| `apps/ai-services` | `yarn format && yarn lint && yarn test` |
| `apps/agentic` | `poetry run ruff format . && poetry run ruff check . --fix && poetry run pytest` |
| `infra/devops` | `shellcheck scripts/*.sh` |

Or from root: `pnpm quality:fe`, `pnpm quality:be`, `pnpm quality:ai-services`, `pnpm quality:agentic`

### Changed-files-only for FE/BE

Run `npm run format:write` and `npm run lint:fix` on the **full repo** reformats hundreds of untouched files.
Instead, target only changed files:

```bash
# Get changed + staged + untracked JS files
CHANGED=$(git diff --name-only --diff-filter=ACMR HEAD -- '*.js' '*.jsx' && git diff --cached --name-only --diff-filter=ACMR -- '*.js' '*.jsx' && git ls-files --others --exclude-standard -- '*.js' '*.jsx')
if [ -n "$CHANGED" ]; then
  echo "$CHANGED" | sort -u | xargs npx prettier --write
  echo "$CHANGED" | sort -u | xargs npx eslint --fix
fi
```

## Built-in Tools

- **TaskCreate** — When running quality gates across multiple repos (cross-repo changes), create a task per repo to track pass/fail.

## Process

1. Detect repo from cwd or context
2. Run format (auto-fix code style)
3. Run lint (auto-fix when possible)
4. Run tests (verify functionality)
5. Report results
6. **If ALL pass → stage and commit**
   - Stage changed files: `git add <specific files>`
   - Commit format: standard conventional commits (`type: summary` or `type(scope): summary`)
   - Scope = module/component, NOT ticket ID
   - Include co-authored-by tag
7. **If ANY fail → report failures, do NOT commit**

## Iron Law

**NEVER COMMIT IF TESTS FAIL.**

## Output Format

```
Quality Gates - {repo-name}

✅ Format: PASSED
✅ Lint: PASSED
✅ Tests: PASSED

Committed: feat: add user settings page
```

Or on failure:

```
Quality Gates - {repo-name}

✅ Format: PASSED
✅ Lint: PASSED
❌ Tests: FAILED

Failed:
- UserService.test.ts:45 - Assertion error
  Fix: Update mock response

⛔ Not committed. Fix failures first.
```
