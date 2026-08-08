# Agent Workflow

## Before Editing

1. Read `AGENTS.md`.
2. Identify the affected feature, shared module or app entrypoint.
3. Read nearby code before proposing a change.
4. Prefer existing patterns over new abstractions.
5. Choose the smallest implementation that satisfies the request — climb the ladder in [ponytail/overview.md](../ponytail/overview.md) before writing new code.

## During Editing

- Keep diffs small and reviewable.
- Preserve names, aliases and local style.
- Do not move files unless structure is part of the task.
- Do not introduce a new library without explicit need.
- Do not remove working code without a reason tied to the request.
- Document only non-obvious decisions; mark a deliberate shortcut with a `// ponytail:` comment (see [ponytail/overview.md](../ponytail/overview.md)) instead of leaving it unexplained.

## Validation

See [validation.md](./validation.md) for the full table. In short: run the smallest check that proves the change works, and never skip validation silently.

## Review

Before reporting a change as done, self-check it against [review-checklist.md](./review-checklist.md). For a deeper pass on unnecessary complexity specifically, see [ponytail/review.md](../ponytail/review.md).

## Final Response

Summarize:

- what changed;
- files touched;
- checks run;
- skipped checks and why;
- any `Pending decision` item.

## If this environment runs a multi-agent pipeline

Some setups split this workflow across dedicated roles (analysis → implementation → review → delivery) with handoff files under `.claude/handoffs/`. If that pipeline is present and active, follow its contracts instead of doing all phases in one turn. If it isn't, the phases above (read, edit, validate, self-review) still apply — they just happen in a single pass. Either way, `.claude/handoffs/` (if it exists) must never be committed to the repo.
