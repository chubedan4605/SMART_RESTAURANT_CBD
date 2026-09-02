# Define — Full Reference

## Core Truth

> "The quality of your solution is entirely determined by the quality of your problem definition."

A well-defined problem is already half-solved.
A poorly defined problem guarantees a wasted solution — no matter how clever.

---

## The 5 Whys — Root Cause Analysis

### How It Works

Start from the symptom. Ask "Why?" to each answer.
Stop when you reach something that can actually be changed — a behavior, a system, a process.

```
Symptom: [What you observe going wrong]
  ↓ Why is this happening?
Why 1: [First answer — still likely a symptom]
  ↓ Why?
Why 2: [Deeper — a contributing cause]
  ↓ Why?
Why 3: [Pattern starting to form]
  ↓ Why?
Why 4: [Getting close to the structural cause]
  ↓ Why?
Why 5: [Root cause — something you can actually change]
```

### What Good Looks Like

**Bad (stops too early):**

```
Problem: Customers don't set up more after onboarding
Why 1: Because they don't have motivation → "Add tooltips"
```

This is still a symptom. The solution (tooltips) will not work.

**Good (digs to root):**

```
Problem: Customers don't set up more after onboarding
Why 1: They have no motivation to do more
Why 2: They don't see the value of doing more setup
Why 3: They don't trust the agent enough to invest in it
Why 4: They don't know if the agent is performing well or poorly
Why 5: The product shows no feedback after the agent goes live
← ROOT CAUSE: No feedback loop exists
```

Now the solution is obvious: build a feedback loop. Everything else follows.

### When You Find Multiple Layers

Each layer is a real problem. Label them:

```
Layer 1 (deepest): [Root — fix this first]
Layer 2: [Enabled by Layer 1 — fix second]
Layer 3: [Surface symptom — fix last]
```

**Rule:** Always solve bottom-up. Fixing Layer 3 without fixing Layer 1 is a temporary patch.

### The Hospital and the Mirror

A hospital received complaints that elevators were too slow.
Engineers proposed upgrades costing $3–5 million.

One designer asked: "Why do people feel like they're waiting too long?"
Answer: Because there's nothing to do while waiting.

Solution: Install mirrors in the elevator lobbies. Cost: $500.
Complaints dropped 90%.

The stated problem was "slow elevators."
The real problem was "empty waiting time."
Same outcome. 1/10,000th of the cost.

---

## POV Statement — Point of View

### What It Is

A single sentence that captures the real problem in human terms.
Not a feature request. Not a metric. A human truth.

### Format

```
[USER] needs [NEED]
because/but [INSIGHT]
```

The **insight** is the surprising truth you uncovered through empathy —
the thing that reframes everything and wasn't obvious at the start.

### What Makes a Great POV

**Weak POV (just restates the problem):**

```
"Customers need a better onboarding experience
because the current one is confusing."
```

This tells you nothing new. Any solution could fit.

**Strong POV (contains an insight):**

```
"SME business owners need to FEEL IN CONTROL of their agent
because if the agent says something wrong, the risk falls on
THEIR BRAND — not on the product they're using."
```

This insight (brand risk, not product risk) changes the entire solution space.
It means the solution isn't better UI — it's giving control and reducing perceived risk.

### POV Is Not a Solution

A POV defines what you're designing for.
It doesn't tell you how. That's what ideation is for.

### Test Your POV

Ask: "Does this insight change what I would build?"

- If yes → strong POV
- If no → keep digging

---

## How Might We (HMW)

### What It Is

A design question that opens the solution space without prescribing answers.

### Format

```
"How Might We [verb] [user] [desired outcome]?"
```

### Why the Words Matter

- **"How"** — assumes it's solvable
- **"Might"** — suggests many possible answers, not one correct one
- **"We"** — collaborative, not blame-focused

### Transforming POV Into HMW

```
POV: "SME owners need to feel in control of their agent
      because brand risk is theirs, not the product's."

HMW 1: "How Might We let owners preview exactly what their agent
         will say before it talks to real customers?"

HMW 2: "How Might We reduce the perceived risk of activating
         an agent for the first time?"

HMW 3: "How Might We make owners feel like the agent is
         representing them, not replacing them?"
```

Each HMW opens a different design direction.
Run all of them through ideation — don't commit to one prematurely.

### HMW Spectrum

```
Too narrow: "HMW add a preview button?"
             (already a solution, no room to explore)

Just right: "HMW let owners feel safe activating their agent?"
             (specific enough to be actionable, open enough for many solutions)

Too broad:  "HMW make onboarding better?"
             (so open it generates nothing useful)
```

### The NASA Blanket

NASA spent $1 million researching: "How do we keep astronauts warm in space?"
They explored heated suits, insulation materials, complex systems.

A small team reframed it: "How Might We stop heat from escaping?"
Result: the space blanket — a thin metallic sheet costing a few dollars,
retaining 97% of body heat. Now sold in every outdoor store.

Same goal. Different framing. 1,000x cheaper solution.

---

## Defining the Right Problem — Checklist

```
□ Have I asked "Why?" at least 5 times?
□ Does my root cause feel fundamentally different from my symptom?
□ Is my POV surprising — or just restating the obvious?
□ Does my POV contain a real insight, or just a problem description?
□ Is my HMW open enough that 10 different solutions could answer it?
□ Am I solving for the real user, or the most vocal one?
□ Would fixing this root cause eliminate the symptom entirely?
```
