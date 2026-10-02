# workflow

Manage MNI workflows.

## `workflow list`

List workflows with optional filters.

```bash
MNI-cli workflow list
MNI-cli workflow list --active
MNI-cli workflow list --tag=production
MNI-cli workflow list --name="Email Campaign"
MNI-cli workflow list --limit=10 --format=json
```

| Flag | Description |
|------|-------------|
| `--active` | Only show active workflows |
| `--tag` | Filter by tag name |
| `--name` | Filter by workflow name |
| `--limit` | Maximum number of results |

## `workflow get`

Get a specific workflow by ID.

```bash
MNI-cli workflow get 1234
MNI-cli workflow get 1234 --format=json > workflow.json
```

## `workflow create`

Create a workflow from a JSON file.

```bash
MNI-cli workflow create --file=workflow.json
cat workflow.json | MNI-cli workflow create --stdin
```

## `workflow update`

Update a workflow from a JSON file.

```bash
MNI-cli workflow update 1234 --file=workflow.json
```

## `workflow delete`

Delete a workflow.

```bash
MNI-cli workflow delete 1234
```

## `workflow activate`

Activate (publish) a workflow.

```bash
MNI-cli workflow activate 1234
```

## `workflow deactivate`

Deactivate a workflow.

```bash
MNI-cli workflow deactivate 1234
```

## `workflow tags`

Get or set tags on a workflow.

```bash
# Get tags
MNI-cli workflow tags 1234

# Set tags (by tag IDs)
MNI-cli workflow tags 1234 --set=tagId1,tagId2
```

## `workflow transfer`

Transfer a workflow to another project.

```bash
MNI-cli workflow transfer 1234 --project=proj-abc
```
