import { QueryClientProvider } from '@tanstack/react-query';
import { onAuthStateChanged } from 'firebase/auth';
import { type PropsWithChildren, useEffect } from 'react';

import { LocaleProvider } from '@/i18n/locale-provider';
import { useAuthStore } from '@/lib/auth-store';
import { auth } from '@/lib/firebase';
import { queryClient } from '@/lib/query-client';

export function AppProvider(props: PropsWithChildren) {
  const { children } = props;
  const setUser = useAuthStore((state) => state.setUser);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return unsubscribe;
  }, [setUser]);

  return (
    <QueryClientProvider client={queryClient}>
      <LocaleProvider>{children}</LocaleProvider>
    </QueryClientProvider>
  );
}
