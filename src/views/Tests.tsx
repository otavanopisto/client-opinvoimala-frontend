import React from 'react';
import { useTranslation } from 'react-i18next';
import Layout from '../components/Layout';

interface Props {}

const Tests: React.FC<Props> = () => {
  const { t } = useTranslation();

  const hero = {
    title: t('route.tests'),
  };

  return (
    <Layout hero={hero}>
      <div></div>
    </Layout>
  );
};

export default Tests;
