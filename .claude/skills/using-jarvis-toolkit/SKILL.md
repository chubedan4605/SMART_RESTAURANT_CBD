---
name: using-jarvis-toolkit
description: Bootstrap skill establishing the Jarvis Helpdesk development toolkit and mandatory practices
user-invocable: false
---

# Jarvis Helpdesk Toolkit

## Development Process

```
Jira Ticket → Branch (TICKET-ID) → Plan → Implement → Simplify → Test → Review → PR → Squash Merge
```

**Iron Rules:**
1. **Everything starts from a Jira ticket** — no ticket = no code
2. **1 ticket = 1 branch = 1 PR** — notes/analysis → comment on ticket
3. **Commits** = conventional commits (`type(scope): summary`). Scope = module, NOT ticket ID
4. **PR title** = `[TICKET-ID] Ticket name`
5. **Squash merge** → commit on main = PR title
6. **Worktree prompt**: On `TICKET-ID` branch + unrelated request → ask if user wants worktree
7. **Quality gates MUST pass** before any commit

## Skills

Load matching skill BEFORE implementation. Key triggers:

| Skill | When to load |
|-------|-------------|
| `jarvis-debug` | Any bug, test failure, unexpected behavior |
| `fixing-bugs` | Bug ticket requiring systematic reproduction + fix |
| `prod-debug` | SSH, Docker, production logs |
| `gcp-logs` | GCP log investigation |
| `react-best-practices` | Writing or reviewing React components |
| `sequential-thinking` | Complex cross-repo problem decomposition |
| `reviewing-code` | Code review |
| `running-quality-gates` | Format + lint + test before commit |
| `plan-verify` | Verify plan feasibility |
| `browser-testing` | UI capture, smoke tests, demos |
| `product-thinking` | Feature scope, UX decisions |
| `design-thinking` | Framing new problems |
| `setup-env` | Decrypt/encrypt .env files |
| `bugbot-autofix` | Auto-fix PR review comments |
| `context-cards` | Generate docs after work |
| `reflect` | Session reflection for mistakes |

## Workflow Stages

Full details in `.claude/rules/primary-workflow.md`:

1. **Understand** — Read ticket, code, context. Summarize before acting.
2. **Plan** — Planner agent for non-trivial tasks → plan file in `.claude/plans/`
3. **Implement** — Dependency order: Agentic → AI-Services → BE → FE
4. **Simplify** — code-simplifier agent before review
5. **Test** — `pnpm quality:{fe|be|ai-services|agentic}` must pass
6. **Review** — code-reviewer agent, security-reviewer for sensitive changes
7. **Ship** — PR `[TICKET-ID] Ticket name` → squash merge

## Mandatory Practices

- **Quality gates MUST pass** before any commit (format → lint → test)
- **Cross-repo changes**: update ALL 4 repos for DTO/API field changes
- **No plan.md, notes.md files** — use Jira comments or `.claude/plans/`
- **Only stage YOUR changes** — formatters modify all files, revert others
