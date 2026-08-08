# API Layer

This project has no REST API — Firebase (Authentication + Firestore) is the entire backend, see [0012-firebase-backend.md](../decisions/0012-firebase-backend.md). There is no `src/lib/api-client.ts` and none is planned.

## Where backend calls live

- SDK setup: `src/lib/firebase.ts` — calls `initializeApp` once and exports `auth` (`getAuth`) and `db` (`getFirestore`).
- Feature-specific requests: `src/features/<feature>/api/*.ts` — thin, typed wrappers around Firebase SDK calls.
- Never inside a component body or JSX.

## Pattern

```ts
// src/features/<feature>/api/sign-in-with-email.ts
import { signInWithEmailAndPassword, type UserCredential } from 'firebase/auth';

import { auth } from '@/lib/firebase';
import type { LoginPayload } from '@/features/<feature>/types/<feature>.types';

export function signInWithEmail(payload: LoginPayload): Promise<UserCredential> {
  return signInWithEmailAndPassword(auth, payload.email, payload.password);
}
```

For data reads that a screen subscribes to, wrap the Firestore call in a feature hook the same way a REST call would be wrapped in `useQuery`/`useMutation` (see [state-management.md](./state-management.md)) — the SDK changes, the calling convention from a screen's point of view does not.

Request functions:

- take explicit, typed parameters;
- return typed data (type the response; do not `as any` past the Firebase SDK);
- throw or reject on failure — they do not catch-and-swallow errors. The Firebase SDK already rejects its promises on failure (`FirebaseError`, carrying a `.code` like `auth/invalid-credential`) — do not wrap that in a try/catch that discards it.
- do not show toasts, navigate, or touch global stores. That is the screen's job (see [../standards/errors.md](../standards/errors.md)).

## Error flow

```txt
firebase.ts / feature api/*.ts  ->  feature hook (TanStack Query)  ->  screen
```

Errors propagate up through this chain untouched. On failure, the Firebase SDK rejects with a `FirebaseError` carrying `.code` — inspect that when a screen needs to branch on the failure kind (e.g. map `auth/invalid-credential` to a field/form error, see `src/features/auth/utils/get-login-error-message-key.ts`). The screen decides what the user sees (see [state-management.md](./state-management.md) and [../standards/errors.md](../standards/errors.md)). Never show a raw Firebase error code or message to the user — always map it to a user-facing string through `t()`.

## Config

- Environment variables are parsed and validated once in `src/config/env.ts` (Zod schema) and imported as `env` everywhere else — never read `import.meta.env` directly in feature code.
- The Firebase web config (`apiKey`, `authDomain`, etc.) is safely public by Firebase's own design — the actual authorization boundary is Firestore Security Rules (`firestore.rules`), not keeping this config secret. It is still routed through `.env`/`env.ts` per this repo's convention rather than hardcoded.

## Authorization

There is no application server, so authorization is enforced by Firebase Auth (who the request is from) plus Firestore Security Rules (what that uid may read/write) — not app-level RBAC. `firestore.rules` ships deny-by-default; each future data feature adds the narrowest rule its data needs (see the commented `users/{uid}/...` ownership example in that file). A client-side check (hiding a button, redirecting an unauthenticated visitor) is still UX-only — the rules are what actually enforce the boundary, same principle as trusting a server independently of client checks.

## Adding a new Firestore-backed feature

Add the feature's `api/*.ts` functions wrapping the Firestore SDK (`getDoc`/`setDoc`/`onSnapshot`/etc. from `db`), plus the narrowest Firestore Security Rule it needs. Only reach for a different data-access library when the task explicitly calls for it — the Firebase SDK already covers reads, writes, and real-time subscriptions.
