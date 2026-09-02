# BIZ-625 — Capture Facebook ad context for AI agent reply

## Problem

Customer enters a Messenger thread by clicking a Click-to-Messenger ad. Facebook surfaces "Tony Nguyen đã trả lời một quảng cáo" in our UI but the system stores nothing about which ad. The AI agent then replies blind to vague follow-ups like "Lốp 5.00 12 gai xuôi ạ" because it has no idea the customer came from a tire-promo ad.

## Goal

Capture the ad context Facebook gives us in the webhook (`ad_id`, `ads_context_data` with `ad_title` / `photo_url` / `video_url` / `post_id`), persist it as a sibling record to the messenger conversation, and inject it into the AI agent prompt so replies can be grounded in the originating ad.

## Storage — new table `MESSENGER_AD_REFERRAL`

Not a column on `chat_room`. Not a new `MESSAGE_TYPE` (`MESSAGE_TYPE` is direction/channel only in this repo). One row per ad-click event.

```
referralID    STRING PK  (mar_<nanoid>)
tenantID      UUID   FK
chatRoomID    STRING FK   -- always set, primary lookup key
messageID     STRING FK   -- nullable: set on message.referral; null on standalone referral
customerID    STRING FK
channelID     STRING FK
facebookAdId  STRING       indexed
source        STRING       'ADS' | 'SHORTLINK' | 'CUSTOMER_CHAT_PLUGIN' | ...
ref           STRING       optional ref param
adTitle       TEXT
photoUrl      TEXT         time-limited; not pre-downloaded in v1
videoUrl      TEXT         time-limited
postId        STRING       FB post id behind the ad
capturedAt    TIMESTAMP
```

Indexes: `(chatRoomID, capturedAt DESC)` for "latest on this thread", `(facebookAdId)` for future analytics.

## BE — capture (apps/be)

### 1. Migration + model
- New migration: create `MESSENGER_AD_REFERRAL` with the columns above and the two indexes
- New model file `messengerAdReferral.js`
- Register in `init-models.js`

### 2. Domain service
- New file `apps/be/src/components/messenger/messenger-ad-referral.service.js`
- Exports `recordMessengerAdReferral({ chatRoomID, messageID, customerID, channelID, tenantID, referral })` — maps webhook payload → row; idempotent on `(chatRoomID, facebookAdId, capturedAt)`; skip if neither `referral.ad_id` nor `referral.ads_context_data` is present
- Exports `getLatestAdReferralByChatRoomID({ chatRoomID, tenantID })` — returns latest row or null

### 3. Wire into webhook handlers
- [messenger.eventHandler.js `handleMessengerReferralMessage`](apps/be/src/components/webhook/messenger/messenger.eventHandler.js#L2090): after customer found, look up chatroom by customer + channel; call `recordMessengerAdReferral` when `referral.ad_id` or `ads_context_data` exists
- [messenger.eventHandler.js `handleUserSendMessage`](apps/be/src/components/webhook/messenger/messenger.eventHandler.js#L490): when `webhook_event.message.referral` is present, call `recordMessengerAdReferral` after the message is persisted (chat room and messageID exist by then)

### 4. Inject into draft request
- [ai-service.service.js `enqueueDraftResponse`](apps/be/src/components/ai-service/ai-service.service.js#L124): when `chatroom_id` is present, fetch latest referral and set `data.user_metadata.entry_ad = { ad_title, ad_image_url, ad_video_url, source, ad_id, post_id }` (snake_case for agentic).

`user_metadata` is already plumbed end-to-end. No DTO change in AI-Services (`data: any`).

## Agentic — surface in prompt (apps/agentic)

### 5. Synthesis prompt
- [draft_response/pipeline.py `_step_draft_synthesize`](apps/agentic/app/services/draft_response/pipeline.py#L283): if `ctx.user_metadata.get("entry_ad")` is set, build a richer block and pass to a new `{entry_ad}` slot in the template; strip `entry_ad` from the generic key/value rendering so it isn't duplicated
- [draft_response/prompts.py `DRAFT_SYNTHESIS_USER_PROMPT_TEMPLATE`](apps/agentic/app/services/draft_response/prompts.py#L385): insert `### 5c. ENTRY AD CONTEXT` block with explicit guidance — "Customer entered from this ad. Use it to interpret vague replies (sizes, models, promo codes) and stay on the campaign's offering."
- Same enrichment in the orchestrate step's `additional_context` so the planner picks correct sub-agents

## FE — show ad card on chatroom (apps/fe)

### 6. Display
- Extend chatroom detail API response to include `latestAdReferral` (BE joins on chatRoomID, returns latest row or null)
- Render a card at the top of the chat panel: ad title + thumbnail + "Replied via ad" badge — mirroring the Facebook UI in screenshot 2
- Hide when `latestAdReferral` is null

## Out of scope (deferred)

- Marketing API enrichment via `GET /{ad_id}?fields=creative{...}` — defer until webhook is proven insufficient in real traffic
- Pre-downloading time-limited media URLs — needed only for vision-grounded replies
- Linking discovered external ads back to `MARKETING_BROADCASTS` — separate ticket

## Cross-repo dependency order

Agentic → AI-Services (no change) → BE → FE. Quality gate per repo after each.

## Acceptance criteria

1. Webhook with `referral.source === 'ADS'` (standalone or `message.referral`) writes a `MESSENGER_AD_REFERRAL` row.
2. Existing `referral.ref`-only flow (m.me tag link) keeps working — no regression.
3. Draft response request to agentic includes ad context in `user_metadata.entry_ad` when present.
4. Synthesis prompt includes a dedicated `### 5c. ENTRY AD CONTEXT` section when ad context is present.
5. FE chatroom panel renders the ad card when `latestAdReferral` is present.
6. Quality gates pass on all 3 touched repos (BE, Agentic, FE).
