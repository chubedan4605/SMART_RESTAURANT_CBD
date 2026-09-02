# Story Point Reference Guide

## Fibonacci Scale for Jarvis Helpdesk

| SP | Effort | Typical Scope | Example |
|----|--------|--------------|---------|
| 1 | Trivial | Single-line config change, copy fix, env var update | Fix typo in error message |
| 2 | Small | Single file change, straightforward logic | Add a new field to an existing API response |
| 3 | Medium-small | 2-3 files in one repo, clear pattern to follow | Add a new filter to ticket list page |
| 5 | Medium | Multiple files across 1-2 repos, some design needed | New API endpoint with FE integration |
| 8 | Large | Cross-repo changes (3+ repos), new patterns or services | New AI feature (agentic pipeline + API + FE) |
| 13 | Very large | Architectural change, new infrastructure, multi-week | New channel integration end-to-end |
| 21 | Epic-scale | Should be broken down into smaller tickets | Full module rewrite |

## Factors That Increase Points

- **Cross-repo changes**: Each additional repo adds ~2 SP of coordination overhead
- **Database migrations**: +1-2 SP for schema changes (rollback risk, data migration)
- **New Celery tasks**: +1-2 SP (field extraction pitfall, callback wiring)
- **SSE events**: +1 SP (FE subscription, BE broadcast, testing)
- **Third-party API integration**: +2-3 SP (auth, rate limits, error handling)
- **UI complexity**: +1-3 SP depending on custom components vs MUI standard

## Factors That Decrease Points

- **Existing pattern**: If a nearly identical feature exists, follow the pattern (-1-2 SP)
- **Single-repo isolated change**: No cross-repo coordination needed
- **Well-defined API contract**: No ambiguity in what to build
