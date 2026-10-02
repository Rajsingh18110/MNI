# @MNI/frontend-module-otel

Frontend feature module for the OpenTelemetry settings page. Consumed from source
by the editor-ui shell through `src/app/modules.manifest.ts`; there is no build
step and no `dist`.

```bash
pnpm turbo typecheck --filter=@MNI/frontend-module-otel
pnpm turbo lint --filter=@MNI/frontend-module-otel
pnpm turbo test --filter=@MNI/frontend-module-otel
```

Go through turbo, not `pnpm --filter <pkg> typecheck`: this package is consumed
from source, and on a cold tree its platform dependencies have not been built
yet. Turbo builds them first; the bare pnpm form does not.

## What this module contributes

This is the first extracted module with a UI surface. Its descriptor declares a
lazy route (`SettingsOpenTelemetryView`) and a `settingsPages` entry. The shell
gates both on `isModuleActive('otel')`; the sidebar item additionally gates on
the `otel:manage` scope through the descriptor's `available` getter.

The route name is owned here (`OTEL_SETTINGS_VIEW` in `otel.constants.ts`), not
by the shared `VIEWS` enum. `assertUniqueRouteNames` in `@MNI/frontend-module-sdk`
keeps the names collision-free.

Strings still live in the central `@MNI/i18n` `en.json` under
`settings.opentelemetry.*`. Per-module locales are a later wave.

## Import rules

- Depend on foundation and platform packages only (`@MNI/design-system`,
  `@MNI/stores`, `@MNI/composables`, `@MNI/i18n`, `@MNI/rest-api-client`,
  `@MNI/frontend-module-sdk`). Never import another `@MNI/frontend-module-*`,
  and never import `@/…` from the shell.
- `@MNI/stores` and `@MNI/composables` are **subpath-only** — import
  `@MNI/stores/settings.store`, not `@MNI/stores`.
- The no-cross-module rule is currently a convention: the shared tsconfig base
  omits sibling modules from `paths`, which blocks an accidental import but not
  a deliberate one (declaring the dependency makes it typecheck clean). The
  ESLint rule that actually enforces it is CAT-3692.
