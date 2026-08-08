import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DietErrorState } from '@/features/diet/components/diet-error-state';
import { MealForm, type MealFormProps } from '@/features/diet/components/meal-form';
import { MealItem } from '@/features/diet/components/meal-item';
import { MealPlanEmptyState } from '@/features/diet/components/meal-plan-empty-state';
import type { Meal } from '@/features/diet/types/diet.types';
import { useTranslate } from '@/hooks/use-translate';

export interface MealPlanListProps {
  meals: Meal[];
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;

  editingMealId: string | null;
  editForm: MealFormProps | null;
  onStartEdit: (meal: Meal) => void;
  onDelete: (mealId: string) => void;
  isDeletePending: boolean;

  addForm: MealFormProps;
}

// Exemplo de refeições: loading/error/empty/success (docs/standards/ui-states.md), each meal
// editable in place, plus the always-available "add meal" form — docs/project/fitliving-web.md
// section 4.3. Mirrors workouts' ExerciseList structure.
export function MealPlanList(props: MealPlanListProps) {
  const {
    meals,
    isLoading,
    isError,
    onRetry,
    editingMealId,
    editForm,
    onStartEdit,
    onDelete,
    isDeletePending,
    addForm,
  } = props;
  const { t } = useTranslate();

  if (isLoading) {
    return (
      <div role="status" className="flex min-h-24 items-center justify-center">
        {t('common.loading')}
      </div>
    );
  }

  if (isError) {
    return (
      <DietErrorState
        title={t('diet.mealPlanError.title')}
        description={t('diet.mealPlanError.description')}
        retryLabel={t('common.retry')}
        onRetry={onRetry}
      />
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {meals.length === 0 && (
        <MealPlanEmptyState
          title={t('diet.mealPlanEmpty.title')}
          description={t('diet.mealPlanEmpty.description')}
        />
      )}

      {meals.map((meal) =>
        editingMealId === meal.id && editForm ? (
          <Card key={meal.id} size="sm">
            <CardContent>
              <MealForm {...editForm} />
            </CardContent>
          </Card>
        ) : (
          <MealItem
            key={meal.id}
            meal={meal}
            onStartEdit={() => onStartEdit(meal)}
            onDelete={() => onDelete(meal.id)}
            isDeleting={isDeletePending}
          />
        ),
      )}

      <Card size="sm">
        <CardHeader>
          <CardTitle>{t('diet.mealForm.addTitle')}</CardTitle>
        </CardHeader>
        <CardContent>
          <MealForm {...addForm} />
        </CardContent>
      </Card>
    </div>
  );
}
