# Dependency Rules

## Allowed

| From                                                    | May import                                                              |
| ------------------------------------------------------- | ----------------------------------------------------------------------- |
| `src/app`                                               | `features/*`, `components`, `hooks`, `lib`, `types`, `utils`, `config`  |
| `src/features/<x>`                                      | its own files, `components`, `hooks`, `lib`, `types`, `utils`, `config` |
| shared (`components`, `hooks`, `lib`, `types`, `utils`) | other shared folders only                                               |
| `src/testing`                                           | anything, including `src/app` — see the exception below                 |
| `src/i18n`                                              | shared folders and every feature's `i18n/*` — see the exception below   |

`src/testing` is the one intentional exception: its job is to wrap components under test in the same providers the real app uses (`src/testing/test-utils.tsx` re-exports Testing Library's `render` wrapped in `AppProvider`). Feature and component tests should import `render`/`screen` from `@/testing/test-utils`, never `AppProvider` from `@/app/provider` directly — that keeps the exception in one file instead of leaking into every test.

`src/i18n` is the other one: its job is to merge every feature's translation catalog into one message map for `IntlProvider` (see [i18n.md](./i18n.md)). `src/i18n/feature-registry.ts` importing from every `src/features/*/i18n` is expected, not a violation. Nothing else should import a feature's `i18n/*` directly — go through `useTranslate`/`useLocale`.

## Forbidden

- A feature importing from another feature (`features/a` importing `features/b`).
- Any shared folder importing from `src/app` or `src/features`.

## Composing across features

Two features cannot depend on each other directly. When a screen needs both:

1. Compose them in `src/app` (or the closest shared route/layout owner), passing data via props.
2. If features genuinely need to share logic, extract that logic into a shared layer (`hooks`, `lib`, `types`, `utils`) — it stops being feature-specific by definition once two features need it.

Do not "temporarily" import across features to save time. It is the one rule this codebase enforces hardest because it is what keeps features deletable and agent-reviewable in isolation.

## Enforcement

This is lint-enforced, not just a convention — `eslint.config.js` uses `eslint-plugin-import`'s `import/no-restricted-paths` (the same rule Bulletproof React uses):

```js
'import/no-restricted-paths': [
  'error',
  {
    zones: [
      // no cross-feature imports, e.g. features/discussions can't import features/comments
      { target: './src/features/welcome', from: './src/features', except: ['./welcome'] },
      // add one zone per feature as the project grows

      // app can import features, not the other way around
      { target: './src/features', from: './src/app' },

      // shared layers can't import app or features
      {
        target: ['./src/components', './src/hooks', './src/lib', './src/types', './src/utils'],
        from: ['./src/features', './src/app'],
      },
    ],
  },
],
```

**When adding a new feature, add its zone to `eslint.config.js` at the same time** — the rule only protects features it knows about. `npm run lint` will fail on a violation; it will not silently no-op for a feature missing its zone (that feature just won't be protected yet, so add the zone as part of scaffolding the feature, not as an afterthought).

File and folder naming (`kebab-case`) is enforced the same way via `eslint-plugin-check-file`'s `filename-naming-convention`/`folder-naming-convention` rules.

## Imports style

- Use the `@/` alias for anything under `src` (`@/features/...`, `@/lib/...`).
- Prefer direct imports over barrel files (`index.ts` re-exports) — barrels hide which module boundary is being crossed and can hurt tree-shaking.
