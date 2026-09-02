---
name: using-git
description: Use when performing git operations that must follow branch naming and commit conventions
---

# Using Git - Smart Git Operations

## Built-in Tools

- **EnterWorktree** — When on a TICKET-ID branch and user requests unrelated work, use `EnterWorktree` to create an isolated worktree instead of stashing/switching. Prevents cross-contamination.
- **TaskCreate** — For multi-app git operations, create tasks to track each app's status.

## Branch Naming

**Branch = exact Jira ticket ID.** No prefix, no description.

| Correct | Wrong |
|---------|-------|
| `BIZ-123` | `feature/BIZ-123`, `biz-123`, `BIZ-123-description` |

## Commit Format — Standard Conventional Commits

```
type: summary
type(scope): summary
```

- **Scope** = module/component (`auth`, `chat`, `billing`), NOT ticket ID
- **Types**: feat, fix, refactor, chore, docs, test, perf, build, ci, style

Examples:
```
feat: add user export API
fix(auth): resolve token refresh race condition
refactor(chat): extract message parser
chore: update dependencies
```

## PR & Merge

- **PR title**: `[TICKET-ID] Ticket name` (e.g., `[BIZ-123] Add user export API`)
- **Squash merge**: Commit on main = PR title `[TICKET-ID] Ticket name`
- **GitHub gotcha**: PR with 1 commit → GitHub defaults to commit message. MUST change to `[TICKET-ID] Ticket name` before merge

## Worktree Prompt

If currently on a `TICKET-ID` branch and user requests unrelated work → ask:
> "You're on branch BIZ-123. Want to use a worktree for this new task to avoid conflicts?"

## Workflow

### Standard (with Jira ticket)
```bash
git checkout main && git pull origin main
git checkout -b BIZ-123
# ... implement ...
# ... run quality gates ...
git add <specific-files>
git commit -m "feat: description"
```

### Before Commit & Push
1. Run quality gates (format → lint → test)
2. Stage specific files (avoid `git add .`)
3. Commit with conventional format
4. Include co-authored-by tag
5. **Rebase onto main before pushing**: `git fetch origin main && git rebase origin/main`
6. Push with `git push --force-with-lease origin <branch>` (never `--force`)

## Commitlint Status

| Repo | Enforcement |
|------|------------|
| AI-Services | `@commitlint/config-conventional` via husky (standard rules) |
| BE | Husky `commit-msg` hook exists but empty |
| FE | No `commit-msg` hook (only `pre-commit` for lint-staged) |
| Agentic/Landing/DevOps | No husky |

Commit format is a **team convention**, not technically enforced.

## Iron Laws

1. **QUALITY GATES MUST PASS BEFORE ANY COMMIT.**
2. **ALWAYS REBASE ONTO MAIN BEFORE PUSHING.** Every push to origin must be preceded by `git fetch origin main && git rebase origin/main`. Use `--force-with-lease` (never `--force`) when the rebase rewrites history.
