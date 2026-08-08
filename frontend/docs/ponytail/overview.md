# Ponytail — The Lazy-Senior-Dev Ladder

A mental model for not writing code that didn't need to exist. Write as a senior dev who has seen every over-engineered codebase and got paged at 3am by one of them. The best code is the code that was never written.

This is written guidance for this repo, not an installed tool — there is no `/ponytail` command here. Read it once, apply it on every task.

Lazy means efficient, not careless. It runs **after** you understand the problem, never instead of it.

## The ladder

Read the task and the code it touches first. Trace the real flow end to end. Then climb — stop at the first rung that holds:

1. **Does this need to exist?** Speculative need → skip it, say so in one line (YAGNI).
2. **Does it already exist in this codebase?** A helper, util, type, or pattern that already lives here → reuse it. Look before writing; reimplementing something a few files away is the most common mistake.
3. **Does the standard library do this?** `Array.prototype.at`, `URLSearchParams`, `structuredClone`, `Intl.*` — use them before reaching for a package.
4. **Does a native platform feature cover it?** `<input type="date">` instead of a date-picker library, CSS instead of JS (`:focus-visible`, `hidden`, `object-fit`), a native `<dialog>` instead of a modal library.
5. **Does an already-installed dependency solve it?** Use it. Never add a new one for what a few lines of TanStack Query, Zod, or react-router already cover.
6. **Can this be one line?** Make it one line.
7. **Only then:** the minimum code that works.

Two rungs both work? Take the higher one and move on. The first lazy solution that works is the right one — provided you actually know what the change needs to touch.

## Bug fixes: root cause, not symptom

A bug report names a symptom. Before editing, grep every caller of the function you're about to touch. The lazy fix **is** the root-cause fix: a guard in the shared function is a smaller diff than a guard in every caller — and fixing only the path the ticket named leaves every sibling caller still broken. Fix it once, where every caller passes through.

## Rules

- No unrequested abstractions: no interface with one implementation, no factory for one product, no config for a value that never changes (see [dependency-rules.md](../architecture/dependency-rules.md) and [typescript.md](../standards/typescript.md) for what this repo already treats as over-abstraction).
- No boilerplate, no scaffolding "for later" — later takes care of itself.
- Deletion over addition. Boring over clever — clever is what someone decodes at 3am.
- The fewest files possible. The smallest diff that works wins — but only after understanding the problem. The smallest change in the wrong place isn't laziness, it's a second bug.
- Complex request? Deliver the lazy version and question it in the same reply: "Did X; Y covers it. Need full X? Say so." Never stall on a response that could just default and ask.
- Two standard-library options of the same size? Take the one that's correct on edge cases. Laziness means writing less code, not picking the more fragile algorithm.
- Mark deliberate simplifications with a `ponytail:` comment (`// ponytail: ...`) — simple should read as intent, not ignorance. A shortcut with a known ceiling (an in-memory cache with no eviction, an O(n²) scan over a small list, a naive locale fallback) gets a comment naming the ceiling and the upgrade path: `// ponytail: in-memory only, move to a real cache if this needs to survive a reload`. See [debt.md](./debt.md) for how these get tracked.

## Output style

Code first. Then at most three short lines: what was skipped, when to add it. No essays, no feature tour, no design notes.

```
[code] → skipped: [X], add when [Y].
```

Explanation the user explicitly asked for (a report, a walkthrough, phase notes) isn't debt — deliver it in full; this rule is only against unrequested prose. If an explanation is longer than the code, delete the explanation — every paragraph defending a simplification is complexity smuggled back in as prose.

## Intensity

There's no command to switch these — just say which one you want, or default to full:

| Level              | What changes                                                                                                                   |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------ |
| **lite**           | Build what was asked, but name the laziest alternative in one line. The requester chooses.                                     |
| **full** (default) | The ladder, applied. Standard library and native first. Smallest diff, smallest explanation.                                   |
| **ultra**          | YAGNI extremist. Deletion before addition. Deliver the one-liner and challenge the rest of the requirement in the same breath. |

Example — "Add a cache for these API responses":

- lite: "Done, cache added. FYI: TanStack Query's own `staleTime` covers this in one option if you'd rather not maintain a cache class — see [state-management.md](../architecture/state-management.md)."
- full: "Set `staleTime` on the query (see `state-management.md`). Skipped a custom cache layer — add one when `staleTime` provably falls short."
- ultra: "No cache until a profiler says so. When it does: `staleTime`. A hand-rolled TTL cache is a bug factory with a hit rate."

## When NOT to be lazy

Never simplify away: input validation at trust boundaries, error handling that prevents data loss, security measures (see [security.md](../standards/security.md)), accessibility basics (see [accessibility.md](../standards/accessibility.md)), or anything explicitly requested. User insists on the full version → build it, without re-litigating.

Never be lazy about understanding the problem. The ladder shortens the solution, never the reading. Trace everything first — every file the change touches, the real flow — before picking a rung. Laziness that skips understanding to ship a small diff is the dangerous kind: it looks like efficiency and delivers a confidently wrong fix. Read everything, then be lazy.

External systems (a backend API, the browser, a third-party SDK) drift from your model of them — a response shape changes, a browser API behaves differently across engines, a locale has a fallback case the happy path misses. Leave the escape hatch a minimal implementation doesn't foresee, not just less code.

Lazy code without your own verification is unfinished. Non-trivial logic (a branch, a loop, a parser, a money/auth path) leaves one executable check behind — a test per [tests.md](../standards/tests.md), not a framework, not a suite per function unless asked. Trivial one-liners don't need a test; YAGNI applies to tests too.

## Boundaries

This governs what gets built, not how you talk — response tone and length are already covered by this repo's general terseness expectations. It applies to code decisions in every task, not just when asked to "simplify."

Related workflows: [review.md](./review.md) (reviewing a diff for over-engineering), [audit.md](./audit.md) (scanning the whole repo), [debt.md](./debt.md) (tracking `ponytail:` comments).
