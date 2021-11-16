import React from 'react';
import { useTranslation } from 'react-i18next';
import { observer } from 'mobx-react-lite';
import { useHistory } from 'react-router';
import Layout from '../components/Layout';
import { useParams } from '../routes/hooks';
import { useStore } from '../store/storeContext';
import Watermark from '../components/Layout/Watermark';
import { path } from '../routes/routes';
import TestScore from '../components/tests/TestScore';

export const TestOutcome = observer(() => {
  const history = useHistory();
  const { t } = useTranslation();
  const { slug } = useParams();

  const {
    tests: { testOutcomeState, getTest, getTestOutcome },
  } = useStore();

  const test = getTest(slug);
  const outcome = getTestOutcome(slug);

  const isLoading = testOutcomeState === 'FETCHING';

  const hero = {
    title: test?.name ?? '',
    lead: test?.description,
    goBackText: t('route.tests'),
    onGoBackClick: () => history.push(`/${path('tests')}`),
    image: test?.categories[0]?.image,
    smallImage: true,
  };

  const { points, maximumPoints, stars } = outcome ?? {};

  return (
    <Layout wrapperSize="sm" hero={hero} isLoading={isLoading}>
      <Watermark right={-80} top={-40} />
      <TestScore points={points} maxPoints={maximumPoints} stars={stars} />

      {/* TODO: SHOW OUTCOMES */}
    </Layout>
  );
});
