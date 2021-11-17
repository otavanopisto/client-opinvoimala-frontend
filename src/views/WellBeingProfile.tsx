import { observer } from 'mobx-react-lite';
import React from 'react';
import { useTranslation } from 'react-i18next';
import Layout from '../components/Layout';

export const WellBeingProfile: React.FC = observer(() => {
  const { t } = useTranslation();

  const hero = {
    title: t('view.well_being_profile.title'),
  };

  return <Layout hero={hero}>TODO</Layout>;
});
