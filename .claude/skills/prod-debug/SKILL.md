---
name: prod-debug
description: "Diagnose production issues on the Jarvis Helpdesk server using SSH, Docker logs, PostgreSQL, Redis, and Qdrant inspection. Load this before any production debugging."
---

# Production Debugging Guide

All commands run via SSH to `jarvis-helpdesk-vm`. VPN (OpenVPN) must be connected.

## Step 0: Prerequisites

Verify SSH access is configured. If not, load the `setup-server` skill first.

```bash
ssh jarvis-helpdesk-vm 'echo "Connected as $(whoami) on $(hostname)"'
```

Expected: `Connected as jarvis on helpdesk`

If this fails: check VPN connection, then run `/setup-server` skill.

## Step 1: Triage

Before touching any tools, gather context from the user:

- **Symptoms**: What is broken? (errors, slowness, missing data, failed jobs)
- **Timeframe**: When did it start? Is it ongoing?
- **Scope**: Which users, tenants, or features are affected?
- **Error messages**: Any error screenshots or messages from users?

## Step 2: Container Health

Check all running containers:

```bash
ssh jarvis-helpdesk-vm 'docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"'
```

Look for: containers not running, restarting loops, or unhealthy status.

### Container Reference

| Service | Container | Port |
|---------|-----------|------|
| Frontend | tp-frontend | 3333:3000 |
| Backend | tp-backend | 3334:3030 |
| Backend Workers | tp-workers | — |
| AI Services | tp-ai-service | 3345:5556 |
| Agentic API | tp-helpdesk-agentic | 3342:8000 |
| Celery Worker | tp-celery-worker | — |
| Celery Draft Worker | tp-celery-draft-response-worker | — |
| Celery Beat | tp-celery-beat | — |
| Landing Page | jarvis-helpdesk-landing | 3336:3001 |
| LiveChat | tp-livechat | 3338:4000 |
| PostgreSQL | tp-postgres | 3335:5432 |
| Redis | tp-redis | 3346:6379 |
| Qdrant | tp-qdrant | 3343:6333 |
| Nginx | nginx | 80/443 |
| Elasticsearch | tp-elasticsearch | 9200 |
| Phoenix | tp-phoenix | 3347:6006 |
| Adminer | tp-adminer | 3340:8080 |
| Directus | tp-directus | 8055 |

Check a specific container's recent events:

```bash
ssh jarvis-helpdesk-vm 'docker inspect --format="{{.State.Status}} - Restarts: {{.RestartCount}} - Started: {{.State.StartedAt}}" <container-name>'
```

## Step 3: Container Logs

### Recent errors (quick scan)

```bash
# Last 50 lines from a specific container
ssh jarvis-helpdesk-vm 'docker logs --tail 50 <container-name>'

# Last 50 lines with timestamps
ssh jarvis-helpdesk-vm 'docker logs --tail 50 -t <container-name>'

# Errors from the last 30 minutes
ssh jarvis-helpdesk-vm 'docker logs --since 30m <container-name> 2>&1 | grep -i error'
```

### Common log checks by symptom

| Symptom | Check these containers |
|---------|----------------------|
| API errors / 500s | tp-backend, tp-ai-service |
| Draft response not working | tp-celery-draft-response-worker, tp-helpdesk-agentic |
| Knowledge lookup failing | tp-celery-worker, tp-qdrant |
| SSE not updating | tp-backend (SSE events), tp-ai-service (callbacks) |
| Slow responses | tp-backend, tp-ai-service, tp-helpdesk-agentic |
| Login / auth issues | tp-backend, tp-postgres |
| Landing page down | jarvis-helpdesk-landing, tp-devops-nginx-1 |
| LiveChat not loading | tp-livechat, tp-devops-nginx-1 |

### Search logs with patterns

```bash
# Search for specific error
ssh jarvis-helpdesk-vm 'docker logs --since 1h tp-backend 2>&1 | grep -i "traceback\|error\|exception"'

# Search for a specific task ID
ssh jarvis-helpdesk-vm 'docker logs --since 1h tp-celery-worker 2>&1 | grep "TASK_ID_HERE"'

# Search for a specific tenant
ssh jarvis-helpdesk-vm 'docker logs --since 1h tp-backend 2>&1 | grep "TENANT_ID_HERE"'
```

## Step 4: Database Inspection

### PostgreSQL

```bash
# Open psql shell
ssh jarvis-helpdesk-vm 'docker exec -it tp-postgres psql -U postgres'

# One-off query (non-interactive)
ssh jarvis-helpdesk-vm 'docker exec tp-postgres psql -U postgres -c "SELECT count(*) FROM tenants;"'
```

Useful queries:

```sql
-- Check recent errors in background tasks
SELECT id, type, status, error, created_at
FROM background_tasks
WHERE status = 'failed'
ORDER BY created_at DESC
LIMIT 20;

-- Check active connections
SELECT count(*) FROM pg_stat_activity WHERE state = 'active';

-- Check table sizes
SELECT relname, pg_size_pretty(pg_total_relation_size(relid))
FROM pg_catalog.pg_statio_user_tables
ORDER BY pg_total_relation_size(relid) DESC
LIMIT 10;
```

### Redis

```bash
# Check Redis info
ssh jarvis-helpdesk-vm 'docker exec tp-redis redis-cli info'

# Check memory usage
ssh jarvis-helpdesk-vm 'docker exec tp-redis redis-cli info memory | grep used_memory_human'

# Check connected clients
ssh jarvis-helpdesk-vm 'docker exec tp-redis redis-cli info clients | grep connected_clients'

# Check BullMQ queue lengths
ssh jarvis-helpdesk-vm 'docker exec tp-redis redis-cli keys "bull:*" | head -20'
```

### Qdrant

```bash
# Check Qdrant collections
ssh jarvis-helpdesk-vm 'curl -s http://localhost:6333/collections | python3 -m json.tool'

# Check specific collection info
ssh jarvis-helpdesk-vm 'curl -s http://localhost:6333/collections/COLLECTION_NAME | python3 -m json.tool'
```

## Step 5: System Resources

```bash
# Disk space
ssh jarvis-helpdesk-vm 'df -h'

# Memory usage
ssh jarvis-helpdesk-vm 'free -h'

# CPU and top processes
ssh jarvis-helpdesk-vm 'top -bn1 | head -15'

# Docker disk usage
ssh jarvis-helpdesk-vm 'docker system df'
```

## Step 6: Research & Cross-Reference

Before synthesizing, use built-in tools to deepen your analysis:

- **WebSearch** — Research specific error messages, stack traces, or library-specific issues. Search GitHub issues or Stack Overflow for known problems.
- **GCP Logs cross-reference** — If the `gcp-logs` skill is available, cross-reference Docker logs with Cloud Logging for a fuller picture (especially for requests that span multiple services).
- **Jira MCP** — Check if similar incidents were reported before by searching Jira: `mcp__claude_ai_Atlassian__searchJiraIssuesUsingJql` with relevant keywords.

## Step 7: Synthesis

After gathering data, provide a structured summary:

1. **Root cause**: What went wrong and why
2. **Impact**: Which users/features were affected, for how long
3. **Evidence**: Specific log lines, error messages, or query results that confirm the diagnosis
4. **Suggested fix**: Concrete next steps (code change, config update, container restart, etc.)
5. **Prevention**: What could prevent this from recurring (monitoring, validation, error handling, etc.)

## Common Issues Quick Reference

| Issue | Likely Cause | Quick Fix |
|-------|-------------|-----------|
| Container restarting | OOM or crash loop | Check logs, increase memory limit |
| Celery tasks stuck | Worker crashed or queue full | Restart worker, check Redis |
| Qdrant queries slow | Collection too large or not indexed | Check collection stats |
| 502 Bad Gateway | Backend container down | Restart tp-backend or tp-ai-service |
| SSE not working | Backend not sending events | Check tp-backend logs for SSE errors |
| Disk full | Docker images/logs accumulating | `docker system prune` |
