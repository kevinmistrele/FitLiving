import { type FormEvent, useEffect, useMemo, useState } from 'react';

import {
  useCreateMealMutation,
  useDeleteMealMutation,
  useUpdateMealMutation,
} from '@/features/diet/hooks/use-meal-mutations';
import { useMealPlanQuery } from '@/features/diet/hooks/use-meal-plan-query';
import { useProfileQuery } from '@/lib/profile';
import { useUpdateProfileMutation } from '@/features/diet/hooks/use-update-profile-mutation';
import {
  mealFormSchema,
  profileFormSchema,
  type Meal,
  type MealFieldErrors,
  type ProfileFieldErrors,
} from '@/features/diet/types/diet.types';
import { calculateDietGoals } from '@/features/diet/utils/calculate-diet-goals';
import { useTranslate } from '@/hooks/use-translate';
import { useAuthStore } from '@/lib/auth-store';

interface ProfileFormValues {
  heightCm: string;
  age: string;
  sex: string;
  activityLevel: string;
  dietDeficitLevel: string;
}

const emptyProfileForm: ProfileFormValues = {
  heightCm: '',
  age: '',
  sex: '',
  activityLevel: 'moderate',
  dietDeficitLevel: 'moderate',
};

interface MealFormValues {
  name: string;
  description: string;
  approxKcal: string;
  approxProteinG: string;
  timing: string;
}

const emptyMealForm: MealFormValues = {
  name: '',
  description: '',
  approxKcal: '',
  approxProteinG: '',
  timing: 'other',
};

type Translate = (id: string, values?: Record<string, string | number>) => string;

function validateProfileForm(values: ProfileFormValues, t: Translate) {
  const result = profileFormSchema.safeParse(values);

  if (result.success) {
    return { success: true as const, data: result.data };
  }

  const errors: ProfileFieldErrors = {};

  for (const issue of result.error.issues) {
    const field = issue.path[0];

    if (field === 'heightCm' && !errors.heightCm)
      errors.heightCm = t('diet.profileForm.errors.heightInvalid');
    if (field === 'age' && !errors.age) errors.age = t('diet.profileForm.errors.ageInvalid');
    if (field === 'sex' && !errors.sex) errors.sex = t('diet.profileForm.errors.sexRequired');
    if (field === 'activityLevel' && !errors.activityLevel)
      errors.activityLevel = t('diet.profileForm.errors.activityLevelRequired');
    if (field === 'dietDeficitLevel' && !errors.dietDeficitLevel)
      errors.dietDeficitLevel = t('diet.profileForm.errors.dietDeficitLevelRequired');
  }

  return { success: false as const, errors };
}

function validateMealForm(values: MealFormValues, t: Translate) {
  const result = mealFormSchema.safeParse(values);

  if (result.success) {
    return { success: true as const, data: result.data };
  }

  const errors: MealFieldErrors = {};

  for (const issue of result.error.issues) {
    const field = issue.path[0];

    if (field === 'name' && !errors.name) errors.name = t('diet.mealForm.errors.nameRequired');
    if (field === 'approxKcal' && !errors.approxKcal)
      errors.approxKcal = t('diet.mealForm.errors.kcalInvalid');
    if (field === 'approxProteinG' && !errors.approxProteinG)
      errors.approxProteinG = t('diet.mealForm.errors.proteinInvalid');
    if (field === 'timing' && !errors.timing)
      errors.timing = t('diet.mealForm.errors.timingRequired');
  }

  return { success: false as const, errors };
}

export function useDietScreen() {
  const { t } = useTranslate();
  const uid = useAuthStore((state) => state.user?.uid);

  const [profileForm, setProfileForm] = useState(emptyProfileForm);
  const [hasSyncedProfileForm, setHasSyncedProfileForm] = useState(false);
  const [profileFieldErrors, setProfileFieldErrors] = useState<ProfileFieldErrors>({});

  const [addForm, setAddForm] = useState(emptyMealForm);
  const [addFieldErrors, setAddFieldErrors] = useState<MealFieldErrors>({});

  const [editingMealId, setEditingMealId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState(emptyMealForm);
  const [editFieldErrors, setEditFieldErrors] = useState<MealFieldErrors>({});

  const profileQuery = useProfileQuery(uid);
  const mealPlanQuery = useMealPlanQuery(uid);

  const updateProfileMutation = useUpdateProfileMutation(uid);
  const createMealMutation = useCreateMealMutation(uid);
  const updateMealMutation = useUpdateMealMutation(uid);
  const deleteMealMutation = useDeleteMealMutation(uid);

  const profile = profileQuery.data;

  // Seeds the editable form from the loaded profile exactly once — after that, the form is
  // the source of truth for what the user is typing. currentWeightKg changes (new check-ins)
  // never touch this form: it only edits heightCm/age/sex/activityLevel/dietDeficitLevel.
  useEffect(() => {
    if (!profile || hasSyncedProfileForm) return;

    setProfileForm({
      heightCm: profile.heightCm !== null ? String(profile.heightCm) : '',
      age: profile.age !== null ? String(profile.age) : '',
      sex: profile.sex ?? '',
      activityLevel: profile.activityLevel,
      dietDeficitLevel: profile.dietDeficitLevel,
    });
    setHasSyncedProfileForm(true);
  }, [profile, hasSyncedProfileForm]);

  // Recomputed on every render from the latest profile — never cached in state — so it always
  // reflects the most recent currentWeightKg (mirrored from check-ins) or profile edit, per
  // docs/project/fitliving-web.md section 4.1's recalculation requirement.
  const dietGoals = useMemo(() => {
    if (!profile || profile.heightCm === null || profile.age === null || profile.sex === null) {
      return null;
    }

    const weightKg = profile.currentWeightKg ?? profile.initialWeightKg;

    return calculateDietGoals({
      weightKg,
      heightCm: profile.heightCm,
      age: profile.age,
      sex: profile.sex,
      activityLevel: profile.activityLevel,
      dietDeficitLevel: profile.dietDeficitLevel,
    });
  }, [profile]);

  function handleProfileSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!uid) return;

    const result = validateProfileForm(profileForm, t);
    if (!result.success) {
      setProfileFieldErrors(result.errors);
      return;
    }
    setProfileFieldErrors({});

    updateProfileMutation.mutate({ uid, payload: result.data });
  }

  function handleAddMealSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!uid) return;

    const result = validateMealForm(addForm, t);
    if (!result.success) {
      setAddFieldErrors(result.errors);
      return;
    }
    setAddFieldErrors({});

    const meals = mealPlanQuery.data ?? [];

    createMealMutation.mutate(
      { uid, order: meals.length, payload: result.data },
      { onSuccess: () => setAddForm(emptyMealForm) },
    );
  }

  function handleStartEdit(meal: Meal) {
    setEditingMealId(meal.id);
    setEditForm({
      name: meal.name,
      description: meal.description,
      approxKcal: String(meal.approxKcal),
      approxProteinG: String(meal.approxProteinG),
      timing: meal.timing,
    });
    setEditFieldErrors({});
  }

  function handleCancelEdit() {
    setEditingMealId(null);
    setEditFieldErrors({});
  }

  function handleEditSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!uid || !editingMealId) return;

    const result = validateMealForm(editForm, t);
    if (!result.success) {
      setEditFieldErrors(result.errors);
      return;
    }
    setEditFieldErrors({});

    updateMealMutation.mutate(
      { uid, mealId: editingMealId, payload: result.data },
      { onSuccess: () => setEditingMealId(null) },
    );
  }

  function handleDelete(mealId: string) {
    if (!uid) return;

    deleteMealMutation.mutate(
      { uid, mealId },
      { onSuccess: () => setEditingMealId((current) => (current === mealId ? null : current)) },
    );
  }

  function handleRetry() {
    void profileQuery.refetch();
    void mealPlanQuery.refetch();
  }

  if (profileQuery.isLoading) {
    return { status: 'loading' as const };
  }

  if (profileQuery.isError) {
    return { status: 'error' as const, onRetry: handleRetry };
  }

  if (!profile) {
    return { status: 'error' as const, onRetry: handleRetry };
  }

  const meals = mealPlanQuery.data ?? [];

  const profileFormProps = {
    values: profileForm,
    onHeightCmChange: (value: string) => setProfileForm((prev) => ({ ...prev, heightCm: value })),
    onAgeChange: (value: string) => setProfileForm((prev) => ({ ...prev, age: value })),
    onSexChange: (value: string) => setProfileForm((prev) => ({ ...prev, sex: value })),
    onActivityLevelChange: (value: string) =>
      setProfileForm((prev) => ({ ...prev, activityLevel: value })),
    onDietDeficitLevelChange: (value: string) =>
      setProfileForm((prev) => ({ ...prev, dietDeficitLevel: value })),
    onSubmit: handleProfileSubmit,
    isSubmitting: updateProfileMutation.isPending,
    heightCmError: profileFieldErrors.heightCm,
    ageError: profileFieldErrors.age,
    sexError: profileFieldErrors.sex,
    activityLevelError: profileFieldErrors.activityLevel,
    dietDeficitLevelError: profileFieldErrors.dietDeficitLevel,
    formError: updateProfileMutation.isError
      ? t('diet.profileForm.errors.submitFailed')
      : undefined,
  };

  const addFormProps = {
    mode: 'create' as const,
    values: addForm,
    onNameChange: (value: string) => setAddForm((prev) => ({ ...prev, name: value })),
    onDescriptionChange: (value: string) => setAddForm((prev) => ({ ...prev, description: value })),
    onApproxKcalChange: (value: string) => setAddForm((prev) => ({ ...prev, approxKcal: value })),
    onApproxProteinGChange: (value: string) =>
      setAddForm((prev) => ({ ...prev, approxProteinG: value })),
    onTimingChange: (value: string) => setAddForm((prev) => ({ ...prev, timing: value })),
    onSubmit: handleAddMealSubmit,
    isSubmitting: createMealMutation.isPending,
    nameError: addFieldErrors.name,
    approxKcalError: addFieldErrors.approxKcal,
    approxProteinGError: addFieldErrors.approxProteinG,
    timingError: addFieldErrors.timing,
    formError: createMealMutation.isError ? t('diet.mealForm.errors.submitFailed') : undefined,
  };

  const editFormProps = editingMealId
    ? {
        mode: 'edit' as const,
        values: editForm,
        onNameChange: (value: string) => setEditForm((prev) => ({ ...prev, name: value })),
        onDescriptionChange: (value: string) =>
          setEditForm((prev) => ({ ...prev, description: value })),
        onApproxKcalChange: (value: string) =>
          setEditForm((prev) => ({ ...prev, approxKcal: value })),
        onApproxProteinGChange: (value: string) =>
          setEditForm((prev) => ({ ...prev, approxProteinG: value })),
        onTimingChange: (value: string) => setEditForm((prev) => ({ ...prev, timing: value })),
        onSubmit: handleEditSubmit,
        onCancel: handleCancelEdit,
        isSubmitting: updateMealMutation.isPending,
        nameError: editFieldErrors.name,
        approxKcalError: editFieldErrors.approxKcal,
        approxProteinGError: editFieldErrors.approxProteinG,
        timingError: editFieldErrors.timing,
        formError: updateMealMutation.isError ? t('diet.mealForm.errors.submitFailed') : undefined,
      }
    : null;

  return {
    status: 'ready' as const,
    profile,
    dietGoals,
    profileForm: profileFormProps,

    meals,
    isMealsLoading: mealPlanQuery.isLoading,
    isMealsError: mealPlanQuery.isError,
    onRetryMeals: () => void mealPlanQuery.refetch(),

    addForm: addFormProps,
    editingMealId,
    editForm: editFormProps,
    onStartEdit: handleStartEdit,
    onDelete: handleDelete,
    isDeletePending: deleteMealMutation.isPending,
  };
}
