#!/bin/bash
# UserPromptSubmit hook: Periodically inject development rules into context
# Rate-limited: only injects every 10 prompts or 15 minutes to avoid spam

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"
TRACK_FILE="${TMPDIR:-/tmp}/jarvis-kit-rules-reminder.json"
COOLDOWN=900 # 15 minutes
PROMPT_INTERVAL=10

NOW=$(date +%s)

# Load tracking state
PROMPT_COUNT=0
LAST_INJECT=0
if [ -f "$TRACK_FILE" ]; then
  PROMPT_COUNT=$(jq -r '.prompt_count // 0' "$TRACK_FILE" 2>/dev/null)
  LAST_INJECT=$(jq -r '.last_inject // 0' "$TRACK_FILE" 2>/dev/null)
fi

PROMPT_COUNT=$((PROMPT_COUNT + 1))
SINCE_LAST=$((NOW - LAST_INJECT))

# Check if we should inject
SHOULD_INJECT=false
if [ "$LAST_INJECT" -eq 0 ]; then
  SHOULD_INJECT=true
elif [ "$SINCE_LAST" -ge "$COOLDOWN" ] && [ "$PROMPT_COUNT" -ge "$PROMPT_INTERVAL" ]; then
  SHOULD_INJECT=true
fi

if [ "$SHOULD_INJECT" = true ]; then
  PROMPT_COUNT=0
  LAST_INJECT=$NOW

  # Build reminder from rules files
  REMINDER="[Jarvis Kit Workflow Reminder]
- Workflow: Understand → Plan → Implement → Simplify → Test → Review → Ship
- Principles: YAGNI, KISS, DRY. No shortcuts. No mocks to pass tests.
- Files: <200 lines, update existing, descriptive names
- Cross-repo: Agentic → AI-Services → BE → FE. Check DTO alignment.
- Quality: format → lint → test MUST pass. Only stage YOUR files.
- Commits: conventional format. Scope = module, NOT ticket ID."

  # Check for active plan
  CURRENT_BRANCH=$(git -C "$PROJECT_DIR" branch --show-current 2>/dev/null || true)
  PLAN_FILE=$(find "$PROJECT_DIR/.claude/plans" -maxdepth 1 -name "*${CURRENT_BRANCH}*" -type f 2>/dev/null | head -1)
  if [ -n "$PLAN_FILE" ]; then
    PLAN_NAME=$(basename "$PLAN_FILE")
    REMINDER="$REMINDER
- Active plan: $PLAN_NAME"
  fi

  ESCAPED=$(echo "$REMINDER" | jq -Rs .)
  cat <<EOF
{
  "hookSpecificOutput": {
    "hookEventName": "UserPromptSubmit",
    "additionalContext": $ESCAPED
  }
}
EOF
fi

# Save tracking state
cat > "$TRACK_FILE" <<EOF
{
  "prompt_count": $PROMPT_COUNT,
  "last_inject": $LAST_INJECT
}
EOF

exit 0
