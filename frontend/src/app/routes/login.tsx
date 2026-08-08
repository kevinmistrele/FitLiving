import { Navigate } from 'react-router-dom';

import { LoginScreen } from '@/features/auth/components/login-screen';
import { useAuthStore } from '@/lib/auth-store';

export function LoginRoute() {
  const user = useAuthStore((state) => state.user);

  if (user) {
    return <Navigate to="/" replace />;
  }

  return <LoginScreen />;
}
