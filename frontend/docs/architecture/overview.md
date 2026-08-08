# Architecture Overview

Feature-based React architecture inspired by Bulletproof React, adapted for AI-agent collaboration.

## Layers

```txt
app  ->  features  ->  shared (components, hooks, lib, types, utils)
```

- **`src/app`** — composition root: providers, routing, global shell. May import from every other layer.
- **`src/features/*`** — self-contained, user-facing capabilities. May import from shared layers only.
- **Shared layers** (`components`, `hooks`, `lib`, `types`, `utils`) — business-agnostic primitives. Must not import from `app` or `features`.

Data flows down, dependencies point down. Nothing shared depends on something feature-specific.

## Why this shape

- A new feature is addable without touching unrelated code.
- An agent can read one feature folder and the shared layers it uses — not the whole repo.
- Shared code stays generic because it structurally cannot reach into feature internals.

## Related docs

- [project-structure.md](./project-structure.md) — folder layout on disk.
- [dependency-rules.md](./dependency-rules.md) — what may import what, with the cross-feature-import rule.
- [feature-template.md](./feature-template.md) — the shape of a new feature.
- [api-layer.md](./api-layer.md) — where network calls live.
- [state-management.md](./state-management.md) — server state vs. local state.
- [i18n.md](./i18n.md) — translations, owned per feature, merged at the root.
- [feature-flags.md](./feature-flags.md) — env-based flags and the `useFeatureFlag` hook.
- [0001-frontend-architecture.md](../decisions/0001-frontend-architecture.md) — the decision record behind this layout.
