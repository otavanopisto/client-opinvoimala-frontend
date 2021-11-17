import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { observer } from 'mobx-react-lite';
import { useHistory } from 'react-router';
import Layout from '../components/Layout';
import { useParams } from '../routes/hooks';
import { useStore } from '../store/storeContext';
import Watermark from '../components/Layout/Watermark';
import { path } from '../routes/routes';
import TestScore from '../components/tests/TestScore';
import TestOutcome from '../components/tests/TestOutcome';
import Annotation from '../components/Annotation';
import Message from '../components/Message';
import { TestOutcomes as TestOutcomesType } from '../store/models';
import LinkList from '../components/LinkList';

export const TestOutcomes = observer(() => {
  const history = useHistory();
  const { t } = useTranslation();
  const { slug } = useParams();
  const slugRef = useRef<string>();

  const {
    tests: {
      testState,
      testOutcomeState,
      getTest,
      getTestOutcome,
      fetchTest,
      fetchTestOutcome,
    },
  } = useStore();

  const test = getTest(slug);
  const outcome = getTestOutcome(slug);

  const isLoading = testOutcomeState === 'FETCHING';

  useEffect(() => {
    if (!test && testState === 'IDLE') {
      slugRef.current = slug;
      fetchTest({ slug });
    }
  }, [fetchTest, slug, test, testState]);

  useEffect(() => {
    if (!outcome && testOutcomeState === 'IDLE') {
      slugRef.current = slug;
      fetchTestOutcome({ slug });
    }
  }, [fetchTestOutcome, outcome, slug, testOutcomeState]);

  const hero = {
    title: test?.name ?? '',
    lead: test?.description,
    goBackText: t('route.tests'),
    onGoBackClick: () => history.push(`/${path('tests')}`),
    image: test?.categories[0]?.image,
    smallImage: true,
  };

  const { points, maximumPoints, stars } = outcome ?? {};

  const getVisibleOutcomes = (outcome?: TestOutcomesType | null) => {
    const { allOutcomes, matchingOutcomes, triggerOutcomes } = outcome ?? {};
    const outcomes = allOutcomes?.length ? allOutcomes : matchingOutcomes ?? [];
    return [...outcomes, ...(triggerOutcomes ?? [])];
  };

  const getOutcomeLinkList = (outcome?: TestOutcomesType | null) => {
    const { linkListTitle, linkList } = outcome ?? {};
    if (!linkList?.length) return undefined;
    return {
      title: linkListTitle ?? null,
      links: linkList,
    };
  };

  const visibleOutcomes = getVisibleOutcomes(outcome);
  const linkList = getOutcomeLinkList(outcome);

  return (
    <Layout wrapperSize="sm" hero={hero} isLoading={isLoading}>
      <Watermark right={-80} top={-40} />
      <TestScore points={points} maxPoints={maximumPoints} stars={stars} />

      {visibleOutcomes.map(outcome => (
        <TestOutcome key={outcome.id} {...outcome} />
      ))}

      {!visibleOutcomes.length && (
        <Message content={t('view.test_outcome.no_matching_outcomes')} />
      )}

      <Annotation text={t('annotation.test')} />

      {linkList && <LinkList list={linkList} />}
    </Layout>
  );
});
