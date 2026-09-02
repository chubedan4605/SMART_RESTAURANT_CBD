#!/bin/bash
# UserPromptSubmit hook: Auto-detect context + plan-gate + branch management
# Detects Slack links, Jira IDs, GitHub URLs, and nudges planning before implementation

INPUT=$(cat)
PROMPT=$(echo "$INPUT" | jq -r '.prompt // empty')

[ -z "$PROMPT" ] && exit 0

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"

HINTS=()

# ─── Slack links ────────────────────────────────────────────────
SLACK_LINKS=$(echo "$PROMPT" | grep -oE 'https://[a-zA-Z0-9-]+\.slack\.com/archives/[A-Z0-9]+/p[0-9]+(\?[^ ]*)?' || true)
if [ -n "$SLACK_LINKS" ]; then
  LINK_COUNT=$(echo "$SLACK_LINKS" | wc -l | tr -d ' ')
  HINTS+=("SLACK: ${LINK_COUNT} link(s) detected. Read thread via Slack MCP before responding.")
fi

# ─── Jira ticket IDs ───────────────────────────────────────────
JIRA_IDS=$(echo "$PROMPT" | grep -oE '[A-Z]{2,10}-[0-9]+' | sort -u || true)
if [ -n "$JIRA_IDS" ]; then
  ID_LIST=$(echo "$JIRA_IDS" | tr '\n' ', ' | sed 's/,$//')
  FIRST_TICKET=$(echo "$JIRA_IDS" | head -1)
  HINTS+=("JIRA: Ticket ${ID_LIST}. Fetch from Jira MCP to understand context.")

  # Branch management
  CURRENT_BRANCH=$(git -C "$PROJECT_DIR" branch --show-current 2>/dev/null || true)
  if [ -n "$CURRENT_BRANCH" ]; then
    if [ "$CURRENT_BRANCH" = "main" ] || [ "$CURRENT_BRANCH" = "master" ]; then
      if git -C "$PROJECT_DIR" show-ref --verify --quiet "refs/heads/$FIRST_TICKET" 2>/dev/null; then
        HINTS+=("GIT: On ${CURRENT_BRANCH} → git checkout ${FIRST_TICKET} (branch exists)")
      else
        HINTS+=("GIT: On ${CURRENT_BRANCH} → git pull origin main && git checkout -b ${FIRST_TICKET}")
      fi
    elif [ "$CURRENT_BRANCH" != "$FIRST_TICKET" ]; then
      HINTS+=("GIT: On branch '${CURRENT_BRANCH}' but ticket is ${FIRST_TICKET}. Ask user: switch or worktree?")
    fi
  fi
fi

# ─── GitHub PR/issue URLs ──────────────────────────────────────
GH_LINKS=$(echo "$PROMPT" | grep -oE 'https://github\.com/[^ ]+/(pull|issues)/[0-9]+' || true)
if [ -n "$GH_LINKS" ]; then
  HINTS+=("GITHUB: PR/issue link detected. Fetch via gh CLI before responding.")
fi

# ─── Plan gate: nudge planning for implementation requests ─────
IMPL_KEYWORDS=$(echo "$PROMPT" | grep -iE '(implement|build|create|add feature|develop|code|fix bug|refactor)' || true)
if [ -n "$IMPL_KEYWORDS" ]; then
  CURRENT_BRANCH=$(git -C "$PROJECT_DIR" branch --show-current 2>/dev/null || true)
  PLAN_EXISTS=$(find "$PROJECT_DIR/.claude/plans" -maxdepth 1 -name "*.md" -path "*${CURRENT_BRANCH}*" -type f 2>/dev/null | head -1)
  if [ -z "$PLAN_EXISTS" ] && [ -n "$CURRENT_BRANCH" ] && [ "$CURRENT_BRANCH" != "main" ]; then
    HINTS+=("PLAN: No plan found for branch '${CURRENT_BRANCH}'. For non-trivial tasks, consider: planner agent → plan file → then implement. Skip for small fixes.")
  fi
fi

# ─── Output ─────────────────────────────────────────────────────
if [ ${#HINTS[@]} -gt 0 ]; then
  CONTEXT=$(printf '%s\n' "${HINTS[@]}")
  ESCAPED=$(echo "$CONTEXT" | jq -Rs .)
  cat <<EOF
{
  "hookSpecificOutput": {
    "hookEventName": "UserPromptSubmit",
    "additionalContext": $ESCAPED
  }
}
EOF
fi

exit 0
