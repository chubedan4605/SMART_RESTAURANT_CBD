---
name: gtm-editor
description: "Create and modify Google Tag Manager container import JSON files. This skill should be used when adding tags, triggers, variables, or events to GTM via JSON import, or when troubleshooting GTM import format errors. Triggers on: GTM, google tag manager, tracking event, conversion tag, container import, data layer."
---

# GTM Container Editor

Create, modify, and troubleshoot Google Tag Manager container import JSON files.

## When to Use

- Adding new tags (GA4, Google Ads, Meta Pixel, Custom HTML) to a GTM container
- Adding new triggers (click, visibility, scroll, custom event, page view)
- Adding new variables (data layer, constant, auto-event, URL component)
- Troubleshooting GTM import errors ("undefined trigger reference", "invalid format")
- Converting manually-created GTM setups to importable JSON for version control

## Workflow

### 1. Gather Container Info

Before creating or modifying a GTM import JSON, collect:

- **GTM container public ID** (e.g., `GTM-PVNC67P3`) -- visible in GTM UI header
- **Account ID and Container ID** -- extract from GTM URL: `tagmanager.google.com/#/container/accounts/{ACCOUNT_ID}/containers/{CONTAINER_ID}`
- **Platform IDs** -- GA4 measurement ID (`G-XXXXXXXX`), Google Ads ID (numeric only, strip `AW-` prefix), Meta Pixel ID

If an existing GTM export JSON is available, read its `containerVersion.accountId` and `containerVersion.containerId` to match the format exactly.

### 2. Create or Modify the JSON

**New container**: Copy `assets/gtm-container-template.json` and replace all placeholder values (`ACCOUNT_ID`, `CONTAINER_ID`, `GTM-XXXXXXXX`, `CONTAINER_NAME`).

**Existing container**: Read the existing JSON and add new entities to the appropriate arrays (`tag`, `trigger`, `variable`). Ensure new IDs (`tagId`, `triggerId`, `variableId`) do not conflict with existing ones.

### 3. Apply the Format Rules

Read `references/gtm-json-format.md` for the complete format specification. Key rules:

- GA4 config uses type `googtag`, NOT `gaawc`
- GA4 events use `measurementIdOverride` with a constant variable, NOT `TAG_REFERENCE`
- Event params use `eventSettingsTable` with `parameter`/`parameterValue` keys
- Google Ads conversion ID is numeric only (no `AW-` prefix)
- All Pages trigger ID is `2147479553`
- Every tag needs `fingerprint`, `tagFiringOption`, `monitoringMetadata`, `consentSettings`
- Every variable needs `fingerprint` and `formatValue: {}`
- Custom HTML tags need `supportDocumentWrite` parameter
- Declare all built-in variables used (Page Path, Click ID, etc.) in `builtInVariable`

### 4. Validate Before Delivery

Before presenting the JSON to the user, verify:

1. All `firingTriggerId` references point to triggers that exist in the file or are the built-in `2147479553`
2. All `{{Variable Name}}` references in tag parameters have matching entries in the `variable` array or `builtInVariable` array
3. `accountId` and `containerId` are consistent across all entities
4. All IDs (`tagId`, `triggerId`, `variableId`) are unique strings within their type
5. JSON is valid (no trailing commas, proper escaping in HTML strings)

### 5. Import Instructions

Provide these instructions with the JSON:

1. Open GTM > Admin > Import Container
2. Select the JSON file
3. Choose workspace: "Default Workspace" (or a new workspace for review)
4. Choose import option: **Merge** > **Rename conflicting tags, triggers, and variables**
5. Review the preview and confirm
6. After import, open GTM Preview mode to verify triggers fire correctly
7. Publish the container version when satisfied

## Resources

- `references/gtm-json-format.md` -- Complete JSON format specification with examples for every entity type
- `assets/gtm-container-template.json` -- Minimal valid template to start from
