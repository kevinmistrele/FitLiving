# State Management

## Default: keep state close to where it is used

Local `useState`/`useReducer` in the component or screen hook that needs it. Do not lift state or add a global store "just in case."

## Server state: TanStack Query

Any data that originates from the API is server state, not app state:

- fetch/mutate through a feature hook that wraps `useQuery`/`useMutation` (see [api-layer.md](./api-layer.md));
- let the query cache own loading/error/data — don't copy query data into `useState`;
- key queries so they can be invalidated precisely (`['entity', entityId]`, not a single flat key for everything).

## Global client state

Only introduce shared/global client state (context, store) when two or more unrelated parts of the tree genuinely need the same piece of UI state. Before adding one, check whether:

- it can stay local to a screen hook, or
- it is actually server state that belongs in TanStack Query.

If a global store is truly needed, this project uses Zustand (see [0011-zustand.md](../decisions/0011-zustand.md) and [../recipes/zustand.md](../recipes/zustand.md)) — app-wide stores live in `src/lib` (e.g. `src/lib/auth-store.ts`), feature-scoped stores in the owning feature's `stores/`. Document why a new store is needed in the PR description; don't add one by default.

## Derived data

Compute derived values from existing state/query data at render time (or with `useMemo` when the computation is provably expensive). Do not duplicate derived data into its own state variable — it will drift out of sync.

## Finite/explicit states

For screens with more than trivial branching (loading/error/empty/success), model the state explicitly in the screen hook rather than juggling multiple booleans:

```ts
type WelcomeScreenState =
  | { status: 'loading' }
  | { status: 'error' }
  | { status: 'empty' }
  | { status: 'success'; message: WelcomeMessage };
```

This makes impossible combinations (e.g. `isLoading && isError`) unrepresentable and easier for an agent (or reviewer) to reason about.

## URL state

Data that should survive a refresh or be shareable via link (filters, pagination, selected tab/id) belongs in the URL — route params or query string — not in component state. Read/write it through `react-router` (`useParams`, `useSearchParams`) instead of mirroring it into `useState` and manually keeping both in sync:

```ts
const [searchParams, setSearchParams] = useSearchParams();
const page = Number(searchParams.get('page') ?? '1');
```

See `docs/decisions/0002-routing.md` for where routes are configured.
