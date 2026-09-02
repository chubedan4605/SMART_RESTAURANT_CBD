# BIZ-586 — CRM Daily Briefing — CS role MVP

**Jira**: https://jarvisbiz.atlassian.net/browse/BIZ-586
**Branch**: `BIZ-586`

## Goal

When a CS user opens the CRM page (`/stages`), surface an AI-generated **Daily Briefing** at the top: 3 cards highlighting deals that need their attention today (HOT / OVERDUE / CLOSING SOON), each with a one-click CTA. Cached for 2 hours per user; manually refreshable.

## Non-goals (separate tickets)

- Admin variant (pipeline health, team perf, forecast)
- Streaming SSE / progressive card render
- Wrapping inference services into a unified CRM agent + tool registry
- Write tools (create_deal, move_stage) with HITL approval
- Inline deal capture chip on ticket conversation view
- Insight card (pattern detection)

## Architecture

```
FE (/stages page)
  ↓ GET /api/v1/tenants/:tenantID/crm/briefing
BE (deal-briefing.controller → service)
  ↓ Redis check (briefing:{userId}:{date}, 2h TTL)
  ↓ if miss: gather deals + chat msg signals → POST /ai-agents/crm-briefing
AI-Services (ai-agent.service.generateCrmBriefing)
  ↓ POST /api/v1/crm-briefing/generate
Agentic (services/analysis/crm_briefing.py)
  ↓ Gemini structured output → CrmBriefingOutput
```

## Decisions

- **Briefing scope = current CS user's deals only** (resolved server-side via `customerSupportID`). Admin gets the same briefing for the deals they own personally; admin-wide briefing is a follow-up ticket.
- **Cards are deterministic-shaped, AI-narrated**:
  - BE classifies deals into 3 buckets using SQL/JS rules (not LLM):
    - HOT: customer's last message in last 24h on a deal where last agent reply is older OR missing
    - OVERDUE: deal has been in current stage > `stage.maxDays` (and `maxDays` is set, > 0)
    - CLOSING SOON: probability >= 70 and stage isWinStage = false (still active)
  - Each bucket may produce 0 or 1 card. AI receives the picked deal + context and writes title + 1-line context + recommended action verb. AI **does not pick** which deals — keeps it deterministic + cheap.
  - Empty bucket → no card.
- **Cache key**: `briefing:{customerSupportID}:{tenantID}:{YYYY-MM-DD}` TTL 2h. Refresh button bypasses cache (BE deletes key + regenerates).
- **Auth model**: any authenticated user with `customerSupportID`. Returns 200 + empty briefing if user has 0 deals.
- **Language**: derived from request (Accept-Language or default `vi`); fallback `vi`.
- **Cost**: 1 LLM call per cache miss. With 2h TTL → ≤ 4 calls/user/day. Use Gemini Flash Lite (already wired via `get_llm()`).

## DTO contract (consistent across 4 repos)

**Response**:
```json
{
  "generatedAt": "2026-05-05T08:30:00Z",
  "userName": "Tan",
  "totals": { "deals": 23, "totalValue": 1200000000 },
  "cards": [
    {
      "type": "HOT",
      "title": "Khách 'ABC Corp' chờ phản hồi",
      "context": "Khách nhắn 18h trước, chưa có reply.",
      "actionLabel": "Trả lời ngay",
      "deal": { "dealID": "...", "name": "...", "value": 50000000, "stageName": "Negotiation" }
    },
    { "type": "OVERDUE", ... },
    { "type": "CLOSING_SOON", ... }
  ],
  "emptyState": null
}
```

If user has 0 deals: `cards: []`, `emptyState: "noDeals"`.

## Implementation steps (Agentic → AI-Services → BE → FE)

### 1. Agentic (`apps/agentic/`)

**New files:**
- `app/schemas/crm_briefing/__init__.py`
- `app/schemas/crm_briefing/schemas.py` — `CrmBriefingInput`, `BriefingDealContext`, `CrmBriefingOutput`, `BriefingCard`
- `app/services/analysis/crm_briefing.py` — `CrmBriefingService.generate()`
- `app/api/routers/crm_briefing.py` — `POST /api/v1/crm-briefing/generate`

**Edited files:**
- `app/api/routers/__init__.py` — register new router

**Logic:**
- Input: `userName`, `deals[]` already classified by BE into `HOT/OVERDUE/CLOSING_SOON`. For each, AI gets: `dealName`, `customerName`, `stageName`, `daysInStage`, `lastCustomerMessage` (string, optional), `value`, `probability`.
- Output: 1 card per non-empty bucket. AI writes: `title` (≤ 60 chars), `context` (≤ 100 chars), `actionLabel` (verb, ≤ 20 chars).
- Prompt: language enforcement (vi/en), brand voice "concise, specific, no pep talk".
- On error: return empty `cards`. No throw.

### 2. AI-Services (`apps/ai-services/`)

**New files:**
- `src/modules/ai-agent/dtos/crm-briefing.dto.ts` — `CrmBriefingDto`, nested DTOs

**Edited files:**
- `src/shared/modules/agentic/agentic.service.ts` — add `generateCrmBriefing()`
- `src/modules/ai-agent/ai-agent.service.ts` — add `generateCrmBriefing()` (proxy)
- `src/modules/ai-agent/ai-agent.controller.ts` — add `POST /ai-agents/crm-briefing`

### 3. BE (`apps/be/`)

**New files:**
- `src/components/deal/deal-briefing.controller.js` — handler `getBriefingHandler`
- `src/components/deal/deal-briefing.service.js` — `getBriefing()` (with cache), `buildBriefingContext()` (bucket classification + deal selection)

**Edited files:**
- `src/components/tenant/tenant.route.js` — register `GET /:tenantID/crm/briefing`, `POST /:tenantID/crm/briefing/refresh`

**Logic:**
- Auth: `auth` middleware. Use `req.user.customerSupportID`, `req.user.tenantID`. Reject if no `customerSupportID`.
- Cache key: `briefing:{customerSupportID}:{tenantID}:{YYYY-MM-DD}`. Get → return parsed JSON.
- On miss:
  1. Fetch deals owned by this CS, scoped to tenant. Limit to active deals (not in win/loss stage).
  2. For each deal: fetch latest stage info (maxDays, isWinStage), compute `daysInStage` from latest STAGE_CHANGE activity (or createdAt if none).
  3. Classify into buckets using deterministic rules. Pick top 1 per bucket (highest value within bucket; tiebreak: most recent activity).
  4. For HOT: fetch latest customer message timestamp via existing `getMessageList` for the deal's customerID; only include if customer's last message > last agent message within 24h.
  5. Build payload, call `aiServiceClient.post('/ai-agents/crm-briefing', payload)`.
  6. Merge AI text with bucket data → final card list.
  7. Cache with 2h TTL.
- Refresh: `DEL` key, then call `getBriefing()` again.
- Empty user (no `customerSupportID`): 200 with empty briefing + `emptyState: "noCs"`.

### 4. FE (`apps/fe/`)

**New files:**
- `src/components/CrmBriefing/DailyBriefing.jsx` — top-level component (skeleton, content, refresh button, dismissible per session)
- `src/components/CrmBriefing/BriefingCard.jsx` — card component with type icon, title, context, CTA
- `src/service/CrmBriefingService.js` — `fetchBriefing(tenantID)`, `refreshBriefing(tenantID)`

**Edited files:**
- `src/pages/stages/index.js` — render `<DailyBriefing />` above the Kanban board (between header and Board)
- `src/locales/vi/pages.json`, `src/locales/en/pages.json` — add briefing labels

**Logic:**
- `useEffect` on mount → fetch briefing. Skeleton during load.
- Each card has primary CTA:
  - HOT → opens `DealDetailDrawer` for that deal (existing component)
  - OVERDUE → opens `DealDetailDrawer` (CS can soạn re-engagement from inside)
  - CLOSING_SOON → opens `DealDetailDrawer`
- Refresh button calls refresh endpoint, replaces state.
- `[×]` dismisses for the session (sessionStorage flag, cleared on next session).
- Empty state: "Bạn chưa được assign deal nào hôm nay."
- Error state: "Em đang busy, thử lại sau. [↻ Retry]"

## Acceptance check

- [ ] CS opens `/stages` → briefing renders with skeleton then content within ~2s
- [ ] Each card shows correct deal info, opens drawer on CTA click
- [ ] Cache works (refresh page within 2h → no LLM call, see Redis key)
- [ ] Refresh button regenerates briefing
- [ ] Empty state for user with 0 deals
- [ ] Quality gates pass: agentic (ruff + pytest), ai-services (yarn lint), be (npm format+lint), fe (npm format+lint+test)

## Risks

1. **Message timestamp fetching is O(deals × chatRooms)** — bound it by limiting to top N candidates per bucket BEFORE fetching messages (cheaper sort by activity first).
2. **`customerSupportID` may be null for owners** — guard explicitly, return empty briefing.
3. **Stage `maxDays` often null** — when null, OVERDUE bucket is skipped for that deal.
4. **i18n drift** — keep keys minimal; reuse existing labels where possible.

## Time estimate

~1.5–2 days end-to-end including quality gates and PR. Single dev.
