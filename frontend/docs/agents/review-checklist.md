# Review Checklist

Use this before calling a change done — as self-review, or as the checklist a dedicated reviewer (human or agent) applies.

## Correctness and scope

- [ ] Only the files necessary for the request were changed.
- [ ] No unrelated refactor rode along with the requested change.
- [ ] Architecture boundaries are respected — no cross-feature imports (see [dependency-rules.md](../architecture/dependency-rules.md)).
- [ ] If a new feature was added, its zone was added to `import/no-restricted-paths` in `eslint.config.js` — otherwise it isn't actually protected.
- [ ] If a new feature flag was added, it's in `.env.example` and `src/config/feature-flags.ts`, defaults to off, and is read through `useFeatureFlag` (see [feature-flags.md](../architecture/feature-flags.md)).
- [ ] Acceptance criteria for the task (if any were stated) are each addressed.
- [ ] If the change altered a convention or made any statement in `AGENTS.md`/`docs/` false, the affected doc was updated in the same change.

## Types and code quality

- [ ] No `any`.
- [ ] No unused imports or variables.
- [ ] Props, function returns, and API data are typed.
- [ ] No duplicated logic that already exists elsewhere in the codebase.
- [ ] Names are self-explanatory; no drive-by renames unrelated to the task.
- [ ] No unrequested abstraction, dependency, or file — see [ponytail/overview.md](../ponytail/overview.md); run [ponytail/review.md](../ponytail/review.md) for a dedicated pass.

## UI and behavior

- [ ] Screens handle loading, error, empty, and success states where the data is remote (see [state-management.md](../architecture/state-management.md)).
- [ ] Accessibility was considered for any interactive UI (see [accessibility.md](../standards/accessibility.md)).
- [ ] No raw technical error surfaced to the end user (see [errors.md](../standards/errors.md)).
- [ ] New static UI copy uses `t()` with both `en`/`pt` keys added to the feature's own `i18n/*.json` — not hardcoded, and not added to a shared app-wide file (see [i18n.md](../architecture/i18n.md)).

## Tests and validation

- [ ] Tests match the risk of the change (see [tests.md](../standards/tests.md)).
- [ ] Validation from [validation.md](./validation.md) proportional to the change was actually run, not just assumed.

## Safety

- [ ] No secrets, tokens, private endpoints, or proprietary business rules were added or exposed.
- [ ] No new dependency was added unless the task required it.
- [ ] No destructive git operation (force-push, hard reset, discarding uncommitted work) without explicit instruction.

## Severity, if reporting findings rather than just checking boxes

| Severity | Meaning                                                                   |
| -------- | ------------------------------------------------------------------------- |
| BLOCKER  | Breaks correct behavior or creates a critical risk (security, data loss). |
| HIGH     | Serious problem that should be fixed before merging.                      |
| MEDIUM   | Meaningful improvement, does not block.                                   |
| LOW      | Style/best-practice suggestion.                                           |
| INFO     | Observation, no action required.                                          |

A change with any open `BLOCKER` or `HIGH` finding is not ready to merge.
