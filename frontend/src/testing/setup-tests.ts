import '@testing-library/jest-dom/vitest';

import { cleanup } from '@testing-library/react';
import { afterAll, afterEach, beforeAll, vi } from 'vitest';

import { server } from '@/testing/mocks/server';

// Firebase is this app's backend (see docs/architecture/api-layer.md).
// Mock the SDK boundary globally so no test ever touches real Firebase
// (network, IndexedDB persistence) — tests control behavior per case via
// vi.mocked(signInWithEmailAndPassword)/vi.mocked(firebaseSignOut) etc.
vi.mock('firebase/app', async (importOriginal) => {
  // Keep the real FirebaseError class (so `instanceof` checks in
  // src/features/auth/utils/get-login-error-message-key.ts still work against
  // errors constructed in tests) — only initializeApp is replaced.
  const actual = await importOriginal<typeof import('firebase/app')>();
  return {
    ...actual,
    initializeApp: vi.fn(() => ({})),
  };
});

vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(() => ({})),
  onAuthStateChanged: vi.fn((_auth: unknown, callback: (user: null) => void) => {
    callback(null);
    return () => {};
  }),
  signInWithEmailAndPassword: vi.fn(),
  signOut: vi.fn(),
}));

vi.mock('firebase/firestore', () => ({
  getFirestore: vi.fn(() => ({})),
}));

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));

afterEach(() => {
  cleanup();
  server.resetHandlers();
});

afterAll(() => server.close());
