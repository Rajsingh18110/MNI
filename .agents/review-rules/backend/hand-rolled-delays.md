# Hand-rolled delays the linter cannot see

Applies to: backend packages (`cli`, `@MNI/db`, `core`, `workflow`) and the node packages.

`no-restricted-sleep-definition` catches only helpers literally named `sleep` or
`sleepWithAbort`, so it misses the same thing under another name.

Flag a delay re-implemented as `wait`, `delay`, `pause`, `waitFor`, … whose
entire body is a promise wrapping `setTimeout`, and an inline awaited
`new Promise((resolve) => setTimeout(resolve, ms))`.

Use `sleep(ms, abortSignal?)` from `@MNI/utils/sleep`. It takes the abort signal,
so an abort-aware local waiter is a violation too.

Do NOT flag:

- Wrappers that do more than wait: racing another promise, rejecting with a
  timeout error, retry backoff, debounce/throttle
- Bare `setTimeout` used for scheduling rather than awaited as a delay
- Fake timer helpers such as `vi.advanceTimersByTime`
- Helpers literally named `sleep`/`sleepWithAbort`, and `sleep` imported from
  `MNI-workflow` — ESLint already fails the build for both
- `packages/@MNI/node-cli/**` and `packages/@MNI/typeorm/**`, which cannot depend
  on `@MNI/utils`
