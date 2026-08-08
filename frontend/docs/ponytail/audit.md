# Ponytail Audit — Repo-Wide Over-Engineering Scan

Same as [review.md](./review.md), but across the whole repository instead of one diff: a ranked list of what to delete, simplify, or replace with a standard-library or native equivalent. A single report — it doesn't apply fixes.

Rank findings biggest cut first.

## Tags

Same as [review.md](./review.md):

- `delete:` — dead code, unused flexibility, a speculative feature. Replacement: nothing.
- `stdlib:` — hand-rolled logic the standard library (or a hook already in `src/hooks`) already covers. Name the function.
- `native:` — a dependency or code doing what the platform already does. Name the native feature.
- `yagni:` — an abstraction with one implementation, a config no one sets, a layer with one caller.
- `shrink:` — same logic, fewer lines. Show the shorter form.

## What to hunt for in this codebase

- Dependencies that the standard library or a browser/React feature already covers (check `package.json` against [performance.md](../standards/performance.md) and [components.md](../standards/components.md) first).
- Single-implementation interfaces in `src/features/*/types` or `src/lib` — see [typescript.md](../standards/typescript.md) on when `interface` earns its keep.
- Factories with one product, wrappers that only delegate to what they wrap.
- A feature's `components/`, `hooks/`, or `utils/` file exporting exactly one thing that's only used in one place — a candidate for inlining (see [feature-template.md](../architecture/feature-template.md)).
- Dead feature flags in `src/config/feature-flags.ts` that are permanently on/off (see [feature-flags.md](../architecture/feature-flags.md)) and the branches they still gate.
- Unused `SupportedLocale`/translation keys in `src/i18n` or a feature's `i18n/*.json` (see [i18n.md](../architecture/i18n.md)).
- Hand-rolled versions of anything TanStack Query, react-router, or Zod already does (see [api-layer.md](../architecture/api-layer.md), [state-management.md](../architecture/state-management.md)).

## Output

One line per finding, ranked: `<tag> <what to cut>. <replacement>. [path]`. End with `net: -<N> lines, -<M> deps possible.` Nothing to cut: `Lean already. Ship.`

## Boundaries

Scope: over-engineering and complexity only. Correctness bugs, security issues, and performance problems are explicitly out of scope — send those to a normal review. Lists findings, applies nothing. A single report, not a persistent mode.
