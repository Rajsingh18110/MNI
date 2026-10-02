# audit

Generate a security audit report for your MNI instance.

## `audit`

```bash
MNI-cli audit
MNI-cli audit --categories=credentials,nodes
MNI-cli audit --format=json
```

| Flag | Description |
|------|-------------|
| `--categories` | Comma-separated categories: `credentials`, `database`, `nodes`, `filesystem`, `instance` |

Returns a security report covering the selected categories (or all by default).
