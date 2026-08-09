import { AlertTriangle } from 'lucide-react';

import { ErrorState } from '@/components/error-state';
import { DietGoalsSummary } from '@/features/diet/components/diet-goals-summary';
import { DietTipBanner } from '@/features/diet/components/diet-tip-banner';
import { MacroBreakdown } from '@/features/diet/components/macro-breakdown';
import { MealPlanList } from '@/features/diet/components/meal-plan-list';
import { ProfileForm } from '@/features/diet/components/profile-form';
import { useDietScreen } from '@/features/diet/hooks/use-diet-screen.hooks';
import { useTranslate } from '@/hooks/use-translate';

export function DietScreen() {
  const { t } = useTranslate();
  const state = useDietScreen();

  if (state.status === 'loading') {
    return (
      <div role="status" className="flex min-h-[50vh] items-center justify-center">
        {t('common.loading')}
      </div>
    );
  }

  if (state.status === 'error') {
    return (
      <div className="mx-auto max-w-2xl p-4">
        <ErrorState
          title={t('diet.error.title')}
          description={t('diet.error.description')}
          retryLabel={t('common.retry')}
          onRetry={state.onRetry}
          icon={<AlertTriangle />}
        />
      </div>
    );
  }

  const { dietGoals, profileForm, meals, addForm } = state;

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-4 p-4">
      <DietTipBanner />

      <ProfileForm
        values={profileForm.values}
        onHeightCmChange={profileForm.onHeightCmChange}
        onAgeChange={profileForm.onAgeChange}
        onSexChange={profileForm.onSexChange}
        onActivityLevelChange={profileForm.onActivityLevelChange}
        onDietDeficitLevelChange={profileForm.onDietDeficitLevelChange}
        onSubmit={profileForm.onSubmit}
        isSubmitting={profileForm.isSubmitting}
        heightCmError={profileForm.heightCmError}
        ageError={profileForm.ageError}
        sexError={profileForm.sexError}
        activityLevelError={profileForm.activityLevelError}
        dietDeficitLevelError={profileForm.dietDeficitLevelError}
        formError={profileForm.formError}
      />

      {dietGoals ? (
        <>
          <DietGoalsSummary
            title={t('diet.goals.title')}
            tdeeLabel={t('diet.goals.tdeeLabel')}
            targetCalLabel={t('diet.goals.targetCalLabel')}
            bmiLabel={t('diet.goals.bmiLabel')}
            healthyWeightLabel={t('diet.goals.healthyWeightLabel')}
            calculatedFromLabel={t('diet.goals.calculatedFromLabel')}
            dietGoals={dietGoals}
          />

          <MacroBreakdown
            title={t('diet.macros.title')}
            proteinLabel={t('diet.macros.proteinLabel')}
            carbsLabel={t('diet.macros.carbsLabel')}
            fatLabel={t('diet.macros.fatLabel')}
            gramsUnit={t('diet.macros.gramsUnit')}
            lowBudgetWarning={t('diet.macros.lowBudgetWarning')}
            dietGoals={dietGoals}
          />
        </>
      ) : (
        <p
          role="status"
          className="border-border text-muted-foreground rounded-xl border border-dashed p-4 text-center text-sm"
        >
          {t('diet.goals.incompleteProfilePrompt')}
        </p>
      )}

      <MealPlanList
        meals={meals}
        isLoading={state.isMealsLoading}
        isError={state.isMealsError}
        onRetry={state.onRetryMeals}
        editingMealId={state.editingMealId}
        editForm={state.editForm}
        onStartEdit={state.onStartEdit}
        onDelete={state.onDelete}
        isDeletePending={state.isDeletePending}
        addForm={addForm}
      />
    </div>
  );
}
