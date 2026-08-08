import { authFeatureMessages } from '@/features/auth/i18n';
import { checkInsFeatureMessages } from '@/features/check-ins/i18n';
import { dietFeatureMessages } from '@/features/diet/i18n';
import { workoutsFeatureMessages } from '@/features/workouts/i18n';

interface FeatureMessages {
  en: Record<string, string>;
  pt: Record<string, string>;
}

// The one place shared code legitimately imports across every feature —
// see docs/architecture/dependency-rules.md.
const features: FeatureMessages[] = [
  authFeatureMessages,
  checkInsFeatureMessages,
  workoutsFeatureMessages,
  dietFeatureMessages,
];

export function mergeFeatureMessages(locale: 'en' | 'pt'): Record<string, string> {
  return features.reduce<Record<string, string>>((merged, feature) => {
    return { ...merged, ...feature[locale] };
  }, {});
}
