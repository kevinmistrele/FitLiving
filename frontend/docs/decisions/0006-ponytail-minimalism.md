# 0006 - Ponytail: a minimalism ladder for agents

## Context

`workflow.md` already said "choose the smallest implementation that satisfies the request" and "do not introduce a new library without explicit need," but left "smallest" undefined — an agent had no concrete order of preference (reuse vs. standard library vs. native platform feature vs. new code) and no convention for marking a deliberate shortcut so it doesn't rot silently.

Ponytail (external concept, MIT-licensed, see https://github.com/DietrichGebert/ponytail) is a lazy-senior-dev methodology built around exactly this: a ladder of preferences to climb before writing new code, plus review/audit/debt-tracking workflows for the same concern.

## Decision

Adopt the methodology as written guidance in `docs/ponytail/`, not as an installed tool — this repo has no `/ponytail` plugin or slash command. Dropped from the source material: the plugin's own installation/config/auto-update mechanics and its benchmark-scoreboard display, since neither is relevant to a self-contained repo guide.

- `docs/ponytail/overview.md` — the ladder, the root-cause bug-fix rule, the `// ponytail:` comment convention, output style, and the explicit list of things never to simplify away.
- `docs/ponytail/review.md` / `audit.md` — diff-level and repo-wide passes scoped only to over-engineering, complementary to `docs/agents/review-checklist.md` (which covers correctness, safety, and scope).
- `docs/ponytail/debt.md` — a ledger workflow for `// ponytail:` markers, so a deferred shortcut has a named ceiling and upgrade trigger instead of aging into permanent, unexamined debt.

`AGENTS.md`'s Required Reading now includes `docs/ponytail/overview.md`, since the ladder is meant to run on every task, not just when asked to simplify.

## Consequences

- Every response is expected to apply the ladder by default; asking for the "lite" or "ultra" version is plain-language, not a command syntax.
- A deliberate simplification must carry a `// ponytail: <ceiling>, <upgrade path>` comment — an unmarked shortcut is treated as an oversight, not an intentional trade-off.
- `docs/ponytail/review.md` and `audit.md` are additive review lenses, not replacements for the correctness-focused `docs/agents/review-checklist.md` — running one doesn't substitute for the other.
