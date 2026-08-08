import type { FormEvent } from 'react';

import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { MEAL_TIMING_OPTIONS } from '@/features/diet/types/diet.types';
import { useTranslate } from '@/hooks/use-translate';

export interface MealFormValues {
  name: string;
  description: string;
  approxKcal: string;
  approxProteinG: string;
  timing: string;
}

export interface MealFormProps {
  mode: 'create' | 'edit';
  values: MealFormValues;
  onNameChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onApproxKcalChange: (value: string) => void;
  onApproxProteinGChange: (value: string) => void;
  onTimingChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onCancel?: () => void;
  isSubmitting: boolean;
  nameError?: string;
  approxKcalError?: string;
  approxProteinGError?: string;
  timingError?: string;
  formError?: string;
}

// Add/edit a meal — docs/project/fitliving-web.md section 4.3. Reused for both the
// always-visible "add meal" form and a meal's inline edit mode (mirrors workouts'
// ExerciseForm pattern).
export function MealForm(props: MealFormProps) {
  const {
    mode,
    values,
    onNameChange,
    onDescriptionChange,
    onApproxKcalChange,
    onApproxProteinGChange,
    onTimingChange,
    onSubmit,
    onCancel,
    isSubmitting,
    nameError,
    approxKcalError,
    approxProteinGError,
    timingError,
    formError,
  } = props;
  const { t } = useTranslate();

  const submitLabel = isSubmitting
    ? t(mode === 'create' ? 'diet.mealForm.createSubmitPending' : 'diet.mealForm.editSubmitPending')
    : t(mode === 'create' ? 'diet.mealForm.createSubmit' : 'diet.mealForm.editSubmit');

  return (
    <form onSubmit={onSubmit} noValidate>
      <FieldGroup>
        <Field data-invalid={Boolean(nameError)}>
          <FieldLabel htmlFor={`meal-name-${mode}`}>{t('diet.mealForm.nameLabel')}</FieldLabel>
          <Input
            id={`meal-name-${mode}`}
            type="text"
            value={values.name}
            onChange={(event) => onNameChange(event.target.value)}
            aria-invalid={Boolean(nameError)}
            disabled={isSubmitting}
          />
          {nameError && <FieldError>{nameError}</FieldError>}
        </Field>
        <Field>
          <FieldLabel htmlFor={`meal-description-${mode}`}>
            {t('diet.mealForm.descriptionLabel')}
          </FieldLabel>
          <Input
            id={`meal-description-${mode}`}
            type="text"
            value={values.description}
            onChange={(event) => onDescriptionChange(event.target.value)}
            disabled={isSubmitting}
          />
        </Field>
        <div className="grid grid-cols-2 gap-2">
          <Field data-invalid={Boolean(approxKcalError)}>
            <FieldLabel htmlFor={`meal-kcal-${mode}`}>{t('diet.mealForm.kcalLabel')}</FieldLabel>
            <Input
              id={`meal-kcal-${mode}`}
              type="number"
              inputMode="numeric"
              min="0"
              step="1"
              value={values.approxKcal}
              onChange={(event) => onApproxKcalChange(event.target.value)}
              aria-invalid={Boolean(approxKcalError)}
              disabled={isSubmitting}
            />
            {approxKcalError && <FieldError>{approxKcalError}</FieldError>}
          </Field>
          <Field data-invalid={Boolean(approxProteinGError)}>
            <FieldLabel htmlFor={`meal-protein-${mode}`}>
              {t('diet.mealForm.proteinLabel')}
            </FieldLabel>
            <Input
              id={`meal-protein-${mode}`}
              type="number"
              inputMode="numeric"
              min="0"
              step="1"
              value={values.approxProteinG}
              onChange={(event) => onApproxProteinGChange(event.target.value)}
              aria-invalid={Boolean(approxProteinGError)}
              disabled={isSubmitting}
            />
            {approxProteinGError && <FieldError>{approxProteinGError}</FieldError>}
          </Field>
        </div>
        <Field data-invalid={Boolean(timingError)}>
          <FieldLabel htmlFor={`meal-timing-${mode}`}>{t('diet.mealForm.timingLabel')}</FieldLabel>
          <Select
            value={values.timing}
            onValueChange={(value) => onTimingChange(value ?? '')}
            disabled={isSubmitting}
          >
            <SelectTrigger
              id={`meal-timing-${mode}`}
              className="w-full"
              aria-invalid={Boolean(timingError)}
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {MEAL_TIMING_OPTIONS.map((option) => (
                <SelectItem key={option} value={option}>
                  {t(`diet.mealForm.timingOptions.${option}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {timingError && <FieldError>{timingError}</FieldError>}
        </Field>
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
              {t('diet.mealForm.cancel')}
            </Button>
          )}
        </Field>
      </FieldGroup>
    </form>
  );
}
