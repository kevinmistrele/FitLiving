import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyState } from '@/components/empty-state';
import { ErrorState } from '@/components/error-state';
import { ExerciseForm, type ExerciseFormProps } from '@/features/workouts/components/exercise-form';
import { ExerciseItem } from '@/features/workouts/components/exercise-item';
import type { LoadEntryFormProps } from '@/features/workouts/components/load-entry-form';
import type { Exercise, LoadEntry } from '@/features/workouts/types/workout.types';
import { useTranslate } from '@/hooks/use-translate';

export interface ExerciseRow {
  exercise: Exercise;
  isCompleted: boolean;
  latestLoadEntry: LoadEntry | null;
}

export interface ExerciseListProps {
  exercises: ExerciseRow[];
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;

  editingExerciseId: string | null;
  editForm: ExerciseFormProps | null;
  onStartEdit: (exercise: Exercise) => void;
  onDelete: (exerciseId: string) => void;
  isDeletePending: boolean;
  onToggleCompleted: (exerciseId: string, checked: boolean) => void;

  loadEntryExerciseId: string | null;
  loadEntryForm: LoadEntryFormProps | null;
  onStartLoadEntry: (exerciseId: string) => void;

  addForm: ExerciseFormProps;
}

// The selected day's exercises: loading/error/empty/success (docs/standards/ui-states.md),
// each exercise editable in place, plus the always-available "add exercise" form so the
// empty state still lets the user create the first exercise for the day (section 3.3).
export function ExerciseList(props: ExerciseListProps) {
  const {
    exercises,
    isLoading,
    isError,
    onRetry,
    editingExerciseId,
    editForm,
    onStartEdit,
    onDelete,
    isDeletePending,
    onToggleCompleted,
    loadEntryExerciseId,
    loadEntryForm,
    onStartLoadEntry,
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
        title={t('workouts.exercisesError.title')}
        description={t('workouts.exercisesError.description')}
        retryLabel={t('common.retry')}
        onRetry={onRetry}
      />
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {exercises.length === 0 && (
        <EmptyState
          title={t('workouts.empty.title')}
          description={t('workouts.empty.description')}
        />
      )}

      {exercises.map(({ exercise, isCompleted, latestLoadEntry }) =>
        editingExerciseId === exercise.id && editForm ? (
          <Card key={exercise.id} size="sm">
            <CardContent>
              <ExerciseForm {...editForm} />
            </CardContent>
          </Card>
        ) : (
          <ExerciseItem
            key={exercise.id}
            exercise={exercise}
            isCompleted={isCompleted}
            latestLoadEntry={latestLoadEntry}
            onToggleCompleted={(checked) => onToggleCompleted(exercise.id, checked)}
            onStartEdit={() => onStartEdit(exercise)}
            onDelete={() => onDelete(exercise.id)}
            isDeleting={isDeletePending}
            isLoggingLoad={loadEntryExerciseId === exercise.id}
            onStartLoadEntry={() => onStartLoadEntry(exercise.id)}
            loadEntryForm={loadEntryExerciseId === exercise.id ? loadEntryForm : null}
          />
        ),
      )}

      <Card size="sm">
        <CardHeader>
          <CardTitle>{t('workouts.exerciseForm.addTitle')}</CardTitle>
        </CardHeader>
        <CardContent>
          <ExerciseForm {...addForm} />
        </CardContent>
      </Card>
    </div>
  );
}
