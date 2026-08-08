import { useState } from 'react';

import { signOut } from '@/features/auth/api/sign-out';
import { useTranslate } from '@/hooks/use-translate';
import { useAuthStore } from '@/lib/auth-store';

export function HomeRoute() {
  const user = useAuthStore((state) => state.user);
  const { t } = useTranslate();
  const [signOutError, setSignOutError] = useState<string | null>(null);

  async function handleLogout() {
    setSignOutError(null);

    try {
      await signOut();
    } catch {
      setSignOutError(t('common.somethingWentWrong'));
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-8 text-center">
      <h1 className="text-xl font-semibold">{t('home.welcomeBack')}</h1>
      {user?.email && <p className="text-muted-foreground">{user.email}</p>}
      <button
        type="button"
        onClick={() => void handleLogout()}
        className="border-border rounded-md border px-4 py-2"
      >
        {t('home.logout')}
      </button>
      {signOutError && (
        <p role="alert" className="text-destructive">
          {signOutError}
        </p>
      )}
    </main>
  );
}
