import { featureFlags, type FeatureFlagName } from '@/config/feature-flags';

export function useFeatureFlag(name: FeatureFlagName): boolean {
  return featureFlags[name];
}
