---
name: release-notes
description: Create release notes for Jarvis Helpdesk. Navigate to implemented features using Playwright, capture screenshots/video, write release note markdown, update BE release-notes directory, and create a separate PR. Use when a version is ready to ship or user asks to write release notes.
---

# Release Notes

Create user-facing release notes with screenshots for Jarvis Helpdesk.

## System Overview

Release notes live in **apps/be**:

```
release-notes/
├── index.json              # Version metadata (version, date, title, breaking)
├── version.guideline.md    # Format guide
├── 1.4.0.md                # Content (Vietnamese, markdown)
├── images/
│   └── v1.4.0/             # Screenshots for that version
│       └── subscription.png
```

- FE renders via `ReleaseNotesDialog` using `react-markdown`
- Images referenced as `![alt](/release-notes/images/v<version>/<file>)` — FE prepends `REACT_APP_API_HOST`

## Workflow

### 0. Gather Context with Built-in Tools

- **Jira MCP** (`mcp__claude_ai_Atlassian__searchJiraIssuesUsingJql`) — Search for tickets completed since last release to build changelog.
- **GitHub MCP** (`mcp__github__list_commits`) — Get commit history since last version tag.
- **Slack MCP** — Search `biz-dev` for feature announcements and demos to capture user-facing narrative.

### 1. Determine Version

Check current latest in `release-notes/index.json`. Bump:

- **Major** (2.0.0): Breaking changes
- **Minor** (1.5.0): New features
- **Patch** (1.4.1): Bug fixes only

### 2. Capture Screenshots

Use **Playwright MCP** (browser-testing skill) to capture evidence:

```
1. browser_navigate → http://localhost:3000 (FE dev server)
2. Login if needed (use saved auth state)
3. Navigate to the new feature / fixed bug
4. browser_screenshot → save to release-notes/images/v<version>/
5. Repeat for each notable change
```

For video recording (major features): use `browser_record` or capture multiple screenshots showing the flow.

### 3. Write Release Note

Create `release-notes/<version>.md` following this format:

```markdown
## ✨ New Features

### Feature Name

Brief description, aimed at the end-user (in Vietnamese).

![IMAGE](/release-notes/images/v<version>/feature.png)

## 🚀 Improvements

- Improvement description 1
- Improvement description 2

## 🐞 Bug Fixes

- Bug fix description 1
```

**Writing Style:**

- Vietnamese, user-facing language (not technical jargon)
- **Engaging tone**: Open each feature with a relatable problem then the solution ("Before, you had to X then Y. Now just Z")
- **Always use bullet points**: List capabilities and steps as bulleted lists. Avoid walls of text
- **Structure each feature**: Problem → Solution → What you can do (bullet list) → Screenshot

**Rules:**

- No metadata in the md file (title/date go in index.json)
- Images use absolute path `/release-notes/images/v<version>/<file>`
- Only include sections with actual changes (skip empty sections)

### 4. Update index.json

Add new entry at the **end** of the array:

```json
{
  "version": "<version>",
  "date": "YYYY-MM-DD",
  "title": "Jarvis Helpdesk v<version>",
  "breaking": false
}
```

### 5. Create PR

Create a **separate branch and PR** for release notes:

- Branch: `release-notes/v<version>` (not tied to any ticket)
- PR title: `Release Notes v<version>` (no [TICKET-ID] required)
- PR rules are relaxed — no strict conventional commit or ticket requirement
- Target: `main` branch in BE repo

## Important Notes

- Release notes are **user-facing** — write for customers, not developers
- Screenshots must clearly show the feature — crop if needed
- Check the app is running locally (`npm start` in FE, `npm run dev` in BE) before capturing
- If the feature spans multiple pages, capture each relevant screen
