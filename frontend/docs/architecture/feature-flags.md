# Feature Flags

This base uses a minimal, dependency-free convention: flags are environment variables, parsed once and read through a hook. There is no remote flag service (LaunchDarkly, GrowthBook, Unleash, etc.) — adopt one deliberately (new ADR) if the project outgrows build-time flags (e.g. needs per-user targeting, remote toggling without a redeploy, or a rollout percentage).

## Where flags live

- `src/config/feature-flags.ts` — declares every known flag explicitly (mirrors `src/config/env.ts`'s pattern) and parses `VITE_FEATURE_*` variables with `zod`.
- `src/hooks/use-feature-flag.ts` — the only way features should read a flag.

```ts
// src/config/feature-flags.ts
const featureFlagsSchema = z.object({
  VITE_FEATURE_EXAMPLE: booleanFlag,
});

export const featureFlags = {
  example: parsed.VITE_FEATURE_EXAMPLE,
} as const;
```

```ts
// usage in a feature
const isExampleEnabled = useFeatureFlag('example');
```

## Adding a new flag

1. Add `VITE_FEATURE_<NAME>=false` to `.env.example` (flags default to **off** unless a task says otherwise).
2. Add the corresponding key to `featureFlagsSchema` and `featureFlags` in `src/config/feature-flags.ts`.
3. Read it with `useFeatureFlag('<name>')` — never read `import.meta.env.VITE_FEATURE_*` directly in feature code, same rule as `env.ts` (see [api-layer.md](./api-layer.md)).

## Why a hook and not a plain constant

Today `useFeatureFlag` just reads a parsed env value — no state, no context. It's a hook anyway so call sites don't change if flags later move to a context/provider (e.g. remote flags loaded at runtime): the call site (`useFeatureFlag('example')`) stays identical; only the implementation changes.

## Using a flag to gate UI

Gate at the screen or route level when the whole feature is flagged; gate at the component level for a smaller piece of UI. Either way, keep the flag check close to the render decision — don't thread a boolean prop through several layers just to reach a leaf component.

```tsx
function Screen() {
  const isExampleEnabled = useFeatureFlag('example');
  if (!isExampleEnabled) return null;
  return <ExamplePanel />;
}
```

## Testing

Set the env var before the test file imports `src/config/feature-flags.ts` (module-level `parse` runs once at import time), or mock `@/hooks/use-feature-flag` directly in tests that need to exercise both the on/off branches.

## Removing a flag

Once a flag is permanently on (or off), delete the flag, its `.env.example` entry, and the `if` branch it gated — flags are meant to be temporary. A flag left in the codebase after the rollout decision is made is dead code, not a feature.
