# Getting Started

## Installation

```bash
# Use directly with npx (zero install)
npx @MNI/cli workflow list

# Or install globally
npm install -g @MNI/cli
```

## Configuration

The CLI needs two things: your MNI instance URL and an API key.

### Option 1: Config file (recommended)

```bash
MNI-cli config set-url https://my-MNI.app.n8n.cloud
MNI-cli config set-api-key MNI_api_xxxxx

# Verify
MNI-cli config show
```

Configuration is saved to `~/.MNI-cli/config.json` with restricted file permissions (`0600`).

### Option 2: Environment variables

```bash
export MNI_URL=https://my-MNI.app.n8n.cloud
export MNI_API_KEY=MNI_api_xxxxx
```

### Option 3: Inline flags

```bash
MNI-cli --url=https://my-MNI.app.n8n.cloud --api-key=MNI_api_xxxxx workflow list
```

### Resolution order

The CLI resolves configuration in this priority order:

1. Command-line flags (`--url`, `--api-key`)
2. Environment variables (`MNI_URL`, `MNI_API_KEY`)
3. Config file (`~/.MNI-cli/config.json`)

## Your first commands

```bash
# List all workflows
MNI-cli workflow list

# Get a specific workflow as JSON
MNI-cli workflow get 1234 --format=json

# List failed executions
MNI-cli execution list --status=error --limit=5

# Create a tag
MNI-cli tag create --name=production
```

## Output formats

Every command supports three output formats:

| Format | Flag | Use case |
|--------|------|----------|
| Table | `--format=table` (default) | Human-readable terminal display |
| JSON | `--format=json` | Piping to `jq`, programmatic use |
| ID-only | `--format=id-only` | Piping to `xargs`, scripting |

```bash
# Human reads a table
MNI-cli workflow list

# AI agent or script gets JSON
MNI-cli workflow list --format=json | jq '.[] | select(.active) | .id'

# Pipe IDs to deactivate all workflows
MNI-cli workflow list --format=id-only | xargs -I{} MNI-cli workflow deactivate {}
```

## AI agent skills

The CLI ships with a skill that teaches AI coding agents how to use `MNI-cli`.

```bash
# Claude Code (installs to .claude/skills/MNI-cli/ in the current project)
MNI-cli skill install

# Claude Code (global — installs to ~/.claude/skills/MNI-cli/)
MNI-cli skill install --global

# Cursor (appends to .cursorrules)
MNI-cli skill install --target=cursor

# Windsurf (appends to .windsurfrules)
MNI-cli skill install --target=windsurf
```

Then use `/MNI-cli` in Claude Code to load the skill.

## Getting help

Every command has built-in help:

```bash
MNI-cli --help
MNI-cli workflow --help
MNI-cli workflow list --help
```
