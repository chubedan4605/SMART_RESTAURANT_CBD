#!/bin/bash
# Auto-format files after Write/Edit operations

# Get file path from stdin (Claude Code passes tool input as JSON)
FILE_PATH=$(jq -r '.tool_input.file_path // empty' 2>/dev/null || echo "")

if [ -z "$FILE_PATH" ]; then
  # No file path, skip
  exit 0
fi

# Find prettier: prefer local node_modules, fallback to global
find_prettier() {
  # Check common local locations relative to the file
  local dir="$1"
  while [ "$dir" != "/" ]; do
    if [ -x "$dir/node_modules/.bin/prettier" ]; then
      echo "$dir/node_modules/.bin/prettier"
      return
    fi
    dir="$(dirname "$dir")"
  done
  # Fallback to global
  if command -v prettier &> /dev/null; then
    echo "prettier"
    return
  fi
  echo ""
}

# Determine file type and run appropriate formatter
case "$FILE_PATH" in
  *.ts|*.tsx|*.js|*.jsx|*.json|*.css|*.scss)
    # JavaScript/TypeScript/CSS - use prettier
    PRETTIER=$(find_prettier "$(dirname "$FILE_PATH")")
    if [ -n "$PRETTIER" ]; then
      $PRETTIER --write "$FILE_PATH" 2>/dev/null || true
    fi
    ;;
  *.py)
    # Python - use ruff if available
    if command -v ruff &> /dev/null; then
      ruff format "$FILE_PATH" 2>/dev/null || true
    fi
    ;;
  *.sh)
    # Shell - use shfmt if available
    if command -v shfmt &> /dev/null; then
      shfmt -w "$FILE_PATH" 2>/dev/null || true
    fi
    ;;
esac

# Always exit 0 (don't block on formatting failures)
exit 0
