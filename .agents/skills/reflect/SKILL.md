---
description: "Reflect on the current conversation to identify avoidable mistakes and propose improvements to CLAUDE.md or project skills. Use at the end of a project or when the user asks to reflect on what went wrong."
---

# Reflect Skill

You are reviewing this conversation's history to extract durable lessons. The goal is to identify mistakes you made that were **avoidable in principle** — meaning a rule, convention, or piece of context in CLAUDE.md or a skill file could have prevented them — and propose concrete changes to those files.

## Step 1: Scan the conversation for mistakes

Look through the full conversation for moments where:

- **You wrote code the user had to correct** (wrong pattern, wrong API, wrong convention)
- **You went down a wrong path** before being redirected by the user
- **You missed something the user had to point out** (a file you should have read, a pattern you should have followed, an edge case you should have caught)
- **You repeated a mistake** the user had already corrected earlier in the conversation
- **You made an assumption that turned out wrong** (about project structure, conventions, behavior)
- **The user gave you a correction that sounded like "we always do X"** or "that's not how this codebase works"

For each mistake, note:

- What happened (the error)
- What the user said to correct it
- What you should have done instead

## Step 2: Filter for generalizable lessons

For each mistake, ask: **"Is this a one-off, or does it represent a category of mistakes?"**

**DISCARD** lessons that are:

- Specific to one component, feature, or file ("remember that CallRecording uses X")
- Already covered by existing rules in CLAUDE.md or skills (read them to check)
- Too vague to be actionable ("be more careful", "double-check your work", "read files before editing")
- About the user's personal preferences that were unknowable in advance
- About external APIs or libraries that change over time

**KEEP** lessons that are:

- About a **pattern or convention** that applies across the codebase
- About a **category of mistake** you'd make again in similar situations
- About a **workflow habit** (e.g., "always run X before Y", "always check Z before assuming W")
- About a **gotcha** in the project's tech stack that isn't documented
- Specific enough to be actionable but general enough to apply beyond this one task

## Step 3: Draft proposed changes

For each surviving lesson, draft a **concrete edit** to a specific file. Each proposal should include:

1. **The mistake category** — one sentence describing the class of error
2. **Target file** — which file to edit (`CLAUDE.md`, or a specific skill like `.claude/skills/frontend-patterns/SKILL.md`)
3. **Where in the file** — which section it belongs in (e.g., "Hard Rules — Frontend", "Strawberry Gotchas")
4. **Exact text to add** — the actual line(s) or paragraph to insert, written in the same style as the surrounding content
5. **Why this helps** — one sentence on what future mistake this prevents

## Step 4: Present to the user

Present each proposed change and ask the user if they want to apply it. Group by target file. For each one, show the proposed text and explain why it would help.

Do NOT apply changes without user approval.

## Quality bar

A good reflection produces 1-5 high-quality, specific, durable lessons. If the conversation went smoothly with no mistakes, say so — do not invent lessons to fill space. If there are 10 real lessons, present all 10. But most conversations will yield 0-3 genuine improvements.

The test for each lesson: **"If this rule had existed at the start of the conversation, would it have concretely prevented a specific mistake I made?"** If you can't point to the exact moment it would have helped, discard it.
