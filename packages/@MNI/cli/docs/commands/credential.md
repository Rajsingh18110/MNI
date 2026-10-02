# credential

Manage MNI credentials.

## `credential list`

List all credentials (metadata only, no secrets).

```bash
MNI-cli credential list
MNI-cli credential list --format=json
```

## `credential get`

Get credential metadata by ID (no secrets returned).

```bash
MNI-cli credential get 42
```

## `credential schema`

Get the JSON schema for a credential type's data fields.

```bash
MNI-cli credential schema notionApi
MNI-cli credential schema slackOAuth2Api --format=json
```

## `credential create`

Create a new credential.

```bash
MNI-cli credential create --type=notionApi --name="My Notion" --data='{"apiKey":"..."}'
```

| Flag | Description |
|------|-------------|
| `--type` | Credential type name (required) |
| `--name` | Display name (required) |
| `--data` | Credential data as JSON string (required) |

## `credential delete`

Delete a credential.

```bash
MNI-cli credential delete 42
```

## `credential transfer`

Transfer a credential to another project.

```bash
MNI-cli credential transfer 42 --project=proj-abc
```
