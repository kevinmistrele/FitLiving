import { createBrowserRouter } from 'react-router-dom';

import { RootErrorRoute } from '@/app/routes/root-error';

export const router = createBrowserRouter([
  {
    path: '/login',
    errorElement: <RootErrorRoute />,
    lazy: async () => {
      const { LoginRoute } = await import('@/app/routes/login');
      return { Component: LoginRoute };
    },
  },
  {
    path: '/',
    errorElement: <RootErrorRoute />,
    lazy: async () => {
      const { ProtectedLayout } = await import('@/app/routes/protected-layout');
      return { Component: ProtectedLayout };
    },
    children: [
      {
        index: true,
        lazy: async () => {
          const { HomeRoute } = await import('@/app/routes/home');
          return { Component: HomeRoute };
        },
      },
      {
        path: 'workouts',
        lazy: async () => {
          const { WorkoutsRoute } = await import('@/app/routes/workouts');
          return { Component: WorkoutsRoute };
        },
      },
      {
        path: 'diet',
        lazy: async () => {
          const { DietRoute } = await import('@/app/routes/diet');
          return { Component: DietRoute };
        },
      },
    ],
  },
]);
