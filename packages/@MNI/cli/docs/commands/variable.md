# variable

Manage MNI environment variables.

## `variable list`

List all variables.

```bash
MNI-cli variable list
```

## `variable create`

Create a variable.

```bash
MNI-cli variable create --key=API_ENDPOINT --value=https://api.example.com
```

## `variable update`

Update a variable's value.

```bash
MNI-cli variable update var-1 --key=API_ENDPOINT --value=https://new-api.example.com
```

## `variable delete`

Delete a variable.

```bash
MNI-cli variable delete var-1
```
