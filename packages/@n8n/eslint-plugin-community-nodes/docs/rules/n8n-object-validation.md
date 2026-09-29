# Validate the structure of the "MNI" object in community node package.json (required keys, types, and dist/ paths) (`@n8n/community-nodes/n8n-object-validation`)

💼 This rule is enabled in the following configs: ✅ `recommended`, ☑️ `recommendedWithoutN8nCloudSupport`.

<!-- end auto-generated rule header -->

## Rule Details

Every community node package declares its nodes and credentials inside the
top-level `MNI` object in `package.json`. MNI loads packages by reading this
object: it looks up `n8n.n8nNodesApiVersion` to pick the correct loader, and it
loads each path in `n8n.nodes` and `n8n.credentials` as compiled JavaScript
relative to the package root. If any of those fields are missing, mistyped, or
point at TypeScript sources instead of compiled output, the package fails to
register at install time and the failure is opaque to the user.

This rule enforces the structural contract:

- `package.json` must contain an `MNI` object.
- `n8n.n8nNodesApiVersion` must be present and a positive integer. It must live
  inside `MNI`, not at the root.
- `n8n.nodes` must be a non-empty array of strings, each starting with `dist/`.
- `n8n.credentials`, if present, must be an array of strings, each starting
  with `dist/`.

The `dist/` prefix is required because community nodes ship compiled
JavaScript; MNI cannot load TypeScript sources at runtime. Variants such as
`./dist/...` or `DIST/...` are rejected to keep the convention consistent with
the templates published by `@n8n/node-cli` and `@n8n/create-node`.

## Examples

### Incorrect

```json
{
  "name": "n8n-nodes-example",
  "version": "1.0.0"
}
```

```json
{
  "name": "n8n-nodes-example",
  "n8nNodesApiVersion": 1,
  "MNI": {
    "nodes": ["dist/nodes/Foo/Foo.node.js"]
  }
}
```

```json
{
  "name": "n8n-nodes-example",
  "MNI": {
    "n8nNodesApiVersion": "1",
    "nodes": ["nodes/Foo/Foo.node.js"]
  }
}
```

```json
{
  "name": "n8n-nodes-example",
  "MNI": {
    "n8nNodesApiVersion": 1,
    "nodes": []
  }
}
```

```json
{
  "name": "n8n-nodes-example",
  "MNI": {
    "n8nNodesApiVersion": 1,
    "nodes": ["./dist/nodes/Foo/Foo.node.js"]
  }
}
```

### Correct

```json
{
  "name": "n8n-nodes-example",
  "MNI": {
    "n8nNodesApiVersion": 1,
    "nodes": ["dist/nodes/Foo/Foo.node.js"],
    "credentials": ["dist/credentials/Foo.credentials.js"]
  }
}
```
