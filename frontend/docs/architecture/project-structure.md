# Project Structure

Most code lives under `src`.

```txt
src/
  app/
    app.tsx
    provider.tsx
    router.tsx
    routes/
      home.tsx
  components/
    ui/
  config/
  features/
    feature-name/
      api/
      components/
      hooks/
      types/
      utils/
  hooks/
  i18n/
  lib/
  testing/
  types/
  utils/
```

## App Layer

`src/app` owns composition:

- root providers (`provider.tsx`);
- the router (`router.tsx`) and one route file per top-level route (`routes/*.tsx`) — a route file renders a feature's screen, it does not contain feature logic itself;
- global shell;
- feature composition.

It may import from features and shared modules. Adding a route is: create `src/app/routes/<name>.tsx` rendering the feature's screen, then register it in `router.tsx` (see `docs/decisions/0002-routing.md`).

## Feature Layer

`src/features/*` owns user-facing capabilities.

Features should be self-contained and expose only the files needed by the app layer.

Avoid importing from another feature. Compose multiple features in `src/app` instead.

## Shared/Application Layer

Shared folders include `components`, `hooks`, `lib`, `types` and `utils`.

They must stay business-agnostic and must not import from `src/app` or `src/features`.

## i18n Layer

`src/i18n` merges every feature's own translations into one catalog — it does not hold feature copy itself (a feature's strings live in `src/features/<feature>/i18n/`). See [i18n.md](./i18n.md).

## Import Rules

See [dependency-rules.md](./dependency-rules.md) for the full allow/forbid table, including the cross-feature-import rule and composition guidance.
