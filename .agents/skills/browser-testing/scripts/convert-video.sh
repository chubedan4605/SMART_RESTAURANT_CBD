#!/bin/bash
# Convert .webm video to .mp4 using ffmpeg
# Usage: ./convert-video.sh <input.webm> [output.mp4]

set -e

INPUT="$1"
OUTPUT="${2:-${INPUT%.webm}.mp4}"

if [ -z "$INPUT" ]; then
  echo "Usage: ./convert-video.sh <input.webm> [output.mp4]"
  exit 1
fi

if ! command -v ffmpeg &>/dev/null; then
  echo "ffmpeg not found. Install with: brew install ffmpeg"
  exit 1
fi

echo "Converting: $INPUT -> $OUTPUT"
ffmpeg -i "$INPUT" -c:v libx264 -preset fast -crf 22 -an "$OUTPUT" -y -loglevel warning
echo "Done: $OUTPUT"
