# 0007 - MSW, Playwright E2E and Renovate

## Context

The base validated code statically (format, lint, typecheck) and with unit/component tests, but had three known boundaries: API mocking was hand-rolled per test, nothing proved the app actually boots and renders in a real browser, and pinned dependencies had no update automation.

## Decision

- **MSW** for API mocking in tests. The node server (`src/testing/mocks/server.ts`) starts via `setup-tests.ts` with `onUnhandledRequest: 'error'`, so an unmocked fetch fails the test instead of passing silently. Tests register responses locally with `server.use(...)`; shared handlers live in `src/testing/mocks/handlers.ts`. Hand-rolled `fetch` mocks are no longer acceptable — see `docs/standards/tests.md`.
- **Playwright** as the E2E runner (`npm run test:e2e`, specs in `e2e/`), starting with a single smoke test. It boots the dev server itself on the dedicated port `5199` (`--strictPort`) so a dev server from another project on the default port is never tested by mistake. CI installs Chromium and runs the smoke after build. E2E specs cover critical journeys only, not every screen.
- **Renovate** (`renovate.json`, `config:recommended`, non-major updates grouped) so pinned dependencies get update PRs validated by the existing CI. Requires the Renovate GitHub App to be enabled on the repository.

## Consequences

- `api-client` grew `post`/`put`/`patch`/`delete` and a typed `ApiError` (status + parsed body) alongside this, tested through MSW (`src/lib/api-client.test.ts`).
- Vitest is scoped to `src/**/*.test.{ts,tsx}` so it never picks up Playwright specs.
- CI got slower (~1 min for browser install + smoke) in exchange for a real-browser boot check on every PR.
- Supersedes the "no E2E runner" consequence noted in [0005](./0005-formatting-and-ci.md).
