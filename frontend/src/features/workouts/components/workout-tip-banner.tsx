import { Lightbulb } from 'lucide-react';

import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslate } from '@/hooks/use-translate';

// Static usage tip — docs/project/fitliving-web.md section 3, the reminder line under 3.3:
// warm up, leave 1-2 reps in reserve; training is at noon fasted, so eat light and hydrate.
export function WorkoutTipBanner() {
  const { t } = useTranslate();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb aria-hidden="true" className="text-primary size-4" />
          {t('workouts.tip.title')}
        </CardTitle>
        <CardDescription>{t('workouts.tip.description')}</CardDescription>
      </CardHeader>
    </Card>
  );
}
