# [TICKET-ID] Feature Name

**Date**: YYYY-MM-DD
**Type**: Feature Implementation
**Status**: Planning
**Jira**: [TICKET-ID]

## Summary
2-3 sentences: what the feature does and its business value.

## Context Links
- **Jira Ticket**: TICKET-ID
- **Related Docs**: [docs/ files if any]
- **Dependencies**: [external systems, APIs, existing features]

## Requirements
### Functional
- [ ] Requirement 1
- [ ] Requirement 2

### Non-Functional
- [ ] Performance target
- [ ] Security requirement

## Architecture
```mermaid
[Component diagram showing data flow between FE → BE → AI-Services → Agentic]
```

### Key Components
- **Component 1**: Brief description
- **Component 2**: Brief description

### Data Models
- **Model 1**: Key fields
- **Model 2**: Key fields

### Cross-Repo Impact
| Repo | Changes |
|------|---------|
| FE | |
| BE | |
| AI-Services | |
| Agentic | |

## Implementation Phases

### Phase 1: [Name] (Est: X days)
**Scope**: Specific boundaries
**Tasks**:
1. [ ] Task 1 — file: `path/to/file`
2. [ ] Task 2 — file: `path/to/file`

**Acceptance Criteria**:
- [ ] Criteria 1
- [ ] Criteria 2

### Phase 2: [Name] (Est: X days)
[Repeat structure]

## Testing Strategy
- **Unit Tests**: Coverage targets
- **Integration Tests**: Cross-service interactions
- **E2E Tests**: Critical user flows
- **Quality Gates**: `pnpm quality:fe`, `pnpm quality:be`, etc.

## Risk Assessment
| Risk | Impact | Mitigation |
|------|--------|------------|
| Risk 1 | High | Strategy |

## Checklist
- [ ] All phases complete
- [ ] Quality gates pass in all affected repos
- [ ] Cross-repo DTO alignment verified
- [ ] Testing complete
- [ ] Code review passed
