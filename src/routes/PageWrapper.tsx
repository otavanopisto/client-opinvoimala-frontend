import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useStore } from '../store/storeContext';

interface Props {
  title?: string;
}

/**
 * Sets title for the page
 */
const PageWrapper: React.FC<Props> = ({ title, children }) => {
  const { t } = useTranslation();

  const {
    settings: { settings },
  } = useStore();

  /**
   * Set page title
   */
  useEffect(() => {
    const baseTitle = settings?.appName ?? t('app_name') ?? '';
    document.title = title ? `${baseTitle} - ${title}` : baseTitle;
  }, [settings, t, title]);

  return <>{children}</>;
};

export default PageWrapper;
