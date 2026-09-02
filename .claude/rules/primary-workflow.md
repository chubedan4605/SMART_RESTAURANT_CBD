# Primary Workflow — Jarvis Kit

The standard development workflow. Every non-trivial task follows these stages.

## Workflow

```
[1. Understand] → [2. Plan] → [GATE] → [3. Implement] → [4. Simplify] → [5. Test] → [GATE] → [6. Review] → [GATE] → [7. Ship]
```

Gates require passing before proceeding to the next stage.

## Stages

### 1. Understand
- Read Jira ticket, Slack thread, or user request
- Read relevant code (don't assume from names — read implementations)
- Summarize understanding: "I understand X, and I'll do Y"
- Max 2 questions per turn. Propose, don't interrogate

### 2. Plan
- For non-trivial tasks: delegate to `planner` agent
- Planner delegates to `researcher` agents in parallel for technical topics
- Output: plan file in `.claude/plans/YYMMDD-TICKET-ID-slug.md`
- Use templates from `.claude/plans/templates/`
- **GATE**: Plan reviewed before implementation starts

### 3. Implement
- Delegate to `fullstack-developer` or implement directly for small tasks
- Follow dependency order: Agentic → AI-Services → BE → FE
- Follow development rules (`.claude/rules/development-rules.md`)
- Check app-level skills before coding in any app
- Run compile/build check after modifying code

### 4. Simplify
- Delegate to `code-simplifier` agent
- Review recent changes for: unnecessary abstractions, dead code, over-engineering
- Preserve functionality 100% — only improve clarity
- Skip for trivial changes (1-2 line fixes)

### 5. Test
- Run quality gates per repo: `pnpm quality:{app}`
- Delegate to `test-runner` for pytest failures
- **No mocks/fakes to pass tests** — fix the real issue
- **GATE**: All tests pass before review

### 6. Review
- Delegate to `code-reviewer` agent
- Two-stage: behavioral checklist + domain-specific rubric
- Hunt production bugs: race conditions, N+1, data leaks, auth gaps
- For security-sensitive changes: also run `security-reviewer`
- **GATE**: No critical issues before shipping

### 7. Ship
- Commit with conventional format
- Create PR: `[TICKET-ID] Ticket name`
- Update Jira ticket status

## When to Skip Stages

| Scenario | Skip |
|----------|------|
| 1-line typo fix | Skip Plan, Simplify, Review |
| Small bug fix (< 10 lines) | Skip Plan, Simplify |
| Refactoring (no behavior change) | Skip Plan (but DO Review) |
| Config/env change | Skip Simplify, Review |
| Everything else | Follow ALL stages |
