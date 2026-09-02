# Development Rules

These rules are ENFORCED via hooks, not just documented. They apply to ALL code in this monorepo.

## Sacred Principles

- **YAGNI** — Don't build features not in the current plan/ticket
- **KISS** — Simplest solution that works. Clever code is a liability
- **DRY** — Extract common patterns only when duplicated 3+ times. Three similar lines > premature abstraction

## File Management

- **200-line limit** — Code files exceeding 200 lines MUST be modularized
  - Split into focused components/modules
  - Extract utility functions into separate files
  - Create dedicated service classes for business logic
- **Update, don't duplicate** — Modify existing files directly. NEVER create "enhanced" or "v2" copies
- **Descriptive naming** — kebab-case for JS/TS/Python/shell, PascalCase for React components. Names must be self-documenting for Grep/Glob

## Code Quality

- **No shortcuts** — No fake data, mocks, cheats, or temporary solutions just to pass tests or CI
- **Real implementation only** — Don't simulate or stub. Implement the actual code
- **Error handling** — Every async operation has explicit error handling. No silent failures
- **Input validation** — At system boundaries only (user input, external APIs). Trust internal code
- **Type safety** — No `any` in TypeScript without justification. Use Pydantic models in Python

## Pre-Commit

- Format → Lint → Test MUST pass before any commit
- **Monorepo scope**: Formatters modify ALL files in the app. After quality gates:
  1. `git diff --stat` — check what changed
  2. Only stage files YOU modified
  3. Revert formatter changes on OTHER files: `git checkout -- <file>`
- Conventional commits: `feat:`, `fix:`, `refactor:`, `test:`, `docs:`, `chore:`
- Scope = module/component, NOT ticket ID
- NEVER commit .env, API keys, credentials, or .env.key

## Implementation

- Follow established patterns in each app (check app-level skills)
- Cross-repo changes: update ALL 4 repos for DTO/API field changes
- Implement in dependency order: Agentic → AI-Services → BE → FE
- Run quality gates per repo after changes
