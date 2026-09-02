---
name: setup-server
description: Setup SSH access to Jarvis production server. Generates SSH key, copies to server, configures SSH config. Use when user asks to connect to server, setup SSH, or access production.
user-invocable: true
---

# Setup Server SSH Access

One-time setup for passwordless SSH to the Jarvis Helpdesk production server.

## Prerequisites

- **VPN must be connected** (OpenVPN) — ask the user to confirm VPN is on before proceeding
- Server credentials — ask the user for the server password (do NOT hardcode it)

## Server Info

| Field | Value |
|-------|-------|
| Host | 10.0.0.37 |
| User | jarvis |
| SSH Config Alias | jarvis-helpdesk-vm |

## Steps

### 1. Confirm VPN is connected

Ask the user: "Is your VPN (OpenVPN) connected?" — do NOT proceed until confirmed.

### 2. Check and install sshpass

```bash
which sshpass
```

If not found, ask user to install based on platform:

| Platform | Command |
|----------|---------|
| **macOS** | `brew install hudochenkov/sshpass/sshpass` |
| **Linux (Debian/Ubuntu)** | `sudo apt install sshpass` |
| **Linux (Fedora)** | `sudo dnf install sshpass` |
| **Windows** | Not needed if using Git Bash with ssh-copy-id |

Ask user to run the install command themselves.

### 3. Generate SSH key

```bash
# Check if key already exists
test -f ~/.ssh/jarvis-helpdesk-vm && echo "Key exists" || echo "Key NOT found"
```

If key doesn't exist:
```bash
ssh-keygen -t ed25519 -f ~/.ssh/jarvis-helpdesk-vm -N ""
```

If key already exists, skip this step.

### 4. Copy public key to server

Ask the user for the server password, then run:

```bash
sshpass -p '<PASSWORD>' ssh-copy-id -i ~/.ssh/jarvis-helpdesk-vm.pub jarvis@10.0.0.37
```

Replace `<PASSWORD>` with the password the user provides. **NEVER log or store the password in any file.**

If `sshpass` is not available, ask user to run manually:
```
ssh-copy-id -i ~/.ssh/jarvis-helpdesk-vm.pub jarvis@10.0.0.37
```
They will be prompted to enter the password interactively.

### 5. Setup SSH config

Check if `jarvis-helpdesk-vm` entry already exists:
```bash
grep -c "Host jarvis-helpdesk-vm" ~/.ssh/config 2>/dev/null || echo "0"
```

If not found, append to `~/.ssh/config`:
```
Host jarvis-helpdesk-vm
    HostName 10.0.0.37
    User jarvis
    IdentityFile ~/.ssh/jarvis-helpdesk-vm
```

### 6. Test connection

```bash
ssh jarvis-helpdesk-vm 'echo "Connected as $(whoami) on $(hostname)"'
```

Expected output: `Connected as jarvis on helpdesk`

If it fails:
- **"Connection refused"** → VPN not connected, ask user to check OpenVPN
- **"Permission denied"** → Key not copied correctly, redo step 4
- **"Connection timed out"** → Server unreachable, check VPN and network

### 7. Done

Tell the user:
- `ssh jarvis-helpdesk-vm` to connect to the server
- `ssh jarvis-helpdesk-vm 'command'` to run a remote command
- VPN must always be on before SSH
- Claude will ask for confirmation before running SSH commands (security)

## Common Server Commands

| Task | Command |
|------|---------|
| Check running containers | `ssh jarvis-helpdesk-vm 'docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"'` |
| View container logs | `ssh jarvis-helpdesk-vm 'docker logs --tail 50 <container-name>'` |
| Restart a service | `ssh jarvis-helpdesk-vm 'docker restart <container-name>'` |
| Check disk space | `ssh jarvis-helpdesk-vm 'df -h'` |
| Check memory | `ssh jarvis-helpdesk-vm 'free -h'` |
| Check CPU | `ssh jarvis-helpdesk-vm 'top -bn1 \| head -5'` |

## Container Names Reference

| Service | Container Name |
|---------|---------------|
| Frontend | tp-frontend |
| Backend | tp-backend |
| Backend Workers | tp-workers |
| AI Services | tp-ai-service |
| Agentic API | tp-helpdesk-agentic |
| Celery Worker | tp-celery-worker |
| Celery Draft Worker | tp-celery-draft-response-worker |
| Celery Beat | tp-celery-beat |
| Landing Page | jarvis-helpdesk-landing |
| LiveChat | tp-livechat |
| PostgreSQL | tp-postgres |
| Redis | tp-redis |
| Qdrant | tp-qdrant |
| Nginx | tp-devops-nginx-1 |
| Elasticsearch | tp-elasticsearch |
