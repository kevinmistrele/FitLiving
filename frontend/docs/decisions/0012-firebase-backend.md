# 0012 - Firebase as the entire backend

## Context

`docs/fitliving.md` (section 8, "Ordem Sugerida de Construção") scopes the first build step as "login and cloud data structure skeleton." The project has no server of its own, no plan to build one, and a Firebase project (`fitliving-ef1ec`) was already provisioned by the owner with Authentication and Firestore available. `docs/architecture/api-layer.md` described a generic REST `src/lib/api-client.ts` wrapper (`get`/`post`/`put`/`patch`/`delete`) that this project will never build — there is no REST backend to call.

## Decision

Firebase is this project's entire backend, for both the current auth feature and future data features (Treino, Dieta, Acompanhamento — not built yet):

- `src/lib/firebase.ts` calls `initializeApp` with config sourced from `env` (`src/config/env.ts`, `VITE_FIREBASE_*`, never read `import.meta.env` directly), and exports `auth` (`getAuth`) and `db` (`getFirestore`). No Firebase Analytics — it adds nothing for a single-user app that's already behind auth.
- Feature `api/*.ts` files wrap Firebase SDK calls directly with typed functions (e.g. `signInWithEmail(payload): Promise<UserCredential>` wraps `signInWithEmailAndPassword`) — same throw/never-swallow contract `docs/architecture/api-layer.md` and `docs/standards/errors.md` already describe, just against the Firebase SDK instead of `fetch`.
- `docs/architecture/api-layer.md` was rewritten in this same change to describe this actual pattern instead of the generic REST one — no `src/lib/api-client.ts` exists or is planned.
- Authorization is enforced by Firebase Auth (who you are) plus Firestore Security Rules (what that uid may read/write) instead of an app-level RBAC system — there is no application server to host one. `firestore.rules` ships deny-by-default with a commented example of the `users/{uid}/...` ownership pattern future data features will use.
- Session/token lifecycle (refresh, persistence, expiry) is owned entirely by the Firebase Auth SDK, not a custom HttpOnly cookie — there is no application server to mint or verify one. `docs/standards/security.md`'s Auth section was updated to describe this instead of the earlier HttpOnly-cookie placeholder.

## Consequences

- No REST API, no `src/lib/api-client.ts`, no `ApiError` type — Firebase SDK errors (`FirebaseError`, `.code`) are the failure shape feature `api/` functions propagate instead.
- Firestore Security Rules are the actual authorization boundary; a client-side check (e.g. hiding a button) is still UX-only, same principle as before, just enforced server-side by rules instead of a custom API.
- The Firebase web config (`apiKey`, `authDomain`, etc.) is safely public by Firebase's own design, but still routed through `.env`/`env.ts` per this repo's convention rather than hardcoded, so it isn't scattered across source files.
- Deploying `firestore.rules` (`firebase deploy --only firestore:rules`) and enabling Email/Password sign-in + creating the owner's account are manual steps in the Firebase console/CLI, outside this change's scope.
