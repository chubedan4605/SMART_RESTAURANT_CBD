#!/usr/bin/env python3
"""
Analyze GCP Cloud Logging entries exported by observability-mcp.

Usage:
    python3 analyze-log-entries.py <log-entries-file.txt>

Input: JSON file produced by mcp__observability-mcp__list_log_entries
       (format: [{"type": "text", "text": "<JSON array of log entries>"}])

Output: Grouped error summary by service, context, and message frequency.
"""

import collections
import json
import re
import sys


UUID_PATTERN = re.compile(
    r"[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}"
)
STATUS_PATTERN = re.compile(r"status=\d+")
SERVICE_PATTERN = re.compile(r'"service_name":\s*"([^"]+)"')
CONTEXT_PATTERN = re.compile(r'"context":\s*"([^"]+)"')
JSON_MSG_PATTERN = re.compile(r'"message":\s*"([^"]+)"')
TEXT_PAYLOAD_PATTERN = re.compile(r'"textPayload":\s*"([^"]{1,300})')
TIMESTAMP_PATTERN = re.compile(r'"timestamp":\s*"([^"]+)"')
SEVERITY_PATTERN = re.compile(r'"severity":\s*"([^"]+)"')


def normalize_message(msg: str) -> str:
    """Remove UUIDs and status codes to group similar messages."""
    msg = UUID_PATTERN.sub("<UUID>", msg)
    msg = STATUS_PATTERN.sub("status=NNN", msg)
    return msg[:150]


def analyze(filepath: str) -> None:
    with open(filepath, "r") as f:
        raw = f.read()

    outer = json.loads(raw)
    text_str = outer[0]["text"]

    # Extract fields via regex (handles truncated JSON gracefully)
    messages = JSON_MSG_PATTERN.findall(text_str)
    text_messages = TEXT_PAYLOAD_PATTERN.findall(text_str)
    services = SERVICE_PATTERN.findall(text_str)
    contexts = CONTEXT_PATTERN.findall(text_str)
    timestamps = TIMESTAMP_PATTERN.findall(text_str)
    severities = SEVERITY_PATTERN.findall(text_str)

    # Count by service
    svc_counter = collections.Counter(services)

    # Count by context
    ctx_counter = collections.Counter(contexts)

    # Count by normalized message
    msg_counter = collections.Counter()
    for m in messages:
        msg_counter[normalize_message(m)] += 1

    # Count textPayload messages
    text_counter = collections.Counter()
    for m in text_messages:
        text_counter[normalize_message(m)] += 1

    # Count by severity
    sev_counter = collections.Counter(severities)

    # Time range
    time_range = ""
    if timestamps:
        time_range = f"{timestamps[-1]} to {timestamps[0]}"

    # Output
    print(f"Total jsonPayload errors: {len(messages)}")
    print(f"Total textPayload errors: {len(text_messages)}")
    if time_range:
        print(f"Time range: {time_range}")
    print()

    print("=== BY SEVERITY ===")
    for sev, cnt in sev_counter.most_common():
        print(f"  {sev}: {cnt}")
    print()

    print("=== BY SERVICE ===")
    for svc, cnt in svc_counter.most_common():
        print(f"  {svc}: {cnt} errors")
    print()

    print("=== BY CONTEXT ===")
    for ctx, cnt in ctx_counter.most_common():
        print(f"  {ctx}: {cnt} errors")
    print()

    print("=== TOP ERROR MESSAGES (jsonPayload) ===")
    for msg, cnt in msg_counter.most_common(20):
        print(f"  [{cnt}x] {msg}")
        print()

    if text_counter:
        print("=== TOP ERROR MESSAGES (textPayload) ===")
        for msg, cnt in text_counter.most_common(20):
            print(f"  [{cnt}x] {msg}")
            print()


if __name__ == "__main__":
    if len(sys.argv) != 2:
        print(f"Usage: {sys.argv[0]} <log-entries-file.txt>")
        sys.exit(1)
    analyze(sys.argv[1])
