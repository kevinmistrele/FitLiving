# 0002 - Routing with react-router

## Context

`docs/` referred to "routes" and "the router" (URL state, route-level code splitting) before any router was actually installed — a fork with a second screen had no concrete way to add navigation.

## Decision

Add `react-router-dom` (data router API) as the routing solution:

- `src/app/router.tsx` — `createBrowserRouter` config, one entry per top-level route.
- `src/app/routes/<route-name>.tsx` — a thin route component that imports and renders a feature's screen. Route files do not contain feature logic themselves.
- Routes are lazy-loaded via each route's `lazy` property, giving route-level code splitting by default (see `docs/standards/performance.md`).
- `src/app/app.tsx` renders `<RouterProvider router={router} />`.
- `src/testing/test-utils.tsx` wraps rendered components in `MemoryRouter` so any component using router hooks (`useNavigate`, `useParams`, `Link`) works under test without extra setup per test file.

## Consequences

- Adding a second feature/screen means: add a route file under `src/app/routes/`, register it in `router.tsx`, done — no ambiguity about where routing config lives.
- URL state (filters, params) is implemented with `react-router`'s `useSearchParams`/`useParams`, not hand-rolled.
- A route file importing a feature's screen is the one place `src/app` legitimately reaches into a feature — consistent with the existing dependency rules (`docs/architecture/dependency-rules.md`).
