import { z } from 'zod';

const booleanFlag = z
  .string()
  .optional()
  .transform((value) => value === 'true');

const featureFlagsSchema = z.object({
  VITE_FEATURE_EXAMPLE: booleanFlag,
});

const parsedFlags = featureFlagsSchema.parse(import.meta.env);

export const featureFlags = {
  example: parsedFlags.VITE_FEATURE_EXAMPLE,
} as const;

export type FeatureFlagName = keyof typeof featureFlags;
