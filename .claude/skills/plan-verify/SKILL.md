---
name: plan-verify
description: "Verify feasibility of a plan, feature requirement, or enhancement document against the Jarvis Helpdesk codebase. Analyzes technical complexity, cross-repo impact, system effects, and estimates story points. Use when the user provides a plan document, PRD, feature spec, or requirement and wants to know if it is doable and how much effort it takes."
---

# Plan Verification

Analyze a plan or requirement document against the live codebase to determine feasibility, estimate complexity, and assess system impact. Produce a clear go/no-go recommendation with story point estimate.

---

## When to Use

- User shares a plan document, PRD, feature spec, or enhancement proposal
- User asks "is this doable?", "how complex is this?", "how many story points?"
- Before sprint planning, to validate ticket estimates
- When evaluating whether to accept or push back on a requirement

## Input Sources

The plan document can come from:
- A file path (markdown, PDF, text)
- A Jira ticket (fetch via Jira MCP)
- A Confluence page (fetch via Atlassian MCP)
- A Slack message or thread (fetch via Slack MCP)
- Direct text pasted by the user

---

## Workflow

### Phase 1: Understand the Plan

1. Read the plan document fully. Extract:
   - **Goal**: What is the desired outcome?
   - **Scope**: What features/changes are described?
   - **Constraints**: Deadlines, technical limitations, dependencies mentioned
   - **Ambiguities**: Requirements that are vague or contradictory

2. Restate the plan in one paragraph to confirm understanding with the user.

### Phase 2: Codebase Impact Analysis

Launch a **codebase-analyst** agent to investigate the affected areas. The agent prompt should include:

```
Analyze the Jarvis Helpdesk codebase for the following planned changes:
[paste extracted scope items]

For each change, determine:
1. Which repos are affected (FE / BE / AI-Services / Agentic / DevOps)
2. Which files and functions would need modification
3. Existing patterns that can be followed vs. new patterns needed
4. Database schema changes required
5. API contract changes (new endpoints, modified DTOs)
6. Background task flow changes (Celery tasks, SSE events, x-task-id chain)
7. Third-party integrations or services involved
8. Potential conflicts with in-progress work (check recent branches)
```

### Phase 3: Feasibility Assessment

Read `references/analysis-checklist.md` and evaluate each dimension:

1. **Technical Feasibility** — Can the current stack support this?
2. **Codebase Readiness** — Do existing patterns accommodate the change?
3. **Cross-Repo Impact** — How many repos need coordinated changes?
4. **Risk Assessment** — What could go wrong?
5. **Scope Clarity** — Are requirements specific enough to implement?

Flag any **blockers** (hard no) vs. **risks** (manageable with effort).

### Phase 4: Story Point Estimation

Read `references/story-points.md` for the Fibonacci scale calibrated to Jarvis Helpdesk.

Estimate by:
1. Start with the base effort from the scope (number of repos, files, new vs. existing patterns)
2. Apply adjustment factors (cross-repo coordination, migrations, new Celery tasks, SSE, third-party APIs)
3. Consider uncertainty — vague requirements add +1-2 SP for discovery work

### Phase 5: Verdict

Produce the final output in the format below.

---

## Output Format

```markdown
## Plan Verification: [Plan Title]

### Understanding
[One paragraph restating the plan's goal and scope]

### Verdict: [GO / NO-GO / CONDITIONAL]

**Story Points: [N]** (Fibonacci: 1/2/3/5/8/13/21)

### Feasibility Summary

| Dimension | Status | Notes |
|-----------|--------|-------|
| Technical Feasibility | [Pass/Risk/Blocker] | ... |
| Codebase Readiness | [Pass/Risk/Blocker] | ... |
| Cross-Repo Impact | [N repos] | ... |
| Risk Level | [Low/Medium/High] | ... |
| Scope Clarity | [Clear/Partial/Vague] | ... |

### Affected Repos & Files
- **FE**: [files/components]
- **BE**: [files/services]
- **AI-Services**: [modules]
- **Agentic**: [tasks/pipelines]

### Complexity Breakdown
| Item | Base SP | Adjustments | Subtotal |
|------|---------|-------------|----------|
| [Feature/change 1] | N | +N (reason) | N |
| [Feature/change 2] | N | +N (reason) | N |
| **Total** | | | **N** |

### Risks & Mitigations
1. [Risk] → [Mitigation]

### Recommendations
- [Actionable next steps if GO]
- [What to clarify if CONDITIONAL]
- [Why not and alternatives if NO-GO]
```

### Verdict Criteria

- **GO**: Technically feasible, scope is clear, risks are manageable, effort is proportionate to value
- **CONDITIONAL**: Feasible but requires clarification on specific items before committing
- **NO-GO**: Fundamental blocker exists (architectural limitation, disproportionate effort, conflicting requirements)

---

## Jarvis-Specific Pitfalls to Check

These are known complexity multipliers in the Jarvis codebase:

1. **Cross-repo DTO alignment** — When modifying API fields, all 4 repos (FE service → BE controller → AI-Services DTO → Agentic schema) must update in sync
2. **Celery field extraction** — Fields not explicitly extracted from workflow results are silently lost
3. **Background task flow** — taskId must be passed via x-task-id header through the entire chain (BE → AI-Services → Agentic)
4. **SSE event wiring** — New events require FE subscription, BE broadcast, and proper typing
5. **FE infinite loops** — Array refs must be memoized, messages deduped, pending state checked
6. **Language preservation** — AI prompts need aggressive reinforcement to maintain Vietnamese output

---

## Reference Files

- `references/story-points.md` — Fibonacci scale calibrated to Jarvis Helpdesk with adjustment factors
- `references/analysis-checklist.md` — Structured checklist for feasibility dimensions and necessity evaluation
