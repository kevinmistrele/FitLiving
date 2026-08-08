import { ExerciseList } from '@/features/workouts/components/exercise-list';
import { WorkoutDayTabs } from '@/features/workouts/components/workout-day-tabs';
import { WorkoutTipBanner } from '@/features/workouts/components/workout-tip-banner';
import { WorkoutsErrorState } from '@/features/workouts/components/workouts-error-state';
import { useWorkoutScreen } from '@/features/workouts/hooks/use-workout-screen.hooks';
import { useTranslate } from '@/hooks/use-translate';

export function WorkoutScreen() {
  const { t } = useTranslate();
  const state = useWorkoutScreen();

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
        <WorkoutsErrorState
          title={t('workouts.error.title')}
          description={t('workouts.error.description')}
          retryLabel={t('common.retry')}
          onRetry={state.onRetry}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-4 p-4">
      <WorkoutTipBanner />

      <WorkoutDayTabs
        days={state.days}
        selectedDayId={state.selectedDayId}
        onSelectDay={state.onSelectDay}
      />

      <ExerciseList
        exercises={state.exercises}
        isLoading={state.isExercisesLoading}
        isError={state.isExercisesError}
        onRetry={state.onRetryExercises}
        editingExerciseId={state.editingExerciseId}
        editForm={state.editForm}
        onStartEdit={state.onStartEdit}
        onDelete={state.onDelete}
        isDeletePending={state.isDeletePending}
        onToggleCompleted={state.onToggleCompleted}
        loadEntryExerciseId={state.loadEntryExerciseId}
        loadEntryForm={state.loadEntryForm}
        onStartLoadEntry={state.onStartLoadEntry}
        addForm={state.addForm}
      />
    </div>
  );
}
