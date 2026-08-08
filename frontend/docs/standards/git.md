# Git Conventions

Agents must not commit, push, or open PRs unless explicitly asked (see `AGENTS.md`). When git work is requested, follow these conventions.

## Branches

Format: `<type>/<short-description>` — optionally suffixed with an issue/ticket id.

```txt
feat/user-login
fix/profile-image-load-123
refactor/auth-flow
```

- Types: `feat`, `fix`, `refactor`, `hotfix`, `chore`, `test`, `docs`, `ci`, `perf`, `build`, `experiment`.
- Lowercase, words separated by hyphens, no special characters or accents.
- Keep the description under ~50 characters.

## Commits

[Conventional Commits](https://www.conventionalcommits.org/): `<type>(optional scope): <description>`.

- Types: same list as branches, plus `style` (formatting only) and `revert`.
- Scope is optional and names the area touched: `ui`, `api`, `auth`, `router`, `config`, `deps`, `i18n`, a feature name.
- Description in imperative present tense ("add", not "added"), short first line; details go in the body.
- One logical change per commit — don't mix UI changes into an API commit.

```txt
feat(auth): add JWT token validation

fix: prevent racing of requests

Introduce a request id and a reference to the latest request.
Dismiss incoming responses other than from the latest request.

Refs: #123
```

## Pull Requests

- Small and focused: one PR per well-defined scope; split large features into incremental PRs.
- Title: a short, clear description of what the PR delivers, following the same type prefix as commits.
- Body: what changed, how to test it, and evidence it works (screenshots, test output) when the change is visual or behavioral.
- Resolve conflicts and CI failures before requesting review.

### Review comment labels

Prefix review comments with a label so severity is explicit:

| Label            | Meaning                                                         |
| ---------------- | --------------------------------------------------------------- |
| `[BLOCKER]`      | Must be fixed before merge (security, data loss, broken build). |
| `[BUG]`          | Incorrect behavior that must be fixed.                          |
| `[REQUEST]`      | Required change for approval.                                   |
| `[IMPROVEMENT]`  | Optional but worthwhile (performance, maintainability).         |
| `[NICE TO HAVE]` | Optional suggestion; author decides.                            |
| `[QUESTION]`     | Clarification about a decision or logic.                        |
