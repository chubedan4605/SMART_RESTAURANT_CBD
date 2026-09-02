---
name: using-jarvis-toolkit
description: Bootstrap skill establishing the Jarvis Helpdesk development toolkit and mandatory practices
user-invocable: false
---

# Jarvis Helpdesk Toolkit

## Development Process

```
Jira Ticket → Branch (TICKET-ID) → Code → Quality Gates → PR + Slack → Review → Squash Merge
```

**Iron Rules:**
1. **Everything starts from a Jira ticket** — no ticket = no code, even for small bugs
2. **1 ticket = 1 branch = 1 PR** — no subtasks unless truly needed. Notes/analysis → comment on ticket
3. **Commits** = standard conventional commits (`feat: ...`, `fix(auth): ...`). Scope = module, NOT ticket ID
4. **PR title** = `[TICKET-ID] Ticket name`
5. **Squash merge** → commit on main = PR title. GitHub may default to commit msg if 1 commit — must change
6. **After PR** → post to Slack channel `biz-dev` in English, request random team member to review
7. **Worktree prompt**: On `TICKET-ID` branch + unrelated request → ask if user wants worktree

## Slash Commands

| Command | What it does |
|---------|-------------|
| `/fix-bug BUG-ID` | Reproduce, analyze, fix, regression test |
| `/review` | Exhaustive code review with custom rubric |
| `/quality [repo]` | Format + lint + test + commit (if pass) |
| `/pr [title]` | Push + create PR + notify Slack `biz-dev` |
| `/test [path]` | Run pytest in agentic repo |
| `/git action` | Smart git operations |
| `/autofix` | Auto-fix unresolved PR review comments |
| `/reflect` | Review session for mistakes, improve skills |
| `/copy-edit [file]` | Remove AI-sounding patterns from writing |
| `/debug` | Diagnose production issues via SSH + Docker |
| `/setup-env` | Decrypt/encrypt .env files |
| `/doc [TICKET-ID]` | Generate/list/search Context Cards |

## Skills

Convention skills are in each sub-repo's `.agents/skills/` — auto-loaded when working there.

Root-level cross-repo skills:

| Skill | When to load |
|-------|-------------|
| `prod-debug` | Production debugging via SSH/Docker |
| `product-thinking` | Feature scoping, UX, user-facing copy |
| `design-thinking` | Problem framing, empathy, ideation |
| `copy-edit` | Landing page copy, marketing content |

## Branch Strategy

- **Root repo**: NEVER switch branch — stays on current branch
- **Submodules**: Branch = `TICKET-ID`, stay on main if no ticket

## Mandatory Practices

1. **Quality gates MUST pass** before any commit (format → lint → test)
2. **Cross-repo awareness** — changes often span multiple services
3. **No plan.md, task.md, notes.md** — use Jira comments
