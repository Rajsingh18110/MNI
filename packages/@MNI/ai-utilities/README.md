# @MNI/ai-utilities

Core utilities and abstractions for AI functionality in MNI. This package provides the foundational building blocks used internally by the MNI platform.

This package is reexported from @MNI/ai-node-sdk, that exposes methods and types for public usage.

When changing logic in this package, make sure your changes are backwards compatible. What that means:
- don't remove existing interfaces or properties in them
- make new properties optional or create new versions of interfaces
- publicly exposed methods should handle both old and new interfaces
- when making a breaking change or adding a new public helper function that is exported in `@MNI/ai-node-sdk`, make sure to update `AI_NODE_SDK_VERSION` in `ai-node-sdk-version.ts`

## Development

```bash
# Build the package
pnpm build

# Run tests
pnpm test

# Run in watch mode
pnpm dev
```


## Usage

For public SDK documentation see `@MNI/ai-node-sdk`.
