# Ideate — Full Reference

## Core Truth

> "Quantity of ideas matters more than quality — at first."

The best ideas never emerge from trying to have a good idea.
They emerge from having so many ideas that the filter disappears.

---

## The Two Brain Modes

Understanding these modes is the foundation of effective ideation.

| Mode              | What It Does                             | When to Use          |
| ----------------- | ---------------------------------------- | -------------------- |
| 🌊 **Divergent**  | Expands possibilities, generates options | During brainstorming |
| 🎯 **Convergent** | Narrows, evaluates, selects              | After brainstorming  |

**The cardinal rule: Never mix modes in the same session.**

The moment someone says "but that won't work" during a brainstorm,
divergent thinking dies. The team shifts to convergent mode and self-censors
every idea that follows. You've killed the session.

Run separate meetings: one to generate, one to evaluate.

---

## Lewrick's 4 Rules of Brainstorming

**1. Defer judgment**
No criticism, no "that's not practical," no eye-rolls during idea generation.
All evaluation happens in a separate session.

**2. Build on ideas**
"Yes, and..." — take someone's idea and extend it.
Never "No, but..." — this shuts down thinking.

**3. Go for quantity**
Target 50–100 ideas before filtering.
Volume is the strategy. Most ideas will be bad. That's correct and expected.

**4. Stay visual**
Sketch, don't just talk. A rough drawing communicates faster
and sparks more ideas than a sentence.

---

## Crazy 8s — The Fastest Ideation Tool

### How to Run It

1. Fold an A4 sheet into 8 equal panels
2. Set a timer for 8 minutes (1 minute per panel)
3. Sketch one idea per panel — rough is fine
4. **Don't think. Just put something in each box.**

### Why It Works

Time pressure eliminates the perfectionism that kills early ideas.
When the timer forces you to fill panel 7 and 8, your brain has exhausted
all the "safe" ideas and starts producing genuinely original ones.
Ideas 7 and 8 are almost always the most interesting.

### Group Variation

Run individually first (8 minutes, silent).
Then share and do a second round building on each other's ideas.
Never share first — group pressure kills individual ideas before they're born.

---

## How Might We → Idea Generation

Great HMW questions generate great ideas. Weak ones generate weak ones.

### Running HMW Ideation

1. Write each HMW question on a separate card or sticky note
2. Spend 5 minutes per HMW generating ideas (Crazy 8s format)
3. Post all ideas on a wall — don't discuss yet
4. Only after all ideas are posted → move to convergent mode

### From HMW to Ideas

```
HMW: "How Might We let users preview what the agent will say
      before it goes live?"

Ideas generated:
→ Show 3 sample Q&As before activation
→ Let users test the agent themselves in a sandbox
→ Show a "confidence score" per answer
→ Allow one-click editing of any answer
→ Show a before/after comparison of answers
→ Send a test conversation to the user's own device
→ Create a "review mode" where all responses need approval first
→ Show which answers came from the website vs. were inferred
```

Each of these is a buildable solution. Crazy 8s gets you here in 8 minutes.

---

## Selecting Ideas — Convergent Thinking

After generating, move to selection. Never cut ideas the same day you generate them.
Sleep on them — ideas look different in the morning.

### The 2x2 Matrix

Plot ideas on two axes:

```
                HIGH IMPACT
                     │
                     │   ★ Build     ● Invest
                     │   First       Carefully
                     │
LOW EFFORT ──────────┼──────────── HIGH EFFORT
                     │
                     │   ○ Quick     △ Question
                     │   Wins        Mark
                     │
                LOW IMPACT
```

Build First (high impact, low effort) = always start here.
Question Mark = needs more evidence before committing.

### Voting Without Bias

Give each participant 3–5 votes (dots on sticky notes).
Vote silently and simultaneously — never one at a time.
One person voting first biases everyone else.

---

## Prototyping — Making Ideas Tangible

### The Core Principle

**A prototype is a question made physical — not a product, not a demo.**

Its only job is to get an answer you couldn't get from a conversation.
Build the minimum needed to answer the specific question you have.

### The 3 Types

**Paper Prototype**

- Time: 30 minutes
- Answers: Does this flow make sense? Do users understand the sequence?
- How: Hand-drawn screens on paper, user "clicks" by pointing
- Use when: Testing logic and flow before any visual design

**Digital Mockup**

- Time: 1–2 days
- Answers: Is this UI clear? Do users know what to do?
- How: Figma or similar, clickable but not functional
- Use when: Testing interface clarity and user comprehension

**Wizard of Oz**

- Time: A few hours
- Answers: Would users actually want this behavior? Is the output valuable?
- How: A human performs the function manually, user thinks it's automated
- Use when: Testing AI or complex automated behavior before building it
- Example: Before building an AI agent — have a human answer as if they were the AI.
  Measure if users are satisfied. If not, don't build.

### The Zappos Rule

**Validate demand before building anything.**

Nick Swinmurn didn't stock inventory or build a warehouse system.
He photographed shoes in local stores, posted them on a simple website,
and only purchased the shoes after someone placed an order.
He lost money on every transaction — but proved that people would buy shoes online.
Amazon acquired Zappos for $1.2 billion.

Ask yourself: what's the cheapest possible way to find out if this idea has demand?

### The Dropbox Rule

**A demo of something that doesn't exist is still a valid prototype.**

Drew Houston made a 3-minute video demonstrating a product that didn't exist.
75,000 people signed up for the waitlist overnight.
He validated massive demand before writing a single line of production code.

---

## Testing — Finding Where You're Wrong

### The Mindset Shift

Testing is not to prove you're right.
Testing is to find out where you're wrong — as early and cheaply as possible.

**The Windows 8 Lesson:**
Microsoft did thorough research. Focus groups said the new design was fine.
Launch day: catastrophe. Users were furious. Windows 10 had to restore the Start button.

Why did research fail? In focus groups, people respond based on social desirability —
they say what they think sounds reasonable, not how they actually feel or behave.
Trust behavioral data, not stated preferences.

### Lewrick's 5 Test Types

**1. Usability Test**
Sit next to the user. Stay silent. Watch them complete a task.
Never explain, never help, never react.
Every moment of hesitation is a data point.
_Best for: Testing any new flow or interface_

**2. A/B Test**
Two versions, same traffic, let data decide.
Remove all assumptions — the data picks the winner.
_Best for: Optimizing when you have sufficient traffic_

**3. Desirability Test**
Show the user your design and ask them to describe it using 3 adjectives.
If they say "confusing, cold, overwhelming" — redesign.
If they say "clear, trustworthy, fast" — you're on track.
_Best for: Checking emotional tone and brand alignment_

**4. Fake Door Test**
Add a button or link for a feature that doesn't exist yet.
Count how many people click it. If many do — build it.
If almost no one does — don't.
_Best for: Validating demand before building_

**5. Concierge Test**
Do the thing manually for 1–2 real users before automating it.
You will learn things about the problem no research can surface.
_Best for: Understanding the real workflow before building automation_

---

## Lean Canvas — Connecting Ideas to Business

After validating a solution, anchor it to business reality:

```
┌─────────────┬─────────────┬─────────────┐
│  Problem    │  Solution   │ Unique Value│
│             │             │  Proposition│
├─────────────┤             ├─────────────┤
│  Existing   │             │  Unfair     │
│ Alternatives│             │  Advantage  │
├─────────────┴─────────────┴─────────────┤
│           Customer Segments             │
├─────────────┬─────────────┬─────────────┤
│ Key Metrics │  Channels   │ Revenue /   │
│             │             │ Cost        │
└─────────────┴─────────────┴─────────────┘
```

**The Lean Canvas connects Design Thinking output to product reality:**

- Problem = what you found through empathy
- Solution = what survived prototyping and testing
- Unique Value = the POV rewritten as a customer promise
- Key Metrics = how you'll know if this is working
- Unfair Advantage = what makes this defensible over time
