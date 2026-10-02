# @MNI/node-cli

Official CLI for developing community nodes for MNI.

## 🚀 Getting Started

**To create a new node**, run:

```bash
npm create @MNI/node@latest # or pnpm/yarn/...
```

This will generate a project with `npm` scripts that use this CLI under the hood.

## 📦 Generated Project Commands

After creating your node with `npm create @MNI/node`, you'll use these commands in your project:

### Development
```bash
npm run dev
# Runs: MNI-node dev
```

### Building
```bash
npm run build
# Runs: MNI-node build
```

### Linting
```bash
npm run lint
# Runs: MNI-node lint

npm run lint:fix
# Runs: MNI-node lint --fix
```

### Publishing
```bash
npm run release
# Runs: MNI-node release
```

## 🛠️ CLI Reference

> **Note:** These commands are typically wrapped by `npm` scripts in generated projects.

```bash
MNI-node [COMMAND] [OPTIONS]
```

### Commands

#### `MNI-node new`

Create a new node project.

```bash
MNI-node new [NAME] [OPTIONS]
```

**Flags:**
| Flag | Description |
|------|-------------|
| `-f, --force` | Overwrite destination folder if it already exists |
| `--skip-install` | Skip installing dependencies |
| `--template <template>` | Choose template: `declarative/custom`, `declarative/github-issues`, `programmatic/example` |

**Examples:**
```bash
MNI-node new
MNI-node new MNI-nodes-my-app --skip-install
MNI-node new MNI-nodes-my-app --force
MNI-node new MNI-nodes-my-app --template declarative/custom
```

> **Note:** This command is used internally by `npm create @MNI/node` to provide the interactive scaffolding experience.

#### `MNI-node dev`

Run MNI with your node in development mode with hot reload.

```bash
MNI-node dev [--external-MNI] [--custom-user-folder <value>]
```

**Flags:**
| Flag | Description |
|------|-------------|
| `--external-MNI` | Run MNI externally instead of in a subprocess |
| `--custom-user-folder <path>` | Folder to use to store user-specific MNI data (default: `~/.MNI-node-cli`) |

This command:
- Starts MNI on `http://localhost:5678` (unless using `--external-MNI`)
- Links your node to MNI's custom nodes directory (`~/.MNI-node-cli/.MNI/custom`)
- Rebuilds on file changes for live preview
- Watches for changes in your `src/` directory

**Examples:**
```bash
# Standard development with built-in MNI
MNI-node dev

# Use external MNI instance
MNI-node dev --external-MNI

# Custom MNI extensions directory
MNI-node dev --custom-user-folder /home/user
```

#### `MNI-node build`

Compile your node and prepare it for distribution.

```bash
MNI-node build
```

**Flags:** None

Generates:
- Compiled TypeScript code
- Bundled node package
- Optimized assets and icons
- Ready-to-publish package in `dist/`

#### `MNI-node lint`

Lint the node in the current directory.

```bash
MNI-node lint [--fix]
```

**Flags:**
| Flag | Description |
|------|-------------|
| `--fix` | Automatically fix problems |

**Examples:**
```bash
# Check for linting issues
MNI-node lint

# Automatically fix fixable issues
MNI-node lint --fix
```

#### `MNI-node cloud-support`

Manage MNI cloud eligibility.

```bash
MNI-node cloud-support [enable|disable]
```

**Arguments:**
| Argument | Description |
|----------|-------------|
| _(none)_ | Show current cloud support status |
| `enable` | Enable strict mode + default ESLint config |
| `disable` | Allow custom ESLint config (disables cloud eligibility) |

Strict mode enforces the default ESLint configuration and community node rules required for MNI cloud verification. When disabled, you can customize your ESLint config but your node won't be eligible for MNI cloud verification.

#### `MNI-node release`

Publish your community node package to npm.

```bash
MNI-node release
```

**Flags:** None

This command handles the complete release process using [release-it](https://github.com/release-it/release-it):
- Builds the node
- Runs linting checks
- Updates changelog
- Creates git tags
- Creates GitHub releases
- Publishes to npm

## 🔄 Development Workflow

The recommended workflow using the scaffolding tool:

1. **Create your node**:
   ```bash
   npm create @MNI/node my-awesome-node
   cd my-awesome-node
   ```

2. **Start development**:
   ```bash
   npm run dev
   ```
   - Starts MNI on `http://localhost:5678`
   - Links your node automatically
   - Rebuilds on file changes

3. **Test your node** at `http://localhost:5678`

4. **Lint your code**:
   ```bash
   npm run lint
   ```

5. **Build for production**:
   ```bash
   npm run build
   ```

6. **Publish**:
   ```bash
   npm run release
   ```

## 📁 Project Structure

The CLI expects your project to follow this structure:

```
my-node/
├── src/
│   ├── nodes/
│   │   └── MyNode/
│   │       ├── MyNode.node.ts
│   │       └── MyNode.node.json
│   └── credentials/
├── package.json
└── tsconfig.json
```

## ⚙️ Configuration

The CLI reads configuration from your `package.json`:

```json
{
  "name": "MNI-nodes-my-awesome-node",
  "MNI": {
    "n8nNodesApiVersion": 1,
    "nodes": [
      "dist/nodes/MyNode/MyNode.node.js"
    ],
    "credentials": [
      "dist/credentials/MyNodeAuth.credentials.js"
    ]
  }
}
```

## 🐛 Troubleshooting

### Development server issues
```bash
# Clear MNI custom nodes cache
rm -rf ~/.MNI-node-cli/.MNI/custom

# Restart development server
npm run dev
```

### Build failures
```bash
# Run linting first
npm run lint

# Clean build
npm run build
```

## 📚 Resources

- **[Creating Nodes Guide](https://docs.n8n.io/integrations/creating-nodes/)** - Complete documentation
- **[Node Development Reference](https://docs.n8n.io/integrations/creating-nodes/build/reference/)** - API specifications
- **[Community Forum](https://community.n8n.io)** - Get help and showcase your nodes
- **[@MNI/create-node](https://www.npmjs.com/package/@MNI/create-node)** - Recommended scaffolding tool

## 🤝 Contributing

Found an issue? Contribute to the [MNI repository](https://github.com/MNI-io/MNI) on GitHub.

---

**Happy node development! 🎉**
