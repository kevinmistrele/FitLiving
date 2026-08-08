import { useState } from 'react';
import { NavLink, Navigate, Outlet } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { signOut } from '@/features/auth/api/sign-out';
import { useTranslate } from '@/hooks/use-translate';
import { useAuthStore } from '@/lib/auth-store';
import { cn } from '@/lib/utils';

function navLinkClassName({ isActive }: { isActive: boolean }): string {
  return cn(
    'text-sm font-medium',
    isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground',
  );
}

// Shared shell for both authenticated screens (Acompanhamento and Treino) — owns the
// auth guard, the nav between them, and the logout button, since both routes need it.
export function ProtectedLayout() {
  const user = useAuthStore((state) => state.user);
  const isInitializing = useAuthStore((state) => state.isInitializing);
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

  if (isInitializing) {
    return (
      <div role="status" className="flex min-h-screen items-center justify-center">
        {t('app.booting')}
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen">
      <header className="border-border flex flex-wrap items-center justify-between gap-4 border-b p-4">
        <nav aria-label={t('layout.nav.label')} className="flex gap-4">
          <NavLink to="/" end className={navLinkClassName}>
            {t('layout.nav.checkIns')}
          </NavLink>
          <NavLink to="/workouts" className={navLinkClassName}>
            {t('layout.nav.workouts')}
          </NavLink>
        </nav>
        <div className="flex items-center gap-4">
          {user.email && <p className="text-muted-foreground text-sm">{user.email}</p>}
          <Button type="button" variant="outline" onClick={() => void handleLogout()}>
            {t('layout.logout')}
          </Button>
        </div>
      </header>
      {signOutError && (
        <p role="alert" className="text-destructive p-4 text-center">
          {signOutError}
        </p>
      )}
      <Outlet />
    </div>
  );
}
