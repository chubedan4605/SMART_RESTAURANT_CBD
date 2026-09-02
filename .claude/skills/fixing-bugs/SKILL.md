---
name: fixing-bugs
description: Use when a bug ticket needs systematic reproduction, root cause analysis, and a targeted fix
---

# Fixing Bugs - Systematic Bug Resolution

5-phase workflow: Understand → Reproduce → Analyze → Fix → Verify.

## Iron Law

**ALWAYS REPRODUCE BEFORE FIXING. NEVER GUESS AT ROOT CAUSE.**

## Built-in Tools

- **WebSearch/WebFetch** — Research error messages, stack traces, or library-specific bugs. Search GitHub issues for known problems before diving deep.
- **Serena `find_referencing_symbols`** — Trace all callers of the buggy function to understand blast radius and find related bugs.
- **Playwright MCP** — For UI bugs: navigate to the page, take screenshots to verify reproduction and confirm fix visually.
- **TaskCreate** — Track the 5 phases as tasks for complex bugs spanning multiple files/repos.

## Process

### Phase 1: Understand
Fetch bug ticket via Jira MCP. Extract: reproduction steps, expected vs actual, environment, error messages.
If error message is unclear, use **WebSearch** to research the error pattern.

### Phase 2: Reproduce
Follow exact steps. Confirm bug. Document observations.
For UI bugs, use **Playwright** to navigate and screenshot the broken state.

### Phase 3: Analyze (5 Whys)
Root cause analysis. Ask "Why?" until you reach the actual cause.
Use **Serena `find_referencing_symbols`** to trace the buggy code path and identify all affected call sites.
Comment on the Jira ticket with:
- Reproduction steps (verified)
- Root cause (file:line)
- Proposed fix approach

### Phase 4: Fix
1. Create branch: `git checkout -b BUG-ID` (must match `[A-Z]+-\d+` pattern)
2. Minimal fix addressing root cause
3. Add regression test reproducing original bug
4. Run quality gates
5. Commit: `fix: description` or `fix(scope): description` (standard conventional commits, scope = module NOT ticket ID)

### Phase 5: Verify
1. Test with original repro steps
2. For UI bugs: use **Playwright** to screenshot the fixed state (before/after comparison)
3. Test edge cases
4. Check for regressions
5. Update Jira with fix details

## Red Flags - STOP

- "I think I know what's wrong without reproducing" → REPRODUCE FIRST
- "The fix is obvious, skip the analysis" → Do the 5 Whys
- "No need for a regression test" → ALWAYS add one

## Common Bug Patterns

- **Off-by-one**: Check loop boundaries
- **Race conditions**: Look for async/await issues
- **Null/undefined**: Check optional chaining
- **State bugs**: Check Zustand/React state flow
- **Celery field loss**: Check explicit field extraction

