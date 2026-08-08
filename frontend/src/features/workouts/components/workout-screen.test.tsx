import { getDocs } from 'firebase/firestore';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { WorkoutScreen } from '@/features/workouts/components/workout-screen';
import { mockSignedInUser, render, screen } from '@/testing/test-utils';

const mockedGetDocs = vi.mocked(getDocs);

// All 5 fixed workoutDays already seeded, so getOrCreateWorkoutDays never has to fall into
// its create-missing-days path (which would also need writeBatch mocked).
function mockWorkoutDaysSnapshot() {
  const dayIds = ['mon', 'tue', 'wed', 'thu', 'fri'];

  return {
    empty: false,
    docs: dayIds.map((dayId, index) => ({
      id: dayId,
      data: () => ({
        dayId,
        weekday: index + 1,
        type: index % 2 === 0 ? 'full_body' : 'cardio_core',
        label: `Day ${index + 1}`,
        updatedAt: { toDate: () => new Date(2026, 0, 1) },
      }),
    })),
  };
}

describe('WorkoutScreen', () => {
  beforeEach(() => {
    mockedGetDocs.mockReset();
  });

  it('renders the empty state with the add-exercise form available when the day has no exercises yet', async () => {
    mockSignedInUser('test-uid-empty');
    // Call order: 1) getOrCreateWorkoutDays, 2) listExercises for the selected day,
    // 3+) listLoadHistory per exercise (none here, so nothing beyond the first two calls).
    mockedGetDocs.mockResolvedValue({ empty: true, docs: [] } as never);
    mockedGetDocs.mockResolvedValueOnce(mockWorkoutDaysSnapshot() as never);
    mockedGetDocs.mockResolvedValueOnce({ empty: true, docs: [] } as never);

    render(<WorkoutScreen />);

    expect(await screen.findByText('No exercises yet')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Add exercise' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Add exercise' })).toBeInTheDocument();
  });

  it('renders the exercises once they exist for the selected day', async () => {
    mockSignedInUser('test-uid-with-data');
    mockedGetDocs.mockResolvedValue({ empty: true, docs: [] } as never);
    mockedGetDocs.mockResolvedValueOnce(mockWorkoutDaysSnapshot() as never);
    mockedGetDocs.mockResolvedValueOnce({
      empty: false,
      docs: [
        {
          id: 'exercise-1',
          data: () => ({
            name: 'Squat',
            sets: 3,
            repsMin: 8,
            repsMax: 12,
            order: 0,
            completedThisWeek: false,
            lastCompletedAt: null,
            createdAt: { toDate: () => new Date(2026, 0, 1) },
          }),
        },
      ],
    } as never);

    render(<WorkoutScreen />);

    expect(await screen.findByText('Squat')).toBeInTheDocument();
    expect(screen.getByText('3 sets x 8-12 reps')).toBeInTheDocument();
    expect(screen.queryByText('No exercises yet')).not.toBeInTheDocument();
  });
});
