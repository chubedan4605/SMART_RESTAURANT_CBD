#!/bin/bash
# Session bootstrap: inject toolkit skill + load previous session state
# Jarvis Kit session initialization

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"
SKILL_FILE="$PROJECT_DIR/.claude/skills/using-jarvis-toolkit/SKILL.md"

if [ ! -f "$SKILL_FILE" ]; then
  exit 0
fi

# Check .env vs .env.example mismatches
ENV_CHECK=""
if [ -x "$PROJECT_DIR/scripts/env-check.sh" ]; then
  ENV_CHECK=$("$PROJECT_DIR/scripts/env-check.sh" 2>/dev/null | grep "WARN" || true)
fi

# Read skill content, strip YAML frontmatter
SKILL_CONTENT=$(sed '1{/^---$/!q;};1,/^---$/d' "$SKILL_FILE")

# Append env check warnings if any
if [ -n "$ENV_CHECK" ]; then
  SKILL_CONTENT="$SKILL_CONTENT

## Environment Mismatch Detected
The following .env files are out of sync with .env.example:
$ENV_CHECK
Recommend running: ./scripts/env-check.sh for details, then update .env and ./scripts/env-encrypt.sh"
fi

# Load previous session state if exists
PROJECT_HASH=$(echo -n "$PROJECT_DIR" | shasum -a 256 | cut -c1-12)
STATE_FILE="${TMPDIR:-/tmp}/jarvis-kit-sessions/$PROJECT_HASH.md"

if [ -f "$STATE_FILE" ]; then
  # Check if state is less than 7 days old
  STATE_AGE=$(( $(date +%s) - $(stat -f %m "$STATE_FILE" 2>/dev/null || echo 0) ))
  if [ "$STATE_AGE" -lt 604800 ]; then
    STATE_CONTENT=$(cat "$STATE_FILE")
    SKILL_CONTENT="$SKILL_CONTENT

## Previous Session State (Resuming)
$STATE_CONTENT"
  fi
fi

# Inject workflow reminder
SKILL_CONTENT="$SKILL_CONTENT

## Jarvis Kit Workflow
Rules: \`.claude/rules/development-rules.md\` | Workflow: \`.claude/rules/primary-workflow.md\` | Orchestration: \`.claude/rules/orchestration-protocol.md\`"

# JSON-escape the content
ESCAPED_CONTENT=$(echo "$SKILL_CONTENT" | jq -Rs .)

# Output as additionalContext for the session
cat <<EOF
{
  "hookSpecificOutput": {
    "hookEventName": "SessionStart",
    "additionalContext": $ESCAPED_CONTENT
  }
}
EOF

exit 0
