import { z } from 'zod';

export const loginPayloadSchema = z.object({
  email: z.string().min(1).email(),
  password: z.string().min(1),
});

export type LoginPayload = z.infer<typeof loginPayloadSchema>;

export interface LoginFieldErrors {
  email?: string;
  password?: string;
}
