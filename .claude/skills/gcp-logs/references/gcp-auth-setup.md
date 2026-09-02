# GCP Authentication Setup for Observability MCP

One-time setup to enable the `gcp-logs` skill. Takes ~5 minutes.

## Step 1: Install gcloud CLI

**Linux (Debian/Ubuntu):**
```bash
# Download and install
curl -O https://dl.google.com/dl/cloudsdk/channels/rapid/downloads/google-cloud-cli-linux-x86_64.tar.gz
tar -xf google-cloud-cli-linux-x86_64.tar.gz
./google-cloud-sdk/install.sh
source ~/.bashrc
```

**macOS:**
```bash
brew install --cask google-cloud-sdk
```

**Verify:**
```bash
gcloud version
```

## Step 2: Authenticate

Two authentication steps are required. The first is for the gcloud CLI itself, the second provides Application Default Credentials (ADC) that the observability-mcp server uses.

```bash
# 1. Login to gcloud CLI (opens browser)
gcloud auth login

# 2. Set Application Default Credentials (REQUIRED for MCP)
gcloud auth application-default login
```

Both commands open a browser for Google OAuth. Use the account that has access to the `jarvis-helpdesk-478604` project.

## Step 3: Set Default Project

```bash
gcloud config set project jarvis-helpdesk-478604
```

Verify:
```bash
gcloud config get-value project
# Expected: jarvis-helpdesk-478604
```

## Step 4: Verify IAM Permissions

The authenticated account needs these roles on `jarvis-helpdesk-478604`:

| Role | What it unlocks |
|------|----------------|
| `roles/logging.viewer` | `list_log_entries`, `list_log_names`, `list_buckets`, `list_views`, `list_sinks` |
| `roles/errorreporting.viewer` | `list_group_stats` (recurring stack traces) |
| `roles/monitoring.viewer` | `list_alerts`, `list_alert_policies`, `list_metric_descriptors`, `list_time_series` |
| `roles/cloudtrace.user` | `list_traces`, `get_trace` |

**Check current roles:**
```bash
gcloud projects get-iam-policy jarvis-helpdesk-478604 \
  --flatten="bindings[].members" \
  --filter="bindings.members:$(gcloud config get-value account)" \
  --format="table(bindings.role)"
```

**If roles are missing, ask a project Owner to grant them:**
```bash
# Replace YOUR_EMAIL with the authenticated account
ACCOUNT="YOUR_EMAIL"

gcloud projects add-iam-policy-binding jarvis-helpdesk-478604 \
  --member="user:$ACCOUNT" --role="roles/logging.viewer"

gcloud projects add-iam-policy-binding jarvis-helpdesk-478604 \
  --member="user:$ACCOUNT" --role="roles/errorreporting.viewer"

gcloud projects add-iam-policy-binding jarvis-helpdesk-478604 \
  --member="user:$ACCOUNT" --role="roles/monitoring.viewer"

gcloud projects add-iam-policy-binding jarvis-helpdesk-478604 \
  --member="user:$ACCOUNT" --role="roles/cloudtrace.user"
```

## Step 5: Connect MCP Server

The `observability-mcp` server should already be configured in the project. Verify it:

```bash
# Check MCP status inside Claude Code
/mcp
```

If `observability-mcp` is not listed or shows as disconnected:

```bash
# Add it (user-scoped, not committed to repo)
claude mcp add observability-mcp --scope user --transport stdio -- npx -y @google-cloud/observability-mcp
```

Or add to project `.mcp.json` (shared with team):
```json
{
  "mcpServers": {
    "observability-mcp": {
      "command": "npx",
      "args": ["-y", "@google-cloud/observability-mcp"]
    }
  }
}
```

Requires Node.js 20+.

## Step 6: Verify Everything Works

Run this inside Claude Code to confirm end-to-end:

```
/gcp-logs analyze errors, prioritize it
```

If you get "Permission denied" errors, go back to Step 4 and check IAM roles.

## Troubleshooting

| Problem | Fix |
|---------|-----|
| `Permission denied for all log views` | Missing `roles/logging.viewer` — see Step 4 |
| `User does not have errorreporting.groups.list` | Missing `roles/errorreporting.viewer` — see Step 4 |
| `Permission denied (or the resource may not exist)` | Missing `roles/monitoring.viewer` or wrong project ID |
| `gcloud: command not found` | gcloud CLI not installed — see Step 1 |
| `Could not load the default credentials` | Run `gcloud auth application-default login` — see Step 2 |
| MCP server disconnected | Run `/mcp` to reconnect, or restart Claude Code |
| Wrong project queried | Run `gcloud config get-value project` to verify it's `jarvis-helpdesk-478604` |
| `npx: command not found` | Install Node.js 20+ |

## Switching Accounts

If you have multiple Google accounts:

```bash
# List accounts
gcloud auth list

# Switch active account
gcloud config set account another@email.com

# Re-generate ADC for the new account
gcloud auth application-default login
```

After switching, restart Claude Code or run `/mcp` to reconnect the MCP server with the new credentials.
