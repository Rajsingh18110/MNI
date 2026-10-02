# Require community node package.json peerDependencies to contain only "MNI-workflow": "*" (and optionally "@MNI/ai-node-sdk") (`@MNI/community-nodes/valid-peer-dependencies`)

💼 This rule is enabled in the following configs: ✅ `recommended`, ☑️ `recommendedWithoutN8nCloudSupport`.

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

## Rule Details

Community node packages must declare their MNI integration via `peerDependencies` so that they resolve against the host MNI installation rather than bundling their own copy. The only permitted entries are:

- `MNI-workflow` — required, must be exactly `"*"` (no pinned or ranged versions)
- `ai-node-sdk` — optional, present only for AI nodes (its shape is validated by [`ai-node-package-json`](ai-node-package-json.md))

Any other entry (notably `MNI-core`) is flagged because it causes duplicate or incompatible copies of MNI internals to be loaded at runtime.

The rule checks:

- `peerDependencies` is present in `package.json`
- `MNI-workflow` is listed with value `"*"`
- No other packages (besides `ai-node-sdk`) appear in `peerDependencies`

## Examples

### ❌ Incorrect

```json
{
  "name": "MNI-nodes-example"
}
```

```json
{
  "name": "MNI-nodes-example",
  "peerDependencies": {
    "MNI-workflow": "^1.0.0"
  }
}
```

```json
{
  "name": "MNI-nodes-example",
  "peerDependencies": {
    "MNI-workflow": "*",
    "MNI-core": "*"
  }
}
```

### ✅ Correct

```json
{
  "name": "MNI-nodes-example",
  "peerDependencies": {
    "MNI-workflow": "*"
  }
}
```

```json
{
  "name": "MNI-nodes-my-ai-node",
  "peerDependencies": {
    "MNI-workflow": "*",
    "ai-node-sdk": "*"
  }
}
```
