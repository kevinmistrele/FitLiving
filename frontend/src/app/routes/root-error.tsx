import { useRouteError } from 'react-router-dom';

import { useTranslate } from '@/hooks/use-translate';

export function RootErrorRoute() {
  const error = useRouteError();
  const { t } = useTranslate();

  if (import.meta.env.DEV) {
    console.error(error);
  }

  return (
    <div
      role="alert"
      className="flex min-h-screen flex-col items-center justify-center gap-4 p-8 text-center"
    >
      <h1 className="text-xl font-semibold">{t('common.somethingWentWrong')}</h1>
      <button
        type="button"
        onClick={() => window.location.assign('/')}
        className="border-border rounded-md border px-4 py-2"
      >
        {t('common.retry')}
      </button>
    </div>
  );
}
