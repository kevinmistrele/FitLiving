import { LoginForm } from '@/components/login-form';
import { useLoginScreen } from '@/features/auth/hooks/use-login-screen.hooks';
import { useTranslate } from '@/hooks/use-translate';

export function LoginScreen() {
  const { t } = useTranslate();
  const {
    email,
    password,
    onEmailChange,
    onPasswordChange,
    onSubmit,
    isSubmitting,
    emailError,
    passwordError,
    formError,
  } = useLoginScreen();

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <LoginForm
          title={t('auth.login.title')}
          description={t('auth.login.description')}
          emailLabel={t('auth.login.emailLabel')}
          passwordLabel={t('auth.login.passwordLabel')}
          submitLabel={t('auth.login.submit')}
          submitPendingLabel={t('auth.login.submitPending')}
          email={email}
          password={password}
          onEmailChange={onEmailChange}
          onPasswordChange={onPasswordChange}
          onSubmit={onSubmit}
          isSubmitting={isSubmitting}
          emailError={emailError}
          passwordError={passwordError}
          formError={formError}
        />
      </div>
    </div>
  );
}
