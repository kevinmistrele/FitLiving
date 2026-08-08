import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  LoadEntryForm,
  type LoadEntryFormProps,
} from '@/features/workouts/components/load-entry-form';
import type { Exercise, LoadEntry } from '@/features/workouts/types/workout.types';
import { useTranslate } from '@/hooks/use-translate';
import { cn } from '@/lib/utils';

export interface ExerciseItemProps {
  exercise: Exercise;
  isCompleted: boolean;
  latestLoadEntry: LoadEntry | null;
  onToggleCompleted: (checked: boolean) => void;
  onStartEdit: () => void;
  onDelete: () => void;
  isDeleting: boolean;
  isLoggingLoad: boolean;
  onStartLoadEntry: () => void;
  loadEntryForm: LoadEntryFormProps | null;
}

// One exercise row: name, sets/reps, "completed this week" checkbox, latest logged load
// (highlighted when it increased vs. the previous week — section 3.2), plus edit/delete/log
// actions (section 3.3).
export function ExerciseItem(props: ExerciseItemProps) {
  const {
    exercise,
    isCompleted,
    latestLoadEntry,
    onToggleCompleted,
    onStartEdit,
    onDelete,
    isDeleting,
    isLoggingLoad,
    onStartLoadEntry,
    loadEntryForm,
  } = props;
  const { t } = useTranslate();

  return (
    <Card size="sm">
      <CardContent className="flex flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-2">
            <Checkbox
              checked={isCompleted}
              onCheckedChange={onToggleCompleted}
              aria-label={t('workouts.exerciseItem.completedLabel', { name: exercise.name })}
            />
            <span>
              <span className="block font-medium">{exercise.name}</span>
              <span className="text-muted-foreground block text-sm">
                {t('workouts.exerciseItem.setsReps', {
                  sets: exercise.sets,
                  repsMin: exercise.repsMin,
                  repsMax: exercise.repsMax,
                })}
              </span>
            </span>
          </div>
          <div className="flex shrink-0 gap-1">
            <Button type="button" variant="ghost" size="sm" onClick={onStartEdit}>
              {t('workouts.exerciseItem.edit')}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onDelete}
              disabled={isDeleting}
            >
              {t('workouts.exerciseItem.delete')}
            </Button>
          </div>
        </div>

        {latestLoadEntry && (
          <p
            className={cn(
              'text-sm',
              latestLoadEntry.increasedVsPrevious
                ? 'text-primary font-medium'
                : 'text-muted-foreground',
            )}
          >
            {t('workouts.exerciseItem.latestLoad', { loadKg: latestLoadEntry.loadKg })}
            {latestLoadEntry.increasedVsPrevious && ` ${t('workouts.exerciseItem.increased')}`}
          </p>
        )}

        {isLoggingLoad && loadEntryForm ? (
          <LoadEntryForm {...loadEntryForm} />
        ) : (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onStartLoadEntry}
            className="self-start"
          >
            {t('workouts.exerciseItem.logLoad')}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
