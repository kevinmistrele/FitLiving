import { render as testingLibraryRender, type RenderOptions } from '@testing-library/react';
import type { PropsWithChildren, ReactElement } from 'react';
import { MemoryRouter } from 'react-router-dom';

import { AppProvider } from '@/app/provider';

function AllProviders(props: PropsWithChildren) {
  const { children } = props;

  return (
    <AppProvider>
      <MemoryRouter>{children}</MemoryRouter>
    </AppProvider>
  );
}

function render(ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) {
  return testingLibraryRender(ui, { wrapper: AllProviders, ...options });
}

export * from '@testing-library/react';
export { render };
