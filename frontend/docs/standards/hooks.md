# Hooks

## Kinds of hooks in this codebase

- **Shared hooks** — `src/hooks/*`. Generic, reusable across features (e.g. `use-debounced-value`). No feature or domain knowledge.
- **Feature API hooks** — `src/features/<feature>/api/*.ts`. Wrap `useQuery`/`useMutation` around a request function (see [api-layer.md](../architecture/api-layer.md)).
- **Screen hooks** — `src/features/<feature>/hooks/use-<screen>-screen.hooks.ts`. Orchestrate one or more feature hooks, derive display state, expose callbacks to the screen component.

## Screen hook rules

- Named `use-<screen>-screen.hooks.ts`, exporting `use<Screen>Screen()`.
- May call feature hooks, derive/shape data for rendering, and return callbacks.
- Must not render UI (no JSX).
- Keep the return value a flat, typed object the screen destructures — not a re-export of the raw query object, so the screen doesn't reach into TanStack Query internals directly.

```ts
export function useWelcomeScreen() {
  const welcomeMessageQuery = useWelcomeMessage();

  return {
    isError: welcomeMessageQuery.isError,
    isLoading: welcomeMessageQuery.isLoading,
    message: welcomeMessageQuery.data,
  };
}
```

## Rules of Hooks

- Follow `eslint-plugin-react-hooks` (already enabled) — no conditional hook calls, correct dependency arrays.
- Don't suppress an exhaustive-deps warning to silence it; fix the dependency or restructure the effect.
- Prefer deriving values during render over `useEffect` + `useState` when the value can be computed directly from props/state.
