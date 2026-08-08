# Frontend Agent Base

Base repository for scalable React front-end projects designed to be easy for humans and AI agents to maintain.

It combines:

- feature-based architecture inspired by Bulletproof React;
- strict TypeScript and small reviewable diffs;
- explicit AI-agent workflow in `AGENTS.md`;
- clear boundaries between App, Feature and Application/shared layers — lint-enforced, not just documented;
- examples for API hooks, screen hooks, UI components and tests.

## Stack

- React
- TypeScript
- Vite
- Firebase (Authentication + Firestore — the app's entire backend, see `docs/decisions/0012-firebase-backend.md` and `docs/architecture/api-layer.md`)
- TanStack Query
- react-router (data router API — see `docs/decisions/0002-routing.md`)
- react-intl (i18n, owned per feature — see `docs/architecture/i18n.md`)
- Tailwind CSS v4 (see `docs/decisions/0009-tailwind.md`)
- shadcn/ui (see `docs/decisions/0010-shadcn.md`)
- Zustand (app-wide auth state — see `docs/decisions/0011-zustand.md`)
- Vitest
- Testing Library
- MSW (API mocking in tests — `src/testing/mocks/`)
- Playwright (E2E smoke — `npm run test:e2e`)
- Renovate (automated dependency update PRs, validated by CI)
- ESLint, with `eslint-plugin-import` (`import/no-restricted-paths` enforces the dependency rules), `eslint-plugin-check-file` (enforces `kebab-case` naming) and `eslint-plugin-jsx-a11y` (enforces baseline accessibility)
- Prettier (`eslint-config-prettier` keeps ESLint out of formatting's way)
- Husky + lint-staged: pre-commit runs lint + format + typecheck, pre-push runs the test suite
- GitHub Actions CI (`.github/workflows/ci.yml`): format check, lint, typecheck, test, build

## Project Structure

```txt
src/
  app/          Application shell, providers, router, routes
  components/   Shared UI components, business-agnostic
  config/       Environment, global config, feature flags
  features/     Feature modules with their own api, hooks, components, types and i18n
  hooks/        Shared hooks (including useTranslate, useLocale, useFeatureFlag)
  i18n/         Merges every feature's translations into one catalog
  lib/          Preconfigured libraries and application services
  testing/      Test helpers and mocks
  types/        Shared contracts and types
  utils/        Shared pure utilities
```

## Getting Started

```bash
npm install
cp .env.example .env   # fill in your Firebase project's VITE_FIREBASE_* config values
npm run dev
```

Building your first real feature? Start with [`docs/architecture/feature-template.md`](docs/architecture/feature-template.md) — it's the shape every feature in this repo follows (`auth` is a working example of the same pattern).

## Commands

```bash
npm install
npm run dev
npm run typecheck
npm run lint
npm run format
npm run test
npm run test:e2e   # first run: npx playwright install chromium
npm run build
```

## For AI Agents

Start with `AGENTS.md` — it is the entry point for any agent (Claude, Codex, Cursor, Copilot, etc.) and points to the rest of `docs/`:

```txt
docs/
  agents/         workflow, validation, review checklist
  ponytail/       the minimalism ladder — what NOT to build, review, audit, debt ledger
  architecture/   overview, project structure, dependency rules, feature template,
                  API layer, state management, i18n, feature flags
  standards/      typescript, naming, react, components, hooks, forms, styling,
                  ui-states, accessibility, errors, security, performance, tests,
                  documentation, git
  decisions/      numbered architecture decision records
  recipes/        opt-in additions (Tailwind, Zustand, shadcn/ui) — applied only when you choose them
```

Do not create broad refactors unless the user explicitly asks for them.
