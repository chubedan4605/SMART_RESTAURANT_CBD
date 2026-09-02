---
name: browser-testing
description: "Playwright MCP for UI capture, smoke tests, bug verification, and video recording for demos."
---

# Browser Testing — Playwright MCP + Video Recording

Browser automation for capturing evidence when testing features, verifying bug fixes, or recording demo clips.

## Setup

Playwright MCP must be configured in `.mcp.json` (gitignored, each dev sets up locally):

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["@playwright/mcp@latest"]
    }
  }
}
```

Or add via CLI:
```bash
claude mcp add --scope project playwright -- npx @playwright/mcp@latest
```

## When to Use

- **Use**: Feature completion evidence, bug fix verification, UI regression check, release note screenshots, demo clips
- **Skip**: Small/trivial changes (copy fix, config tweak, styling nudge)

## Auth Setup (One-Time)

Jarvis Helpdesk requires login. Two options:

**Option A — Persistent profile (default):** Playwright remembers login state across sessions automatically. No extra config needed.

**Option B — Storage state file:** Add `--storage-state` flag for explicit control:
```json
"playwright": {
  "command": "npx",
  "args": ["@playwright/mcp@latest", "--storage-state", ".playwright-auth.json"]
}
```

Either way:
1. First session → navigate to app → login via Playwright tools → state auto-saved
2. Next sessions → already logged in

**Security**: `.playwright-auth.json` is gitignored. Never commit auth state files.

## Workflow 1: Screenshot Capture (via MCP)

### Pre-flight: Scripting before capture

**CRITICAL COST REDUCTION**: Before doing anything, **ask the user to switch the model to Claude 3.5 Haiku**. Browser testing (Playwright MCP) consumes a huge amount of tokens.

Before starting to capture or record, you MUST create a script:

1. **Identify feature** — read Jira ticket or ask user clearly about the scope
2. **List screens to capture** — 1 line description per screen
3. **Identify actions** — navigate where, what to click, which dropdown to open
4. **Present script to user for approval** before executing
5. **Create output directory** — `demo-<ticket-id>/` or `demo-<feature>/`

Action script example:
```
Feature: BIZ-398 Re-engagement & Auto-close
Output: demo-biz398/

Image 1: Kanban board (navigate /stages → wait load → screenshot)
Image 2: Re-engagement settings (click "Remind & Auto-close" button → screenshot drawer)
Image 3: Stage dropdown in chat (navigate /chat → click Categorize dropdown → screenshot)
```

### Capture Flow

```
1. browser_navigate → http://localhost:3000/<page>
2. browser_snapshot → verify page loaded, get element refs
3. Interact: browser_click, browser_fill, browser_select as needed
4. browser_screenshot → save to demo-<id>/<nn>-<description>.png
5. Repeat for each screen
```

### Release Note Screenshots

```
1. browser_navigate → feature page
2. Interact to reach the desired state
3. browser_screenshot → save to apps/be/release-notes/images/v<version>/
4. Reference in release note as ![alt](/release-notes/images/v<version>/<file>)
```

See `release-notes` skill for full release workflow.

## Workflow 2: Video Recording (via Script)

Playwright MCP does not support video. Use standalone script:

### Pre-flight: Video script

**CRITICAL COST REDUCTION**: Before doing anything, **ask the user to switch the model to Claude 3.5 Haiku**. Browser testing consumes a huge amount of tokens.

1. **Write steps file** (JSON) describing each navigate, click, wait step
2. **Review with user** — ensure the flow is correct
3. **Run script** → output `.webm` → convert to `.mp4` if needed

### Steps File Format

Create JSON file with array of actions:

```json
[
  { "action": "navigate", "url": "http://localhost:3000/stages" },
  { "action": "wait", "ms": 2000 },
  { "action": "click", "selector": "button:has-text('Remind')" },
  { "action": "wait", "ms": 1500 },
  { "action": "screenshot", "filename": "settings.png" },
  { "action": "fill", "selector": "input[name=timeout]", "value": "30" },
  { "action": "select", "selector": "select#stage", "value": "new" },
  { "action": "hover", "selector": ".card" },
  { "action": "scroll", "y": 300 },
  { "action": "press", "key": "Escape" }
]
```

Available actions: `navigate`, `click`, `fill`, `select`, `hover`, `scroll`, `press`, `wait`, `screenshot`

### Record

```bash
# Basic — headed browser, records video
node .claude/skills/browser-testing/scripts/record-video.js steps.json --output demo-biz398

# With auth state
node .claude/skills/browser-testing/scripts/record-video.js steps.json \
  --output demo-biz398 \
  --storage-state .playwright-auth.json

# Custom viewport
node .claude/skills/browser-testing/scripts/record-video.js steps.json \
  --output demo-biz398 \
  --width 1920 --height 1080

# Slower for demo clarity
node .claude/skills/browser-testing/scripts/record-video.js steps.json \
  --output demo-biz398 \
  --slow 1000
```

### Convert to MP4 (for Slack/social)

```bash
# Requires ffmpeg: brew install ffmpeg
.claude/skills/browser-testing/scripts/convert-video.sh demo-biz398/steps.webm
# → demo-biz398/steps.mp4
```

### Example: Demo BIZ-398

```bash
node .claude/skills/browser-testing/scripts/record-video.js \
  .claude/skills/browser-testing/scripts/examples/demo-reengagement.json \
  --output demo-biz398
```

## Available MCP Tools

| Tool | What |
|------|------|
| `browser_navigate` | Go to URL |
| `browser_snapshot` | Get accessibility tree (structured, no vision needed) |
| `browser_click` | Click element by ref from snapshot |
| `browser_fill` | Type into input field |
| `browser_select` | Select dropdown option |
| `browser_screenshot` | Capture screenshot |
| `browser_press_key` | Press keyboard key |
| `browser_wait` | Wait for condition |
| `browser_close` | Close browser |

## Rules

1. **MUST create script** before capturing/recording — present to user for approval
2. Always `browser_snapshot` after navigation or interaction — refs change on DOM update
3. Use accessibility tree refs (`ref="e1"`) from snapshot, not CSS selectors
4. Screenshots/videos go to `demo-<ticket-id>/` directory
5. Don't store credentials in skill files or committed code
6. If login state expires, re-login via Playwright and state auto-saves
7. Naming convention: `<nn>-<description>.png` (e.g., `01-kanban-board.png`)
