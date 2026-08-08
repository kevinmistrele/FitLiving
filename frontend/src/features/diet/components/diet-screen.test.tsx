import { onAuthStateChanged } from 'firebase/auth';
import { getDoc, getDocs } from 'firebase/firestore';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { DietScreen } from '@/features/diet/components/diet-screen';
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

const baseProfileFields = {
  initialWeightKg: 105,
  goalNovemberComfortableKg: 94,
  goalCapKg: 90,
  goalOverweightExitKg: 82,
  novemberWindowStart: { toDate: () => new Date(2020, 10, 1) },
  novemberWindowEnd: { toDate: () => new Date(2020, 10, 30) },
  updatedAt: { toDate: () => new Date(2026, 0, 1) },
};

describe('DietScreen', () => {
  beforeEach(() => {
    mockedGetDoc.mockReset();
    mockedGetDocs.mockReset();
    // No meals in the plan for either scenario below.
    mockedGetDocs.mockResolvedValue({ empty: true, docs: [] } as never);
  });

  it('asks the user to fill in height/age/sex before showing calculated goals when the profile is incomplete', async () => {
    mockSignedInUser('test-uid-incomplete-profile');
    mockedGetDoc.mockResolvedValue({
      exists: () => true,
      data: () => ({
        ...baseProfileFields,
        // heightCm/age/sex intentionally absent — a profile check-ins created but the diet
        // form was never filled in yet.
        currentWeightKg: 100,
        activityLevel: 'moderate',
        dietDeficitLevel: 'moderate',
      }),
    } as never);

    render(<DietScreen />);

    expect(await screen.findByRole('heading', { name: 'Goals' })).toBeInTheDocument();
    expect(
      screen.getByText(
        'Fill in your height, age and sex above to see your calculated TDEE, calorie target and macros.',
      ),
    ).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Calculated goals' })).not.toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Macronutrients' })).not.toBeInTheDocument();
  });

  it('shows TDEE, calorie target and macros once height/age/sex are on the profile', async () => {
    mockSignedInUser('test-uid-complete-profile');
    mockedGetDoc.mockResolvedValue({
      exists: () => true,
      data: () => ({
        ...baseProfileFields,
        currentWeightKg: 100,
        heightCm: 180,
        age: 30,
        sex: 'male',
        activityLevel: 'moderate',
        dietDeficitLevel: 'moderate',
      }),
    } as never);

    render(<DietScreen />);

    expect(await screen.findByRole('heading', { name: 'Calculated goals' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Macronutrients' })).toBeInTheDocument();
    // BMR = 10*100 + 6.25*180 - 5*30 + 5 = 1980; TDEE = 1980 * 1.55 = 3069;
    // target = 3069 - 500 (moderate deficit) = 2569.
    expect(screen.getByText('3069 kcal')).toBeInTheDocument();
    expect(screen.getByText('2569 kcal')).toBeInTheDocument();
    expect(
      screen.queryByText(
        'Fill in your height, age and sex above to see your calculated TDEE, calorie target and macros.',
      ),
    ).not.toBeInTheDocument();
  });
});
