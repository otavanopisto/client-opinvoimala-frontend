import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Layout from '../components/Layout';
import TestsList from '../components/tests/TestsList';
import { useStore } from '../store/storeContext';

interface Props {}

const Tests: React.FC<Props> = observer(() => {
  const { t } = useTranslation();

  const {
    tests: { categoriesState, categories, fetchCategories },
  } = useStore();

  const isBusy = categoriesState === 'FETCHING';

  useEffect(() => {
    if (categoriesState === 'NOT_FETCHED') {
      fetchCategories();
    }
  }, [categoriesState, fetchCategories]);

  const hero = {
    title: t('route.tests'),
  };

  return (
    <Layout hero={hero} isLoading={isBusy}>
      {categories?.map(({ id, label, tests }) => (
        <TestsList key={id} title={label} items={tests} />
      ))}
    </Layout>
  );
});

export default Tests;
