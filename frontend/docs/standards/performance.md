# Performance

- Readability first. Don't optimize before there's a measured or obvious problem.
- Use `useMemo`/`useCallback`/`React.memo` only when there's a concrete re-render or computation cost to avoid — not as a default wrapper on every component or value.
- Let TanStack Query's caching (`staleTime`, query keys) do the work of avoiding redundant network requests instead of hand-rolled caching.
- Avoid state updates that cascade unnecessary re-renders (e.g. storing a derived value in state instead of computing it — see [state-management.md](../architecture/state-management.md)).
- For lists, key by stable IDs, not array index, to avoid unnecessary reconciliation/remounts.
- Route-level code splitting is already the default: each route in `src/app/router.tsx` uses the `lazy` property, so every route is its own chunk. Only reach for manual `React.lazy` inside a route for a clearly heavy sub-section, not preemptively for every component.
- When a `useState` initial value comes from an expensive computation, pass a function, not the result — `useState(() => expensiveFn())` runs once; `useState(expensiveFn())` runs on every render:

```ts
// runs on every render
const [state, setState] = useState(expensiveFn());

// runs once
const [state, setState] = useState(() => expensiveFn());
```

- Prefer passing `children` over rendering a child component directly inside a parent that re-renders on its own state changes — JSX passed as `children` is not re-created by the parent's re-render:

```tsx
// PureComponent re-renders whenever count changes, even though it doesn't use it
function Counter() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <button onClick={() => setCount((c) => c + 1)}>{count}</button>
      <PureComponent />
    </div>
  );
}

// PureComponent, passed as children, is unaffected by Counter's re-renders
function Counter({ children }: PropsWithChildren) {
  const [count, setCount] = useState(0);
  return (
    <div>
      <button onClick={() => setCount((c) => c + 1)}>{count}</button>
      {children}
    </div>
  );
}
```
