# React

- Declare components with `function`, not arrow-function consts (`function Button(props: ButtonProps) {}`).
- `PascalCase` for components and types, `camelCase` for variables/functions, `kebab-case` for files and folders. `kebab-case` is lint-enforced via `eslint-plugin-check-file` (`npm run lint` fails on a non-conforming filename/folder).
- One component's primary responsibility per file. Small, focused components over one large one with internal branching.
- Screens (the top-level component a route renders) orchestrate: they call feature hooks, decide loading/empty/error/success UI (see [state-management.md](../architecture/state-management.md)), and compose fragments.
- UI fragments (everything a screen renders below itself) receive data and callbacks through props only. A fragment never calls an API, reads a global store, or navigates directly — that keeps it reusable and independently testable.
- Extract non-trivial screen logic into `use-<screen>-screen.hooks.ts` (see [hooks.md](./hooks.md)) instead of letting the screen component accumulate `useEffect`s and derived variables.
- Prefer composition (`children`, render props, slots) over a growing list of boolean props (`variant`, `size` enums are fine; `isX`/`isY`/`isZ` stacking booleans is a smell).
- Don't introduce a new UI/animation/state library to solve something React + this repo's existing tools already solve.

## Internal order

Inside a component, keep a fixed order so every file reads the same:

1. Hooks — external libraries first, then this repo's hooks. Always at the top, never inside conditions or loops.
2. Derived constants and `useState`.
3. `useEffect` / `useMemo` / `useCallback`.
4. Handlers (`handleX`) and local helpers — helpers never contain hooks.
5. `return` (JSX). No code after it, no business logic inline in JSX — extract to the screen hook.
