import { z } from 'zod';

export interface CheckIn {
  id: string;
  date: string; // yyyy-mm-dd
  weightKg: number;
  waistCm: number;
  notes: string;
  deltaWeightKg: number | null;
  createdAt: Date;
}

export const createCheckInSchema = z.object({
  date: z.string().min(1),
  weightKg: z.coerce.number().positive(),
  waistCm: z.coerce.number().positive(),
  notes: z.string().max(1000).optional().default(''),
});

export type CreateCheckInInput = z.infer<typeof createCheckInSchema>;

export interface CheckInFieldErrors {
  date?: string;
  weightKg?: string;
  waistCm?: string;
}
