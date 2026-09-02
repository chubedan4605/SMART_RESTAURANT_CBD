#!/bin/bash
# Save full session state before conversation compaction
# Triggers session-state-save, then injects summary for post-compact context

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"

INPUT=$(cat)
CWD=$(echo "$INPUT" | jq -r '.cwd // empty')
[ -z "$CWD" ] && CWD="$PROJECT_DIR"

# Trigger session state save
"$SCRIPT_DIR/session-state-save.sh" 2>/dev/null || true

# Gather git state for immediate context
CURRENT_BRANCH=$(cd "$CWD" && git branch --show-current 2>/dev/null || echo "unknown")
TICKET_ID=""
if echo "$CURRENT_BRANCH" | grep -qE '^[A-Z]{2,10}-[0-9]+'; then
  TICKET_ID=$(echo "$CURRENT_BRANCH" | grep -oE '^[A-Z]{2,10}-[0-9]+')
fi

RECENT_COMMITS=$(cd "$CWD" && git log --oneline -3 2>/dev/null || echo "none")
GIT_STATUS=$(cd "$CWD" && git diff --stat HEAD 2>/dev/null | tail -1)

# Find active plan
PLAN_FILE=$(find "$PROJECT_DIR/.claude/plans" -maxdepth 1 -name "*${CURRENT_BRANCH}*" -type f 2>/dev/null | head -1)
PLAN_NAME=""
[ -n "$PLAN_FILE" ] && PLAN_NAME=$(basename "$PLAN_FILE" .md)

# Build context
CONTEXT="[Jarvis Kit] Session state saved before compaction."
CONTEXT="$CONTEXT Branch: $CURRENT_BRANCH."
[ -n "$TICKET_ID" ] && CONTEXT="$CONTEXT Ticket: $TICKET_ID."
[ -n "$PLAN_NAME" ] && CONTEXT="$CONTEXT Plan: $PLAN_NAME."
[ -n "$GIT_STATUS" ] && CONTEXT="$CONTEXT Changes: $GIT_STATUS."
CONTEXT="$CONTEXT Recent commits: $RECENT_COMMITS."
CONTEXT="$CONTEXT Rules: .claude/rules/ | Workflow: primary-workflow.md | Orchestration: orchestration-protocol.md"

ESCAPED=$(printf '%s' "$CONTEXT" | jq -Rs .)
cat <<EOF
{
  "hookSpecificOutput": {
    "hookEventName": "PreCompact",
    "additionalContext": $ESCAPED
  }
}
EOF

exit 0
