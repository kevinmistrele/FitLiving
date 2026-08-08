# AGENTS.md

## Purpose

This repository is a React + TypeScript front-end base designed for scalable feature development and AI-agent collaboration. It works the same way whether you are Claude, Codex, Cursor, Copilot, or any other agent — start here.

## Commands

```bash
npm install          # setup (Node >= 22)
npm run dev          # dev server
npm run typecheck    # tsc --noEmit
npm run lint         # eslint (also enforces architecture boundaries)
npm run test         # vitest (unit/integration, src/**/*.test.*)
npm run test:e2e     # playwright smoke (e2e/, boots dev server itself)
npm run format       # prettier --write (format:check is what CI runs)
npm run build        # tsc -b && vite build
```

Run the smallest check that proves your change works — see [Validation](#validation).

## Project Kickoff (fresh clone only)

If this base was just cloned to start a new project (sign: the `welcome` example is still the only feature), ask the user **before building the first feature**:

1. Which optional recipes to apply — see `docs/recipes/` (currently: Tailwind, Zustand, shadcn/ui). Apply only what the user chooses, following the recipe file exactly; each one records its own ADR.
2. Whether to keep or delete the `welcome` example feature.

On an established project, skip this section entirely — never apply a recipe without an explicit user request.

## Rule Priority

1. Explicit user request.
2. Existing code and local patterns.
3. This `AGENTS.md` and `docs/`.
4. General React, TypeScript and accessibility best practices.

If rules conflict, mark `Pending decision` and choose the smallest safe change only when progress is still possible.

## How to Work

This file is the only required reading. Then jump straight to the docs matching your task — see the map below.

1. Read the code you are about to change and its neighbors before editing; prefer existing patterns over new abstractions.
2. Choose the smallest implementation that satisfies the request — climb the ladder below first.
3. Keep diffs small and reviewable; don't move or rename files unless that is the task.
4. Validate (see [Validation](#validation)), self-check against `docs/agents/review-checklist.md`, then report.

Full version: `docs/agents/workflow.md`.

## The Ladder (what NOT to build)

Stop at the first rung that holds:

1. Does this need to exist at all? Speculative need → skip it, say so in one line.
2. Already in this codebase? Reuse it.
3. Standard library does it? Use it.
4. Native platform feature covers it? Use it.
5. An already-installed dependency solves it? Use it — never add a new one for what TanStack Query, Zod, or react-router already cover.
6. Can it be one line? One line.
7. Only then: the minimum code that works.

Mark deliberate shortcuts with a `// ponytail:` comment naming the ceiling and the upgrade path. Full version: `docs/ponytail/overview.md`.

## Documentation Map

```txt
docs/
  agents/         how to work: workflow, validation, review checklist
  ponytail/       what NOT to build: the minimalism ladder, review, audit, debt ledger
  architecture/   the system: overview, structure, dependency rules, API layer, state,
                  i18n, feature flags
  standards/      the code: typescript, naming, react, components, hooks, forms, styling,
                  ui-states, accessibility, errors, security, performance, tests,
                  documentation, git
  decisions/      why: numbered architecture decision records
  recipes/        opt-in additions (tailwind, zustand, shadcn) and situational workflows
                  (design-tool MCP → component) — only on explicit user choice or when the
                  task actually involves that scenario
```

Jump straight to the doc that matches the task instead of reading everything:

| Task involves                                         | Read                                                                                                               |
| ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| A new feature or route                                | `docs/architecture/feature-template.md`, `docs/architecture/dependency-rules.md`, `docs/decisions/0002-routing.md` |
| Fetching/sending data                                 | `docs/architecture/api-layer.md`, `docs/standards/errors.md`                                                       |
| Component or screen work                              | `docs/standards/react.md`, `docs/standards/components.md`, `docs/standards/hooks.md`                               |
| A form                                                | `docs/standards/forms.md`                                                                                          |
| Shared/global state question                          | `docs/architecture/state-management.md`                                                                            |
| User-facing text / translations                       | `docs/architecture/i18n.md`                                                                                        |
| Gating something behind a flag                        | `docs/architecture/feature-flags.md`                                                                               |
| Styling                                               | `docs/standards/styling.md`                                                                                        |
| Loading/error/empty UI for a screen                   | `docs/standards/ui-states.md`                                                                                      |
| Naming a function, variable or file                   | `docs/standards/naming.md`                                                                                         |
| Asked to commit, branch or open a PR                  | `docs/standards/git.md`                                                                                            |
| Tests                                                 | `docs/standards/tests.md`                                                                                          |
| Anything user-facing/interactive                      | `docs/standards/accessibility.md`                                                                                  |
| User opts into Tailwind, Zustand or shadcn/ui         | `docs/recipes/tailwind.md`, `docs/recipes/zustand.md`, `docs/recipes/shadcn.md`                                    |
| Tempted to add a new abstraction, dependency, or file | `docs/ponytail/overview.md`                                                                                        |
| Reviewing a diff or the repo for bloat                | `docs/ponytail/review.md`, `docs/ponytail/audit.md`                                                                |

## Architecture (short version)

Feature-based, inspired by Bulletproof React. Full rules: `docs/architecture/`.

```txt
app -> features -> shared (components, hooks, lib, types, utils)

src/
  app/          shell: providers, router, one route file per top-level route
  components/   shared business-agnostic UI
  config/       env validation, feature flags
  features/*    self-contained: api/ components/ hooks/ types/ i18n/ (create only what's needed)
  hooks/ i18n/ lib/ testing/ types/ utils/    shared layers
```

- `src/app` composes providers, routing and features.
- `src/features/*` are self-contained; they must not import each other.
- Shared folders are business-agnostic and must not import from `app` or `features`.

These boundaries are lint-enforced (`import/no-restricted-paths` in `eslint.config.js`), not just documented — `npm run lint` fails on a violation. When adding a new feature, add its zone to that config too (see `docs/architecture/dependency-rules.md`).

## Never Do This

- Use `any`.
- Call an API from inside JSX (network calls belong in `src/lib` or a feature's `api/`).
- Import one feature from another (`src/features/a` importing `src/features/b`) — this fails lint.
- Add global state for data that's local to one screen.
- Put translations in one shared app-wide file — they belong in the owning feature's `i18n/` (see `docs/architecture/i18n.md`).
- Read `import.meta.env.VITE_FEATURE_*` directly — go through `useFeatureFlag` (see `docs/architecture/feature-flags.md`).
- Refactor broadly beyond what the request needs.
- Add, log, or expose secrets, tokens, private endpoints, or proprietary business rules.
- Add a new dependency, abstraction, or file without climbing the ladder above first — reuse, standard library, and native platform features come before new code.
- Ship a change that makes any statement in `docs/` or this file false — update the affected doc in the same change. A doc that lies is worse than no doc.

## Validation

Run the smallest useful check for the change (full table: `docs/agents/validation.md`):

```bash
npm run typecheck
npm run lint
npm run test
```

Run `npm run build` when the change touches bundling, routing, global config, dependencies or public contracts. Run `npm run format` if you're not sure formatting is clean — `npm run format:check` is what CI checks.

A pre-commit hook (lint + typecheck + format) and a pre-push hook (tests) run automatically, and GitHub Actions (`.github/workflows/ci.yml`) re-runs everything on push/PR — these are a backstop, not a substitute for running validation yourself during the task.

## Before Reporting Done

Self-check against `docs/agents/review-checklist.md`, then summarize: what changed, files touched, checks run, anything skipped and why, any `Pending decision`.

## Safety

- Change only what is necessary; preserve unrelated user changes.
- Do not commit, push, or open PRs unless explicitly asked.
- Do not run destructive git operations without explicit instruction.
