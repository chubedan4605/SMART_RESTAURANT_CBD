# Jarvis Helpdesk — Jarvis Kit

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

**Before Implementation — "Propose, don't interrogate":**
- Research first, ask later. Read code, Jira, or relevant context before responding
- Summarize: "I understand X, and I'll do Y"
- Max 2 questions per turn. If small/clear → just do it

## Rules (enforced via hooks)

| Rule file | Content |
|-----------|---------|
| `.claude/rules/primary-workflow.md` | Staged workflow: Understand → Plan → Implement → Simplify → Test → Review → Ship |
| `.claude/rules/development-rules.md` | YAGNI/KISS/DRY, file < 200 lines, no shortcuts, conventional commits |
| `.claude/rules/orchestration-protocol.md` | Subagent delegation, status protocol, context isolation, anti-patterns |

## Architecture

pnpm workspace monorepo + Turborepo. GCP: `jarvis-helpdesk-478604`.

```
FE (React) → BE (Express) → AI-Services (NestJS) → Agentic (FastAPI+Celery)
     ↑                                                       |
     └──────────── SSE (real-time updates) ←─────────────────┘
```

| App | Path | Stack | Port |
|-----|------|-------|------|
| FE | `apps/fe` | React 18 + MUI 5 + Zustand + React Query 5 | 3006 |
| BE | `apps/be` | Express + Sequelize + PostgreSQL + BullMQ | 3030 |
| AI-Services | `apps/ai-services` | NestJS 10 + TypeORM + PostgreSQL | 5556 |
| Agentic | `apps/agentic` | FastAPI + Celery + Qdrant + Poetry | 8000 |
| Landing Page | `apps/landing-page` | Next.js + Tailwind CSS | 3001 |

## Build & Quality Gates

| App | Dev | Quality |
|-----|-----|---------|
| FE | `pnpm dev:fe` | `pnpm quality:fe` |
| BE | `pnpm dev:be` | `pnpm quality:be` |
| AI-Services | `pnpm dev:ai-services` | `pnpm quality:ai-services` |
| Agentic | `pnpm dev:agentic` | `pnpm quality:agentic` |

## Critical Pitfalls

1. **Celery field extraction**: Fields not explicitly extracted = LOST silently
2. **FE infinite loops**: Memoize array refs (useMemo), dedup messages (useRef)
3. **Cross-repo DTO alignment**: Modify API fields → update ALL 4 repos
4. **Background task flow**: `x-task-id` header through chain (BE → AI-Services → Agentic)
5. **Domain model name ≠ purpose**: "Topics" = sub-agent configs, "Customer Stages" = CRM pipeline. Always read implementation
6. **Agentic pipeline output is unstructured**: LLM fields are sentences, not keywords. Don't GROUP BY them
7. **Quality gate scope**: Formatters modify ALL files. Only stage YOUR changes, revert others

## Skills

**Load matching skill BEFORE implementation.** Check this list first.

| Skill | When to load |
|-------|-------------|
| `jarvis-debug` | Any bug, test failure, unexpected behavior |
| `fixing-bugs` | Bug ticket requiring systematic reproduction + fix |
| `prod-debug` | Production debugging (SSH, Docker, logs) |
| `gcp-logs` | GCP log investigation, error triage |
| `react-best-practices` | Writing or reviewing React components |
| `sequential-thinking` | Complex cross-repo problem decomposition |
| `reviewing-code` | Code review |
| `running-quality-gates` | Format + lint + test before commit |
| `plan-verify` | Verify plan feasibility before implementing |
| `browser-testing` | UI capture, smoke tests, video demos |
| `release-notes` | Preparing release notes |
| `copy-edit` | Edit user-facing writing |
| `design-thinking` | Framing new problems |
| `product-thinking` | Feature scope, UX decisions |
| `setup-env` | Decrypt/encrypt .env files |
| `setup-server` | SSH setup to production |
| `bugbot-autofix` | Auto-fix PR review comments |
| `using-git` | Git conventions |
| `reflect` | Session reflection for mistakes |
| `context-cards` | Generate docs after work |
| `facebook-ads-create` | Meta Ads API campaigns |
| `gtm-editor` | Google Tag Manager |

## Environment Variables

Encrypted with `age`, stored in `envs/`. Key: `.env.key` (gitignored).

```bash
./scripts/env-decrypt.sh   # Decrypt all
./scripts/env-encrypt.sh   # Encrypt all (or pass app name for specific)
```

## Agentic System

Full reference: `apps/agentic/CLAUDE.md`
