import type { ComponentProps, FormEvent } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export interface LoginFormProps extends Omit<ComponentProps<'div'>, 'onSubmit'> {
  title: string;
  description: string;
  emailLabel: string;
  passwordLabel: string;
  submitLabel: string;
  submitPendingLabel: string;
  email: string;
  password: string;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  isSubmitting: boolean;
  emailError?: string;
  passwordError?: string;
  formError?: string;
}

// Generic, business-agnostic email/password login form shell — built from the shadcn
// `login-01` block (see docs/decisions/0010-shadcn.md), with sign-up and social login
// stripped: this app has no public sign-up (docs/project/fitliving-web.md, section 2).
export function LoginForm(props: LoginFormProps) {
  const {
    className,
    title,
    description,
    emailLabel,
    passwordLabel,
    submitLabel,
    submitPendingLabel,
    email,
    password,
    onEmailChange,
    onPasswordChange,
    onSubmit,
    isSubmitting,
    emailError,
    passwordError,
    formError,
    ...divProps
  } = props;

  return (
    <div className={cn('flex flex-col gap-6', className)} {...divProps}>
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} noValidate>
            <FieldGroup>
              <Field data-invalid={Boolean(emailError)}>
                <FieldLabel htmlFor="email">{emailLabel}</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => onEmailChange(event.target.value)}
                  aria-invalid={Boolean(emailError)}
                  disabled={isSubmitting}
                />
                {emailError && <FieldError>{emailError}</FieldError>}
              </Field>
              <Field data-invalid={Boolean(passwordError)}>
                <FieldLabel htmlFor="password">{passwordLabel}</FieldLabel>
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => onPasswordChange(event.target.value)}
                  aria-invalid={Boolean(passwordError)}
                  disabled={isSubmitting}
                />
                {passwordError && <FieldError>{passwordError}</FieldError>}
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
    </div>
  );
}
