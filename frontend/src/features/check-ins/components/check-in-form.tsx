import { ClipboardCheck } from 'lucide-react';
import type { FormEvent } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';

export interface CheckInFormProps {
  title: string;
  tip: string;
  dateLabel: string;
  weightLabel: string;
  waistLabel: string;
  notesLabel: string;
  notesPlaceholder: string;
  submitLabel: string;
  submitPendingLabel: string;
  date: string;
  weightKg: string;
  waistCm: string;
  notes: string;
  onDateChange: (value: string) => void;
  onWeightKgChange: (value: string) => void;
  onWaistCmChange: (value: string) => void;
  onNotesChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  isSubmitting: boolean;
  dateError?: string;
  weightKgError?: string;
  waistCmError?: string;
  formError?: string;
}

// Registro semanal — docs/project/fitliving-web.md section 5.1.
export function CheckInForm(props: CheckInFormProps) {
  const {
    title,
    tip,
    dateLabel,
    weightLabel,
    waistLabel,
    notesLabel,
    notesPlaceholder,
    submitLabel,
    submitPendingLabel,
    date,
    weightKg,
    waistCm,
    notes,
    onDateChange,
    onWeightKgChange,
    onWaistCmChange,
    onNotesChange,
    onSubmit,
    isSubmitting,
    dateError,
    weightKgError,
    waistCmError,
    formError,
  } = props;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ClipboardCheck aria-hidden="true" className="text-primary size-4" />
          {title}
        </CardTitle>
        <CardDescription>{tip}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} noValidate>
          <FieldGroup>
            <Field data-invalid={Boolean(dateError)}>
              <FieldLabel htmlFor="check-in-date">{dateLabel}</FieldLabel>
              <Input
                id="check-in-date"
                type="date"
                value={date}
                onChange={(event) => onDateChange(event.target.value)}
                aria-invalid={Boolean(dateError)}
                disabled={isSubmitting}
              />
              {dateError && <FieldError>{dateError}</FieldError>}
            </Field>
            <Field data-invalid={Boolean(weightKgError)}>
              <FieldLabel htmlFor="check-in-weight">{weightLabel}</FieldLabel>
              <Input
                id="check-in-weight"
                type="number"
                inputMode="decimal"
                step="0.1"
                min="0"
                value={weightKg}
                onChange={(event) => onWeightKgChange(event.target.value)}
                aria-invalid={Boolean(weightKgError)}
                disabled={isSubmitting}
              />
              {weightKgError && <FieldError>{weightKgError}</FieldError>}
            </Field>
            <Field data-invalid={Boolean(waistCmError)}>
              <FieldLabel htmlFor="check-in-waist">{waistLabel}</FieldLabel>
              <Input
                id="check-in-waist"
                type="number"
                inputMode="decimal"
                step="0.1"
                min="0"
                value={waistCm}
                onChange={(event) => onWaistCmChange(event.target.value)}
                aria-invalid={Boolean(waistCmError)}
                disabled={isSubmitting}
              />
              {waistCmError && <FieldError>{waistCmError}</FieldError>}
            </Field>
            <Field>
              <FieldLabel htmlFor="check-in-notes">{notesLabel}</FieldLabel>
              <Input
                id="check-in-notes"
                type="text"
                placeholder={notesPlaceholder}
                value={notes}
                onChange={(event) => onNotesChange(event.target.value)}
                disabled={isSubmitting}
              />
            </Field>
            {formError && (
              <p role="alert" className="text-destructive text-sm font-normal">
                {formError}
              </p>
            )}
            <Field>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? submitPendingLabel : submitLabel}
              </Button>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
