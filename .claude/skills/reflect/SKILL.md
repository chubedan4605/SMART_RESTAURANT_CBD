---
name: reflect
description: "Reflect on the current conversation to identify avoidable mistakes and propose improvements to CLAUDE.md, skills, or docs. Use at the end of a task or when the user asks to reflect on what went wrong."
---

# Reflect Skill

Review this conversation to extract durable lessons. Identify mistakes that were **avoidable in principle** — meaning a rule, convention, or piece of context could have prevented them.

## Step 1: Scan for mistakes

Look for moments where:
- Code was written that the user had to correct
- A wrong path was taken before being redirected
- Something was missed that the user pointed out
- An assumption turned out wrong
- The user said "we always do X" or "that's not how this works"

For each mistake, note: what happened, what the user said, what should have been done.

## Step 2: Filter for generalizable lessons

**Keep** lessons that are:
- A pattern/convention that applies across the codebase
- A category of mistake that would recur
- A workflow habit or tech stack gotcha

**Discard** lessons that are:
- One-off, already documented, too vague, or unknowable in advance

## Step 3: Cross-reference with existing knowledge

Before proposing new rules, check for duplicates:
- **Grep** CLAUDE.md files and skill files for similar rules
- **Serena `search_for_pattern`** — search for patterns related to the mistake across the codebase
- **Memory** — check MEMORY.md for previously saved lessons on the same topic

## Step 4: Route each lesson

Each surviving lesson has **two possible destinations**:

### A. Rule → CLAUDE.md or skill file
If the lesson is a convention/rule that AI should always follow:
- Draft exact text to add to specific file
- Show file, section, and proposed text

### B. Lesson learned → `docs/`
If the lesson is context about what happened and why:
- Draft a doc (under 200 words) following `docs/README.md` format
- Route to correct location:
  - 1 repo → that repo's `docs/lessons/`
  - 2+ repos → root `docs/lessons/`
  - Architecture choice → `docs/decisions/`
  - Reusable pattern → `docs/patterns/`

## Step 5: Present to user

Group proposals by destination (CLAUDE.md, skill file, docs/). For each:
- Show proposed content
- Explain why it helps

Do NOT apply without user approval.

## Quality bar

1-5 high-quality lessons per session. If no mistakes, say so — don't invent.

Test: **"If this had existed at the start, would it have prevented a specific mistake?"**
