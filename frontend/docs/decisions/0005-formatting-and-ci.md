# 0005 - Prettier and GitHub Actions CI

## Context

Formatting had no enforced convention, and validation (`typecheck`/`lint`/`test`/`build`) only ran locally via Husky hooks (see `docs/agents/validation.md`) — nothing gated a pull request itself.

## Decision

- Add Prettier, configured close to the sibling production app's settings (`semi: true`, `singleQuote: true`, `tabWidth: 2`, `arrowParens: 'always'`), adjusted (`printWidth: 100`, `trailingComma: 'all'`) to match this repo's existing line lengths instead of forcing a large one-time reformat away from it.
- `eslint-config-prettier` disables any ESLint stylistic rule that could conflict with Prettier — formatting is Prettier's job, not ESLint's.
- `npm run format` / `npm run format:check` scripts; `lint-staged` runs `prettier --write` alongside `eslint --fix`.
- Add `.github/workflows/ci.yml` (adapted from Bulletproof React's `react-vite-ci.yml`) running format-check, lint, typecheck, test, and build on every push/PR.

## Consequences

- The entire existing codebase was reformatted once to adopt the new Prettier config (formatting-only diff, verified against the type/lint/test/build suite before and after).
- A PR now fails CI on a formatting, lint, type, test, or build regression even if a contributor's local hooks were bypassed.
- No E2E job was added (Bulletproof React's CI has one via Playwright) — this base had no E2E runner at the time. Superseded by [0007](./0007-testing-and-dependency-tooling.md), which added Playwright and an E2E step to this workflow.
