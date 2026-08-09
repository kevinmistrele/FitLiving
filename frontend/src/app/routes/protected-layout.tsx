import { useState } from 'react';
import { Dumbbell, LineChart, LogOut, Moon, Sun, Utensils } from 'lucide-react';
import { Link, Navigate, Outlet, useLocation } from 'react-router-dom';

import { AppLogo } from '@/components/app-logo';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { signOut } from '@/features/auth/api/sign-out';
import { useTheme } from '@/hooks/use-theme';
import { useTranslate } from '@/hooks/use-translate';
import { useAuthStore } from '@/lib/auth-store';

interface NavItem {
  to: string;
  end: boolean;
  label: string;
  icon: typeof LineChart;
}

function isNavItemActive(item: NavItem, pathname: string): boolean {
  return item.end ? pathname === item.to : pathname.startsWith(item.to);
}

// Shared shell for all authenticated screens (Acompanhamento, Treino and Dieta) — owns the
// auth guard, the sidebar nav between them, and the logout/theme controls, since every route
// needs them. The shadcn sidebar (docs/decisions/0010-shadcn.md) already handles the
// mobile/desktop split natively: it becomes a Sheet/drawer under the md breakpoint (see
// src/hooks/use-mobile.ts), which is why the SidebarTrigger + page title header below is
// md:hidden — the sidebar itself is the desktop nav.
export function ProtectedLayout() {
  const user = useAuthStore((state) => state.user);
  const isInitializing = useAuthStore((state) => state.isInitializing);
  const { t } = useTranslate();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [signOutError, setSignOutError] = useState<string | null>(null);

  const navItems: NavItem[] = [
    { to: '/', end: true, label: t('layout.nav.checkIns'), icon: LineChart },
    { to: '/workouts', end: false, label: t('layout.nav.workouts'), icon: Dumbbell },
    { to: '/diet', end: false, label: t('layout.nav.diet'), icon: Utensils },
  ];
  const activeNavItem = navItems.find((item) => isNavItemActive(item, location.pathname));
  const themeToggleLabel =
    theme === 'dark' ? t('layout.theme.switchToLight') : t('layout.theme.switchToDark');

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
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <AppLogo className="px-2 py-1.5" />
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <nav aria-label={t('layout.nav.label')}>
                <SidebarMenu>
                  {navItems.map((item) => {
                    const isActive = isNavItemActive(item, location.pathname);

                    return (
                      <SidebarMenuItem key={item.to}>
                        <SidebarMenuButton
                          isActive={isActive}
                          aria-current={isActive ? 'page' : undefined}
                          render={<Link to={item.to} />}
                        >
                          <item.icon />
                          <span>{item.label}</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </nav>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          {user.email && (
            <p className="text-sidebar-foreground/70 truncate px-2 py-1 text-xs">{user.email}</p>
          )}
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                type="button"
                onClick={() => toggleTheme()}
                aria-label={themeToggleLabel}
              >
                {theme === 'dark' ? <Sun /> : <Moon />}
                <span>{themeToggleLabel}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton type="button" onClick={() => void handleLogout()}>
                <LogOut />
                <span>{t('layout.logout')}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="border-border flex items-center gap-2 border-b p-4 md:hidden">
          <SidebarTrigger aria-label={t('layout.nav.toggle')} />
          <p className="text-sm font-medium">{activeNavItem?.label}</p>
        </header>
        {signOutError && (
          <p role="alert" className="text-destructive p-4 text-center">
            {signOutError}
          </p>
        )}
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  );
}
