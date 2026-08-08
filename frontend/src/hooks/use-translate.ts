import { useIntl } from 'react-intl';

export function useTranslate() {
  const intl = useIntl();

  function t(id: string, values?: Record<string, string | number>): string {
    return intl.formatMessage({ id, defaultMessage: id }, values);
  }

  return { t };
}
