---
name: gcp-logs
description: "Diagnose production issues using Google Cloud Logging, Monitoring, and Tracing via the observability-mcp tools. Load this before any GCP log investigation, error triage, or root cause analysis."
---

# GCP Logs — Cloud Observability Debugging

Read, filter, and analyze Google Cloud logs, metrics, traces, and alerts to diagnose production issues and identify root causes.

## Prerequisites

- The `observability-mcp` MCP server must be connected (check via `/mcp`)
- The operator must be authenticated: `gcloud auth application-default login`
- GCP project ID is required for all queries

First-time setup or permission issues → read `references/gcp-auth-setup.md` for the full guide (gcloud install, ADC auth, IAM roles, MCP connection, troubleshooting).

## Project Reference

| Environment | Project ID |
|-------------|-----------|
| Production  | `jarvis-helpdesk-478604` |

Update this table if the project ID changes or staging/dev environments are added.

## Step 0: Orientation

Before querying logs, gather context:

- **Symptoms**: What is broken? (errors, slowness, missing data, failed jobs)
- **Timeframe**: When did it start? Narrow the window as much as possible
- **Scope**: Which service, user, or tenant is affected?

Map symptoms to the correct GCP service name using the container-to-service mapping below.

### Service Mapping

Jarvis Helpdesk services run as containers on GCE. Logs use `resource.type="global"` and are identified by `jsonPayload.service_name` or `jsonPayload.context`. The primary log name is `jarvis-helpdesk`.

**By `service_name` in jsonPayload (primary identifier):**

| Jarvis Service | `service_name` value | `context` examples | Container |
|----------------|---------------------|-------------------|-----------|
| Backend (Express) | `jarvis-helpdesk-be` | `AiService.service`, `MessageController`, `Passport`, `Zalo.controller` | tp-backend |
| AI Services (NestJS) | `jarvis-helpdesk-ai-services` | `AllExceptionsFilter`, `SubscriptionGuard` | tp-ai-service |
| Plugin API (NestJS) | — (logs from `jarvis-helpdesk-plugin-api` path) | `AllExceptionsFilter`, `ValidationPipe` | tp-ai-service |
| Agentic (FastAPI) | — (Python tracebacks) | Celery tasks, configure_from_website | tp-helpdesk-agentic |

**Filter by service_name:**
```
filter: 'jsonPayload.service_name="jarvis-helpdesk-be"'
filter: 'jsonPayload.service_name="jarvis-helpdesk-ai-services"'
```

**Filter by context:**
```
filter: 'jsonPayload.context="AllExceptionsFilter"'
filter: 'jsonPayload.context="Passport"'
```

**Container reference (for SSH/Docker debugging via prod-debug skill):**

| Container | Port | Service |
|-----------|------|---------|
| tp-frontend | 3333:3000 | Frontend |
| tp-backend | 3334:3030 | Backend |
| tp-ai-service | 3345:5556 | AI Services + Plugin API |
| tp-helpdesk-agentic | 3342:8000 | Agentic API |
| tp-celery-worker | — | Celery Worker |
| tp-celery-draft-response-worker | — | Celery Draft Worker |
| tp-celery-beat | — | Celery Beat |
| jarvis-helpdesk-landing | 3336:3001 | Landing Page |
| tp-postgres | 3335:5432 | PostgreSQL |
| tp-redis | 3346:6379 | Redis |
| tp-qdrant | 3343:6333 | Qdrant |
| nginx | 80/443 | Nginx |

## Step 1: Discover Available Logs

Use `list_log_names` to see what logs exist in the project:

```
Tool: mcp__observability-mcp__list_log_names
parent: "projects/jarvis-helpdesk-478604"
```

This reveals which services are actually emitting logs — use these names to build precise filters.

## Step 2: Query Log Entries

Use `list_log_entries` as the primary investigation tool. Always set `orderBy: "timestamp desc"` to see the most recent entries first.

### Common Filter Patterns

**All errors in the last hour:**
```
filter: 'severity="ERROR" AND timestamp >= "2026-03-25T09:00:00Z"'
resourceNames: ["projects/jarvis-helpdesk-478604"]
orderBy: "timestamp desc"
pageSize: 50
```

**Errors from a specific service (by service_name):**
```
filter: 'severity>="ERROR" AND jsonPayload.service_name="jarvis-helpdesk-be"'
```

**Errors from a specific context:**
```
filter: 'severity>="ERROR" AND jsonPayload.context="AllExceptionsFilter"'
```

**Search for a specific error message:**
```
filter: 'jsonPayload.message:"database connection failed"'
```

**Search by HTTP status code:**
```
filter: 'httpRequest.status=500'
```

**Logs for a specific task ID (cross-service tracing):**
```
filter: 'jsonPayload.message:"TASK_ID_HERE"'
```

**Logs for a specific tenant:**
```
filter: 'jsonPayload.message:"TENANT_ID_HERE"'
```

**Time-bounded query (narrow window for performance):**
```
filter: 'timestamp >= "2026-03-25T10:00:00Z" AND timestamp < "2026-03-25T10:30:00Z" AND severity>="WARNING"'
```

### Filter Syntax Reference

| Operator | Example | Notes |
|----------|---------|-------|
| Exact match | `severity="ERROR"` | String fields |
| Substring | `jsonPayload.message:"connection"` | Contains text in JSON message |
| Comparison | `severity>="WARNING"` | WARNING, ERROR, CRITICAL |
| AND/OR/NOT | `severity="ERROR" AND NOT jsonPayload.message:"health"` | Combine filters |
| Service name | `jsonPayload.service_name="jarvis-helpdesk-be"` | Primary service identifier |
| Context | `jsonPayload.context="AllExceptionsFilter"` | NestJS/Express context |
| Log name | `logName="projects/jarvis-helpdesk-478604/logs/jarvis-helpdesk"` | Main app log stream |
| JSON level | `jsonPayload.level=50` | Numeric: 50=error, 40=warn, 30=info |
| Text payload | `textPayload:"some text"` | For non-JSON log entries (Python tracebacks) |

### Pagination

If more results exist, the response includes `nextPageToken`. Pass it as `pageToken` in the next call to continue.

### Large Result Analysis

When `list_log_entries` returns too many results and gets saved to a file, use the bundled analysis script to parse and summarize:

```bash
python3 .claude/skills/gcp-logs/scripts/analyze-log-entries.py <saved-file.txt>
```

This groups errors by service, context, and normalized message — producing a frequency-ranked summary for triage.

## Step 3: Analyze Recurring Errors

Use `list_group_stats` to find recurring stack traces — NOT for general error searches. This aggregates similar errors and shows occurrence counts and affected users.

```
Tool: mcp__observability-mcp__list_group_stats
projectName: "projects/jarvis-helpdesk-478604"
timeRangePeriod: "PERIOD_6_HOURS"
order: "COUNT_DESC"
```

Time range options: `PERIOD_1_HOUR`, `PERIOD_6_HOURS`, `PERIOD_1_DAY`, `PERIOD_1_WEEK`, `PERIOD_30_DAYS`.

## Step 4: Check Metrics and Performance

### Discover Available Metrics

```
Tool: mcp__observability-mcp__list_metric_descriptors
name: "projects/jarvis-helpdesk-478604"
filter: 'metric.type : "cpu"'
```

### Query Metric Data

```
Tool: mcp__observability-mcp__list_time_series
name: "projects/jarvis-helpdesk-478604"
filter: 'metric.type = "compute.googleapis.com/instance/cpu/usage_time"'
interval: { "startTime": "2026-03-25T08:00:00Z", "endTime": "2026-03-25T10:00:00Z" }
```

Useful for correlating error spikes with resource exhaustion (CPU, memory, disk).

## Step 5: Distributed Tracing

For latency issues or cross-service debugging, use traces.

### List Traces

```
Tool: mcp__observability-mcp__list_traces
projectId: "jarvis-helpdesk-478604"
filter: 'latency:1s'
```

Filter examples:
- Slow requests: `latency:1s` (latency >= 1 second)
- By HTTP status: `http.status_code:500`
- By root span: `root:main.api.HTTP`

### Get Full Trace Details

```
Tool: mcp__observability-mcp__get_trace
projectId: "jarvis-helpdesk-478604"
traceId: "TRACE_ID_FROM_LIST"
```

## Step 6: Check Alerts

### Active Alerts (ongoing incidents)

```
Tool: mcp__observability-mcp__list_alerts
parent: "projects/jarvis-helpdesk-478604"
filter: 'state="OPEN"'
```

### Configured Alert Policies

```
Tool: mcp__observability-mcp__list_alert_policies
name: "projects/jarvis-helpdesk-478604"
```

## Step 7: Synthesis — Root Cause Report

After gathering evidence, provide a structured diagnosis:

1. **Root cause**: What went wrong and why
2. **Impact**: Which users/features were affected, for how long
3. **Evidence**: Specific log entries, error messages, trace IDs, or metric data that confirm the diagnosis
4. **Suggested fix**: Concrete next steps (code change, config update, container restart, infrastructure change)
5. **Prevention**: What could prevent recurrence (monitoring, alerts, error handling, capacity planning)

## Debugging Playbooks

### Symptom → Investigation Path

| Symptom | Start with | Filter hint |
|---------|-----------|-------------|
| API 500 errors | `list_log_entries` | `severity="ERROR" AND jsonPayload.service_name="jarvis-helpdesk-be"` |
| Draft response stuck | `list_log_entries` | `jsonPayload.message:"draftResponse" OR jsonPayload.message:"draft response"` |
| AI agent response failing | `list_log_entries` | `jsonPayload.message:"generateAIAgentResponse"` |
| Knowledge lookup failing | `list_log_entries` | `jsonPayload.message:"knowledge" OR jsonPayload.message:"qdrant"` |
| Auth / token errors | `list_log_entries` | `jsonPayload.context="Passport" AND severity="ERROR"` |
| Subscription blocks | `list_log_entries` | `jsonPayload.message:"subscription has expired"` |
| Validation errors (noisy) | `list_log_entries` | `jsonPayload.context="AllExceptionsFilter" AND jsonPayload.message:"ValidationException"` |
| Slow API responses | `list_traces` | `latency:2s` |
| High error rate spike | `list_group_stats` | `PERIOD_1_HOUR`, `COUNT_DESC` |
| Service down / unreachable | `list_alerts` | `state="OPEN"` then `list_log_entries` for ECONNREFUSED |
| Memory/CPU issues | `list_time_series` | CPU/memory metrics for the instance |
| Celery task timeouts | `list_log_entries` | `jsonPayload.message:"TimeLimitExceeded"` |
| Cross-service failures | `list_log_entries` | Search by tenant UUID across all services, then `list_traces` |

### Complementing SSH Debugging

This skill complements the `prod-debug` skill (SSH + Docker logs). Use GCP logs when:

- SSH access is unavailable or inconvenient
- Need to search across a longer time window (Docker logs rotate)
- Need aggregated error statistics (`list_group_stats`)
- Need distributed tracing across services (`list_traces`)
- Need to correlate with metrics (`list_time_series`)
- Need to check alert history (`list_alerts`)

Use `prod-debug` (SSH) when:

- Need real-time log tailing
- Need to inspect database state (PostgreSQL, Redis, Qdrant)
- Need to restart containers or run system commands
- GCP logging agent is not forwarding the logs needed
