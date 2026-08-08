import { useMutation } from '@tanstack/react-query';
import { type FormEvent, useState } from 'react';

import { signInWithEmail } from '@/features/auth/api/sign-in-with-email';
import { loginPayloadSchema, type LoginFieldErrors } from '@/features/auth/types/auth.types';
import { getLoginErrorMessageKey } from '@/features/auth/utils/get-login-error-message-key';
import { useTranslate } from '@/hooks/use-translate';

export function useLoginScreen() {
  const { t } = useTranslate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<LoginFieldErrors>({});

  const signInMutation = useMutation({
    mutationFn: signInWithEmail,
  });

  function validate(): boolean {
    const result = loginPayloadSchema.safeParse({ email, password });

    if (result.success) {
      setFieldErrors({});
      return true;
    }

    const errors: LoginFieldErrors = {};

    for (const issue of result.error.issues) {
      const field = issue.path[0];

      if (field === 'email' && !errors.email) {
        errors.email =
          issue.code === 'too_small'
            ? t('auth.login.errors.emailRequired')
            : t('auth.login.errors.emailInvalid');
      }

      if (field === 'password' && !errors.password) {
        errors.password = t('auth.login.errors.passwordRequired');
      }
    }

    setFieldErrors(errors);
    return false;
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!validate()) return;

    signInMutation.mutate({ email, password });
  }

  return {
    email,
    password,
    onEmailChange: setEmail,
    onPasswordChange: setPassword,
    onSubmit: handleSubmit,
    isSubmitting: signInMutation.isPending,
    emailError: fieldErrors.email,
    passwordError: fieldErrors.password,
    formError: signInMutation.isError
      ? t(getLoginErrorMessageKey(signInMutation.error))
      : undefined,
  };
}
