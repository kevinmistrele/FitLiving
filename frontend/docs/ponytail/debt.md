# Ponytail Debt — Tracking `ponytail:` Comments

Every deliberate shortcut left by [overview.md](./overview.md)'s ladder is marked with a `// ponytail:` comment naming its ceiling and upgrade path. This collects them into a ledger so a deferral doesn't silently become permanent.

## Scan

Grep the repo for the marker, ignoring build output and dependencies:

```bash
grep -rn '// ?ponytail:' src
```

Each hit is one ledger line. The `// ponytail:` prefix keeps prose that merely mentions the convention out of the ledger.

## Output

One line per marker, grouped by file:

```
<file>:<line>, <what was simplified>. ceiling: <the named limit>. upgrade: <the trigger to revisit>.
```

The convention is `// ponytail: <ceiling>, <upgrade path>`, so pull the ceiling and trigger straight from the comment. Want a name attached? Add `git blame -L<line>,<line>`.

Flag rot risk: any `// ponytail:` comment that doesn't name an upgrade path or trigger gets the `no-trigger` tag — those are the ones that rot silently and should be fixed to name one, or removed if the shortcut is now permanent.

End with `<N> markers, <M> with no trigger.` Nothing found: `No ponytail debt. Clean ledger.`

## Persisting the ledger

This is a report, not a file that gets written automatically. If it's worth tracking over time, write the output to `PONYTAIL-DEBT.md` at the repo root when asked — otherwise treat it as a one-off scan (e.g. before a release, or when explicitly requested).

## Boundaries

Reads and reports only — never edits code. A single report per run.
