# [TICKET-ID] Bug Fix

**Date**: YYYY-MM-DD
**Type**: Bug Fix
**Priority**: [Critical/High/Medium/Low]
**Jira**: [TICKET-ID]

## Summary
What's broken and its impact on users.

## Issue Analysis
### Symptoms
- Symptom 1
- Symptom 2

### Root Cause
Brief explanation of the underlying cause.

### Evidence
- **Logs**: Reference to log files
- **Error Messages**: Key error patterns
- **Affected Components**: List of impacted files/modules

## Context Links
- **Jira Ticket**: TICKET-ID
- **Related Issues**: [other tickets]
- **Recent Changes**: [relevant commits or PRs]

## Solution Design
### Approach
2-3 sentences: how to fix it.

### Changes Required
1. **File 1** (`path/to/file`): Brief change description
2. **File 2** (`path/to/file`): Brief change description

### Cross-Repo Impact
| Repo | Changes |
|------|---------|
| FE | |
| BE | |
| AI-Services | |
| Agentic | |

## Implementation Steps
1. [ ] Reproduce the bug
2. [ ] Step 1 — file: `path/to/file`
3. [ ] Step 2 — file: `path/to/file`
4. [ ] Run quality gates
5. [ ] Verify fix

## Verification
### Test Cases
- [ ] Fix works for the reported case
- [ ] Edge cases handled
- [ ] No regression in related features

### Rollback Plan
1. Revert commit: `git revert <hash>`
2. Restore previous behavior

## Checklist
- [ ] Bug reproduced
- [ ] Fix implemented
- [ ] Quality gates pass
- [ ] Regression tests added
- [ ] Code review passed
