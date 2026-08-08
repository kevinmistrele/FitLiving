import { type FormEvent, useState } from 'react';

import { useCheckInsQuery } from '@/features/check-ins/hooks/use-check-ins-query';
import { useCreateCheckInMutation } from '@/features/check-ins/hooks/use-create-check-in-mutation';
import { useProfileQuery } from '@/lib/profile';
import {
  createCheckInSchema,
  type CheckInFieldErrors,
} from '@/features/check-ins/types/check-in.types';
import { calculateGoalProgressPercentage } from '@/features/check-ins/utils/calculate-goal-progress-percentage';
import { calculateProgressStats } from '@/features/check-ins/utils/calculate-progress-stats';
import { toDateInputValue } from '@/features/check-ins/utils/date-input';
import { useTranslate } from '@/hooks/use-translate';
import { useAuthStore } from '@/lib/auth-store';

function isWithinNovemberWindow(start: Date, end: Date): boolean {
  const now = new Date();

  return now >= start && now <= end;
}

export function useCheckInsScreen() {
  const { t } = useTranslate();
  const uid = useAuthStore((state) => state.user?.uid);

  const [date, setDate] = useState(() => toDateInputValue(new Date()));
  const [weightKg, setWeightKg] = useState('');
  const [waistCm, setWaistCm] = useState('');
  const [notes, setNotes] = useState('');
  const [fieldErrors, setFieldErrors] = useState<CheckInFieldErrors>({});

  const checkInsQuery = useCheckInsQuery(uid);
  const profileQuery = useProfileQuery(uid);
  const createCheckInMutation = useCreateCheckInMutation(uid);

  function resetForm() {
    setDate(toDateInputValue(new Date()));
    setWeightKg('');
    setWaistCm('');
    setNotes('');
    setFieldErrors({});
  }

  function validate(): boolean {
    const result = createCheckInSchema.safeParse({ date, weightKg, waistCm, notes });

    if (result.success) {
      setFieldErrors({});
      return true;
    }

    const errors: CheckInFieldErrors = {};

    for (const issue of result.error.issues) {
      const field = issue.path[0];

      if (field === 'date' && !errors.date) {
        errors.date = t('checkIns.form.errors.dateRequired');
      }

      if (field === 'weightKg' && !errors.weightKg) {
        errors.weightKg = t('checkIns.form.errors.weightInvalid');
      }

      if (field === 'waistCm' && !errors.waistCm) {
        errors.waistCm = t('checkIns.form.errors.waistInvalid');
      }
    }

    setFieldErrors(errors);
    return false;
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!uid || !validate()) return;

    const parsed = createCheckInSchema.parse({ date, weightKg, waistCm, notes });

    createCheckInMutation.mutate({ uid, payload: parsed }, { onSuccess: () => resetForm() });
  }

  function handleRetry() {
    void checkInsQuery.refetch();
    void profileQuery.refetch();
  }

  const form = {
    date,
    weightKg,
    waistCm,
    notes,
    onDateChange: setDate,
    onWeightKgChange: setWeightKg,
    onWaistCmChange: setWaistCm,
    onNotesChange: setNotes,
    onSubmit: handleSubmit,
    isSubmitting: createCheckInMutation.isPending,
    dateError: fieldErrors.date,
    weightKgError: fieldErrors.weightKg,
    waistCmError: fieldErrors.waistCm,
    formError: createCheckInMutation.isError ? t('checkIns.form.errors.submitFailed') : undefined,
  };

  if (checkInsQuery.isLoading || profileQuery.isLoading) {
    return { status: 'loading' as const };
  }

  if (checkInsQuery.isError || profileQuery.isError) {
    return { status: 'error' as const, onRetry: handleRetry };
  }

  const checkIns = checkInsQuery.data ?? [];
  const profile = profileQuery.data;

  if (!profile) {
    return { status: 'error' as const, onRetry: handleRetry };
  }

  const stats = calculateProgressStats(checkIns, profile.initialWeightKg);
  const currentWeightKg = profile.currentWeightKg ?? profile.initialWeightKg;
  const goalProgressPercentage = calculateGoalProgressPercentage(
    profile.initialWeightKg,
    currentWeightKg,
    profile.goalNovemberComfortableKg,
  );

  return {
    status: 'ready' as const,
    isEmpty: checkIns.length === 0,
    checkIns,
    profile,
    totalLostKg: stats?.totalLostKg ?? null,
    averagePaceKgPerWeek: stats?.averagePaceKgPerWeek ?? null,
    goalProgressPercentage,
    isInsideNovemberWindow: isWithinNovemberWindow(
      profile.novemberWindowStart,
      profile.novemberWindowEnd,
    ),
    form,
  };
}
