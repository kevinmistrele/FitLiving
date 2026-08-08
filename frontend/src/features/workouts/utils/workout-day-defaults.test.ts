import { describe, expect, it } from 'vitest';

import {
  WORKOUT_DAY_DEFAULTS,
  WORKOUT_DAY_IDS,
} from '@/features/workouts/utils/workout-day-defaults';

describe('workout-day-defaults', () => {
  it('fixes Mon/Wed/Fri as full_body and Tue/Thu as cardio_core, per the spec structure', () => {
    expect(WORKOUT_DAY_DEFAULTS.mon.type).toBe('full_body');
    expect(WORKOUT_DAY_DEFAULTS.wed.type).toBe('full_body');
    expect(WORKOUT_DAY_DEFAULTS.fri.type).toBe('full_body');
    expect(WORKOUT_DAY_DEFAULTS.tue.type).toBe('cardio_core');
    expect(WORKOUT_DAY_DEFAULTS.thu.type).toBe('cardio_core');
  });

  it('orders weekday 1-5 across mon-fri', () => {
    expect(WORKOUT_DAY_IDS.map((dayId) => WORKOUT_DAY_DEFAULTS[dayId].weekday)).toEqual([
      1, 2, 3, 4, 5,
    ]);
  });
});
