---
name: setup-env
description: Setup environment variables for all apps. Installs age if needed, decrypts encrypted .env files, or encrypts current .env files. Use when user asks to setup env, decrypt env, or encrypt env.
user-invocable: true
---

# Setup Environment Variables

Automated setup for encrypted `.env` files across all apps using `age` encryption.

## Prerequisites

- `age` encryption tool (this skill will install it automatically if missing)
- `.env.key` file in the repo root (get from team lead if you don't have it)

## Steps

### 1. Detect platform and check `age`

```bash
# Check OS
uname -s 2>/dev/null || echo "Windows"

# Check if age is installed
which age 2>/dev/null || where age 2>nul
```

If `age` is not found, guide the user based on their platform:

| Platform | Install command |
|----------|----------------|
| **macOS** | `brew install age` |
| **Linux (Debian/Ubuntu)** | `sudo apt install age` |
| **Linux (Fedora)** | `sudo dnf install age` |
| **Windows (scoop)** | `scoop install age` |
| **Windows (choco)** | `choco install age.portable` |

Ask the user to run the install command themselves since it may require elevated permissions:
```
Please install age first by running: ! brew install age
(or the appropriate command for your OS)
```
Then wait for confirmation before proceeding.

### 2. Check for `.env.key`

```bash
test -f .env.key && echo "Key found" || echo "Key NOT found"
```

If `.env.key` is missing:
- Tell the user: "You need the `.env.key` file to decrypt environments. Get it from your team lead (via 1Password, Slack DM, etc.) and place it in the repo root."
- Stop here until the user provides the key.

### 3. Decrypt all environments

Choose the right script based on platform:

**macOS / Linux / Git Bash on Windows:**
```bash
./scripts/env-decrypt.sh
```

**Windows PowerShell:**
```powershell
.\scripts\env-decrypt.ps1
```

Both scripts decrypt all encrypted `.env.age` files from `envs/` into each app:

| Encrypted file | Decrypts to |
|---------------|-------------|
| `envs/fe.env.age` | `apps/fe/.env` |
| `envs/be.env.age` | `apps/be/.env` |
| `envs/ai-services.env.age` | `apps/ai-services/.env` |
| `envs/agentic.env.age` | `apps/agentic/.env` |
| `envs/landing-page.env.age` | `apps/landing-page/.env` |
| `envs/devops-landing.env.age` | `infra/devops/.env.landing` |

### 4. Decrypt specific repo only

```bash
# Bash
./scripts/env-decrypt.sh be          # Only backend
./scripts/env-decrypt.sh fe agentic  # Frontend + Agentic

# PowerShell
.\scripts\env-decrypt.ps1 be
.\scripts\env-decrypt.ps1 fe, agentic
```

Available names: `fe`, `be`, `ai-services`, `agentic`, `landing-page`, `devops-landing`

## Encrypting (after updating .env)

When the user has updated a `.env` file and wants to encrypt it:

```bash
# Bash — all repos
./scripts/env-encrypt.sh
# Bash — specific repo
./scripts/env-encrypt.sh be

# PowerShell — all repos
.\scripts\env-encrypt.ps1
# PowerShell — specific repo
.\scripts\env-encrypt.ps1 be
```

After encrypting, remind the user to:
1. `git add envs/` to stage the encrypted files
2. Commit and push so teammates can pull the updated envs

## Troubleshooting

- **"age: command not found"** → Install age (see step 1)
- **".env.key not found"** → Get the private key file from team lead
- **"no identity matched any of the recipients"** → Wrong `.env.key`, ask team lead for the correct one
- **"SKIP ... not found"** → That repo doesn't have an encrypted .env yet, which is normal
- **Windows: "running scripts is disabled"** → Run `Set-ExecutionPolicy RemoteSigned -Scope CurrentUser` first
