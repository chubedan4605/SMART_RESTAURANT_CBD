---
name: browser-testing
description: "Browser testing, UI capture, bug verification, and video recording using Antigravity's native browser_subagent."
---

# Browser Testing & Video Recording (Native Antigravity)

Use Antigravity's native `browser_subagent` for all UI automation, testing, and video recording instead of external scripts.

## Core Capabilities

Antigravity's `browser_subagent` has built-in tools for interacting with web pages (clicking, typing, navigating). **CRITICAL**: The subagent automatically records all browser interactions and saves them as **WebP videos** in the artifacts directory. This is the ONLY approved way to record a browser session video/animation.

## Workflow

**CRITICAL COST REDUCTION**: Before doing any browser testing, explicitly **notify the user to switch the model to Claude 3.5 Haiku**. Browser testing generates a massive amount of tokens.

1. **Pre-flight & Scripting**: 
   - Identify the feature or bug to test.
   - Outline a clear step-by-step task describing exactly what URL to visit, what elements to click, what inputs to fill, and what to verify.

2. **Execute `browser_subagent` tool**:
   - Call the `browser_subagent` tool.
   - Provide the detailed step-by-step sequence in the `Task` argument.
   - Set the `RecordingName` (e.g., `login_flow_demo`, MUST be lowercase with underscores, max 3 words). This is crucial, as this dictates the generated recording file.
   - The subagent will autonomously follow the instructions in the browser.

3. **Output & Artifacts**:
   - Once the subagent finishes, it will return control, and the WebP recording is automatically saved in the artifacts directory.
   - The subagent can be instructed to verify functionality, capture specific states, or just blindly perform a flow to record a clip.

**Setup Requirements**: 
- Make sure the local dev server (e.g., `http://localhost:3000`) is running. If it's not running, tell the user to start it.
- The subagent acts as a real user, so if authentication is required, clearly instruct the subagent to log in first or confirm if existing cookies will suffice.

## Example Usage

When recording a demo clip for ticket `BIZ-398`:
1. **Tool**: `browser_subagent`
2. **RecordingName**: `biz_398_demo`
3. **TaskDescription**: "Go to http://localhost:3000/stages. Ensure the page loads. Click the button with the text 'Nhắc lại'. Check that the Re-engagement settings drawer opens. Go to http://localhost:3000/chat and click the stage dropdown. Stop and return."
