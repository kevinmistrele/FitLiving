import { z } from 'zod';

// Fixed 5-day structure — docs/firestore-data-model.md section 1.3.
export type WorkoutDayId = 'mon' | 'tue' | 'wed' | 'thu' | 'fri';

export type WorkoutDayType = 'full_body' | 'cardio_core';

export interface WorkoutDay {
  dayId: WorkoutDayId;
  weekday: number;
  type: WorkoutDayType;
  label: string;
  updatedAt: Date | null;
}

export interface Exercise {
  id: string;
  name: string;
  sets: number;
  repsMin: number;
  repsMax: number;
  order: number;
  completedThisWeek: boolean;
  lastCompletedAt: Date | null;
  createdAt: Date;
}

export interface LoadEntry {
  id: string;
  weekOf: Date;
  loadKg: number;
  repsAchieved: number | null;
  increasedVsPrevious: boolean;
  createdAt: Date;
}

export const exerciseFormSchema = z
  .object({
    name: z.string().trim().min(1),
    sets: z.coerce.number().int().positive(),
    repsMin: z.coerce.number().int().positive(),
    repsMax: z.coerce.number().int().positive(),
  })
  .refine((value) => value.repsMax >= value.repsMin, {
    message: 'repsMax must be greater than or equal to repsMin',
    path: ['repsMax'],
  });

export type ExerciseFormInput = z.infer<typeof exerciseFormSchema>;

export interface ExerciseFieldErrors {
  name?: string;
  sets?: string;
  repsMin?: string;
  repsMax?: string;
}

// repsAchieved stays a string through validation (mirrors how check-ins' form fields are
// plain strings until parsed) because it's optional: '' means "not recorded", anything else
// must be a positive integer.
const repsAchievedFieldSchema = z
  .string()
  .trim()
  .refine((value) => value === '' || (/^\d+$/.test(value) && Number(value) > 0), {
    message: 'repsAchieved must be a positive whole number or empty',
  });

export const loadEntryFormSchema = z.object({
  loadKg: z.coerce.number().positive(),
  repsAchieved: repsAchievedFieldSchema,
});

export type LoadEntryFormInput = z.infer<typeof loadEntryFormSchema>;

export interface LoadEntryFieldErrors {
  loadKg?: string;
  repsAchieved?: string;
}
