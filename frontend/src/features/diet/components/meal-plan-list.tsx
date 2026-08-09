import { AlertTriangle, Inbox, Plus } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyState } from '@/components/empty-state';
import { ErrorState } from '@/components/error-state';
import { MealForm, type MealFormProps } from '@/features/diet/components/meal-form';
import { MealItem } from '@/features/diet/components/meal-item';
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
      <ErrorState
        title={t('diet.mealPlanError.title')}
        description={t('diet.mealPlanError.description')}
        retryLabel={t('common.retry')}
        onRetry={onRetry}
        icon={<AlertTriangle />}
      />
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {meals.length === 0 && (
        <EmptyState
          title={t('diet.mealPlanEmpty.title')}
          description={t('diet.mealPlanEmpty.description')}
          icon={<Inbox />}
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
          <CardTitle className="flex items-center gap-2">
            <Plus aria-hidden="true" className="text-primary size-4" />
            {t('diet.mealForm.addTitle')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <MealForm {...addForm} />
        </CardContent>
      </Card>
    </div>
  );
}
