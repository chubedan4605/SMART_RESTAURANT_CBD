#!/bin/bash
# PostToolUse hook: Track file edits and remind about simplification
# After 5+ file edits in a session, injects a reminder to review for unnecessary complexity.

INPUT=$(cat)
TOOL_NAME=$(echo "$INPUT" | jq -r '.tool_name // empty')

# Only track edit/write operations
case "$TOOL_NAME" in
  Edit|Write|MultiEdit) ;;
  *) exit 0 ;;
esac

# Session tracking via temp file (resets after 2 hours)
TRACK_FILE="${TMPDIR:-/tmp}/jarvis-simplify-session.json"
THRESHOLD=5
REMINDER_COOLDOWN=600 # 10 minutes between reminders

NOW=$(date +%s)

# Load or initialize session data
if [ -f "$TRACK_FILE" ]; then
  START_TIME=$(jq -r '.start_time // 0' "$TRACK_FILE" 2>/dev/null)
  EDIT_COUNT=$(jq -r '.edit_count // 0' "$TRACK_FILE" 2>/dev/null)
  LAST_REMINDER=$(jq -r '.last_reminder // 0' "$TRACK_FILE" 2>/dev/null)

  # Reset if session older than 2 hours
  ELAPSED=$((NOW - START_TIME))
  if [ "$ELAPSED" -gt 7200 ]; then
    START_TIME=$NOW
    EDIT_COUNT=0
    LAST_REMINDER=0
  fi
else
  START_TIME=$NOW
  EDIT_COUNT=0
  LAST_REMINDER=0
fi

# Increment edit count
EDIT_COUNT=$((EDIT_COUNT + 1))

# Save updated session data
cat > "$TRACK_FILE" <<EOF
{
  "start_time": $START_TIME,
  "edit_count": $EDIT_COUNT,
  "last_reminder": $LAST_REMINDER
}
EOF

# Check if we should remind
SINCE_LAST=$((NOW - LAST_REMINDER))
if [ "$EDIT_COUNT" -ge "$THRESHOLD" ] && [ "$SINCE_LAST" -ge "$REMINDER_COOLDOWN" ]; then
  # Update last reminder time
  cat > "$TRACK_FILE" <<EOF
{
  "start_time": $START_TIME,
  "edit_count": $EDIT_COUNT,
  "last_reminder": $NOW
}
EOF

  CONTEXT="[Simplify Check] ${EDIT_COUNT} files modified this session. Before moving on, scan recent changes for: unnecessary abstractions, dead code, over-engineering, or violations of YAGNI/KISS. Run /review if the changes are substantial."
  ESCAPED=$(echo "$CONTEXT" | jq -Rs .)

  cat <<EOF
{
  "hookSpecificOutput": {
    "hookEventName": "PostToolUse",
    "additionalContext": $ESCAPED
  }
}
EOF
fi

exit 0
