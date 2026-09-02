---
name: context-cards
description: Generate and manage lightweight docs (lessons, decisions, patterns) after completing work. Use when finishing a Jira ticket or when the user asks to document something.
user-invocable: false
---

# Docs — Lessons, Decisions, Patterns

Create lightweight docs (under 200 words) recording what was learned, decided, or discovered.

## Operations

### Generate: `/doc TICKET-ID`

1. **Gather context using built-in tools:**
   - **Jira MCP** (`mcp__claude_ai_Atlassian__getJiraIssue`) — fetch ticket details, comments, linked issues
   - **Git history**: `git log --all --oneline --grep="TICKET-ID"`
   - **Slack MCP** (`mcp__claude_ai_Slack__slack_search_public`) — search for related discussions if ticket references Slack
   - Current conversation context

2. **Determine location:**
   - Touches **1 repo** → that repo's `docs/` directory
   - Touches **2+ repos** → root `docs/` directory

3. **Determine type:**
   - Bug fix or feature with lesson → `lessons/`
   - Architecture choice → `decisions/`
   - Reusable gotcha → `patterns/`

4. **Draft the doc** (under 200 words):

```markdown
---
ticket: BIZ-123
type: lesson | decision | pattern
title: Short title (max 80 chars)
repos: [be, agentic]
date: YYYY-MM-DD
---

### What happened
- Brief context

### Lesson
- What we learned

### Pitfalls (optional)
- Watch out for X
```

5. **Present to user** for review before writing

6. **Write** to correct directory:
   - Lessons/bugs: `{TICKET-ID}-{slug}.md`
   - Decisions: `{NNN}-{slug}.md` (auto-increment)
   - Patterns: `{slug}.md`

### List: `/doc list`

List all docs across root AND apps. Show: type, title, repos, date.

### Search: `/doc search QUERY`

Search docs across root AND all apps using Grep.

## Rules

- Max **200 words** per file (excluding frontmatter)
- English only
- Focus on **lesson learned**, not feature description
- No Jira copy-paste — engineering perspective only
- Skip trivial changes (typos, dep bumps, config tweaks)
