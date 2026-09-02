---
name: slack-update
description: "Post implementation update to Slack after completing a ticket. Gathers all branch changes, optionally captures browser screenshots/video for demo, and posts a human-style summary to biz-dev channel tagging the team. Use when the user wants to notify the team about completed work, post a dev update, or share implementation progress on Slack."
user-invocable: true
---

# Slack Implementation Update

Post a human-style implementation update to the `biz-dev` Slack channel after completing work on a ticket. Optionally capture browser screenshots or screen recordings as visual proof/demo.

## Workflow

### Step 1: Gather Context

1. **Detect current branch and ticket ID**
   ```bash
   git branch --show-current
   ```
   - Extract ticket ID from branch name (e.g., `JH-123` from `JH-123` or `JH-123-some-description`)
   - If not on a feature branch, ask the user which ticket this relates to

2. **Collect all changes on this branch vs main**
   For the root repo (all changes are in one git repo now):
   ```bash
   git log main..HEAD --oneline --no-merges
   git diff main..HEAD --stat
   ```
   - Note which repos were changed, what files were touched, and the nature of changes

3. **Fetch ticket info from Jira** (if ticket ID detected)
   - Use `mcp__claude_ai_Atlassian__getJiraIssue` to get ticket title and description
   - This provides context for writing a meaningful update

### Step 2: Browser Capture (Optional)

Ask the user: **"Want me to capture screenshots or record a demo video? If yes, which URL should I open?"**

If the user provides a URL or says yes:

1. **Create output directory** for media files:
   ```
   /tmp/claude/slack-update-{TICKET-ID}/
   ```

2. **Open browser and navigate** to the specified URL using Playwright MCP:
   - `mcp__playwright__browser_navigate` to the target URL
   - Wait for the page to load fully

3. **Capture evidence** based on user preference:
   - **Screenshots**: Use `mcp__playwright__browser_take_screenshot` for key states
     - Save with descriptive names: `overview.png`, `feature-detail.png`, etc.
   - **Video recording**: If the user wants a demo video:
     - Navigate through the feature flow
     - Take screenshots at each step as frames
     - Or use Playwright's built-in recording if available

4. **Present captured files** to the user:
   - List all files in the output directory
   - Ask: "These files are ready. Want me to include them in the Slack message, or skip?"
   - The user decides which files (if any) to attach

5. **Close browser** when done:
   - `mcp__playwright__browser_close`

If the user declines capture, skip directly to Step 3.

### Step 3: Compose the Slack Message

Write a **natural, human-style message** in English. Avoid robotic bullet points or overly formal language. The message should read like a developer casually updating their team.

**Message structure:**

```
hey team, just wrapped up [TICKET-ID] — [brief ticket title/description in casual terms]

here's what changed:
[2-4 sentences describing the actual changes, grouped by impact rather than by file. mention the repos involved naturally, e.g. "updated the API endpoint in BE and added the corresponding UI in FE"]

[if there are notable technical decisions or things reviewers should pay attention to, mention them briefly]

[if there's a PR link, include it]

@channel heads up — ready for review whenever you get a chance :pray:
```

**Style guidelines:**
- Lowercase first letter (casual style, like real Slack messages)
- Use Slack mrkdwn: `*bold*`, `_italic_`, `:emoji_code:`, `\n` for newlines
- No "Dear team" or "I'm pleased to announce" — keep it conversational
- Mention specific changes concretely, not vaguely ("added retry logic to the email sender" not "made improvements")
- If changes span multiple repos, group by feature/impact, not by repo
- Keep it under 10 lines — concise but informative
- End with `@channel` tag so everyone gets notified
- Add `:pray:` emoji when asking for review

### Step 4: User Approval

Before posting, display the composed message to the user and ask:

> Here's the Slack message I'll post to `biz-dev`:
>
> [message preview]
>
> Want me to post this? (y/edit/n)

- **y**: Post as-is
- **edit**: Let user modify, then re-confirm
- **n**: Cancel

### Step 5: Post to Slack

Use `mcp__claude_ai_Slack__slack_send_message` to post to the `biz-dev` channel.

- Search for the channel first using `mcp__claude_ai_Slack__slack_search_channels` with query `biz-dev`
- Post the approved message
- If media files were captured and user approved, mention that screenshots/videos are available (Slack MCP may not support file uploads — in that case, tell the user to drag-and-drop the files from the output directory)

### Step 6: Confirmation

After posting:
- Show the user the posted message link (if available)
- If media files exist but couldn't be uploaded, remind:
  > "Screenshots/videos are saved at `/tmp/claude/slack-update-{TICKET-ID}/`. Drag and drop them into the Slack thread if needed."

## Error Handling

- If not on a feature branch and no ticket ID can be determined, ask the user
- If Jira fetch fails, proceed with git-only context
- If Slack posting fails, display the formatted message for manual copy-paste
- If browser capture fails, skip capture and continue with text-only update

## Arguments

`$ARGUMENTS` — optional ticket ID override (e.g., `/slack-update JH-456`)
