import { type FormEvent, useState } from 'react';

import {
  useCreateExerciseMutation,
  useDeleteExerciseMutation,
  useSetExerciseCompletedMutation,
  useUpdateExerciseMutation,
} from '@/features/workouts/hooks/use-exercise-mutations';
import { useCreateLoadEntryMutation } from '@/features/workouts/hooks/use-create-load-entry-mutation';
import { useExercisesQuery } from '@/features/workouts/hooks/use-exercises-query';
import { useLoadHistoriesQuery } from '@/features/workouts/hooks/use-load-histories-query';
import { useWorkoutDaysQuery } from '@/features/workouts/hooks/use-workout-days-query';
import {
  exerciseFormSchema,
  loadEntryFormSchema,
  type Exercise,
  type ExerciseFieldErrors,
  type LoadEntryFieldErrors,
  type WorkoutDayId,
} from '@/features/workouts/types/workout.types';
import { isCompletedThisWeek } from '@/features/workouts/utils/is-completed-this-week';
import { WORKOUT_DAY_IDS } from '@/features/workouts/utils/workout-day-defaults';
import { useTranslate } from '@/hooks/use-translate';
import { useAuthStore } from '@/lib/auth-store';

interface ExerciseFormValues {
  name: string;
  sets: string;
  repsMin: string;
  repsMax: string;
}

const emptyExerciseForm: ExerciseFormValues = { name: '', sets: '', repsMin: '', repsMax: '' };

interface LoadEntryFormValues {
  loadKg: string;
  repsAchieved: string;
}

const emptyLoadEntryForm: LoadEntryFormValues = { loadKg: '', repsAchieved: '' };

// Defaults the day tab to today's weekday when it falls Mon-Fri, otherwise the first day —
// a "one-hand use" convenience so the app opens on the day the user is most likely training.
function getDefaultDayId(): WorkoutDayId {
  const mondayBasedIndex = new Date().getDay() - 1; // JS getDay(): 0=Sun...6=Sat

  return mondayBasedIndex >= 0 && mondayBasedIndex < WORKOUT_DAY_IDS.length
    ? WORKOUT_DAY_IDS[mondayBasedIndex]
    : 'mon';
}

function validateExerciseForm(
  values: ExerciseFormValues,
  t: (id: string, values?: Record<string, string | number>) => string,
) {
  const result = exerciseFormSchema.safeParse(values);

  if (result.success) {
    return { success: true as const, data: result.data };
  }

  const errors: ExerciseFieldErrors = {};

  for (const issue of result.error.issues) {
    const field = issue.path[0];

    if (field === 'name' && !errors.name)
      errors.name = t('workouts.exerciseForm.errors.nameRequired');
    if (field === 'sets' && !errors.sets)
      errors.sets = t('workouts.exerciseForm.errors.setsInvalid');
    if (field === 'repsMin' && !errors.repsMin)
      errors.repsMin = t('workouts.exerciseForm.errors.repsMinInvalid');
    if (field === 'repsMax' && !errors.repsMax)
      errors.repsMax = t('workouts.exerciseForm.errors.repsMaxInvalid');
  }

  return { success: false as const, errors };
}

export function useWorkoutScreen() {
  const { t } = useTranslate();
  const uid = useAuthStore((state) => state.user?.uid);

  const [selectedDayId, setSelectedDayId] = useState<WorkoutDayId>(getDefaultDayId);

  const [addForm, setAddForm] = useState(emptyExerciseForm);
  const [addFieldErrors, setAddFieldErrors] = useState<ExerciseFieldErrors>({});

  const [editingExerciseId, setEditingExerciseId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState(emptyExerciseForm);
  const [editFieldErrors, setEditFieldErrors] = useState<ExerciseFieldErrors>({});

  const [loadEntryExerciseId, setLoadEntryExerciseId] = useState<string | null>(null);
  const [loadEntryForm, setLoadEntryForm] = useState(emptyLoadEntryForm);
  const [loadEntryFieldErrors, setLoadEntryFieldErrors] = useState<LoadEntryFieldErrors>({});

  const workoutDaysQuery = useWorkoutDaysQuery(uid);
  const exercisesQuery = useExercisesQuery(uid, selectedDayId);
  const exercises = exercisesQuery.data ?? [];
  const exerciseIds = exercises.map((exercise) => exercise.id);
  const loadHistoriesQuery = useLoadHistoriesQuery(uid, selectedDayId, exerciseIds);

  const createExerciseMutation = useCreateExerciseMutation(uid, selectedDayId);
  const updateExerciseMutation = useUpdateExerciseMutation(uid, selectedDayId);
  const deleteExerciseMutation = useDeleteExerciseMutation(uid, selectedDayId);
  const setCompletedMutation = useSetExerciseCompletedMutation(uid, selectedDayId);
  const createLoadEntryMutation = useCreateLoadEntryMutation(uid, selectedDayId);

  function handleSelectDay(dayId: WorkoutDayId) {
    setSelectedDayId(dayId);
    setEditingExerciseId(null);
    setLoadEntryExerciseId(null);
  }

  function handleAddSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!uid) return;

    const result = validateExerciseForm(addForm, t);
    if (!result.success) {
      setAddFieldErrors(result.errors);
      return;
    }
    setAddFieldErrors({});

    createExerciseMutation.mutate(
      { uid, dayId: selectedDayId, order: exercises.length, payload: result.data },
      { onSuccess: () => setAddForm(emptyExerciseForm) },
    );
  }

  function handleStartEdit(exercise: Exercise) {
    setEditingExerciseId(exercise.id);
    setEditForm({
      name: exercise.name,
      sets: String(exercise.sets),
      repsMin: String(exercise.repsMin),
      repsMax: String(exercise.repsMax),
    });
    setEditFieldErrors({});
  }

  function handleCancelEdit() {
    setEditingExerciseId(null);
    setEditFieldErrors({});
  }

  function handleEditSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!uid || !editingExerciseId) return;

    const result = validateExerciseForm(editForm, t);
    if (!result.success) {
      setEditFieldErrors(result.errors);
      return;
    }
    setEditFieldErrors({});

    updateExerciseMutation.mutate(
      { uid, dayId: selectedDayId, exerciseId: editingExerciseId, payload: result.data },
      { onSuccess: () => setEditingExerciseId(null) },
    );
  }

  function handleDelete(exerciseId: string) {
    if (!uid) return;

    deleteExerciseMutation.mutate(
      { uid, dayId: selectedDayId, exerciseId },
      {
        onSuccess: () => {
          if (editingExerciseId === exerciseId) setEditingExerciseId(null);
          if (loadEntryExerciseId === exerciseId) setLoadEntryExerciseId(null);
        },
      },
    );
  }

  function handleToggleCompleted(exerciseId: string, nextCompleted: boolean) {
    if (!uid) return;

    setCompletedMutation.mutate({
      uid,
      dayId: selectedDayId,
      exerciseId,
      completed: nextCompleted,
    });
  }

  function handleStartLoadEntry(exerciseId: string) {
    setLoadEntryExerciseId(exerciseId);
    setLoadEntryForm(emptyLoadEntryForm);
    setLoadEntryFieldErrors({});
  }

  function handleCancelLoadEntry() {
    setLoadEntryExerciseId(null);
    setLoadEntryFieldErrors({});
  }

  function handleLoadEntrySubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!uid || !loadEntryExerciseId) return;

    const result = loadEntryFormSchema.safeParse(loadEntryForm);

    if (!result.success) {
      const errors: LoadEntryFieldErrors = {};

      for (const issue of result.error.issues) {
        const field = issue.path[0];

        if (field === 'loadKg' && !errors.loadKg)
          errors.loadKg = t('workouts.loadForm.errors.loadInvalid');
        if (field === 'repsAchieved' && !errors.repsAchieved) {
          errors.repsAchieved = t('workouts.loadForm.errors.repsInvalid');
        }
      }

      setLoadEntryFieldErrors(errors);
      return;
    }
    setLoadEntryFieldErrors({});

    createLoadEntryMutation.mutate(
      { uid, dayId: selectedDayId, exerciseId: loadEntryExerciseId, payload: result.data },
      { onSuccess: () => setLoadEntryExerciseId(null) },
    );
  }

  function handleRetry() {
    void workoutDaysQuery.refetch();
    void exercisesQuery.refetch();
  }

  if (workoutDaysQuery.isLoading) {
    return { status: 'loading' as const };
  }

  if (workoutDaysQuery.isError) {
    return { status: 'error' as const, onRetry: handleRetry };
  }

  const days = workoutDaysQuery.data ?? [];
  const selectedDay = days.find((day) => day.dayId === selectedDayId) ?? days[0];

  if (!selectedDay) {
    return { status: 'error' as const, onRetry: handleRetry };
  }

  const now = new Date();
  const exerciseRows = exercises.map((exercise, index) => {
    const loadHistoryResult = loadHistoriesQuery[index];
    const loadHistory = loadHistoryResult?.data ?? [];
    const latestLoadEntry = loadHistory.length > 0 ? loadHistory[loadHistory.length - 1] : null;

    return {
      exercise,
      isCompleted: isCompletedThisWeek(exercise.completedThisWeek, exercise.lastCompletedAt, now),
      latestLoadEntry,
    };
  });

  const addFormProps = {
    mode: 'create' as const,
    values: addForm,
    onNameChange: (value: string) => setAddForm((prev) => ({ ...prev, name: value })),
    onSetsChange: (value: string) => setAddForm((prev) => ({ ...prev, sets: value })),
    onRepsMinChange: (value: string) => setAddForm((prev) => ({ ...prev, repsMin: value })),
    onRepsMaxChange: (value: string) => setAddForm((prev) => ({ ...prev, repsMax: value })),
    onSubmit: handleAddSubmit,
    isSubmitting: createExerciseMutation.isPending,
    nameError: addFieldErrors.name,
    setsError: addFieldErrors.sets,
    repsMinError: addFieldErrors.repsMin,
    repsMaxError: addFieldErrors.repsMax,
    formError: createExerciseMutation.isError
      ? t('workouts.exerciseForm.errors.submitFailed')
      : undefined,
  };

  const editFormProps = editingExerciseId
    ? {
        mode: 'edit' as const,
        values: editForm,
        onNameChange: (value: string) => setEditForm((prev) => ({ ...prev, name: value })),
        onSetsChange: (value: string) => setEditForm((prev) => ({ ...prev, sets: value })),
        onRepsMinChange: (value: string) => setEditForm((prev) => ({ ...prev, repsMin: value })),
        onRepsMaxChange: (value: string) => setEditForm((prev) => ({ ...prev, repsMax: value })),
        onSubmit: handleEditSubmit,
        onCancel: handleCancelEdit,
        isSubmitting: updateExerciseMutation.isPending,
        nameError: editFieldErrors.name,
        setsError: editFieldErrors.sets,
        repsMinError: editFieldErrors.repsMin,
        repsMaxError: editFieldErrors.repsMax,
        formError: updateExerciseMutation.isError
          ? t('workouts.exerciseForm.errors.submitFailed')
          : undefined,
      }
    : null;

  const loadEntryFormProps = loadEntryExerciseId
    ? {
        values: loadEntryForm,
        onLoadKgChange: (value: string) => setLoadEntryForm((prev) => ({ ...prev, loadKg: value })),
        onRepsAchievedChange: (value: string) =>
          setLoadEntryForm((prev) => ({ ...prev, repsAchieved: value })),
        onSubmit: handleLoadEntrySubmit,
        onCancel: handleCancelLoadEntry,
        isSubmitting: createLoadEntryMutation.isPending,
        loadKgError: loadEntryFieldErrors.loadKg,
        repsAchievedError: loadEntryFieldErrors.repsAchieved,
        formError: createLoadEntryMutation.isError
          ? t('workouts.loadForm.errors.submitFailed')
          : undefined,
      }
    : null;

  return {
    status: 'ready' as const,
    days,
    selectedDayId,
    selectedDay,
    onSelectDay: handleSelectDay,

    exercises: exerciseRows,
    isExercisesLoading: exercisesQuery.isLoading,
    isExercisesError: exercisesQuery.isError,
    onRetryExercises: () => void exercisesQuery.refetch(),

    addForm: addFormProps,

    editingExerciseId,
    editForm: editFormProps,
    onStartEdit: handleStartEdit,

    onDelete: handleDelete,
    isDeletePending: deleteExerciseMutation.isPending,

    onToggleCompleted: handleToggleCompleted,

    loadEntryExerciseId,
    loadEntryForm: loadEntryFormProps,
    onStartLoadEntry: handleStartLoadEntry,
  };
}
