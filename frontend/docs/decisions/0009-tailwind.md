# 0009 - Tailwind CSS v4

## Context

This base's first real feature (auth/login, see `docs/project/fitliving-web.md` step 1) needs a login screen built from shadcn/ui blocks, which are styled with Tailwind. The user chose Tailwind at kickoff, per `docs/recipes/tailwind.md`.

## Decision

Adopt Tailwind CSS v4 via `docs/recipes/tailwind.md`, exactly as documented:

- `tailwindcss` + `@tailwindcss/vite` (no `tailwind.config` file — v4's CSS-first config).
- `@tailwindcss/vite` registered in `vite.config.ts`.
- `src/styles.css` starts with `@import 'tailwindcss';`, followed by an `@theme` block holding the design tokens (colors, font) that previously lived in a plain `:root` block. Resets and the `:focus-visible` rule stay as plain CSS — Tailwind can't express the latter as a token.
- `prettier-plugin-tailwindcss` added for automatic class sorting.

## Consequences

- Component styles are now Tailwind utility classes; see [styling.md](../standards/styling.md) for the full ruleset (theme scale over arbitrary values, no dynamic class names, variant prefixes over JS state, mobile-first).
- Theme tokens are one source of truth (`@theme` in `src/styles.css`), consumed by both hand-written and shadcn-generated components.
- Prerequisite for [0010-shadcn.md](./0010-shadcn.md) — shadcn/ui components are styled with Tailwind.
