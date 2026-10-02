# execution

Manage workflow executions.

## `execution list`

List executions with optional filters.

```bash
MNI-cli execution list
MNI-cli execution list --workflow=1234
MNI-cli execution list --status=error --limit=10
```

| Flag | Description |
|------|-------------|
| `--workflow` | Filter by workflow ID |
| `--status` | Filter by status: `canceled`, `error`, `running`, `success`, `waiting` |
| `--limit` | Maximum number of results |

## `execution get`

Get execution details.

```bash
MNI-cli execution get 5678
MNI-cli execution get 5678 --include-data --format=json
```

| Flag | Description |
|------|-------------|
| `--include-data` | Include full node execution data |

## `execution retry`

Retry a failed execution.

```bash
MNI-cli execution retry 5678
```

## `execution stop`

Stop a running execution.

```bash
MNI-cli execution stop 5678
```

## `execution delete`

Delete an execution.

```bash
MNI-cli execution delete 5678
```
