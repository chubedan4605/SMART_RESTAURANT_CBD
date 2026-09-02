# GTM Container Import JSON Format Reference

This reference documents the exact JSON structure required for Google Tag Manager container import files. All formats are reverse-engineered from real GTM workspace exports (format version 2).

## Top-Level Structure

```json
{
    "exportFormatVersion": 2,
    "exportTime": "2026-03-27 12:00:00",
    "containerVersion": {
        "path": "accounts/{ACCOUNT_ID}/containers/{CONTAINER_ID}/versions/0",
        "accountId": "{ACCOUNT_ID}",
        "containerId": "{CONTAINER_ID}",
        "containerVersionId": "0",
        "container": {
            "path": "accounts/{ACCOUNT_ID}/containers/{CONTAINER_ID}",
            "accountId": "{ACCOUNT_ID}",
            "containerId": "{CONTAINER_ID}",
            "name": "{CONTAINER_NAME}",
            "publicId": "{GTM-XXXXXXXX}",
            "usageContext": ["WEB"],
            "fingerprint": "{TIMESTAMP_MS}",
            "features": {},
            "tagIds": ["{GTM-XXXXXXXX}"]
        },
        "builtInVariable": [...],
        "tag": [...],
        "trigger": [...],
        "variable": [...]
    }
}
```

### Where to Find Account/Container IDs

- Open GTM > Admin > Container Settings
- The URL contains both: `tagmanager.google.com/#/container/accounts/{ACCOUNT_ID}/containers/{CONTAINER_ID}`
- `publicId` is the `GTM-XXXXXXXX` identifier shown in the GTM UI

### Fingerprint

Every entity requires a `fingerprint` field. Use any unique timestamp string (milliseconds since epoch). Example: `"1711500000001"`. GTM reassigns fingerprints on import.

---

## Built-In Variables

Declare built-in variables the container needs. Without declaring them, references like `{{Page Path}}` or `{{Click ID}}` will fail.

```json
{
    "accountId": "{ACCOUNT_ID}",
    "containerId": "{CONTAINER_ID}",
    "type": "PAGE_PATH",
    "name": "Page Path"
}
```

### Common Built-In Variable Types

| Type | Name | Used For |
|------|------|----------|
| `PAGE_URL` | Page URL | Full URL matching |
| `PAGE_HOSTNAME` | Page Hostname | Domain filtering |
| `PAGE_PATH` | Page Path | Path-based triggers |
| `EVENT` | Event | Custom event name |
| `CLICK_ELEMENT` | Click Element | CSS selector matching |
| `CLICK_ID` | Click ID | Element ID matching |
| `CLICK_TEXT` | Click Text | Button/link text matching |
| `CLICK_URL` | Click URL | Link URL matching |
| `SCROLL_DEPTH_THRESHOLD` | Scroll Depth Threshold | Scroll percentage |
| `SCROLL_DEPTH_DIRECTION` | Scroll Depth Direction | Vertical/horizontal |
| `SCROLL_DEPTH_UNITS` | Scroll Depth Units | Percent/pixels |
| `REFERRER` | Referrer | Referrer URL |

---

## Tags

Every tag requires these fields:

```json
{
    "accountId": "{ACCOUNT_ID}",
    "containerId": "{CONTAINER_ID}",
    "tagId": "{UNIQUE_ID}",
    "name": "Human-readable name",
    "type": "{TAG_TYPE}",
    "parameter": [...],
    "fingerprint": "{TIMESTAMP}",
    "firingTriggerId": ["{TRIGGER_ID}"],
    "tagFiringOption": "ONCE_PER_EVENT",
    "monitoringMetadata": { "type": "MAP" },
    "consentSettings": { "consentStatus": "NOT_SET" }
}
```

### Built-In Trigger ID

The "All Pages" built-in trigger ID is **`2147479553`** (NOT `2147483647`). This does not need to be defined in the triggers array.

### Tag Type: Google Tag (GA4 Configuration) — `googtag`

```json
{
    "type": "googtag",
    "parameter": [
        {
            "type": "TEMPLATE",
            "key": "tagId",
            "value": "G-XXXXXXXXXX"
        },
        {
            "type": "LIST",
            "key": "configSettingsTable",
            "list": [
                {
                    "type": "MAP",
                    "map": [
                        { "type": "TEMPLATE", "key": "parameter", "value": "send_page_view" },
                        { "type": "TEMPLATE", "key": "parameterValue", "value": "true" }
                    ]
                }
            ]
        }
    ],
    "firingTriggerId": ["2147479553"]
}
```

**Important**: The GA4 config tag uses type `googtag` with key `tagId` — NOT type `gaawc` with key `measurementId`.

### Tag Type: GA4 Event — `gaawe`

```json
{
    "type": "gaawe",
    "parameter": [
        { "type": "BOOLEAN", "key": "sendEcommerceData", "value": "false" },
        { "type": "TEMPLATE", "key": "eventName", "value": "my_event" },
        { "type": "TEMPLATE", "key": "measurementIdOverride", "value": "{{GA4 - Measurement ID}}" },
        {
            "type": "LIST",
            "key": "eventSettingsTable",
            "list": [
                {
                    "type": "MAP",
                    "map": [
                        { "type": "TEMPLATE", "key": "parameter", "value": "param_name" },
                        { "type": "TEMPLATE", "key": "parameterValue", "value": "{{Some Variable}}" }
                    ]
                }
            ]
        }
    ]
}
```

**Important**:
- Use `measurementIdOverride` referencing a constant variable — NOT `TAG_REFERENCE` to the config tag
- Event parameters use `eventSettingsTable` with keys `parameter`/`parameterValue` — NOT `eventParameters` with `name`/`value`
- Always include `sendEcommerceData: false` unless sending ecommerce data

### Tag Type: Google Ads Conversion — `awct`

```json
{
    "type": "awct",
    "parameter": [
        { "type": "BOOLEAN", "key": "enableNewCustomerReporting", "value": "false" },
        { "type": "BOOLEAN", "key": "enableConversionLinker", "value": "true" },
        { "type": "BOOLEAN", "key": "enableProductReporting", "value": "false" },
        { "type": "BOOLEAN", "key": "enableEnhancedConversion", "value": "false" },
        { "type": "TEMPLATE", "key": "conversionCookiePrefix", "value": "_gcl" },
        { "type": "BOOLEAN", "key": "enableShippingData", "value": "false" },
        { "type": "TEMPLATE", "key": "conversionId", "value": "18034657595" },
        { "type": "TEMPLATE", "key": "conversionLabel", "value": "AbCdEfGhIjK" },
        { "type": "BOOLEAN", "key": "rdp", "value": "false" }
    ]
}
```

**Important**: `conversionId` is the NUMERIC part only — NOT prefixed with `AW-`. If the Google Ads ID is `AW-18034657595`, use `"18034657595"`.

### Tag Type: Google Ads Remarketing — `sp`

```json
{
    "type": "sp",
    "parameter": [
        { "type": "BOOLEAN", "key": "enableConversionLinker", "value": "true" },
        { "type": "BOOLEAN", "key": "enableDynamicRemarketing", "value": "false" },
        { "type": "TEMPLATE", "key": "conversionCookiePrefix", "value": "_gcl" },
        { "type": "TEMPLATE", "key": "conversionId", "value": "18034657595" }
    ],
    "firingTriggerId": ["2147479553"]
}
```

### Tag Type: Custom HTML — `html`

Used for Meta Pixel, third-party scripts, etc.

```json
{
    "type": "html",
    "parameter": [
        {
            "type": "TEMPLATE",
            "key": "html",
            "value": "<script>\n// Your JavaScript here\n</script>"
        },
        { "type": "BOOLEAN", "key": "supportDocumentWrite", "value": "false" }
    ]
}
```

**Important**: Always include `supportDocumentWrite` parameter.

---

## Triggers

Every trigger requires:

```json
{
    "accountId": "{ACCOUNT_ID}",
    "containerId": "{CONTAINER_ID}",
    "triggerId": "{UNIQUE_ID}",
    "name": "Human-readable name",
    "type": "{TRIGGER_TYPE}",
    "fingerprint": "{TIMESTAMP}"
}
```

### Trigger Type: Click — `CLICK`

Fires on any click matching filter conditions.

```json
{
    "type": "CLICK",
    "filter": [
        {
            "type": "STARTS_WITH",
            "parameter": [
                { "type": "TEMPLATE", "key": "arg0", "value": "{{AEV - data-gtm}}" },
                { "type": "TEMPLATE", "key": "arg1", "value": "helpdesk-lp-" }
            ]
        }
    ]
}
```

Filter types: `EQUALS`, `CONTAINS`, `STARTS_WITH`, `ENDS_WITH`, `MATCHES_REGEX`, `CSS_SELECTOR`.

For CSS selector matching:
```json
{
    "type": "CSS_SELECTOR",
    "parameter": [
        { "type": "TEMPLATE", "key": "arg0", "value": "{{Click Element}}" },
        { "type": "TEMPLATE", "key": "arg1", "value": "#my-button, #my-button *" }
    ]
}
```

### Trigger Type: Link Click — `LINK_CLICK`

```json
{
    "type": "LINK_CLICK",
    "filter": [...],
    "waitForTags": { "type": "BOOLEAN", "value": "false" },
    "checkValidation": { "type": "BOOLEAN", "value": "false" },
    "waitForTagsTimeout": { "type": "TEMPLATE", "value": "2000" },
    "uniqueTriggerId": { "type": "TEMPLATE" }
}
```

### Trigger Type: Element Visibility — `ELEMENT_VISIBILITY`

```json
{
    "type": "ELEMENT_VISIBILITY",
    "parameter": [
        { "type": "TEMPLATE", "key": "selectorType", "value": "ID" },
        { "type": "TEMPLATE", "key": "elementId", "value": "my-section" },
        { "type": "TEMPLATE", "key": "firingFrequency", "value": "ONCE" },
        { "type": "TEMPLATE", "key": "onScreenRatio", "value": "30" }
    ]
}
```

`selectorType`: `"ID"` or `"CSS_SELECTOR"`. `firingFrequency`: `"ONCE"`, `"ONCE_PER_ELEMENT"`, `"MANY_PER_ELEMENT"`.

### Trigger Type: Scroll Depth — `SCROLL_DEPTH`

```json
{
    "type": "SCROLL_DEPTH",
    "parameter": [
        { "type": "TEMPLATE", "key": "verticalThresholdsPercent", "value": "25,50,75,100" },
        { "type": "BOOLEAN", "key": "verticalThresholdOn", "value": "true" },
        { "type": "BOOLEAN", "key": "horizontalThresholdOn", "value": "false" },
        { "type": "TEMPLATE", "key": "triggerStartOption", "value": "WINDOW_LOAD" }
    ]
}
```

### Trigger Type: Custom Event — `CUSTOM_EVENT`

For `dataLayer.push({ event: 'my_event' })`:

```json
{
    "type": "CUSTOM_EVENT",
    "customEventFilter": [
        {
            "type": "EQUALS",
            "parameter": [
                { "type": "TEMPLATE", "key": "arg0", "value": "{{_event}}" },
                { "type": "TEMPLATE", "key": "arg1", "value": "my_event" }
            ]
        }
    ]
}
```

### Trigger Type: Page View — `PAGEVIEW`

```json
{
    "type": "PAGEVIEW",
    "filter": [
        {
            "type": "CONTAINS",
            "parameter": [
                { "type": "TEMPLATE", "key": "arg0", "value": "{{Page Path}}" },
                { "type": "TEMPLATE", "key": "arg1", "value": "/checkout" }
            ]
        }
    ]
}
```

---

## Variables

Every variable requires:

```json
{
    "accountId": "{ACCOUNT_ID}",
    "containerId": "{CONTAINER_ID}",
    "variableId": "{UNIQUE_ID}",
    "name": "Variable Name",
    "type": "{VARIABLE_TYPE}",
    "parameter": [...],
    "fingerprint": "{TIMESTAMP}",
    "formatValue": {}
}
```

### Variable Type: Constant — `c`

```json
{
    "type": "c",
    "parameter": [
        { "type": "TEMPLATE", "key": "value", "value": "G-HC1N75ZETK" }
    ]
}
```

### Variable Type: Data Layer Variable — `v`

```json
{
    "type": "v",
    "parameter": [
        { "type": "TEMPLATE", "key": "name", "value": "user_id" },
        { "type": "INTEGER", "key": "dataLayerVersion", "value": "2" }
    ]
}
```

### Variable Type: Auto-Event Variable — `aev`

For reading element attributes (e.g., `data-gtm`):

```json
{
    "type": "aev",
    "parameter": [
        { "type": "TEMPLATE", "key": "varType", "value": "ATTRIBUTE" },
        { "type": "TEMPLATE", "key": "attribute", "value": "data-gtm" }
    ]
}
```

### Variable Type: URL Component — `u`

```json
{
    "type": "u",
    "parameter": [
        { "type": "TEMPLATE", "key": "component", "value": "QUERY" },
        { "type": "TEMPLATE", "key": "queryKey", "value": "utm_source" }
    ]
}
```

---

## Common Pitfalls

1. **Wrong All Pages trigger ID**: Use `2147479553`, NOT `2147483647`
2. **GA4 config tag type**: Use `googtag` with `tagId` key, NOT `gaawc` with `measurementId`
3. **GA4 event measurement ID**: Use `measurementIdOverride` with a constant variable, NOT `TAG_REFERENCE`
4. **Event parameters key names**: Use `parameter`/`parameterValue`, NOT `name`/`value`
5. **Google Ads conversion ID**: Numeric only (`18034657595`), NOT `AW-` prefixed
6. **Missing `supportDocumentWrite`**: Required on all Custom HTML tags
7. **Missing `fingerprint`**: Required on every entity
8. **Missing `formatValue: {}`**: Required on every variable
9. **Missing `tagFiringOption`**: Required on every tag (usually `"ONCE_PER_EVENT"`)
10. **Missing `monitoringMetadata`/`consentSettings`**: Required on every tag
11. **Built-in variables not declared**: If using `{{Page Path}}`, `{{Click ID}}`, etc., declare them in `builtInVariable` array
