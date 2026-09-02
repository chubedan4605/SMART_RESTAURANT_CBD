#!/bin/bash
# Play sound notification when Claude finishes responding
# macOS only — uses built-in system sounds

INPUT=$(cat)
STOP_HOOK_ACTIVE=$(echo "$INPUT" | jq -r '.stop_hook_active // false')

# Prevent infinite loops
if [ "$STOP_HOOK_ACTIVE" = "true" ]; then
  exit 0
fi

# Play macOS system sound (non-blocking)
if [ "$(uname)" = "Darwin" ]; then
  # Glass sound — subtle, not annoying
  afplay /System/Library/Sounds/Glass.aiff &
fi

exit 0
