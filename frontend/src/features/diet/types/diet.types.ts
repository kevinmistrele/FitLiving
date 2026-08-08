import { z } from 'zod';

import {
  ACTIVITY_LEVEL_OPTIONS,
  DIET_DEFICIT_LEVEL_OPTIONS,
  SEX_OPTIONS,
  type ActivityLevel,
  type DietDeficitLevel,
  type Sex,
} from '@/lib/profile';

// Metas (docs/project/fitliving-web.md section 4.1) — the base fields the user edits on the
// diet screen. currentWeightKg is intentionally not part of this form: it's owned/mirrored
// by the check-ins feature and only displayed here.
export const profileFormSchema = z.object({
  heightCm: z.coerce.number().positive(),
  age: z.coerce.number().int().positive(),
  sex: z.enum(SEX_OPTIONS as [Sex, ...Sex[]]),
  activityLevel: z.enum(ACTIVITY_LEVEL_OPTIONS as [ActivityLevel, ...ActivityLevel[]]),
  dietDeficitLevel: z.enum(DIET_DEFICIT_LEVEL_OPTIONS as [DietDeficitLevel, ...DietDeficitLevel[]]),
});

export type ProfileFormInput = z.infer<typeof profileFormSchema>;

export interface ProfileFieldErrors {
  heightCm?: string;
  age?: string;
  sex?: string;
  activityLevel?: string;
  dietDeficitLevel?: string;
}

// Exemplo de refeições (docs/project/fitliving-web.md section 4.3) —
// docs/firestore-data-model.md section 1.7.
export type MealTiming = 'pre_workout' | 'post_workout' | 'other';
export const MEAL_TIMING_OPTIONS: MealTiming[] = ['pre_workout', 'post_workout', 'other'];

export interface Meal {
  id: string;
  name: string;
  description: string;
  approxKcal: number;
  approxProteinG: number;
  order: number;
  timing: MealTiming;
}

export const mealFormSchema = z.object({
  name: z.string().trim().min(1),
  description: z.string().trim().max(1000).optional().default(''),
  approxKcal: z.coerce.number().positive(),
  approxProteinG: z.coerce.number().nonnegative(),
  timing: z.enum(MEAL_TIMING_OPTIONS as [MealTiming, ...MealTiming[]]),
});

export type MealFormInput = z.infer<typeof mealFormSchema>;

export interface MealFieldErrors {
  name?: string;
  approxKcal?: string;
  approxProteinG?: string;
  timing?: string;
}
