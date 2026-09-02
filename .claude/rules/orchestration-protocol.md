# Orchestration Protocol

Rules for delegating work to subagents in the Jarvis Helpdesk monorepo.

## When to Delegate

**Use subagents when:**
- Task spans multiple repos (FE + BE + AI-Services + Agentic)
- Independent research/analysis can run in parallel
- Code review needs fresh perspective (no prior context bias)
- Quality gates need to run while you continue other work

**Do NOT delegate when:**
- Single-file edit or small fix
- You need the result immediately to make a decision
- Task requires full conversation context that's hard to summarize

## Agent Selection

| Agent | Use for |
|-------|---------|
| `planner` | Research + create implementation plan before coding |
| `researcher` | Parallel technical research (multiple topics simultaneously) |
| `fullstack-developer` | Execute implementation plans across any repo |
| `code-simplifier` | Refine code after implementation, before review |
| `code-reviewer` | Two-stage code review with production bug hunting |
| `security-reviewer` | Auth flows, token handling, OWASP, LLM threats |
| `quality-runner` | Format + lint + test per repo (diff-aware) |
| `test-runner` | pytest for agentic with failure analysis |
| `codebase-analyst` | Tracing data flow, finding source of truth |
| `jira-ops` | Jira CRUD operations |

## Status Protocol

All subagents MUST end with one of these statuses:

| Status | Meaning | Controller Action |
|--------|---------|-------------------|
| **DONE** | Completed successfully | Proceed to next step |
| **DONE_WITH_CONCERNS** | Completed but flagged doubts | Read concerns → fix if correctness issue → proceed if observational |
| **BLOCKED** | Cannot complete | Assess blocker → provide context / simplify task / escalate to user |
| **NEEDS_CONTEXT** | Missing information | Provide missing context → re-dispatch |

### Handling Rules

- **Never** ignore BLOCKED or NEEDS_CONTEXT — something must change before retry
- **Never** force same approach after BLOCKED — try: more context → simpler task → escalate
- **DONE_WITH_CONCERNS** about file growth or tech debt → note for future, proceed now
- **DONE_WITH_CONCERNS** about correctness → address before review
- If subagent fails 3+ times on same task → escalate to user, don't retry blindly

## Context Isolation

Pass only necessary context — not the entire conversation.

### Prompt Template

```
Task: [specific task description]
Files to modify: [list]
Files to read for context: [list]
Acceptance criteria: [list]
Constraints: [any relevant constraints]
Plan reference: [plan file path if applicable]
```

### Anti-Patterns

| Bad | Good |
|-----|------|
| "Continue from where we left off" | "Implement X feature per spec in plan.md" |
| "Fix the issues we discussed" | "Fix null check in auth.ts:45, root cause: missing validation" |
| "Look at the codebase and figure out" | "Read src/api/routes.ts and add POST /users endpoint" |
| Passing 50+ lines of conversation | 5-line task summary with file paths |

## Parallel vs Sequential

**Parallel** (independent work):
- Multiple `researcher` agents investigating different topics
- Quality gates across multiple repos
- Code review + documentation update

**Sequential** (output feeds next step):
- `planner` → `fullstack-developer` → `code-simplifier` → `code-reviewer`
- Implement → Test → Review
- Fix → Quality gates → Commit

## Cross-Repo Changes

When a change spans repos, coordinate carefully:
1. Plan all changes before starting (identify DTO alignment)
2. Implement in dependency order: Agentic → AI-Services → BE → FE
3. Run quality gates in each repo after changes
4. Verify cross-service contracts (x-task-id headers, SSE events, API shapes)

## Reporting

After subagent completes:
- Summarize what changed (files, key decisions)
- Flag concerns or deviations from the plan
- Don't blindly trust — verify critical changes before reporting to user
