import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { Meal } from '@/features/diet/types/diet.types';
import { useTranslate } from '@/hooks/use-translate';

export interface MealItemProps {
  meal: Meal;
  onStartEdit: () => void;
  onDelete: () => void;
  isDeleting: boolean;
}

// One meal row: name, timing badge, description, approx kcal/protein, plus edit/delete —
// docs/project/fitliving-web.md section 4.3.
export function MealItem(props: MealItemProps) {
  const { meal, onStartEdit, onDelete, isDeleting } = props;
  const { t } = useTranslate();

  return (
    <Card size="sm">
      <CardContent className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-medium">{meal.name}</span>
            <span className="bg-muted text-muted-foreground rounded-full px-2 py-0.5 text-xs">
              {t(`diet.mealForm.timingOptions.${meal.timing}`)}
            </span>
          </div>
          {meal.description && (
            <p className="text-muted-foreground mt-1 text-sm">{meal.description}</p>
          )}
          <p className="mt-1 text-sm">
            {t('diet.mealItem.approxSummary', {
              kcal: meal.approxKcal,
              proteinG: meal.approxProteinG,
            })}
          </p>
        </div>
        <div className="flex shrink-0 gap-1">
          <Button type="button" variant="ghost" size="sm" onClick={onStartEdit}>
            {t('diet.mealItem.edit')}
          </Button>
          <Button type="button" variant="ghost" size="sm" onClick={onDelete} disabled={isDeleting}>
            {t('diet.mealItem.delete')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
