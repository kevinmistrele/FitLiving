import { onAuthStateChanged } from 'firebase/auth';
import { getDoc, getDocs } from 'firebase/firestore';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { CheckInsScreen } from '@/features/check-ins/components/check-ins-screen';
import { render, screen } from '@/testing/test-utils';

const mockedOnAuthStateChanged = vi.mocked(onAuthStateChanged);
const mockedGetDoc = vi.mocked(getDoc);
const mockedGetDocs = vi.mocked(getDocs);

// Each test uses its own uid so TanStack Query's cache (a module-level singleton shared
// across renders — see src/lib/query-client.ts) never serves a previous test's cached result.
function mockSignedInUser(uid: string) {
  mockedOnAuthStateChanged.mockImplementation((_auth, callback) => {
    (callback as (user: unknown) => void)({ uid, email: 'owner@example.com' });
    return () => {};
  });
}

function mockProfileDoc() {
  mockedGetDoc.mockResolvedValue({
    exists: () => true,
    data: () => ({
      initialWeightKg: 105,
      currentWeightKg: 103,
      goalNovemberComfortableKg: 94,
      goalCapKg: 90,
      goalOverweightExitKg: 82,
      novemberWindowStart: { toDate: () => new Date(2020, 10, 1) },
      novemberWindowEnd: { toDate: () => new Date(2020, 10, 30) },
      updatedAt: { toDate: () => new Date(2026, 0, 1) },
    }),
  } as never);
}

describe('CheckInsScreen', () => {
  beforeEach(() => {
    mockedGetDoc.mockReset();
    mockedGetDocs.mockReset();
  });

  it('renders the empty state with the registration form available when there are no check-ins yet', async () => {
    mockSignedInUser('test-uid-empty');
    mockProfileDoc();
    mockedGetDocs.mockResolvedValue({ empty: true, docs: [] } as never);

    render(<CheckInsScreen />);

    expect(await screen.findByText('No check-ins yet')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Weekly check-in' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Save check-in' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'History' })).not.toBeInTheDocument();
  });

  it('renders history, goals and charts once check-ins exist', async () => {
    mockSignedInUser('test-uid-with-data');
    mockProfileDoc();
    mockedGetDocs.mockResolvedValue({
      empty: false,
      docs: [
        {
          id: 'checkin-1',
          data: () => ({
            date: { toDate: () => new Date(2026, 0, 1) },
            weightKg: 105,
            waistCm: 110,
            notes: 'first week',
            deltaWeightKg: 0,
            createdAt: { toDate: () => new Date(2026, 0, 1) },
          }),
        },
        {
          id: 'checkin-2',
          data: () => ({
            date: { toDate: () => new Date(2026, 0, 8) },
            weightKg: 103,
            waistCm: 108,
            notes: 'feeling good',
            deltaWeightKg: -2,
            createdAt: { toDate: () => new Date(2026, 0, 8) },
          }),
        },
      ],
    } as never);

    render(<CheckInsScreen />);

    expect(await screen.findByRole('heading', { name: 'History' })).toBeInTheDocument();
    expect(screen.getByText('feeling good')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Goals' })).toBeInTheDocument();
    expect(screen.queryByText('No check-ins yet')).not.toBeInTheDocument();
  });
});
