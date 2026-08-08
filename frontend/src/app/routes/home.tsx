import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { signOut } from '@/features/auth/api/sign-out';
import { CheckInsScreen } from '@/features/check-ins/components/check-ins-screen';
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
    <div className="min-h-screen">
      <header className="border-border flex items-center justify-between gap-4 border-b p-4">
        {user?.email && <p className="text-muted-foreground text-sm">{user.email}</p>}
        <Button type="button" variant="outline" onClick={() => void handleLogout()}>
          {t('home.logout')}
        </Button>
      </header>
      {signOutError && (
        <p role="alert" className="text-destructive p-4 text-center">
          {signOutError}
        </p>
      )}
      <CheckInsScreen />
    </div>
  );
}
