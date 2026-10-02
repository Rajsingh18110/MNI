# project

Manage MNI projects and members.

## `project list`

List all projects.

```bash
MNI-cli project list
```

## `project get`

Get a project by ID.

```bash
MNI-cli project get proj-abc
```

## `project create`

Create a new project.

```bash
MNI-cli project create --name="AI Workflows"
```

## `project update`

Update a project's name.

```bash
MNI-cli project update proj-abc --name="New Name"
```

## `project delete`

Delete a project.

```bash
MNI-cli project delete proj-abc
```

## `project members`

List members of a project.

```bash
MNI-cli project members proj-abc
```

## `project add-member`

Add a user to a project with a role.

```bash
MNI-cli project add-member proj-abc --user=user-123 --role=project:editor
```

## `project remove-member`

Remove a user from a project.

```bash
MNI-cli project remove-member proj-abc --user=user-123
```
