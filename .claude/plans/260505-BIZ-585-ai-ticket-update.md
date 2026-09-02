# [BIZ-585] AI-assisted ticket information update

**Date**: 2026-05-05
**Type**: Feature Implementation
**Status**: Planning
**Jira**: BIZ-585
**Branch**: `BIZ-585`

## Summary

Add a manual "AI Update" button in the ticket detail panel that triggers an AI agent to gather full conversation + CRM context (parallel sub-agent fan-out) and autonomously apply updates to ticket fields, deal fields, ~~tag~~s, notes, and tasks. No HITL preview - agent applies directly via an explicit allowlist, with `DeleteTicket` excluded.

## Context Links

- **Jira**: BIZ-585
- **Reuse**: `orchestrate_with_subagents()`, `structured_predict()`, existing reader agent definitions, existing write tools
- **Mirror**: `apps/agentic/app/services/auto_response/pipeline.py::_step_update_ticket` for shape

## Architecture

```
FE TicketDetail (button near S~~tag~~eSelector @ L927)
  -> POST /tickets/:ticketID/ai-suggest-and-apply
       -> AI-Services proxy POST /ai-agents/tenants/:tenantId/tickets/:ticketID/ai-suggest-and-apply
            -> Agentic POST /jarvis-agent/ticket-update-and-apply
                 |- orchestrate_with_subagents()  [parallel readers]
                 |     - ticket_reader_definition
                 |     - customer_reader_definition (if customer_id)
                 |     - crm_reader_definition (if deal_id available)
                 |- structured_predict -> TicketUpdatePlan  (synthesis, NOT a sub-agent)
                 \- Apply step - direct tool calls via allowlist (autonomous, no HITL)
```

### Key Components

- **Ticket Assist Service** (`apps/agentic/app/services/ticket_assist/`): orchestration + synthesis + apply, modeled after `_step_update_ticket`.
- **TicketUpdatePlan** Pydantic schema: holds proposed mutations across ticket / deal / ~~tag~~s / notes / tasks (all fields optional).
- **Tool Allowlist Guard**: hard-coded set in service module that filters out any non-approved tool name; explicit `DeleteTicket` exclusion test.
- **BE foundation**: new internal endpoints for ticket-~~tag~~ association + delete-comment / delete-deal-note / delete-deal-task / remove-ticket-~~tag~~.

### Cross-Repo Impact

| Repo | Changes | Files |
|------|---------|-------|
| FE | "AI Update" button + handler + service call + i18n strings + invalidate ticket query on success | `apps/fe/src/components/Chat/ChatInfo/TicketDetail.js`, `apps/fe/src/service/TicketService.js`, `apps/fe/src/locales/{vi,en}/components.json` |
| BE | New internal endpoints (ticket-~~tag~~ CRUD, deletes), tenant ticket route for FE-facing button, new `TicketTag` model + migration, init-models associations | `src/components/internal/internal.route.js`, `src/components/internal/internal.controller.js`, `src/components/internal/crm.route.js`, `src/components/internal/crm.controller.js`, `src/components/ticket/ticket.route.js`, `src/components/ticket/ticket.controller.js`, `src/components/ticket/ticket.service.js`, `src/models/ticketTag.js` (NEW), `src/models/init-models.js`, `src/migrations/{ts}-create-ticket-~~tag~~.js` (NEW) |
| AI-Services | New proxy endpoint + DTO + AgenticService method | `src/modules/jarvis-agent/jarvis-agent.controller.ts`, `src/modules/jarvis-agent/jarvis-agent.service.ts`, `src/modules/jarvis-agent/dtos/ticket-assist.dto.ts` (NEW), `src/shared/modules/agentic/agentic.service.ts` |
| Agentic | New router endpoint, new service module, new tool entries in tools.json (6 tools), new schema | `app/api/routers/ticket_assist.py` (NEW), `app/services/ticket_assist/{__init__,service,models}.py` (NEW), `app/core/tools/internal_tools/tools.json`, `app/main.py` (router registration) |

---

## Phase 1: BE Foundation

**Goal**: All endpoints the agent will call must exist before agentic implementation.

### 1.1 Ticket-Tag association (NEW)

**UNKNOWN resolved by code read**: There is `Tag` and `CustomerTag` but **no `TicketTag` model or table**. We must create both.

Files to create:
- `apps/be/src/models/ticketTag.js` - Sequelize model: `ticketID` + `~~tag~~ID` composite PK, mirror `customerTag.js` shape, paranoid + timestamps, `tableName: 'TICKET_TAG'`.
- `apps/be/src/migrations/{ts}-create-ticket-~~tag~~.js` - `CREATE TABLE TICKET_TAG (ticketID, ~~tag~~ID, createdAt, updatedAt, deletedAt, PK(ticketID, ~~tag~~ID), FK ticketID -> TICKET, FK ~~tag~~ID -> TAGS)`.

Files to modify:
- `apps/be/src/models/init-models.js` - register `TicketTag`, add `Ticket.belongsToMany(Tag, { through: TicketTag })` and reverse + direct `belongsTo` links (mirror lines 301-310 for CustomerTag).

### 1.2 Internal endpoints for the agent (called by agentic via `/api/v1/internal/*`)

Modify `apps/be/src/components/internal/internal.route.js`:
```js
router.post('/ticket/~~tag~~/add',    writeGuard, InternalController.addTicketTag);
router.post('/ticket/~~tag~~/remove', writeGuard, InternalController.removeTicketTag);
router.delete('/ticket/comment/:commentID', writeGuard, InternalController.deleteTicketComment);
router.get('/~~tag~~s', InternalController.listTags); // see UNKNOWN-2
```

Modify `apps/be/src/components/internal/crm.route.js`:
```js
router.delete('/deals/task/:taskID', writeGuard, CrmController.deleteDealTask);
router.delete('/deals/note/:noteID', writeGuard, CrmController.deleteDealNote);
```

Add corresponding controllers + thin service calls. Each controller MUST validate tenant isolation (`resource.tenantID === req.user.tenantID || req.headers['x-tenant-id']`) - model after `comment.controller.js::deleteComment` (lines 269-305).

### 1.3 FE-facing tenant endpoint (button proxy entry)

Modify `apps/be/src/components/ticket/ticket.route.js`:
```js
ticketRoute.post('/:ticketID/ai-suggest-and-apply', TicketController.aiSuggestAndApply);
```

Controller: thin - extract `ticketID`, `tenantID`, `customerID`, `chatRoomID` from ticket, POST payload to AI-Services `/ai-agents/tenants/:tenantId/tickets/:ticketID/ai-suggest-and-apply`, forward `x-access-token`, return result.

### Acceptance Signal

- `npm run migrate:run` creates `TICKET_TAG` table.
- `curl -X POST -H "X-Secret-Key: ..." -H "X-Tenant-ID: ..." /api/v1/internal/ticket/~~tag~~/add -d '{"ticketID":"...","~~tag~~ID":"..."}'` returns 200.
- All 6 new internal endpoints respond with proper 401/403 when secret key / tenant scope fail.
- `pnpm quality:be` passes.

---

## Phase 2: Agentic - tools, service, router

### 2.1 New tool entries in `tools.json`

Add 6 entries. Schema follows existing patterns (path/body params, snake_case keys, `apiName` for camelCase API):

```jsonc
"AddTicketTag": {
  "endpoint": "/ticket/~~tag~~/add", "method": "POST",
  "description": "Add a ~~tag~~ to a ticket. Use to categorize tickets by topic/type.",
  "invalidates": ["GetTicketDetails"],
  "bodyParams": {
    "ticket_id": {"type": "string", "apiName": "ticketID", "description": "Ticket ID"},
    "~~tag~~_id":    {"type": "string", "apiName": "~~tag~~ID",    "description": "Tag ID (from ListTags)"}
  }
},
"RemoveTicketTag": {
  "endpoint": "/ticket/~~tag~~/remove", "method": "POST",
  "description": "Remove a ~~tag~~ from a ticket.",
  "invalidates": ["GetTicketDetails"],
  "bodyParams": {
    "ticket_id": {"type": "string", "apiName": "ticketID"},
    "~~tag~~_id":    {"type": "string", "apiName": "~~tag~~ID"}
  }
},
"ListTags": {
  "endpoint": "/~~tag~~s", "method": "GET", "cacheTtl": 600,
  "description": "List all ~~tag~~s for the tenant. Use BEFORE AddTicketTag to discover existing ~~tag~~ IDs."
},
"DeleteInternalNote": {
  "endpoint": "/ticket/comment/{comment_id}", "method": "DELETE",
  "description": "Delete an internal note (comment) from a ticket.",
  "invalidates": ["GetTicketMessages"],
  "pathParams": {"comment_id": {"type": "string"}}
},
"DeleteDealTask": {
  "endpoint": "/crm/deals/task/{task_id}", "method": "DELETE",
  "description": "Delete a task from a deal.",
  "invalidates": ["GetDealCompleteness"],
  "pathParams": {"task_id": {"type": "string"}}
},
"DeleteDealNote": {
  "endpoint": "/crm/deals/note/{note_id}", "method": "DELETE",
  "description": "Delete a note from a deal.",
  "pathParams": {"note_id": {"type": "string"}}
}
```

### 2.2 New service: `apps/agentic/app/services/ticket_assist/`

**Files to create**:

`models.py`:
```python
class TicketUpdatePlan(BaseModel):
    # ticket
    status: str | None = None             # OPEN/PENDING/RESOLVED/...
    priority: str | None = None           # LOW/MEDIUM/HIGH
    assignee_id: str | None = None
    body: str | None = None               # ticket summary/description
    detected_intent: str | None = None
    internal_note: str | None = None
    escalation: EscalationPlan | None = None
    add_~~tag~~_ids: list[str] = []
    remove_~~tag~~_ids: list[str] = []
    # deal (optional - only when crm_specialist returned data)
    deal_id: str | None = None
    deal_s~~tag~~e_id: str | None = None
    deal_field_updates: list[DealFieldUpdate] = []  # field, value
    deal_assignee_id: str | None = None
    deal_note: str | None = None
    new_deal_tasks: list[NewDealTask] = []
    delete_deal_task_ids: list[str] = []
    delete_deal_note_ids: list[str] = []
    delete_internal_note_ids: list[str] = []
    rationale: str = Field(..., description="One-paragraph reason summarising the changes.")

class TicketAssistResult(BaseModel):
    applied: list[dict]   # [{tool, args, status}]
    skipped: list[dict]   # [{tool, reason}]
    rationale: str
```

`service.py` (mirror `_step_update_ticket` shape):
```python
ALLOWED_TOOLS: frozenset[str] = frozenset({
    "update_ticket", "assign_ticket", "add_internal_note", "escalate_ticket",
    "add_ticket_~~tag~~", "remove_ticket_~~tag~~", "delete_internal_note",
    "move_deal_s~~tag~~e", "update_deal_field", "assign_deal", "add_deal_note",
    "create_deal_task", "delete_deal_task", "delete_deal_note",
})
# DeleteTicket explicitly NOT in allowlist - guard test asserts this.

async def run_ticket_assist(
    tenant_id: str, ticket_id: str, customer_id: str | None,
    chat_room_id: str | None, agent_config: dict, access_token: str | None,
) -> TicketAssistResult:
    # 1. Construct readers (ticket_reader, customer_reader, crm_reader)
    # 2. await orchestrate_with_subagents(intent="Update ticket info...", agents=[...])
    # 3. structured_predict(TicketUpdatePlan, messages=[system, context_block])
    # 4. apply_plan(plan, client, tool_context)  - direct tool calls, gather results
    # 5. return TicketAssistResult
```

`apply_plan()` walks the plan, looks up each tool via `create_built_tool_from_config`, checks `tool_name in ALLOWED_TOOLS` (raise if not), executes with `asyncio.gather` per group:
- Group A (read-modify-write conflicts): ticket update / assign / escalate - serial.
- Group B (independent): ~~tag~~ adds, ~~tag~~ removes, comment deletes - parallel.
- Group C (deal): s~~tag~~e move, field updates, note adds, task creates/deletes - serial within deal_id.

### 2.3 New router: `apps/agentic/app/api/routers/ticket_assist.py`

```python
@router.post("/jarvis-agent/ticket-update-and-apply", response_model=TicketAssistResult)
async def ticket_update_and_apply(
    schema: TicketAssistRequest,
    x_access_token: str | None = Header(None, alias="X-Access-Token"),
):
    return await run_ticket_assist(...)
```

Register in `app/main.py` next to existing `jarvis_agent_router`.

`TicketAssistRequest` schema (`app/schemas/ticket_assist/request.py`):
```python
class TicketAssistRequest(BaseModel):
    tenant_id: str
    ticket_id: str
    customer_id: str | None = None
    chat_room_id: str | None = None
    agent_config: dict[str, Any] = {}
    topics: list[Any] | None = None  # optional, mirror auto_response
```

### Acceptance Signal

- Unit test: `pytest apps/agentic/tests/services/ticket_assist/test_allowlist.py` asserts `"delete_ticket" not in ALLOWED_TOOLS` and unknown tool name raises.
- Integration test against mocked `InternalApiClient` returns a `TicketAssistResult` with at least 1 applied tool when fixtures supply ticket/customer/deal data.
- `pnpm quality:agentic` clean.

---

## Phase 3: AI-Services Proxy

### Files to create
- `apps/ai-services/src/modules/jarvis-agent/dtos/ticket-assist.dto.ts`:
  ```ts
  export class TicketAssistDto {
    @IsString() @IsOptional() customerId?: string;
    @IsString() @IsOptional() chatRoomId?: string;
  }
  ```

### Files to modify
- `apps/ai-services/src/modules/jarvis-agent/jarvis-agent.controller.ts` - add:
  ```ts
  @Post('tenants/:tenantId/tickets/:ticketId/ai-suggest-and-apply')
  async ticketAssist(
    @Param('tenantId') tenantId: string,
    @Param('ticketId') ticketId: string,
    @Body() dto: TicketAssistDto,
    @Headers('x-access-token') accessToken?: string,
  ) { return this.jarvisAgentService.ticketAssist(tenantId, ticketId, dto, accessToken); }
  ```
- `apps/ai-services/src/modules/jarvis-agent/jarvis-agent.service.ts` - `ticketAssist()` reuses `getAgentContext(tenantId)` to source `topics + agentConfig`, then calls `agenticService.ticketAssist(...)`.
- `apps/ai-services/src/shared/modules/agentic/agentic.service.ts` - `ticketAssist(body)` - POST to `${agenticUrl}/jarvis-agent/ticket-update-and-apply` with `X-Access-Token` header.

### Acceptance Signal
- Swagger at `/api-docs` shows the new endpoint.
- `pnpm quality:ai-services` passes.

---

## Phase 4: FE Integration

### Files to modify
- `apps/fe/src/service/TicketService.js` - add:
  ```js
  export const aiSuggestAndApplyTicket = (ticketID, payload) =>
    axiosClient.post(`/tickets/${ticketID}/ai-suggest-and-apply`, payload);
  ```
- `apps/fe/src/components/Chat/ChatInfo/TicketDetail.js` - insert a new `Box` block right BEFORE the `S~~tag~~eSelector` block (around line 897, before `{/* customer classification ... */}`):
  ```jsx
  <Box sx={{ display: "flex", justifyContent: "flex-end", width: "100%" }}>
    <PrimaryButton
      onClick={handleAiUpdate}
      disabled={isAiUpdating}
      startIcon={isAiUpdating ? <CircularProgress size={14} /> : <i className="bi bi-magic" />}
    >
      {t("ticketDetail.aiUpdate")}
    </PrimaryButton>
  </Box>
  ```
- `handleAiUpdate`: call `aiSuggestAndApplyTicket(ticket.ticketID, { customerId: ticket.customerID, chatRoomId: currentChatRoom?.chatRoomID })`, on success call `updateTicketInfo(...)` (existing `useChatAction` hook) to refresh UI + show toast `t("ticketDetail.aiUpdateApplied", { count: result.applied.length })`. On error, toast.
- States: `const [isAiUpdating, setIsAiUpdating] = useState(false);`
- i18n: add `aiUpdate`, `aiUpdateApplied`, `aiUpdateFailed` keys to `vi/components.json` and `en/components.json`.

### Acceptance Signal
- Click button -> loading spinner -> toast.
- Ticket panel re-renders status / priority / assignee / ~~tag~~s reflecting agent's changes.
- `pnpm quality:fe` passes.

---

## Phase 5: Quality Gates + Review

1. Run `pnpm quality:be` after Phase 1 (migration sanity, lint, format).
2. Run `pnpm quality:agentic` after Phase 2 (pytest + ruff).
3. Run `pnpm quality:ai-services` after Phase 3.
4. Run `pnpm quality:fe` after Phase 4.
5. Manual smoke (with `browser-testing` skill):
   - Open a ticket with conversation history.
   - Click "AI Update" -> wait for spinner -> verify status/priority/~~tag~~s/notes appear.
   - Verify `ticket-history` records the agent-driven changes.
6. Delegate to `code-reviewer` agent - focus areas:
   - Allowlist enforcement is tight (`DeleteTicket` impossible to call).
   - Tenant isolation in ALL new BE endpoints.
   - No race conditions when multiple users click button on same ticket (idempotent? agent overwrites prior values - acceptable for v1, document in code comment).

---

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Agent picks wrong ~~tag~~ IDs (hallucinates) | Med | Agent must call `ListTags` first; tools.json description spells this out; BE returns 404 if ~~tag~~ not found. |
| Agent calls excluded tool via tool_name string | High | Allowlist `frozenset` in service module, pytest asserts exclusion. `DeleteTicket` is also NOT registered in `tools.json` at all. |
| Auto-response background updater races with manual AI Update on the same ticket | Med | Last write wins (acceptable v1). Document in `service.py` docstring. |
| `_step_update_ticket` 10s defer was for race with auto-reply send - irrelevant here (manual trigger, no concurrent reply) | Low | No defer needed. State this in docstring. |
| Tag table missing in prod | High | Migration is reviewed, run s~~tag~~ed; rollback = drop table (no data dependency yet). |
| Plan has too many fields -> LLM JSON truncation | Med | Use `RetryStrategy.FALLBACK_MODEL` like `_step_update_ticket`; field count similar to TicketUpdateOutput today. |
| Apply takes long (sequential write tools) | Med | Group parallel-safe writes (~~tag~~ adds, comment deletes) via `asyncio.gather`; FE shows spinner + 30s timeout. |

## Testing Strategy

- **Agentic unit tests**: allowlist guard, plan parsing, apply_plan dispatch (mock client).
- **Agentic integration test**: `tests/services/ticket_assist/test_e2e.py` with mocked InternalApiClient, asserts read sub-agents fire, plan synthesised, allowed tools called, excluded tools rejected.
- **BE unit tests**: ~~tag~~-add/remove + delete endpoints - tenant scope, missing-resource 404.
- **AI-Services**: shape-only test (proxy passthrough).
- **FE**: snapshot test on TicketDetail with the new button; manual smoke for the round-trip.

## Checklist

- [ ] Phase 1: BE foundation (model, migration, internal endpoints, FE-facing endpoint)
- [ ] Phase 2: Agentic tools, service, router, allowlist tested
- [ ] Phase 3: AI-Services proxy + DTO
- [ ] Phase 4: FE button + handler + i18n
- [ ] All quality gates green
- [ ] Code review passed
- [ ] Manual smoke on s~~tag~~ing

---

## UNKNOWNS / Open Questions

1. **`TICKET_TAG` table does not exist** - confirmed by reading `init-models.js` (only `Customer.hasMany(CustomerTag)`, no `Ticket.hasMany(TicketTag)`). Phase 1.1 designs a new migration; needs DBA review on s~~tag~~ing before prod.
2. **`/~~tag~~s` (LIST ~~tag~~s) is currently auth-gated under `/~~tag~~s`, not behind `/api/v1/internal/*`.** Either (a) wire a duplicate read route under `/internal/~~tag~~s` for the secret-key auth path, or (b) re-use the auth-gated route via the SSO `x-access-token` header that InternalApiClient already forwards. **Recommendation: (a)** - explicit endpoint avoids surprise auth dependency. Adds one more controller line in Phase 1.2.
3. **Deal task/note IDs** - agent needs to know existing IDs to delete them. `crm_reader_definition` exposes `get_customer_deals` + `get_deal_completeness` but not "list deal tasks" or "list deal notes". For v1, delete-tools are documented as available but the synthesis prompt should prefer create-over-delete. If real delete usage is needed, we'd add `ListDealTasks` / `ListDealNotes` GET tools - flag out of v1 scope unless required.
4. **Existing `deleteS~~tag~~eTaskTemplate` (in `deal-task.controller.js`) is for STAGE TASK TEMPLATES, not deal task instances.** A separate `deleteDealTask` controller in `crm.controller.js` is needed (operates on the `DEAL_TASK` table - verify exact model name during Phase 1).
5. **`DeleteTicket` is not currently in `tools.json` at all.** Allowlist defence is belt-and-suspenders - the registry won't surface it even if the LLM hallucinates the name.
