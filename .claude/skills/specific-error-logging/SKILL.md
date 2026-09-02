---
name: specific-error-logging
description: Improve vague or generic error logging so console/log output is concrete, actionable, and preserves diagnostic context. Use when Codex is asked to fix errors, improve debugging output, replace generic console.error/log messages, add catch-block logging, improve API/service/job error handling, or make frontend/backend failures easier to diagnose without exposing sensitive data.
---

# Specific Error Logging

## Goal

Make every logged error answer: what failed, where it failed, which operation/input context matters, and what the original error was. Prefer narrow, actionable logs over generic messages like `console.error("Error:", error)` or `console.error("Something went wrong")`.

## Workflow

1. Find the failure boundary: UI action, API request, service call, database query, background job, queue task, or external integration.
2. Log the operation name and stable identifiers needed to reproduce the failure.
3. Preserve the original error object so stack traces and error causes are not lost.
4. Add only safe context. Never log secrets, tokens, passwords, raw authorization headers, full PII payloads, or large request/response bodies.
5. Keep user-facing messages separate from developer logs. User copy may be friendly; console/server logs must be diagnostic.
6. Verify every `catch` either handles the error intentionally or logs/propagates it with useful context.

## Log Shape

Prefer structured objects when the existing codebase supports them:

```ts
logger.error("Failed to sync Google Drive document", {
  documentId,
  workspaceId,
  attempt,
  error,
});
```

For browser console logs, use a specific message plus a context object:

```ts
console.error("Failed to load conversation messages", {
  conversationId,
  inboxId,
  error,
});
```

If the codebase only accepts string logs, include the operation and identifiers, then pass the error as a separate argument:

```ts
console.error(`Failed to fetch ticket ${ticketId}`, error);
```

## Required Details

Include:

- Operation or component name: `Failed to create ticket`, `Failed to parse upload CSV`, `Failed to refresh auth session`
- Relevant safe identifiers: `ticketId`, `userId`, `workspaceId`, `integrationId`, `requestId`, `jobId`
- External dependency when applicable: provider name, endpoint name, queue name, table/collection name
- Attempt/retry state when applicable
- Original error object

Avoid:

- Generic labels: `Error`, `API error`, `Failed`, `Something went wrong`
- Swallowing errors after logging unless the fallback behavior is deliberate
- Replacing the error object with only `error.message`
- Logging raw payloads, credentials, headers, cookies, access tokens, refresh tokens, API keys, or full uploaded files

## Error Normalization

When the runtime may throw non-`Error` values, normalize only for metadata while preserving the raw value:

```ts
const message = error instanceof Error ? error.message : String(error);
console.error("Failed to import contacts", {
  workspaceId,
  message,
  error,
});
```

Use existing project utilities for error serialization or logger metadata if present. Do not invent a new logging abstraction unless the surrounding code already has no suitable pattern and multiple call sites need the same handling.

## Frontend Guidance

- Include the user action or UI surface: `Failed to submit ticket form`, `Failed to save inbox settings`.
- Include safe route/entity context.
- Keep toast/dialog text user-friendly, but log the technical failure separately.
- In React Query or async handlers, log inside `onError` or the nearest handler with access to useful IDs.

## Backend Guidance

- Prefer the project's logger over `console` when one exists.
- Include request/job correlation IDs if available.
- For API handlers, log route-level context and rethrow/return the existing error response pattern.
- For integrations, include provider, operation, status code, request ID from provider headers, and safe entity IDs.
- For database failures, include operation and table/model/collection, not raw SQL with interpolated sensitive values.

## Review Checklist

Before finishing, scan changed files for:

- `console.error("Error"` or similarly generic messages
- `catch (error) {}` or catches that only return `null`, `false`, or an empty fallback
- Logs that omit the original `error`
- Logs that expose secrets or large raw payloads
- New logging style that conflicts with the local logger conventions
