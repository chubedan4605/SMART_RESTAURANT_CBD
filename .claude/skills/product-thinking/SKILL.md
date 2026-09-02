---
name: product-thinking
description: "Product thinking for engineering decisions in Jarvis Helpdesk. Load this when making product trade-offs, writing user-facing copy, scoping features, or deciding what to build."
---

# Product Thinking — Jarvis Helpdesk

Ground engineering decisions in customer understanding and product context. This skill works at every scale — from choosing a button label to scoping a quarter's work.

---

## What Jarvis Helpdesk Is

**AI Agent omnichannel helpdesk for Vietnamese businesses.** Jarvis helps companies manage customer support across all channels from one place, with AI that drafts responses, looks up knowledge, and automates repetitive tasks.

### The Jarvis Loop

```
Receive (omnichannel inbox) → Understand (AI analysis) → Respond (AI draft) → Learn (knowledge base)
```

Support that gets smarter over time. The AI learns from resolved tickets and internal knowledge to draft better responses.

### Product Modules

| Module                | What it does                                                                     | Who uses it            |
| --------------------- | -------------------------------------------------------------------------------- | ---------------------- |
| **Omnichannel Inbox** | Unified inbox for email, chat, Messenger, Zalo, Lazada, TikTok, Shopify, Zendesk | Agents handle tickets  |
| **AI Draft Response** | AI drafts replies based on conversation context and internal knowledge           | Agents review and send |
| **Knowledge Base**    | Internal knowledge indexed in Qdrant for AI retrieval                            | Admins manage; AI uses |
| **LiveChat Widget**   | Embeddable chat widget (Rocket.Chat-based) for customer websites                 | End users interact     |
| **Analytics**         | Ticket volume, response time, agent performance, AI usage metrics                | Admins monitor         |

### Core Value Proposition

1. **Omnichannel in one place** — no switching between platforms
2. **AI-assisted responses** — faster resolution, consistent quality
3. **Vietnamese-first** — built for Vietnamese business context and language
4. **Easy setup** — not enterprise-complex, approachable for SMBs

---

## User Personas

### 1. Admin (Business Owner / Support Manager)

The buyer and primary admin. Sets up the workspace, connects channels, manages knowledge base, monitors team performance.

**What they care about:** Reducing response time, scaling support without hiring, proving ROI, easy setup that doesn't require technical skills.

**Key context:** This person is non-technical. They evaluate tools based on ease of use, not feature lists. They need to see results quickly (within days, not months).

### 2. Agent (Support Staff)

The daily user handling tickets — reading customer messages, using AI drafts, resolving issues, escalating when needed.

**What they care about:** Getting through tickets efficiently, having accurate AI suggestions, not looking incompetent to customers, clear workflows for common scenarios.

**Key context:** Agents judge the product by how much time it saves them per ticket. If AI drafts are wrong more often than right, they stop using them. Speed and accuracy are everything.

### 3. End User (Customer)

The person reaching out for support through any channel. They don't know or care about Jarvis — they just want their problem solved.

**What they care about:** Fast response, accurate answers, not repeating themselves across channels, being understood (especially in Vietnamese).

**Key context:** End users never see the admin panel. Their experience is the LiveChat widget, email replies, or social media responses. Build every customer-facing interaction to feel natural and fast.

---

## UX Principles

### Users are non-technical

Almost none of the admins or agents are technical. Language should be what a normal person expects, not software jargon.

**Bad:** "Configure NLP pipeline parameters"
**Good:** "Set up your knowledge base"

### Clean, fast, obvious

Every interaction should be:

- **Clean** — no visual clutter, clear hierarchy
- **Fast** — minimal clicks, quick load times
- **Obvious** — the next action is always clear without reading instructions

### Fewer clicks, not more

If something takes 3 clicks and could take 1, it should take 1. Question every confirmation dialog, every intermediate screen. Delete friction ruthlessly.

### Guide to the next thing

Users should always know what to do next. After connecting a channel, prompt them to test it. After setting up knowledge base, show them how AI uses it. Don't leave people on dead-end screens.

### AI must be trustworthy

AI features live or die by trust. When the AI draft is wrong:

- Make it easy to edit (not just accept/reject)
- Show the source (which knowledge article was used)
- Let agents flag bad suggestions to improve the model

### Vietnamese-first

- UI labels and messages should work well in Vietnamese (consider text length differences)
- AI prompts must preserve the customer's language — if they write in Vietnamese, respond in Vietnamese
- Date formats, currency, and business conventions should default to Vietnamese

### Data must make sense

Admins make decisions based on analytics. Numbers that don't add up destroy trust faster than a missing feature. When building analytics:

- Ensure totals actually total
- Make filters behave predictably
- Show clear labels for what's being measured and over what time period

---

## Built-in Tools for Product Thinking

- **WebSearch** — Research competitor products and market positioning when making scope or feature decisions.
- **Slack MCP** (`mcp__claude_ai_Slack__slack_search_public`) — Search `biz-dev` and support channels for real user feedback.
- **Jira MCP** (`mcp__claude_ai_Atlassian__searchJiraIssuesUsingJql`) — Pull ticket history to understand request frequency and user pain patterns.
- **Playwright MCP** — Navigate the current UI to evaluate existing UX flows before proposing changes.
- **Windsor.ai MCP** — Pull analytics data (if connected) to ground decisions in real usage numbers.

## How to Apply This Skill

### Micro decisions — copy, labels, empty states, error messages

1. Use language the user would use, not technical terms
2. Prefer concrete over abstract: "View suggested response" not "Access AI suggestions"
3. Remember: non-technical users. No jargon.

**Quick test:** Would a non-technical support manager understand this without thinking? If not, rewrite.

### Medium decisions — feature scope, what to include/exclude

When scoping a feature:

1. **Which persona is this for?** If the persona can't be named, the feature isn't well-defined.
2. **Does this help the Jarvis Loop?** Does it make Receive, Understand, Respond, or Learn better?
3. **Fit check:**

| Question                                       | Why it matters                          |
| ---------------------------------------------- | --------------------------------------- |
| Does a real user need drive this?              | Prevents building for imagined problems |
| Can the specific persona be named?             | Prevents building generic features      |
| Can this be demoed to a buyer in one sentence? | Prevents hidden complexity              |
| Does this reduce clicks or add them?           | Prevents workflow bloat                 |

### Big decisions — new features, product direction

1. **Frame the problem first.** Before discussing solutions:
   - What customer pain does this address?
   - Which personas care?
   - How frequently does this come up?

2. **Check strategic fit:**
   - Does this strengthen the Receive → Understand → Respond → Learn loop?
   - Does this widen the gap with competitors?
   - Does this work across customer types (e-commerce, service, SaaS)?

3. **Flag unknowns explicitly.** If describing WHAT but not HOW, say so. Unknown mechanisms are risks, not decisions.

---

## Quick Reference — Core Positioning

**The unique loop:** Receive → Understand → Respond → Learn. The edge is the complete AI-assisted system, not individual features.

**Cross-cutting pain points:**

1. Too many channels to manage separately
2. Slow response times losing customers
3. Inconsistent response quality across agents
4. No visibility into support performance
5. Can't scale support without scaling headcount

**Competitive differentiators:**

- Vietnamese-first (language, channels, business context)
- AI that actually helps (not just a chatbot)
- Omnichannel that includes Vietnamese platforms (Zalo, Lazada, TikTok)
- Approachable for SMBs (not enterprise-complex pricing or setup)
