# Prototype & Test — Full Reference

## Core Principle

> "A prototype is a question made physical."

Not a product. Not a demo. Not a proof of concept.
A prototype's only job is to get a specific answer you couldn't get from conversation alone.

Build only what's needed to answer the question you have — nothing more.

---

## The Fidelity Spectrum

Fidelity = how close to the final product your prototype is.
**Lower fidelity = faster learning = cheaper mistakes.**

```
Paper ────────── Digital ────────── Coded
sketch           mockup             prototype

Fastest          Medium             Slowest
Cheapest         Medium cost        Most expensive
Best for:        Best for:          Best for:
flow & logic     UI & UX            performance &
                                    edge cases
```

**Rule:** Use the lowest fidelity that still answers your question.
If paper can answer it — don't build a Figma file.
If Figma can answer it — don't write code.

---

## 3 Prototype Types in Depth

### Type 1 — Paper Prototype

**Time to build:** 30 minutes
**What it answers:** Does this flow make sense? Do users understand the sequence?
**What it can't answer:** Visual polish, speed, real-world edge cases

**How to run it:**

1. Draw each screen on a separate piece of paper (rough is fine)
2. Sit with the user — don't explain anything
3. Give them a task: "Try to [complete this action]"
4. A team member manually swaps paper screens as the user "clicks"
5. Note every pause, confusion, and wrong action — all are insights

**What to watch:**

- Where do they hesitate?
- What do they click that isn't a button?
- What do they say out loud while doing it?
- Where do they get stuck and need help?

**Never:**

- Explain how something works before they try
- React visibly when they do something unexpected
- Rescue them when they get stuck (unless they completely give up)

---

### Type 2 — Digital Mockup (Wizard-Enabled)

**Time to build:** 1–2 days
**What it answers:** Is this UI clear? Do users know what to do without being told?
**What it can't answer:** Actual system behavior, data accuracy, performance

**How to run it:**

- Build in Figma, Framer, or similar
- Make it clickable but not functional
- Run usability tests: 5 users reveals ~85% of major usability issues
- Record sessions (with permission) — watch recordings, don't rely on memory

**The 5-User Rule:**
After 5 usability test sessions, you've found most of the major problems.
More users give diminishing returns. Fix the issues you found, then test again.

---

### Type 3 — Wizard of Oz Prototype

**Time to build:** A few hours
**What it answers:** Would users actually value this output? Is the behavior useful?
**What it can't answer:** Whether automated system can replicate human judgment

**How it works:**
The user thinks they're interacting with an automated system.
Behind the scenes, a human is doing the work manually.
The user never knows.

**Classic Example:**
Before building a voice assistant, the team had a human listening to commands
and manually performing the actions. Users thought it was AI.
They measured satisfaction, discovered what commands failed, what responses delighted.
Then they built the real system with all of that data.

**Jarvis Example:**
Before building automated First Win notifications —
manually send a message when the agent handles its first question.
Measure: Do customers open it? Do they set up more afterward?
If no reaction → the notification concept is wrong. Don't automate it.
If strong reaction → automate it. You know it works.

---

## Testing — 5 Methods in Depth

### Method 1 — Usability Test

**What:** Observe a real user completing a real task with your product or prototype
**Goal:** Find where users get stuck, confused, or make wrong assumptions
**Sample size:** 5 users per round (enough to find major issues)

**Script:**

```
"I'm going to ask you to complete a few tasks. There are no right or wrong
answers — I'm testing the design, not you. Please think out loud as you go.
If you get stuck, that's fine — just keep narrating your thoughts."
```

**During the test:**

- Never answer questions mid-task ("What would you expect to happen if you clicked that?")
- Never react to mistakes (neutral face, keep note-taking)
- Note every hesitation, every wrong click, every moment of silence

**After 5 sessions:**

- List all friction points observed
- Rank by frequency (occurred in 5/5 sessions = critical)
- Fix top issues, re-test before adding new features

---

### Method 2 — A/B Test

**What:** Two versions of the same element shown to different user segments simultaneously
**Goal:** Let behavioral data decide — remove opinion from the equation
**When to use:** You have meaningful traffic (hundreds of users per day minimum)

**What makes a good A/B test:**

- Test one variable at a time (changing two things = you don't know which caused the result)
- Define success metric before running (not after seeing results)
- Run until statistical significance, not until you "like" the result
- Common mistake: stopping early because one version is winning

**Good variables to A/B test:**

- CTA button copy ("Start free trial" vs "Try for free")
- Onboarding flow sequence
- Notification timing and content
- Pricing page layout

---

### Method 3 — Desirability Test

**What:** Show users your design and ask for 3 adjectives to describe it
**Goal:** Understand the emotional reaction and brand alignment
**When to use:** Before finalizing any UI, brand, or communication design

**How to run:**

1. Show the design (or landing page, or email, or UI) for 30 seconds
2. Ask: "Using 3 words, describe how this makes you feel or what it communicates to you"
3. Collect responses across 10–20 users
4. Map words to your intended brand attributes

**Reading results:**

```
You wanted: "trustworthy, clear, professional"
They said: "cold, complicated, corporate"
→ Major redesign needed

You wanted: "fast, simple, friendly"
They said: "clean, easy, friendly"
→ You're close — refine, don't overhaul
```

---

### Method 4 — Fake Door Test

**What:** Add a button or link for a feature that doesn't exist yet. Count clicks.
**Goal:** Measure real demand before investing in building
**When to use:** Validating new feature ideas, pricing tiers, or product directions

**How it works:**

1. Add a real-looking button or option in your product or website
2. When clicked, either show a "coming soon" message or a short survey
3. Measure: click-through rate relative to users who saw it
4. A high rate = strong signal of demand. Low rate = weak signal.

**What it can and can't tell you:**

```
CAN tell you: Whether users want the thing to exist
CANNOT tell you: Whether they'll pay for it, or use it regularly
```

**Follow-up:** After users click, ask "Why were you interested in this?"
The qualitative data is as valuable as the click rate.

---

### Method 5 — Concierge Test

**What:** Deliver the value of a feature manually for real users before automating it
**Goal:** Understand the real workflow, edge cases, and what "good" looks like
**When to use:** Before building any automation, AI feature, or complex workflow

**Why it works:**
You will encounter problems no research can surface.
The manual process teaches you what the automated system needs to handle.

**Classic example:**
Before building a meal planning app — manually email weekly meal plans to 10 users.
You'll quickly learn: some users have dietary restrictions you didn't account for,
some want 3-day plans not 7-day, some want a shopping list not just recipes.
All of this shapes the product before a single line of code is written.

**The signal you're looking for:**
If you hate doing it manually because it's tedious → automation is worth building.
If you discover users don't actually use the output → don't build.

---

## Testing Anti-Patterns

```
❌ Testing to confirm your hypothesis
   → You'll unconsciously run tests that favor your belief

❌ Stopping a test early because you "see" a winner
   → Statistical noise. You need significance, not a streak.

❌ Asking users "Would you use this?" instead of watching them try
   → Intent ≠ behavior. People lie (even to themselves).

❌ Running focus groups to understand individual behavior
   → Group dynamics suppress authentic responses

❌ Building v2 before testing v1
   → You don't know what to improve until you know what's broken
```

---

## The Testing Mindset

**Microsoft Windows 8:**
Thorough research. Focus groups approved the removal of the Start button.
Launch day: global backlash. Windows 10 had to restore it.

Why did validated research fail?
Focus group participants said what sounded reasonable — not how they'd actually feel
when their muscle memory failed them on day one.

**The lesson:** Test behavior, not opinion.
What people do always beats what people say they'll do.
