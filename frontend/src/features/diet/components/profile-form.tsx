import { Target } from 'lucide-react';
import type { FormEvent } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useTranslate } from '@/hooks/use-translate';
import { ACTIVITY_LEVEL_OPTIONS, DIET_DEFICIT_LEVEL_OPTIONS, SEX_OPTIONS } from '@/lib/profile';

export interface ProfileFormValues {
  heightCm: string;
  age: string;
  sex: string;
  activityLevel: string;
  dietDeficitLevel: string;
}

export interface ProfileFormProps {
  values: ProfileFormValues;
  onHeightCmChange: (value: string) => void;
  onAgeChange: (value: string) => void;
  onSexChange: (value: string) => void;
  onActivityLevelChange: (value: string) => void;
  onDietDeficitLevelChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  isSubmitting: boolean;
  heightCmError?: string;
  ageError?: string;
  sexError?: string;
  activityLevelError?: string;
  dietDeficitLevelError?: string;
  formError?: string;
}

// Metas base editáveis — docs/project/fitliving-web.md section 4.1. currentWeightKg is
// intentionally not editable here — it's owned by the check-ins feature (docs/
// firestore-data-model.md section 1.1) and only displayed in DietGoalsSummary.
export function ProfileForm(props: ProfileFormProps) {
  const {
    values,
    onHeightCmChange,
    onAgeChange,
    onSexChange,
    onActivityLevelChange,
    onDietDeficitLevelChange,
    onSubmit,
    isSubmitting,
    heightCmError,
    ageError,
    sexError,
    activityLevelError,
    dietDeficitLevelError,
    formError,
  } = props;
  const { t } = useTranslate();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target aria-hidden="true" className="text-primary size-4" />
          {t('diet.profileForm.title')}
        </CardTitle>
        <CardDescription>{t('diet.profileForm.description')}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} noValidate>
          <FieldGroup>
            <div className="grid grid-cols-2 gap-2">
              <Field data-invalid={Boolean(heightCmError)}>
                <FieldLabel htmlFor="diet-profile-height">
                  {t('diet.profileForm.heightLabel')}
                </FieldLabel>
                <Input
                  id="diet-profile-height"
                  type="number"
                  inputMode="decimal"
                  step="0.1"
                  min="0"
                  value={values.heightCm}
                  onChange={(event) => onHeightCmChange(event.target.value)}
                  aria-invalid={Boolean(heightCmError)}
                  disabled={isSubmitting}
                />
                {heightCmError && <FieldError>{heightCmError}</FieldError>}
              </Field>
              <Field data-invalid={Boolean(ageError)}>
                <FieldLabel htmlFor="diet-profile-age">{t('diet.profileForm.ageLabel')}</FieldLabel>
                <Input
                  id="diet-profile-age"
                  type="number"
                  inputMode="numeric"
                  step="1"
                  min="0"
                  value={values.age}
                  onChange={(event) => onAgeChange(event.target.value)}
                  aria-invalid={Boolean(ageError)}
                  disabled={isSubmitting}
                />
                {ageError && <FieldError>{ageError}</FieldError>}
              </Field>
            </div>

            <Field data-invalid={Boolean(sexError)}>
              <FieldLabel htmlFor="diet-profile-sex">{t('diet.profileForm.sexLabel')}</FieldLabel>
              <Select
                value={values.sex}
                onValueChange={(value) => onSexChange(value ?? '')}
                disabled={isSubmitting}
              >
                <SelectTrigger
                  id="diet-profile-sex"
                  className="w-full"
                  aria-invalid={Boolean(sexError)}
                >
                  <SelectValue placeholder={t('diet.profileForm.sexPlaceholder')} />
                </SelectTrigger>
                <SelectContent>
                  {SEX_OPTIONS.map((option) => (
                    <SelectItem key={option} value={option}>
                      {t(`diet.profileForm.sexOptions.${option}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {sexError && <FieldError>{sexError}</FieldError>}
            </Field>

            <Field data-invalid={Boolean(activityLevelError)}>
              <FieldLabel htmlFor="diet-profile-activity-level">
                {t('diet.profileForm.activityLevelLabel')}
              </FieldLabel>
              <Select
                value={values.activityLevel}
                onValueChange={(value) => onActivityLevelChange(value ?? '')}
                disabled={isSubmitting}
              >
                <SelectTrigger
                  id="diet-profile-activity-level"
                  className="w-full"
                  aria-invalid={Boolean(activityLevelError)}
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ACTIVITY_LEVEL_OPTIONS.map((option) => (
                    <SelectItem key={option} value={option}>
                      {t(`diet.profileForm.activityLevelOptions.${option}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {activityLevelError && <FieldError>{activityLevelError}</FieldError>}
            </Field>

            <Field data-invalid={Boolean(dietDeficitLevelError)}>
              <FieldLabel htmlFor="diet-profile-deficit-level">
                {t('diet.profileForm.dietDeficitLevelLabel')}
              </FieldLabel>
              <Select
                value={values.dietDeficitLevel}
                onValueChange={(value) => onDietDeficitLevelChange(value ?? '')}
                disabled={isSubmitting}
              >
                <SelectTrigger
                  id="diet-profile-deficit-level"
                  className="w-full"
                  aria-invalid={Boolean(dietDeficitLevelError)}
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DIET_DEFICIT_LEVEL_OPTIONS.map((option) => (
                    <SelectItem key={option} value={option}>
                      {t(`diet.profileForm.dietDeficitLevelOptions.${option}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {dietDeficitLevelError && <FieldError>{dietDeficitLevelError}</FieldError>}
            </Field>

            {formError && (
              <p role="alert" className="text-destructive text-sm font-normal">
                {formError}
              </p>
            )}
            <Field>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? t('diet.profileForm.submitPending') : t('diet.profileForm.submit')}
              </Button>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
