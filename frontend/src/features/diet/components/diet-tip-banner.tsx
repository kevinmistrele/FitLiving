import { Lightbulb } from 'lucide-react';

import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslate } from '@/hooks/use-translate';

// Static reminder — docs/project/fitliving-web.md section 4, the line under 4.3: prioritize
// protein, cut liquid calories, half the plate in vegetables, consistency over radical diets,
// drink plenty of water.
export function DietTipBanner() {
  const { t } = useTranslate();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb aria-hidden="true" className="text-primary size-4" />
          {t('diet.tip.title')}
        </CardTitle>
        <CardDescription>{t('diet.tip.description')}</CardDescription>
      </CardHeader>
    </Card>
  );
}
