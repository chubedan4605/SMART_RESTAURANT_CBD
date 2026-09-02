---
name: bugbot-autofix
description: "Go into the GitHub PR for the current branch, find all unresolved review comments, verify each issue, and fix it. Use when the user wants to address PR review feedback automatically."
---

# Bugbot Autofix

Address all unresolved review comments on the current branch's PR.

## Steps

### Step 1 — Find the PR

Run `gh pr view --json number,url,headRefName` to get the PR for the current branch. If no PR exists, stop and tell the user.

Extract the owner and repo from the URL (e.g. `https://github.com/{owner}/{repo}/pull/123`).

### Step 2 — Fetch unresolved review comments

Use the GraphQL API to fetch all review threads, paginating until every thread and comment is collected:

```bash
gh api graphql -f query='
  query($cursor: String) {
    repository(owner: "{owner}", name: "{repo}") {
      pullRequest(number: {number}) {
        reviewThreads(first: 100, after: $cursor) {
          pageInfo { hasNextPage endCursor }
          nodes {
            id
            isResolved
            isOutdated
            comments(first: 100) {
              pageInfo { hasNextPage endCursor }
              nodes {
                id
                body
                path
                line
                author { login }
              }
            }
          }
        }
      }
    }
  }
'
```

**Pagination:** If `reviewThreads.pageInfo.hasNextPage` is true, re-run the query passing `endCursor` as `$cursor` and merge the results. Similarly, if any thread's `comments.pageInfo.hasNextPage` is true, paginate that thread's comments until all are fetched.

Only process threads where `isResolved` is `false` **and** `isOutdated` is `false`. Outdated threads refer to code that has since changed and should be skipped.

### Step 3 — Create a task list

Create a task for each unresolved comment so progress is visible. Each task should include the file path, line, and the reviewer's comment.

If unsure about a comment, or the reviewer's suggestion seems at odds with what the user has previously instructed, use the AskUserQuestion tool to get the user's opinion before proceeding.

### Step 4 — For each unresolved comment

1. **Read the file** at the path and line referenced by the comment.
2. **Understand the feedback** — what is the reviewer asking to change?
3. **Verify the issue** — confirm the problem the reviewer describes actually exists in the current code. If the code has already been fixed or the comment no longer applies, skip it and note why.
4. **Check impact with Serena** — Use `find_referencing_symbols` on the symbol being modified to identify all call sites. Ensures the fix doesn't break other consumers.
5. **Fix it** — make the minimal change that addresses the reviewer's feedback. Follow all project conventions and load any relevant domain skills before writing code:
   - FE changes (`apps/fe/`) → MUI `sx` prop, Zustand, React Query patterns
   - BE changes (`apps/be/`) → Express thin controllers, service layer
   - AI-Services changes (`apps/ai-services/`) → NestJS Module/Controller/Service
   - Agentic changes (`apps/agentic/`) → FastAPI, Pydantic DTOs, Celery patterns
6. **Mark the task complete.**

### Step 5 — Summary

After all comments are addressed, print a summary of what was fixed and what was skipped (with reasons).

## Rules

- Do NOT dismiss or resolve the review threads on GitHub — only fix the code. The reviewer should verify and resolve.
- Load domain skills as needed before making changes.
- Keep fixes focused on what the reviewer asked for. Do not use a review comment as an excuse to refactor unrelated surrounding code.
- If a comment is ambiguous, ask the user via AskUserQuestion rather than guessing.
- Do NOT commit automatically — let the user review the changes first.
- When fixing cross-repo issues, check if the change needs to propagate across the DTO chain (FE → BE → AI-Services → Agentic).
