# Recipe: Zustand

Opt-in only. Apply this when the user explicitly chooses Zustand (typically at project kickoff — see `AGENTS.md`), **and** there is a real case for shared client state. Never as a side effect of another task.

Zustand does not change the state rules in [state-management.md](../architecture/state-management.md) — it only provides the store when one is genuinely justified:

- Server state stays in TanStack Query. Never copy query data into a store.
- Screen-local state stays in `useState`/screen hooks.
- URL-worthy state (filters, pagination, tabs) stays in the URL.
- A store is for UI state that two or more **unrelated** parts of the tree genuinely share (e.g. an app-wide sidebar/theme, a multi-step wizard spanning routes).

## Steps

1. Install:

   ```bash
   npm install zustand
   ```

2. Where a store lives:
   - feature-scoped → `src/features/<feature>/stores/<name>-store.ts` (the folder [feature-template.md](../architecture/feature-template.md) already reserves);
   - app-wide → `src/lib/<name>-store.ts`.

3. Pattern — typed, minimal, actions colocated:

   ```ts
   import { create } from 'zustand';

   interface SidebarStore {
     isOpen: boolean;
     toggle: () => void;
   }

   export const useSidebarStore = create<SidebarStore>((set) => ({
     isOpen: false,
     toggle: () => set((state) => ({ isOpen: !state.isOpen })),
   }));
   ```

   Select narrowly in components (`useSidebarStore((s) => s.isOpen)`) so unrelated updates don't re-render them.

4. Record the decision: new ADR in `docs/decisions/` (next sequential number) stating Zustand was adopted at the user's request.

5. Update [state-management.md](../architecture/state-management.md): its "Global client state" section says the base ships without a global store library — change that sentence to name Zustand and link this recipe.

6. Validate: `npm run typecheck`, `npm run test`. A store with non-trivial logic gets a test per [tests.md](../standards/tests.md).
