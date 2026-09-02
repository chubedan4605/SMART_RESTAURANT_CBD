#!/bin/bash
# SubagentStart hook: Inject minimal Jarvis context when spawning subagents
# Provides ~200 tokens of deterministic context so subagents don't need full conversation

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"

BRANCH=$(git -C "$PROJECT_DIR" branch --show-current 2>/dev/null || echo "unknown")
TICKET_ID=""
if echo "$BRANCH" | grep -qE '^[A-Z]{2,10}-[0-9]+'; then
  TICKET_ID=$(echo "$BRANCH" | grep -oE '^[A-Z]{2,10}-[0-9]+')
fi

# Find active plan for current branch
PLAN_FILE=$(find "$PROJECT_DIR/.claude/plans" -maxdepth 1 -name "*${BRANCH}*" -type f 2>/dev/null | head -1)
PLAN_REF=""
[ -n "$PLAN_FILE" ] && PLAN_REF="Active plan: $(basename "$PLAN_FILE")"

CONTEXT="[Jarvis Kit Context]
Project: Jarvis Helpdesk monorepo (pnpm + Turborepo)
Branch: $BRANCH"

[ -n "$TICKET_ID" ] && CONTEXT="$CONTEXT
Ticket: $TICKET_ID"

[ -n "$PLAN_REF" ] && CONTEXT="$CONTEXT
$PLAN_REF"

CONTEXT="$CONTEXT
Reports path: .claude/plans/reports/
Rules: .claude/rules/development-rules.md
Workflow: .claude/rules/primary-workflow.md
Quality gates: pnpm quality:{fe|be|ai-services|agentic}
Status protocol: End with DONE | DONE_WITH_CONCERNS | BLOCKED | NEEDS_CONTEXT"

ESCAPED=$(echo "$CONTEXT" | jq -Rs .)
cat <<EOF
{
  "hookSpecificOutput": {
    "hookEventName": "SubagentStart",
    "additionalContext": $ESCAPED
  }
}
EOF

exit 0
