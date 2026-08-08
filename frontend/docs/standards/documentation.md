# Documentation

## Code comments

- Default to no comments. Well-named functions, variables, and types should make the "what" self-evident.
- Write a comment only when it captures a non-obvious "why": a workaround for a specific bug/library quirk, a hidden constraint, an invariant that isn't visible from the code shape.
- Don't reference the current task, ticket, or PR in a comment ("fix for #123", "added for X flow") — that context belongs in the commit/PR description and rots as the code evolves.
- No multi-line doc-comment blocks on every exported function. If a function's contract is non-obvious enough to need one, consider whether the name or types could carry that instead.
- A deliberate simplification (skipping an edge case, a shortcut with a known ceiling) gets a `// ponytail: <ceiling>, <upgrade path>` comment instead of silence — see [ponytail/overview.md](../ponytail/overview.md) and [ponytail/debt.md](../ponytail/debt.md) for how these are tracked.

## Project documentation (this `docs/` tree)

- Keep each file focused on one responsibility (see the top of each file). If a change spans two files' concerns, update both rather than cramming it into one.
- Prefer updating an existing doc over creating a new one. Only add a new file under `docs/standards/` or `docs/architecture/` when a genuinely new concern doesn't fit an existing file.
- Use relative Markdown links between docs (`[state-management.md](../architecture/state-management.md)`) so navigation works on GitHub and in any editor.
- Record an architectural decision (new library, new cross-cutting pattern, changed folder convention) as a new file in `docs/decisions/`, numbered sequentially, not as a paragraph buried in an unrelated doc.
- Don't let `AGENTS.md` grow — if it starts exceeding roughly one screen, move detail into the relevant `docs/` file and leave a pointer.
