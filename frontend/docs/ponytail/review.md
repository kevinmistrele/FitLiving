# Ponytail Review — Diff Review for Over-Engineering

A narrow review pass focused only on unnecessary complexity in a diff: reinvented standard library, unneeded dependencies, speculative abstractions, dead flexibility. This is a complement to [review-checklist.md](../agents/review-checklist.md), not a replacement — it doesn't look at correctness, security, or performance bugs at all.

The best outcome is a diff that gets shorter.

## Format

One line per finding:

```
L<line>: <tag> <what>. <replacement>.
```

Use `<file>:L<line>: ...` when the review spans multiple files.

## Tags

- `delete:` — dead code, unused flexibility, a speculative feature. Replacement: nothing.
- `stdlib:` — hand-rolled logic that the JS/TS standard library, or a hook already in this repo, already covers. Name the function.
- `native:` — a dependency or custom code doing what the platform already does. Name the native feature.
- `yagni:` — an abstraction with one implementation, a config no one sets, a layer with one caller.
- `shrink:` — same logic, fewer lines. Show the shorter form.

## Examples (this stack)

❌ "This `useDebouncedSearch` hook might be more complex than necessary, have you considered whether all this logic is needed right now?"

✅ `L14-31: stdlib: 18-line manual debounce with useEffect + setTimeout. useDeferredValue covers the search-input case in 1 line.`

✅ `L6: native: date-picker library imported for a single date field. <input type="date">, 0 deps.`

✅ `api/repository.ts:L22: yagni: EntityRepository interface with one implementation. Inline the class until a second implementation exists.`

✅ `L40-55: delete: retry wrapper around an idempotent GET already handled by TanStack Query's own retry option.`

✅ `L18-24: shrink: manual loop builds a lookup object. Object.fromEntries(items.map(i => [i.id, i])), 1 line.`

## Scoring

End with the one metric that matters: `net: -<N> lines possible.`

Nothing to cut: `Lean already. Ship.` — stop there.

## Boundaries

Scope: over-engineering and complexity only. Correctness bugs, security issues, and performance problems are explicitly out of scope — send those to a normal review (see [review-checklist.md](../agents/review-checklist.md) or `/code-review`). A single smoke test or `assert`-based self-check (see [tests.md](../standards/tests.md)) is the ponytail minimum, not bloat — never flag it for deletion. This pass lists findings; it doesn't apply fixes.
