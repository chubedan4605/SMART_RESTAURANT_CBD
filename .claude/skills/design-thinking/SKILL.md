---
name: design-thinking
description: >
  Apply the full Design Thinking methodology from Michael Lewrick's "The Design Thinking Playbook" to solve any product, business, UX, or innovation problem. This skill enforces a strict discipline: always empathize and find the real problem before proposing any solution. Never jump to solutions.
---

# Design Thinking Skill

Full methodology from Michael Lewrick's _The Design Thinking Playbook_,
structured as an actionable framework for diagnosing and solving real problems.

---

## Built-in Tools for Design Thinking

- **WebSearch** — Research competitors, user behavior data, and case studies during Empathize and Define phases.
- **Sequential Thinking MCP** (`mcp__sequential-thinking__sequentialthinking`) — Structured 5-Whys root cause analysis and complex problem decomposition.
- **Slack MCP** (`mcp__claude_ai_Slack__slack_search_public`) — Search team channels for user feedback, support complaints, and feature requests.
- **Jira MCP** (`mcp__claude_ai_Atlassian__searchJiraIssuesUsingJql`) — Pull existing user-reported issues to ground empathy in real data.
- **Playwright MCP** — Capture current UI state to identify pain points visually during Empathize phase.

## The One Rule That Overrides Everything

> **"Don't solve the stated problem — find the real problem first."**

The stated problem is almost always a symptom.
The real problem lives 3–5 "Why?"s deeper.
Solve the symptom → wasted effort. Solve the root → lasting change.

---

## The Design Thinking Loop

```
UNDERSTAND          EXPLORE           VALIDATE
┌──────────┐     ┌──────────┐     ┌──────────┐
│EMPATHIZE │ →   │  IDEATE  │ →   │   TEST   │
│  DEFINE  │     │PROTOTYPE │     │ ITERATE  │
└──────────┘     └──────────┘     └──────────┘
     ↑                                   │
     └───────────────────────────────────┘
                  (loop back)
```

Never skip UNDERSTAND. Never jump straight to EXPLORE.
The quality of your solution is entirely determined by the quality of your problem definition.

---

## When to Read Each Reference File

| Reference                        | Read When                                                          |
| -------------------------------- | ------------------------------------------------------------------ |
| `references/empathy.md`          | Need to understand users, map pain points, uncover real needs      |
| `references/define.md`           | Need to diagnose root cause, write POV, frame HMW questions        |
| `references/ideate.md`           | Need to brainstorm solutions or generate creative options          |
| `references/prototype-test.md`   | Need to validate ideas quickly and cheaply                         |
| `references/systems-thinking.md` | Problem is complex, interconnected, or has unintended consequences |

---

## Phase 1 — EMPATHIZE

**Goal:** Understand what users are really experiencing — not what they say, but what they feel and do.

### The 3 Layers (always go through all 3)

**1. Observe** — Watch behavior, don't ask

- Users say one thing, do another. Trust what they DO, not what they SAY.
- Watch where they hesitate, abandon, or repeat an action.

**2. Engage** — Ask "Why?" at least 3 times

- First answer = rationalization. Third answer = truth.
- Never ask "Do you like this?" → Ask "What are you trying to accomplish?"

**3. Immerse** — Experience it yourself

- Sam Farber wore thick gloves to feel arthritis pain → invented OXO Good Grips.
- Airbnb founders stayed in their own listings → found photos were the problem.

### Empathy Map (quick template)

```
┌─────────────────────┬─────────────────────┐
│    THINK & FEEL     │        HEAR         │
│  (hidden worries,   │  (boss, peers,      │
│   expectations)     │   environment)      │
├─────────────────────┼─────────────────────┤
│        SEE          │      SAY & DO       │
│  (competitors,      │  (actual words      │
│   environment)      │   & real behavior)  │
└─────────────────────┴─────────────────────┘
          PAIN                   GAIN
    (biggest fear)         (real desired outcome)
```

→ Full framework in `references/empathy.md`

---

## Phase 2 — DEFINE

**Goal:** Frame the real problem, not the stated one.

### 5 Whys — The Root Cause Drill

```
Symptom → Why? → Why? → Why? → Why? → Why? → Root Cause
```

Keep asking until you hit something that can actually be changed.
When you find multiple layers → solve bottom-up, never top-down.

### POV Statement

Format: **"[USER] needs [NEED] because/but [INSIGHT]"**

The insight is the surprising truth you found through empathy —
the thing that reframes the entire problem.

### How Might We (HMW)

Turn the POV into an open design question:
**"How Might We [verb] [user] [desired outcome]?"**

"Might" = there are many solutions, not just one.
A well-framed HMW unlocks 10x more ideas than a poorly framed one.

→ Full framework in `references/define.md`

---

## Phase 3 — IDEATE

**Goal:** Generate many possible solutions before committing to any.

### The Core Rule

**Diverge first, converge later. Never mix the two.**

Judging an idea the moment it's born kills divergent thinking permanently.
Run separate sessions: one for generating, one for evaluating.

### Crazy 8s (fastest tool)

Fold paper into 8 panels. 8 ideas. 8 minutes. Don't think — sketch.
Ideas 7 and 8 are always the most original because the brain has exhausted all safe options.

→ Full framework in `references/ideate.md`

---

## Phase 4 — PROTOTYPE & TEST

**Goal:** Make ideas tangible and learn from real reactions — cheaply.

### The Principle

**Prototype = a question made physical.**
Not a finished product. Not a demo. A tool to get answers.

### 3 Types

- **Paper** — Test flow and logic (30 minutes)
- **Digital Mockup** — Test UI and clarity (1–2 days)
- **Wizard of Oz** — Test behavior before building (hours)

### The Zappos Rule

Nick Swinmurn didn't stock inventory. He photographed shoes in stores, posted them,
and only bought after someone ordered. Validate demand before building anything.

→ Full framework in `references/prototype-test.md`

---

## Phase 5 — SYSTEMS THINKING

**Goal:** Understand second-order effects and avoid creating new problems while solving old ones.

Reintroducing wolves to Yellowstone changed the course of a river.
One product change can ripple through the entire system.

Before finalizing any solution, ask:

```
→ If we implement this, what changes downstream?
→ Does this break or reinforce the vicious cycle?
→ What new problem might this create?
```

→ Full framework in `references/systems-thinking.md`

---

## The Anti-Patterns (never do these)

```
❌ Jump to solutions without defining the real problem
❌ Trust what users say without observing what they do
❌ Stop at Why 1 or Why 2 — that's still the symptom
❌ Judge ideas during brainstorming
❌ Build full features before validating demand
❌ Fix isolated points without looking at the whole system
❌ Solve for the most vocal user, not the most representative one
```

---

## Quick Diagnostic Checklist

Before responding to any problem, verify:

```
□ Is this the symptom or the root cause?
□ What is the user AFRAID of? (not just what they need)
□ Have I asked "Why?" at least 5 times?
□ Does what they SAY match what they DO?
□ Is my POV Statement surprising — or just restating the problem?
□ Is my HMW open enough to allow many solutions?
□ Which phase am I in — and am I skipping ahead?
□ Can this be tested before it's built?
□ What are the second-order effects of this solution?
```
