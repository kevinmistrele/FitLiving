import type { WorkoutDayId, WorkoutDayType } from '@/features/workouts/types/workout.types';

export const WORKOUT_DAY_IDS: WorkoutDayId[] = ['mon', 'tue', 'wed', 'thu', 'fri'];

interface WorkoutDayDefault {
  weekday: number;
  type: WorkoutDayType;
  label: string;
}

// Fixed structure per docs/project/fitliving-web.md section 3.1: Mon/Wed/Fri = full body,
// Tue/Thu = light cardio + core. weekday/type are fixed by the spec and never change; label
// is only the initial display name — it stays editable afterwards (section 3.3).
export const WORKOUT_DAY_DEFAULTS: Record<WorkoutDayId, WorkoutDayDefault> = {
  mon: { weekday: 1, type: 'full_body', label: 'Full Body A' },
  tue: { weekday: 2, type: 'cardio_core', label: 'Cardio & Core A' },
  wed: { weekday: 3, type: 'full_body', label: 'Full Body B' },
  thu: { weekday: 4, type: 'cardio_core', label: 'Cardio & Core B' },
  fri: { weekday: 5, type: 'full_body', label: 'Full Body C' },
};
