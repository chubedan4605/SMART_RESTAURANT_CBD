# Mandatory Quality Gates Rule for Antigravity CLI (agy)

Every time the agent performs any code edits or creates new features in `apps/*` (`apps/fe`, `apps/be`, `apps/ai-services`, `apps/agentic`), the agent MUST run the Quality Gate check for the affected app before concluding the response or committing:

- For `apps/fe`: `pnpm quality:fe`
- For `apps/be`: `pnpm quality:be`
- For `apps/ai-services`: `pnpm quality:ai-services`
- For `apps/agentic`: `pnpm quality:agentic`

## Iron Law
- **NEVER** conclude a task or claim completion without running and passing Quality Gates first.
- If Quality Gates fail, fix the issues immediately and rerun Quality Gates until all tests and lints pass.
