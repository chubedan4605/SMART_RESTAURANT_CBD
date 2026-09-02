#!/bin/bash
# PreToolUse hook (Write only): Inject file naming guidance
# Encourages descriptive, self-documenting file names

cat <<'EOF'
{
  "hookSpecificOutput": {
    "hookEventName": "PreToolUse",
    "permissionDecision": "allow",
    "additionalContext": "[Naming] Use descriptive file names: kebab-case for JS/TS/Python/shell, PascalCase for React components/C#/Java. Avoid generic names like utils.ts, helpers.py, temp.js, misc.ts, common.ts. Names should be self-documenting for Grep/Glob search."
  }
}
EOF

exit 0
