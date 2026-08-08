import type { FormEvent } from 'react';

import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { useTranslate } from '@/hooks/use-translate';

export interface LoadEntryFormValues {
  loadKg: string;
  repsAchieved: string;
}

export interface LoadEntryFormProps {
  values: LoadEntryFormValues;
  onLoadKgChange: (value: string) => void;
  onRepsAchievedChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
  isSubmitting: boolean;
  loadKgError?: string;
  repsAchievedError?: string;
  formError?: string;
}

// Register this week's load for one exercise — docs/project/fitliving-web.md section 3.2.
export function LoadEntryForm(props: LoadEntryFormProps) {
  const {
    values,
    onLoadKgChange,
    onRepsAchievedChange,
    onSubmit,
    onCancel,
    isSubmitting,
    loadKgError,
    repsAchievedError,
    formError,
  } = props;
  const { t } = useTranslate();

  return (
    <form onSubmit={onSubmit} noValidate className="bg-muted/30 flex flex-col gap-3 rounded-lg p-3">
      <FieldGroup>
        <div className="grid grid-cols-2 gap-2">
          <Field data-invalid={Boolean(loadKgError)}>
            <FieldLabel htmlFor="load-entry-kg">{t('workouts.loadForm.loadLabel')}</FieldLabel>
            <Input
              id="load-entry-kg"
              type="number"
              inputMode="decimal"
              step="0.5"
              min="0"
              value={values.loadKg}
              onChange={(event) => onLoadKgChange(event.target.value)}
              aria-invalid={Boolean(loadKgError)}
              disabled={isSubmitting}
            />
            {loadKgError && <FieldError>{loadKgError}</FieldError>}
          </Field>
          <Field data-invalid={Boolean(repsAchievedError)}>
            <FieldLabel htmlFor="load-entry-reps">
              {t('workouts.loadForm.repsAchievedLabel')}
            </FieldLabel>
            <Input
              id="load-entry-reps"
              type="number"
              inputMode="numeric"
              min="1"
              step="1"
              value={values.repsAchieved}
              onChange={(event) => onRepsAchievedChange(event.target.value)}
              aria-invalid={Boolean(repsAchievedError)}
              disabled={isSubmitting}
            />
            {repsAchievedError && <FieldError>{repsAchievedError}</FieldError>}
          </Field>
        </div>
        {formError && (
          <p role="alert" className="text-destructive text-sm font-normal">
            {formError}
          </p>
        )}
        <Field orientation="horizontal">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? t('workouts.loadForm.submitPending') : t('workouts.loadForm.submit')}
          </Button>
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            {t('workouts.loadForm.cancel')}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
