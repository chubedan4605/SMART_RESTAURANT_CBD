#!/bin/bash
# PreToolUse hook: Block access to heavy/generated directories
# Prevents wasted tokens reading node_modules, dist, .git, __pycache__, etc.
# Exit 0 = allow, Exit 2 = block

INPUT=$(cat)
TOOL_NAME=$(echo "$INPUT" | jq -r '.tool_name // empty')

# Directories that should never be read directly
BLOCKED_RE='(^|/)(node_modules|dist|build|\.next|\.nuxt|__pycache__|\.venv|venv|\.git|coverage|\.cache|\.turbo|\.parcel-cache)(/|$)'

extract_path() {
  case "$TOOL_NAME" in
    Read|Edit|Write)
      echo "$INPUT" | jq -r '.tool_input.file_path // empty'
      ;;
    Glob)
      echo "$INPUT" | jq -r '.tool_input.pattern // empty'
      ;;
    Grep)
      echo "$INPUT" | jq -r '.tool_input.path // empty'
      ;;
    Bash)
      CMD=$(echo "$INPUT" | jq -r '.tool_input.command // empty')

      # Allow build/install commands that reference these dirs indirectly
      if echo "$CMD" | grep -qE '^(npm|yarn|pnpm|npx|poetry|pip|uv|cargo|make|docker|go |turbo) '; then
        echo ""
        return
      fi
      # Allow commands with explicit exclusions
      if echo "$CMD" | grep -qE '(--ignore|--exclude|--skip|-not -path|--glob !|--prune)'; then
        echo ""
        return
      fi

      # Extract paths from common file-access commands
      echo "$CMD" | grep -oE '(node_modules|dist|build|\.next|__pycache__|\.venv|\.git|coverage|\.turbo)[^ ]*' | head -1
      ;;
    *)
      echo ""
      ;;
  esac
}

FILE_PATH=$(extract_path)
[ -z "$FILE_PATH" ] && exit 0

if echo "$FILE_PATH" | grep -qE "$BLOCKED_RE"; then
  DIR_NAME=$(echo "$FILE_PATH" | grep -oE '(node_modules|dist|build|\.next|\.nuxt|__pycache__|\.venv|venv|\.git|coverage|\.cache|\.turbo|\.parcel-cache)' | head -1)
  cat >&2 <<EOF

NOTE: This block prevents wasted context on generated/dependency files.

BLOCKED: Access to '${FILE_PATH}' denied
  Directory: ${DIR_NAME}
  Tool: ${TOOL_NAME}

  These directories contain generated/dependency code.
  Instead: use source code, package.json, or documentation.
  To allow a specific path, add it to .claude/settings.json permissions.

EOF
  exit 2
fi

exit 0
