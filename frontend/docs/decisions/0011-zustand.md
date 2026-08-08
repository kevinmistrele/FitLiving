# 0011 - Zustand for app-wide auth state

## Context

The auth feature needs the current Firebase user in at least two unrelated parts of the tree at once: the protected-route layout (`src/app/routes/protected-layout.tsx`, deciding redirect vs. render) and the home screen's logout affordance — with more features to come that will need the current uid (per `docs/project/fitliving-web.md`'s data model, every future record is scoped to the owner's uid). This is exactly the "two or more unrelated parts of the tree genuinely share it" bar `docs/architecture/state-management.md` sets for a global store. The user chose Zustand at kickoff, per `docs/recipes/zustand.md`.

## Decision

Adopt Zustand via `docs/recipes/zustand.md`:

- `src/lib/auth-store.ts` — app-wide (not feature-scoped, since app shell code outside `src/features/auth` needs it), holding `{ user: User | null, isInitializing: boolean, setUser }`.
- A single `onAuthStateChanged` listener, wired once in `src/app/provider.tsx`, is the only writer — it calls `setUser` on every auth state change. Nothing else calls `setUser` directly.
- Server state (there is none yet for auth beyond the Firebase user object itself) stays out of the store; screen-local form state (the login form's email/password) stays in the auth feature's screen hook, not here.

## Consequences

- `useAuthStore` is the one sanctioned way to read the current user/uid outside the `onAuthStateChanged` listener itself.
- Future features that need the owner's uid to scope Firestore reads/writes (Treino, Dieta, Acompanhamento — not built yet) read it from this store rather than re-deriving it from `auth.currentUser` directly, keeping one source of truth for "am I logged in, and as whom."
