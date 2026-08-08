import { render as testingLibraryRender, type RenderOptions } from '@testing-library/react';
import { onAuthStateChanged } from 'firebase/auth';
import type { PropsWithChildren, ReactElement } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';

import { AppProvider } from '@/app/provider';

function AllProviders(props: PropsWithChildren) {
  const { children } = props;

  return (
    <AppProvider>
      <MemoryRouter>{children}</MemoryRouter>
    </AppProvider>
  );
}

function render(ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) {
  return testingLibraryRender(ui, { wrapper: AllProviders, ...options });
}

// Each test should use its own uid so TanStack Query's cache (a module-level singleton
// shared across renders — see src/lib/query-client.ts) never serves a previous test's
// cached result. Relies on the global `vi.mock('firebase/auth', ...)` in setup-tests.ts.
function mockSignedInUser(uid: string) {
  vi.mocked(onAuthStateChanged).mockImplementation((_auth, callback) => {
    (callback as (user: unknown) => void)({ uid, email: 'owner@example.com' });
    return () => {};
  });
}

export * from '@testing-library/react';
export { render, mockSignedInUser };
