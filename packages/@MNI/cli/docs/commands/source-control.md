# source-control

Interact with MNI's source control integration.

## `source-control pull`

Pull changes from the remote Git repository.

```bash
MNI-cli source-control pull
MNI-cli source-control pull --force
```

| Flag | Description |
|------|-------------|
| `--force` | Force pull, overwriting local changes |

Requires the Source Control feature to be licensed and connected to a Git remote.
