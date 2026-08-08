# Error Handling

## Flow

```txt
api-client / api action  ->  feature hook (TanStack Query)  ->  screen hook  ->  screen (UI feedback)
```

- Lower layers (`src/lib`, feature `api/*`) propagate errors — they throw/reject, they never catch-and-silence. On a non-ok response, `api-client` throws `ApiError` (exported from `src/lib/api-client.ts`) carrying `status` and the parsed response `body` — the type to check when feedback depends on the failure kind (e.g. 404 → empty state, 401 → session expired).
- The feature hook exposes the error state (TanStack Query's `isError`/`error` already does this — don't re-wrap it in a try/catch).
- The screen (or its screen hook) is the only layer that decides visual feedback: inline error message, toast, fallback UI — see [ui-states.md](./ui-states.md) for which feedback fits which failure.
- Never show a raw technical error (stack trace, `error.message` straight from a network exception) to the end user — map it to a user-facing message; log the technical detail if the project has logging.

## What not to do

- Don't swallow an error with an empty `catch {}`.
- Don't put `try/catch` around a render or JSX tree to "handle" a data error — that's what the query's `isError` state and an explicit error UI state are for.
- Don't invent a new error-handling pattern per feature; use the flow above so an agent reviewing any feature finds the same shape.

## Error boundaries

The query/screen-state flow above handles _expected_ errors (a failed request, invalid input). Unexpected render-time exceptions (a bug throwing while rendering) need a React error boundary, since a `try/catch` cannot catch those.

- The app root already has one: the router's `errorElement` in `src/app/router.tsx` renders `RootErrorRoute` (`src/app/routes/root-error.tsx`) when any route crashes while rendering. Nothing unhandled reaches a blank screen.
- Wrap features (not only the app root) in their own error boundary where practical, so a crash in one feature doesn't take down the whole screen.
- The boundary's fallback UI belongs with the boundary (app shell or feature), not duplicated ad hoc per component.
- This base doesn't ship a reusable error-boundary component for feature-level use yet — add one (or a small library like `react-error-boundary`) only when a task actually needs it, and note the addition explicitly.

## Regression coverage

When fixing a bug caused by an unhandled or mishandled error, add a test that reproduces the failure mode (see [tests.md](./tests.md)) so it doesn't regress silently.
