---
name: facebook-ads-create
description: "Create Facebook/Meta ad campaigns, ad sets, creatives, and ads using the Meta Marketing API. Use this skill whenever the user wants to create, launch, set up, or build a Facebook ad, Instagram ad, Meta ad campaign, ad set, audience targeting, or ad creative — even if they just say something casual like 'run an ad on Facebook' or 'set up a campaign for my product'. Also triggers for: boosting posts, creating lookalike audiences, setting up retargeting, building any kind of paid social campaign on Meta platforms, or brainstorming/writing ad copy. Use this skill even if the user only says 'create an ad' without specifying Facebook — it's the default ad platform skill."
---

# Facebook Ad Creation Skill

This skill automates the creation of Facebook/Meta advertising campaigns through the Marketing API. It handles the full hierarchy: Campaign → Ad Set (with targeting) → Ad Creative → Ad.

## Reusable Script

**Always use `scripts/create_ad.py`** — a CLI tool that handles the full pipeline with preflight checks, error handling, and resumability. Never write throwaway one-off scripts.

```bash
python scripts/create_ad.py \
    --campaign-name "Spring Sale 2026" \
    --objective "OUTCOME_TRAFFIC" \
    --daily-budget 100000 \
    --audience-countries '["VN"]' \
    --audience-interests '[{"id":"6002884511422","name":"Small business"}]' \
    --audience-locales '[24]' \
    --ad-name "Jarvis AI Agent Ad" \
    --ad-message "Your ad copy here" \
    --ad-link "https://jarvis.com.ai/helpdeskai" \
    --ad-image-path "./ad_image.png" \
    --cta-type "SIGN_UP" \
    --page-id "1004119092789041"
```

## Network Requirement

**IMPORTANT**: The Meta Graph API (`graph.facebook.com`) must be allowed in the network egress policy. If it's blocked, you'll get a 403 with `hostname_blocked`. In that case:
1. Inform the user they need to allow `graph.facebook.com` in their network settings
2. Package the script as a downloadable file so the user can run it locally

## Prerequisites

Before using this skill, ensure the user has:

1. **A Meta Marketing API access token** with `ads_management` permission
2. **An Ad Account ID** (format: `act_XXXXXXXXX`)
3. **A Facebook Page ID** (the page the ad will be published from)

These are stored in `scripts/config_template.py`. **Check there first before asking the user** — credentials may already be configured. If not, create a `config.py` by asking the user for their credentials.

## Dependencies

Install before first use:
```bash
pip install requests --break-system-packages
```

Note: Use `requests` for direct REST API calls instead of the `facebook-business` SDK — the SDK has response-parsing issues (e.g., `string indices must be integers` when extracting IDs). Direct REST calls via `requests` are more reliable.

## How the Meta Ads Hierarchy Works

- **Campaign**: Top level. Sets the advertising objective and overall budget strategy.
- **Ad Set**: Controls who sees the ad and when — targeting (age, location, interests), budget, schedule, and bid strategy.
- **Ad Creative**: The actual content — image/video, headline, description, and call-to-action.
- **Ad**: Links a creative to an ad set, activating delivery.

## Mandatory Preflight Checks

**Run these BEFORE creating anything.** The script handles them automatically, but if writing custom code, always validate:

1. **Payment method** — query `GET /{ad_account_id}?fields=funding_source_details` to check if a payment method exists. Without one, ad creation will fail at the final step (after campaign/ad set/creative are already created).
2. **Meta Pixel** — if using `OUTCOME_SALES` or `OUTCOME_LEADS`, query `GET /{ad_account_id}/adspixels` to get the pixel ID. These objectives require a `promoted_object` with the pixel.
3. **Image** — always require an ad image upfront. Link ads without an uploaded image will try to scrape the landing page's OG image, which frequently fails. Never create a creative without an `image_hash`.
4. **Interest IDs** — NEVER use hardcoded interest IDs. They go stale. Always search via `GET /search?type=adinterest&q={query}` to get current valid IDs.

## Objective-Specific Requirements

| Objective | Requires Pixel? | promoted_object | optimization_goal | Extra targeting fields |
|-----------|----------------|-----------------|-------------------|----------------------|
| `OUTCOME_AWARENESS` | No | None | `REACH` | None |
| `OUTCOME_TRAFFIC` | No | None | `LINK_CLICKS` | None |
| `OUTCOME_ENGAGEMENT` | No | None | `POST_ENGAGEMENT` | None |
| `OUTCOME_LEADS` | Yes | `{"pixel_id": "...", "custom_event_type": "LEAD"}` | `OFFSITE_CONVERSIONS` | `targeting_automation: {"advantage_audience": 0}` |
| `OUTCOME_SALES` | Yes | `{"pixel_id": "...", "custom_event_type": "PURCHASE"}` | `LINK_CLICKS` (safe default) or `OFFSITE_CONVERSIONS` | `targeting_automation: {"advantage_audience": 0}` |
| `OUTCOME_APP_PROMOTION` | No | `{"application_id": "..."}` | `APP_INSTALLS` | None |

**Key lesson**: `OUTCOME_SALES` and `OUTCOME_LEADS` require both a `promoted_object` AND `targeting_automation.advantage_audience` to be explicitly set (0 to disable, 1 to enable).

## Workflow

### Step 1: Check Config

Before asking the user for credentials, check `scripts/config_template.py` — it may already contain valid credentials:
```
# Check: .claude/skills/facebook-ads-create/scripts/config_template.py
```

### Step 2: Gather Requirements

Ask the user for (fill in sensible defaults where possible). **Use AskUserQuestion with button choices** for structured inputs (objective, budget tier, audience preset, CTA).

**Campaign level:**
- Campaign name
- Objective (see table above for requirements)
- Special ad categories (if applicable): `HOUSING`, `EMPLOYMENT`, `CREDIT`, `ISSUES_ELECTIONS_POLITICS`

**Ad Set level:**
- Daily budget — in **smallest currency unit** (e.g., 5000 cents = $50/day for USD; 100000 = 100,000 VND/day for Vietnamese Dong). Make this clear to the user.
- Target audience:
  - Age range (min/max, default 18-65)
  - Gender (0=All, 1=Male, 2=Female)
  - Countries (list of ISO codes, e.g., `["US"]`, `["VN"]`)
  - Interests — **always search via API**, never hardcode IDs
  - Locales (optional — e.g., `[24]` for Vietnamese language)
- Optimization goal (see objective table)
- Start date (default: tomorrow)

**Searching for interest IDs:**
```python
resp = requests.get(f"{BASE_URL}/search", params={
    "access_token": ACCESS_TOKEN,
    "type": "adinterest",
    "q": "small business",
    "limit": 5,
})
# Use the `id` from results — never assume IDs are stable
```

**Creative level:**
- Ad image (file path or URL) — **MANDATORY, always ask for this upfront**
- Ad copy / message text
- Landing page URL
- Call-to-action type: `LEARN_MORE`, `SIGN_UP`, `SHOP_NOW`, `CONTACT_US`, `DOWNLOAD`, `GET_OFFER`, `BOOK_TRAVEL`, `SUBSCRIBE`, etc.
- Facebook Page ID

### Step 3: Brainstorm Ad Copy (if needed)

If the user doesn't have ad copy ready, offer to brainstorm 2-3 options with different angles:
- **Pain Point + Solution** — identify the problem, present the product as the fix
- **Social Proof / FOMO** — highlight adoption numbers, urgency, fear of missing out
- **Short & Punchy** — minimal text, strong hook, single CTA

Write copy in the user's target language (e.g., Vietnamese for VN audiences). Match the tone to the creative image if one is provided.

### Step 4: Run Preflight Checks

Before creating anything, validate:
1. Payment method exists on the ad account
2. If OUTCOME_SALES/LEADS: pixel exists and is accessible
3. Image file exists and is readable
4. Interest IDs are valid (search API)

### Step 5: Run the Script

Use `scripts/create_ad.py` with the gathered parameters. The script handles the full pipeline: Campaign → Ad Set → Image Upload → Creative → Ad.

### Step 6: Present Results

After creation, summarize what was built:
- Campaign ID and name
- Ad Set ID with targeting summary
- Creative ID
- Ad ID
- Status: PAUSED (remind the user to activate in Ads Manager when ready)

## Error Handling

- **403 / hostname_blocked**: `graph.facebook.com` is blocked in network settings. Package script for local execution and tell user to update network settings.
- **401 / OAuthException**: Access token expired. Guide user to generate a new one at developers.facebook.com.
- **Permission errors**: User needs to grant `ads_management` permission in Meta Business settings.
- **Interest targeting failures**: Interest IDs go stale — always search via API, never hardcode.
- **Image download failures**: Meta tries to scrape OG images from landing pages. Always upload images directly via `adimages` endpoint instead.
- **No payment method**: Ad creation fails at the final step. Check payment status in preflight.
- **Conversion event unavailable**: Objective/event mismatch. See the objective table above for correct pairings.
- **Advantage audience flag required**: `OUTCOME_SALES`/`OUTCOME_LEADS` require `targeting_automation: {"advantage_audience": 0|1}` in the targeting spec.

## Important Notes

- **Always create ads as PAUSED** — never set status to ACTIVE automatically.
- **Budget is in smallest currency unit** — $50/day = 5000 for USD; 100,000 VND/day = 100000 for VND. Always clarify the currency with the user.
- **Use `requests` over `facebook-business` SDK** — the SDK has known response-parsing bugs. Direct REST is more reliable.
- **Never hardcode interest IDs** — they go stale. Always search via the `adinterest` search API.
- **Always upload images** — never rely on OG image scraping from landing pages.
- **Locales matter for non-English audiences** — add locale codes (e.g., `[24]` for Vietnamese) to reach users in their language.
- **Custom CTA labels**: Meta only supports predefined CTA types. If the user wants a custom label (e.g., "Tạo ngay AI Agent"), use the closest match (e.g., `SIGN_UP`) and note that the display label may vary by user language.
- **Config includes PAGE_ID**: Always store Page ID in config alongside ACCESS_TOKEN and AD_ACCOUNT_ID — it's needed for every ad creative.
