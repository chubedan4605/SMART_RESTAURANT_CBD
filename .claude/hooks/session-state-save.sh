#!/bin/bash
# PostToolUse (TodoWrite/Task) + Stop hook: Persist session state to file
# State survives compaction and session resume

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"

# Generate stable hash from project dir for global storage
PROJECT_HASH=$(echo -n "$PROJECT_DIR" | shasum -a 256 | cut -c1-12)
STATE_DIR="${TMPDIR:-/tmp}/jarvis-kit-sessions"
STATE_FILE="$STATE_DIR/$PROJECT_HASH.md"

mkdir -p "$STATE_DIR"

# Gather current state
BRANCH=$(git -C "$PROJECT_DIR" branch --show-current 2>/dev/null || echo "unknown")
TIMESTAMP=$(date '+%Y-%m-%d %H:%M')

# Find active plan
PLAN_FILE=$(find "$PROJECT_DIR/.claude/plans" -maxdepth 1 -name "*.md" -not -name "*.template*" -newer "$PROJECT_DIR/.claude/plans" -type f 2>/dev/null | head -1)
PLAN_NAME=""
if [ -n "$PLAN_FILE" ]; then
  PLAN_NAME=$(basename "$PLAN_FILE" .md)
fi

# Get recently modified files (last 30 min)
MODIFIED_FILES=$(find "$PROJECT_DIR/apps" "$PROJECT_DIR/infra" -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.py" -o -name "*.sh" 2>/dev/null | xargs stat -f "%m %N" 2>/dev/null | awk -v threshold=$(($(date +%s) - 1800)) '$1 > threshold {print $2}' | sed "s|$PROJECT_DIR/||" | head -20)

# Get uncommitted changes summary
GIT_STATUS=$(git -C "$PROJECT_DIR" diff --stat HEAD 2>/dev/null | tail -1)

# Write session state
cat > "$STATE_FILE" <<EOF
# Jarvis Kit Session State
**Last saved**: $TIMESTAMP
**Branch**: $BRANCH
**Plan**: ${PLAN_NAME:-none}
**Git status**: ${GIT_STATUS:-clean}

## Recently Modified Files
${MODIFIED_FILES:-none}
EOF

exit 0
