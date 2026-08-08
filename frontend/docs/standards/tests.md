# Tests

## Principles

- Test behavior, not implementation details. A test should still pass after a refactor that doesn't change observable behavior.
- Cover user-visible behavior and critical business rules, not every internal function.
- Keep mocks realistic enough that a passing test means something — don't mock away the exact thing under test.
- Add a regression test for every bug fix where the risk of recurrence justifies it.

## Pyramid

1. **Unit** — pure functions, utilities, selectors (`src/utils`, feature `utils/`).
2. **Component** — user-visible interaction and visual states, via Testing Library queries (role/label/text, not test IDs as a first resort).
3. **Integration** — a feature's flow end to end (screen + hooks + mocked API layer), covering loading/error/empty/success.
4. **E2E** — critical journeys only, via Playwright (`npm run test:e2e`, specs in `e2e/`). The base ships one smoke test (home renders); add a spec per critical journey, not per screen.

## Tools already in this repo

- Vitest for unit/integration tests (`npm run test`, only picks up `src/**/*.test.{ts,tsx}`).
- `@testing-library/react` + `@testing-library/user-event` for component behavior.
- `jsdom` as the test environment (`src/testing/setup-tests.ts`).
- MSW for API mocking: the server in `src/testing/mocks/server.ts` starts automatically via `setup-tests.ts` and errors on unhandled requests. Register per-test responses with `server.use(http.get(...))` (see `src/lib/api-client.test.ts`); add a handler to `src/testing/mocks/handlers.ts` only when many tests share it. Never hand-roll `fetch` mocks.
- Playwright for E2E (`npm run test:e2e`, specs in `e2e/`); it boots the dev server itself via `playwright.config.ts`.

## Rendering components under test

Import `render`/`screen` from `@/testing/test-utils`, not from `@testing-library/react` directly, whenever the component under test needs the app's providers (e.g. TanStack Query context). `test-utils.tsx` wraps Testing Library's `render` in `AppProvider` — this is the one place allowed to import `@/app/provider` from a shared folder (see [dependency-rules.md](../architecture/dependency-rules.md)). Importing `AppProvider` directly in a feature test bypasses that and will fail lint.

## Where tests live

Colocated with the code under test: `<name>.test.tsx` / `<name>.test.ts` next to the component, hook, or util (see `src/features/welcome/components/welcome-screen.test.tsx`).

## Minimum expectation for a new feature

At least one test per screen covering its success path and its error/empty path if the screen has one, plus unit tests for any non-trivial pure logic extracted into `utils/`.
