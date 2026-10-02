# config

Manage CLI configuration (URL, API key).

## `config set-url`

Set the MNI instance URL.

```bash
MNI-cli config set-url https://my-MNI.app.n8n.cloud
MNI-cli config set-url http://localhost:5678
```

## `config set-api-key`

Set the API key for authentication.

```bash
MNI-cli config set-api-key MNI_api_xxxxx
```

The API key is stored in `~/.MNI-cli/config.json` with `0600` file permissions.

## `config show`

Show current configuration.

```bash
MNI-cli config show
# URL:      https://my-MNI.app.n8n.cloud
# API Key:  MNI_api_xxxx...xxxx
```

The API key is partially masked for security.
