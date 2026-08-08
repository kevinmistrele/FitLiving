import type { FormEvent } from 'react';

import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { useTranslate } from '@/hooks/use-translate';

export interface ExerciseFormValues {
  name: string;
  sets: string;
  repsMin: string;
  repsMax: string;
}

export interface ExerciseFormProps {
  mode: 'create' | 'edit';
  values: ExerciseFormValues;
  onNameChange: (value: string) => void;
  onSetsChange: (value: string) => void;
  onRepsMinChange: (value: string) => void;
  onRepsMaxChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onCancel?: () => void;
  isSubmitting: boolean;
  nameError?: string;
  setsError?: string;
  repsMinError?: string;
  repsMaxError?: string;
  formError?: string;
}

// Add/edit an exercise — docs/project/fitliving-web.md section 3.3. Reused for both the
// always-visible "add exercise" form and an exercise's inline edit mode.
export function ExerciseForm(props: ExerciseFormProps) {
  const {
    mode,
    values,
    onNameChange,
    onSetsChange,
    onRepsMinChange,
    onRepsMaxChange,
    onSubmit,
    onCancel,
    isSubmitting,
    nameError,
    setsError,
    repsMinError,
    repsMaxError,
    formError,
  } = props;
  const { t } = useTranslate();

  const submitLabel = isSubmitting
    ? t(
        mode === 'create'
          ? 'workouts.exerciseForm.createSubmitPending'
          : 'workouts.exerciseForm.editSubmitPending',
      )
    : t(
        mode === 'create'
          ? 'workouts.exerciseForm.createSubmit'
          : 'workouts.exerciseForm.editSubmit',
      );

  return (
    <form onSubmit={onSubmit} noValidate>
      <FieldGroup>
        <Field data-invalid={Boolean(nameError)}>
          <FieldLabel htmlFor={`exercise-name-${mode}`}>
            {t('workouts.exerciseForm.nameLabel')}
          </FieldLabel>
          <Input
            id={`exercise-name-${mode}`}
            type="text"
            value={values.name}
            onChange={(event) => onNameChange(event.target.value)}
            aria-invalid={Boolean(nameError)}
            disabled={isSubmitting}
          />
          {nameError && <FieldError>{nameError}</FieldError>}
        </Field>
        <div className="grid grid-cols-3 gap-2">
          <Field data-invalid={Boolean(setsError)}>
            <FieldLabel htmlFor={`exercise-sets-${mode}`}>
              {t('workouts.exerciseForm.setsLabel')}
            </FieldLabel>
            <Input
              id={`exercise-sets-${mode}`}
              type="number"
              inputMode="numeric"
              min="1"
              step="1"
              value={values.sets}
              onChange={(event) => onSetsChange(event.target.value)}
              aria-invalid={Boolean(setsError)}
              disabled={isSubmitting}
            />
            {setsError && <FieldError>{setsError}</FieldError>}
          </Field>
          <Field data-invalid={Boolean(repsMinError)}>
            <FieldLabel htmlFor={`exercise-reps-min-${mode}`}>
              {t('workouts.exerciseForm.repsMinLabel')}
            </FieldLabel>
            <Input
              id={`exercise-reps-min-${mode}`}
              type="number"
              inputMode="numeric"
              min="1"
              step="1"
              value={values.repsMin}
              onChange={(event) => onRepsMinChange(event.target.value)}
              aria-invalid={Boolean(repsMinError)}
              disabled={isSubmitting}
            />
            {repsMinError && <FieldError>{repsMinError}</FieldError>}
          </Field>
          <Field data-invalid={Boolean(repsMaxError)}>
            <FieldLabel htmlFor={`exercise-reps-max-${mode}`}>
              {t('workouts.exerciseForm.repsMaxLabel')}
            </FieldLabel>
            <Input
              id={`exercise-reps-max-${mode}`}
              type="number"
              inputMode="numeric"
              min="1"
              step="1"
              value={values.repsMax}
              onChange={(event) => onRepsMaxChange(event.target.value)}
              aria-invalid={Boolean(repsMaxError)}
              disabled={isSubmitting}
            />
            {repsMaxError && <FieldError>{repsMaxError}</FieldError>}
          </Field>
        </div>
        {formError && (
          <p role="alert" className="text-destructive text-sm font-normal">
            {formError}
          </p>
        )}
        <Field orientation="horizontal">
          <Button type="submit" disabled={isSubmitting}>
            {submitLabel}
          </Button>
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
              {t('workouts.exerciseForm.cancel')}
            </Button>
          )}
        </Field>
      </FieldGroup>
    </form>
  );
}
