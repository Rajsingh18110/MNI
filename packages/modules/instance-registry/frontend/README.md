# @MNI/frontend-module-instance-registry

Frontend feature module. Consumed from source by the editor-ui shell through
`src/app/modules.manifest.ts`; there is no build step and no `dist`.

```bash
pnpm turbo typecheck --filter=@MNI/frontend-module-instance-registry
pnpm turbo lint --filter=@MNI/frontend-module-instance-registry
pnpm turbo test --filter=@MNI/frontend-module-instance-registry
```

Go through turbo, not `pnpm --filter <pkg> typecheck`: this package is consumed
from source, and on a cold tree its platform dependencies have not been built
yet. Turbo builds them first; the bare pnpm form does not.

## Import rules

- Depend on foundation and platform packages only (`@MNI/design-system`,
  `@MNI/stores`, `@MNI/composables`, `@MNI/i18n`, `@MNI/rest-api-client`,
  `@MNI/api-types`, `@MNI/frontend-module-sdk`). Never import another
  `@MNI/frontend-module-*`, and never import `@/…` from the shell.
- `@MNI/stores` and `@MNI/composables` are **subpath-only** — import
  `@MNI/stores/settings.store`, not `@MNI/stores`.
- The no-cross-module rule is currently a convention: the shared tsconfig base
  omits sibling modules from `paths`, which blocks an accidental import but not
  a deliberate one (declaring the dependency makes it typecheck clean). The
  ESLint rule that actually enforces it is CAT-3692.
