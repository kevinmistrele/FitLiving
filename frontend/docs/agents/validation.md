# Validation

Run the smallest validation that actually covers the change — not the full suite for every edit, and never nothing for a behavioral change.

| Change type                                               | Minimum validation                                                                            |
| --------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| Types/comments only, no runtime change                    | `npm run typecheck`                                                                           |
| UI/component change                                       | `npm run typecheck`, `npm run lint`, targeted component test                                  |
| New/changed hook, util, or feature logic                  | add/update a test, then `npm run test` (targeted file, or full run if unsure of blast radius) |
| API layer, state management, or shared-module change      | `npm run typecheck`, `npm run lint`, `npm run test`                                           |
| Routing, global config, dependencies, or public contracts | all of the above, plus `npm run build`                                                        |
| User-visible flow change (route, screen composition)      | consider `npm run test:e2e` — cheap, and it proves the app actually boots and renders         |

## Commands

```bash
npm run typecheck
npm run lint
npm run format:check
npm run test
npm run test:e2e   # Playwright smoke; boots the dev server itself (first run: npx playwright install chromium)
npm run build
```

## Git hooks and CI

A pre-commit hook (Husky + lint-staged) runs `eslint --fix` and `prettier --write` on staged files plus `npm run typecheck`; a pre-push hook runs `npm run test`. `.github/workflows/ci.yml` re-runs `format:check`, `lint`, `typecheck`, `test` and `build` on every push/PR. These are a backstop, not a replacement — a hook or CI catching something means validation was skipped earlier in the task, not that skipping it is fine.

## Rules

- Do not report a change as done without running at least the minimum validation for its category.
- If a check is skipped, say so explicitly and why (e.g. "build skipped, no config/dependency change") — never silently omit it.
- If a check fails and the failure is unrelated to the change (pre-existing), say so rather than hiding it or "fixing" unrelated code as a drive-by.
- For UI-visible changes, prefer actually running the app (`npm run dev`) and exercising the change over trusting typecheck/tests alone to prove the feature works — see the `verify` skill if available.
