import { Navigate, Outlet } from 'react-router-dom';

import { useTranslate } from '@/hooks/use-translate';
import { useAuthStore } from '@/lib/auth-store';

export function ProtectedLayout() {
  const user = useAuthStore((state) => state.user);
  const isInitializing = useAuthStore((state) => state.isInitializing);
  const { t } = useTranslate();

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

  return <Outlet />;
}
