# 0004 - Feature flags via environment variables

## Context

Neither the sibling production app used as reference nor Bulletproof React has a feature-flag system to adopt as-is. The base still needed _some_ answer, since "how do I ship something behind a flag" is a common request an agent will get.

## Decision

Start with the smallest thing that works: flags are `VITE_FEATURE_*` env vars, parsed once in `src/config/feature-flags.ts` (same pattern as `src/config/env.ts`), read through `useFeatureFlag('name')`. No remote flag service, no dependency added.

## Consequences

- Flags require a rebuild/redeploy to change — acceptable for a base repo with no rollout/targeting requirements yet.
- The hook indirection (`useFeatureFlag` instead of a plain exported constant) means call sites don't change if this later grows into a context-based or remote-fetched implementation.
- If the project needs per-user targeting, percentage rollouts, or toggling without a redeploy, that is a new, explicit decision (a new ADR) to adopt a real flag service (e.g. GrowthBook, LaunchDarkly, Unleash) — not a silent upgrade of this convention.
