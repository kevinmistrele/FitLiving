import { AppLogo } from '@/components/app-logo';
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
    <div className="from-primary/10 via-background to-background flex min-h-screen items-center justify-center bg-gradient-to-b p-6">
      <div className="flex w-full max-w-sm flex-col items-center gap-6">
        <div className="flex flex-col items-center gap-2 text-center">
          <AppLogo />
          <p className="text-muted-foreground text-sm">{t('auth.login.tagline')}</p>
        </div>
        <LoginForm
          className="w-full"
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
