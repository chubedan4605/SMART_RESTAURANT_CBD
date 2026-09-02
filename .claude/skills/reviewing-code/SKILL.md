---
name: reviewing-code
description: "Interactive code review of changes against project patterns and conventions. Use when the user asks to review code, a PR, a branch, or a set of changes."
---

# Code Review Skill

Conduct an exhaustive, interactive code review. Follow these steps exactly.

## Step 1: Determine what to review

Ask the user what they want reviewed. Common options:

- **Unstaged changes** (`git diff`)
- **Staged changes** (`git diff --cached`)
- **Most recent commit** (`git diff HEAD~1..HEAD`)
- **Current branch vs main** (`git diff main..HEAD`)
- **A specific commit range** (user provides)
- **A specific PR** (user provides PR number)

If the user already specified what to review (e.g., "review my unstaged changes" or "review this branch"), skip the question and proceed.

## Step 2: Analyze the scope

Once the diff range is known:

1. Run `git diff <range> --stat` to see all changed files and line counts
2. Run `git diff <range> --name-only` to get the clean file list
3. Run `git log <range> --oneline` (if reviewing commits) to understand the narrative
4. Categorize the changes by domain:
   - **FE**: `apps/fe/src/` — React, MUI, Zustand, React Query
   - **BE**: `apps/be/src/` — Express, Sequelize, BullMQ
   - **AI-Services**: `apps/ai-services/src/` — NestJS, TypeORM
   - **Agentic**: `apps/agentic/app/` — FastAPI, Celery, Qdrant, LlamaIndex
   - **Landing**: `apps/landing-page/` — Next.js, Tailwind
   - **DevOps**: `infra/devops/` — Docker Compose, scripts
   - **Tests**: test files across any repo

## Step 3: Load context

1. **Load the relevant project skills** based on which domains are touched:
   - FE changes → MUI `sx` preferred, Zustand with persist, React Query for server state (see `apps/fe/.claude/skills/conventions/`)
   - BE changes → component-based architecture, thin controllers, logic in `*.service.js` (see `apps/be/.claude/skills/conventions/`)
   - AI-Services changes → NestJS Module/Controller/Service pattern (see `apps/ai-services/.claude/skills/conventions/`)
   - Agentic changes → LlamaIndex workflows/agents, Celery task patterns (see `apps/agentic/.claude/skills/`)
   - Landing changes → Tailwind, Framer Motion, next-intl (see `apps/landing-page/.claude/skills/conventions/`)

2. **Read existing files** that the changes modify or build on. For each significantly changed file, read the file in its current state to understand context. For new files, read neighboring files in the same directory to understand local patterns.

3. **Use Serena symbolic tools for impact analysis:**
   - **`find_referencing_symbols`** on any modified/renamed function or class to verify all call sites were updated.
   - **`get_symbols_overview`** on new files to quickly assess structure without reading line-by-line.
   - This is especially critical for cross-repo DTO changes — use `find_referencing_symbols` to ensure field renames propagated.

4. **Identify the largest new files** (by line count) — these need the most scrutiny.

## Step 4: Build the review rubric

Based on what was found in Step 2, build a **custom rubric** tailored to these specific changes. Do NOT use a generic checklist. The rubric should have 4-8 sections, chosen from these categories as relevant:

**If there are React/FE components:**
- **MUI & Styling** — All styling via `sx` prop? No inline styles, no CSS modules? Theme tokens used correctly?
- **State Management** — Zustand with `persist` for client state? React Query for server state? No prop drilling? Memoization where needed (useMemo for array refs)?
- **FE Pitfalls** — Infinite loop risks (array refs, dedup, pending state)? SSE event handling correct?

**If there are Express/BE changes:**
- **BE Architecture** — Logic in service files, thin controllers? Input validation at boundaries? Error handling consistent?
- **Database** — Sequelize queries efficient (no N+1)? Migrations correct? Indexes where needed?

**If there are NestJS/AI-Services changes:**
- **NestJS Patterns** — Module/Controller/Service structure? DTOs with validation? Proper dependency injection?

**If there are FastAPI/Agentic changes:**
- **Agentic Patterns** — Pydantic DTOs for all inputs/outputs? Celery task fields explicitly extracted? `clear_context()` in finally blocks? Correct queue assignment?
- **Celery Safety** — Result fields explicitly extracted to dict (not raw Pydantic object)? Exception re-raised after failure callback? Progress callbacks sent?

**If there are cross-repo changes:**
- **DTO Alignment** — API field changes propagated across all repos in the chain? (FE service → BE controller → AI-Services DTO → Agentic schema)
- **Background Task Flow** — TaskId format correct (`{type}-${tenantID}-${Date.now()}`)? x-task-id header propagated through chain?

**If there are landing page changes:**
- **Landing Conventions** — Tailwind only (no CSS modules)? Inter font? Brand colors from design tokens? Framer Motion with `once: true`? i18n keys (V1 only)?

**Always include:**
- **Security** — No secrets in code? No SQL injection? No XSS? Input validation at system boundaries?
- **Scope & Artifacts** — All changes related to the PR's purpose? No dev-only leftovers (console.log, commented-out code, hardcoded test values)?
- **Tests** — New business logic has test coverage? Existing tests updated for changed behavior?
- **Git Conventions** — Branch matches Jira ticket ID? Commits follow standard conventional format (`type: summary` or `type(scope): summary`)? PR title is `[TICKET-ID] Ticket name`?

Present the rubric to the user before starting so they can adjust it.

## Step 5: Conduct the review

Work through the rubric **one section at a time**. For each section:

1. Read all the relevant code for that section (the actual diff content, not just file names)
2. Identify every issue — be exhaustive. If there is 1 issue, report 1. If there are 20, report all 20.
3. For each issue:
   - Reference the specific **file path and line**
   - Explain **why** it matters
   - Suggest **how** to fix it
   - Note severity: **Critical** (must fix) or **Suggestion** (nice to have)
4. Ask for the user's input before proceeding to the next section

## Output Format

After all sections are reviewed, provide a final summary:

```
## Summary
Brief overall assessment.

## Critical Issues (Must Fix)
- file:line - Issue. Fix suggestion.

## Suggestions (Nice to Have)
- file:line - Suggestion.

## Positive Notes
- What's done well.
```

## Important

- **Exhaustive review.** If there is only one issue in a given section, report that one issue. If there are 20, report all twenty. Do not summarize, truncate, or batch issues to keep things brief.
- Do NOT rubber-stamp. Be thorough and critical.
- Do NOT invent issues that aren't there. Only flag real problems.
- Do NOT give generic advice. Every piece of feedback must reference specific code.
- Read the actual diff content, not just file names.
- Be constructive, not destructive — explain WHY and suggest HOW.
- Acknowledge good practices.
