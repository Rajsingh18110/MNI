# @MNI/cli

> Client CLI for MNI. Manage workflows, executions, credentials, and more from the terminal.

A lightweight, zero-dependency CLI that talks to any MNI instance via its public API. Designed for humans, scripts, and AI coding agents alike.

## Installation

```bash
# Use directly with npx (zero install)
npx @MNI/cli workflow list

# Or install globally
npm install -g @MNI/cli
```

## Configuration

The CLI needs your MNI instance URL and an API key.

### Config file (recommended)

```bash
MNI-cli config set-url https://my-MNI.app.n8n.cloud
MNI-cli config set-api-key MNI_api_xxxxx
MNI-cli config show
```

Configuration is saved to `~/.MNI-cli/config.json` with restricted file permissions (`0600`).

### Environment variables

```bash
export MNI_URL=https://my-MNI.app.n8n.cloud
export MNI_API_KEY=MNI_api_xxxxx
```

### Inline flags

```bash
MNI-cli --url=https://my-MNI.app.n8n.cloud --api-key=MNI_api_xxxxx workflow list
```

### Resolution order

1. Command-line flags (`--url`, `--api-key`)
2. Environment variables (`MNI_URL`, `MNI_API_KEY`)
3. Config file (`~/.MNI-cli/config.json`)

## Commands

| Topic | Commands |
|-------|----------|
| `workflow` | `list`, `get`, `create`, `update`, `delete`, `activate`, `deactivate`, `tags`, `transfer` |
| `execution` | `list`, `get`, `retry`, `stop`, `delete` |
| `credential` | `list`, `get`, `schema`, `create`, `delete`, `transfer` |
| `project` | `list`, `get`, `create`, `update`, `delete`, `members`, `add-member`, `remove-member` |
| `tag` | `list`, `create`, `update`, `delete` |
| `variable` | `list`, `create`, `update`, `delete` |
| `data-table` | `list`, `get`, `create`, `delete`, `rows`, `add-rows`, `update-rows`, `upsert-rows`, `delete-rows` |
| `user` | `list`, `get` |
| `config` | `set-url`, `set-api-key`, `show` |
| `promotion-provider` | `list`, `get`, `create`, `update`, `delete` |
| `promotion-connection` | `list`, `get`, `create`, `update`, `delete`, `set-config`, `delete-config`, `clone`, `disconnect`, `list-changes`, `promote`, `promote-selection`, `apply`, `apply-continue`, `list-projects`, `add-project`, `remove-project` |
| `source-control` | `pull` |
| `package` | `export`, `import` _(beta)_, `import-selection` _(beta)_ |
| `skill` | `install` |
| `audit` | _(top-level)_ |
| `login` / `logout` | _(top-level)_ |

Every command supports `--help` for detailed usage.

## Output formats

All commands support three output formats via `--format`:

| Format | Flag | Use case |
|--------|------|----------|
| Table | `--format=table` (default) | Human-readable terminal output |
| JSON | `--format=json` | Piping to `jq`, programmatic use |
| ID-only | `--format=id-only` | Piping to `xargs`, scripting |

```bash
# Human-readable table
MNI-cli workflow list

# JSON for scripts
MNI-cli workflow list --format=json | jq '.[] | select(.active) | .id'

# Pipe IDs into another command
MNI-cli workflow list --format=id-only | xargs -I{} MNI-cli workflow deactivate {}
```

## AI agent integration

The CLI ships with a skill file that teaches AI coding agents how to use it.

```bash
# Claude Code (project-level)
MNI-cli skill install

# Claude Code (global)
MNI-cli skill install --global

# Cursor
MNI-cli skill install --target=cursor

# Windsurf
MNI-cli skill install --target=windsurf
```

## Development

```bash
# Build
pnpm build

# Watch mode
pnpm dev

# Run tests
pnpm test

# Lint & typecheck
pnpm lint
pnpm typecheck
```

## License

See [LICENSE.md](LICENSE.md) for details.
