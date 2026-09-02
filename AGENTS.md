# AGENTS.md — Antigravity CLI Project Instructions

## Mandatory Quality Gate Rule
- Whenever you make any code edits or implement features in `apps/*`, you MUST run the corresponding Quality Gate before claiming completion:
  - `apps/fe`: `pnpm quality:fe`
  - `apps/be`: `pnpm quality:be`
  - `apps/ai-services`: `pnpm quality:ai-services`
  - `apps/agentic`: `pnpm quality:agentic`
- Never claim success or commit if Quality Gates fail.
