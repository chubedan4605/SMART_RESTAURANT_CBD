## IA#1 — Feature specification · rubric

CSC13114 · individual assignment · 3% of the course · 100 points

Feature to specify: split the bill at a table, in smart-restaurant. Hand in three files: spec.md, questions.md (the list you received), and spec-revised.md.

## What is scored

| # | Criterion | Points |
| --- | --- | --- |
| 1 | Contract | 25 |
| 2 | Acceptance criteria | 25 |
| 3 | Edge cases and non-goals | 20 |
| 4 | Implementability — the | 20 |
|   | question list |   |
| 5 | Revision | 10 |

## 1. Contract — 25 points

| Points | What it looks like |
| --- | --- |
| 21–25 | Endpoints, request and response payloads, |
|   | and status codes are all concrete. Error |
|   | responses have a named shape. Someone |
|   | could write the client without asking you. |
| 13–20 | The happy path is precise; error responses |
|   | are vague or partly missing. |
| 5–12 | Prose only — "the API returns the shares" — |
|   | no payloads, no codes. |
| 0–4 | No contract section. |


## 2. Acceptance criteria — 25 points

| Points | What it looks like |
| --- | --- |
| 21–25 | Every criterion names concrete values and |
|   | can be turned into a test with no further |
|   | decisions. Covers at least: the split arithmetic, |
|   | one failure path, one concurrency case. |
| 13–20 | Most criteria are runnable; one or two are |
|   | wishes ("works correctly"). |
| 5–12 | Criteria are restatements of the goal. |
| 0–4 | None, or none that can fail. |

## 3. Edge cases and non-goals — 20 points

| Points | What it looks like |
| --- | --- |
| 17–20 | Addresses at least four of the five thin places |
|   | (empty state, partial failure, permissions, |
|   | concurrency and duplicates, limits) and has |
|   | an explicit non-goals section. |
| 11–16 | Two or three of them, or non-goals are |
|   | implied rather than written. |
| 4–10 | Happy path only, with one edge case |
|   | mentioned in passing. |
| 0–3 | Happy path only. |

## 4. Implementability — 20 points

Scored from the question list your implementer wrote down, weighted by severity. A question that changes behaviour (who pays the rounding remainder) counts more than a question about naming.

| Points | What it looks like |
| --- | --- |
| 17–20 | No question that changes behaviour. The |
|   | implementation matches what you intended. |


| Points | What it looks like |
| --- | --- |
| 11–16 | One or two behaviour questions; the |
|   | implementer guessed and guessed close. |
| 4–10 | Three or more behaviour questions, or the |
|   | implementation diverges visibly from your |
|   | intent. |
| 0–3 | The implementer could not proceed from the |
|   | spec alone. |

## 5. Revision — 10 points

| Points | What it looks like |
| --- | --- |
| 9–10 | Every question is answered in the revised |
|   | spec, and the changes are visible. |
| 5–8 | Some questions answered; others ignored |
|   | without a reason. |
| 1–4 | Cosmetic edits only. |
| 0 | No revision submitted. |

## How to submit

One zip file, named after your student ID and the total you give yourself:

- \- individual work — <StudentID>_<total>.zip, for example 23120001_82.zip

- \- group work — <StudentID1>-<StudentID2>-<StudentID3>_<total>.zip, IDs in ascending order, for example 23120001-23120042-23120117_75.zip

The zip must contain SELF_ASSESSMENT_REPORT.md: one row per criterion in this rubric, the marks you claim, and evidence pointing at a file, a section, a commit or a test name — plus a short what I did not manage. The total in that table is the number in the file name. Template on Classroom.

A wrong file name costs no marks but delays your result — the grading script matches submissions to the class list by that name.


## Honesty adjustment

Your self-assessment is compared with the mark you actually earn. The gap is your total − the mark, on the same 100-point scale.

| Gap | Adjustment |
| --- | --- |
| within ±10 | none — this is normal calibration |
| +11 to +20 | −3 |
| +21 to +30 | −6 |
| more than +30 | −10 |
| −21 or worse | −3 — read the rubric before you score |
|   | yourself down |
| no SELF_ASSESSMENT_REPORT.md | −10, and the file-name total is ignored |

A criterion you claim with no evidence line counts as claimed-and-not-done for this comparison. The adjustment never takes a submission below 0.

Scoring yourself honestly low costs you nothing inside ±10. Claiming marks you did not earn costs more than the marks would have been worth.

## Notes

- \- A long spec is not a better spec. One well-aimed page scores higher than four vague ones.

- \- You may use an assistant to draft or review the spec. Say so in AI-LOG.md; it costs no marks. What costs marks is a spec you cannot defend.

- \- The spec you hand over is the one that gets implemented. Fix it before you submit, not after you see what came back.
