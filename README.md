# Jarvis Helpdesk

> **AI Agent helpdesk system** — pnpm workspace monorepo with Turborepo.

---

## Repository Structure

```
jarvis-helpdesk/
├── apps/
│   ├── fe/                          # React frontend (MUI 5 + Zustand + React Query 5)
│   ├── be/                          # Express backend (Sequelize + PostgreSQL + BullMQ)
│   ├── ai-services/                 # NestJS AI service layer (TypeORM + PostgreSQL)
│   ├── agentic/                     # FastAPI AI agents (Celery + Qdrant + LlamaIndex)
│   ├── landing-page/                # Next.js landing page (Tailwind CSS)
│   └── livechat/                    # Rocket.Chat-based live chat widget
├── infra/
│   └── devops/                      # Infrastructure & deployment (Docker Compose)
├── package.json                     # Root workspace config + unified scripts
├── pnpm-workspace.yaml              # Workspace packages definition
└── turbo.json                       # Turborepo task pipeline
```

---

## Quick Start

### First Time Setup

```bash
# 1. Clone the repo
git clone git@github.com:myjarvis/jarvis-helpdesk.git

# 2. Install dependencies
pnpm install                  # Node.js apps (fe, be, ai-services, landing-page)
cd apps/agentic && poetry install  # Python app

# 3. Install age (encryption tool)
brew install age              # macOS
scoop install age             # Windows (scoop)
choco install age.portable    # Windows (chocolatey)
sudo apt install age          # Linux (Debian/Ubuntu)

# 4. Get .env.key from team lead (1Password, Slack DM, etc.)
#    Place it in the repo root: jarvis-helpdesk/.env.key

# 5. Decrypt all environment files
./scripts/env-decrypt.sh      # macOS / Linux / Git Bash
.\scripts\env-decrypt.ps1     # Windows PowerShell
```

### Running Services

From the repo root, use the unified scripts:

| App          | Command                | Port |
| ------------ | ---------------------- | ---- |
| FE           | `pnpm dev:fe`          | 3006 |
| BE           | `pnpm dev:be`          | 3030 |
| AI-Services  | `pnpm dev:ai-services` | 5556 |
| Agentic      | `pnpm dev:agentic`     | 8000 |
| Landing Page | `pnpm dev:landing`     | 3001 |
| Infra        | `pnpm infra:bootstrap` | -    |

### Quality Gates

All apps require quality gates to pass before committing:

| App         | Command                    |
| ----------- | -------------------------- |
| FE          | `pnpm quality:fe`          |
| BE          | `pnpm quality:be`          |
| AI-Services | `pnpm quality:ai-services` |
| Agentic     | `pnpm quality:agentic`     |

Run all at once: `pnpm lint && pnpm test`

---

## System Architecture

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   FE (React)    │────▶│   BE (Express)   │────▶│  PostgreSQL DB  │
│  Port 3006      │     │  Port 3030       │     │                 │
└─────────────────┘     └──────────────────┘     └─────────────────┘
        ↑                       │
        │ SSE                   ├──────────────────┐
        │                       │                  │
        │               ┌──────▼────────┐  ┌──────▼────────────┐
        │               │ AI-Services   │  │    Agentic        │
        │               │ (NestJS)      │  │ (FastAPI + Celery) │
        │               │ Port 5556     │  │   Port 8000       │
        │               └───────────────┘  └───────────────────┘
        │                                          │
        └──────────── SSE ─────────────────────────┘
                                                   │
                                            ┌──────▼──────┐
                                            │   Qdrant    │
                                            │ (Vector DB) │
                                            └─────────────┘
```

**Communication:**

- REST APIs between services
- SSE for real-time updates (Agentic → AI-Services → FE)
- BullMQ (Node.js) + Celery (Python) for background jobs
- Redis for caching and queues

### Background Task Flow

```
FE calls BE → BE generates taskId, returns {taskId, status:'pending'}
BE calls AI-Services (x-task-id header) → AI-Services calls Agentic (x-task-id header)
Agentic enqueues Celery task → Worker processes → Callback to AI-Services → SSE → FE
```

---

## Development Standards

### Conventions

- **Jira-First**: ALL task docs in Jira. Never create plan.md, task.md, notes.md
- **Branch naming** = exact Jira ticket ID: `BIZ-123` (not `feature/BIZ-123`)
- **Commit format**: `type(scope): summary` (e.g., `feat(auth): add SSO login`)
- **FE Styling**: MUI `sx` prop only — no direct CSS or inline styles
- **FE State**: Zustand with `persist` middleware; React Query for server state
- **BE Pattern**: Logic in `*.service.js`, thin controllers
- **NestJS Pattern**: Module/Controller/Service
- **Agentic**: Pydantic DTOs, Celery tasks must extract ALL result fields explicitly

### Development Flow

```
/brainstorm  →  /implement  →  /review  →  /quality  →  /pr
   design        code          check       test+commit   PR
```

---

## AI Tooling (Claude Code)

This repo includes Claude Code configuration for AI-assisted development:

- **Skills**: Domain knowledge auto-loaded per context (architecture, frontend, backend, agentic conventions)
- **Commands**: `/brainstorm`, `/implement`, `/review`, `/quality`, `/pr`, `/fix-bug`, `/git`, `/test`
- **Agents**: Specialized subagents for FE, backend, agentic repos + utility agents (quality-runner, jira-ops, code-reviewer)
- **Hooks**: Session start bootstrap, auto-format, pre-commit checks

See `CLAUDE.md` for full AI instructions and conventions.

---

## Environment Variables

All `.env` files are encrypted with [`age`](https://github.com/FiloSottile/age) and stored in `envs/`. One private key decrypts everything.

```
envs/                          # Encrypted .env files (committed to git, safe)
├── fe.env.age                 # → apps/fe/.env
├── be.env.age                 # → apps/be/.env
├── ai-services.env.age        # → apps/ai-services/.env
├── agentic.env.age            # → apps/agentic/.env
├── landing-page.env.age       # → apps/landing-page/.env
└── devops-landing.env.age     # → infra/devops/.env.landing

.env.key                       # Private key (gitignored, NEVER commit)
```

### Decrypt (get envs after cloning or pulling)

```bash
./scripts/env-decrypt.sh              # All repos (Bash)
.\scripts\env-decrypt.ps1             # All repos (PowerShell)
./scripts/env-decrypt.sh be           # Specific repo only
```

### Encrypt (after updating a .env)

```bash
./scripts/env-encrypt.sh              # All repos
./scripts/env-encrypt.sh be           # Specific repo
git add envs/ && git commit && git push
```

### Using Claude Code

```
/setup-env                             # Interactive guided setup (installs age, decrypts)
```

---

## Contributing

1. Pick a Jira ticket
2. Create branch with ticket ID: `git checkout -b BIZ-123`
3. Implement in the relevant app(s) under `apps/`
4. Run quality gates for affected apps
5. Create PR and link to Jira ticket

---

## License

Proprietary - Internal use only
