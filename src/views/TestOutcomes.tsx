import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { observer } from 'mobx-react-lite';
import { useHistory } from 'react-router';
import { Divider } from 'semantic-ui-react';
import Layout from '../components/Layout';
import { useParams } from '../routes/hooks';
import { useStore } from '../store/storeContext';
import Watermark from '../components/Layout/Watermark';
import { path, rt } from '../routes/routes';
import TestScore from '../components/tests/TestScore';
import TestOutcome from '../components/tests/TestOutcome';
import Annotation from '../components/Annotation';
import Message from '../components/Message';
import { TestOutcomes as TestOutcomesType } from '../store/models';
import LinkList from '../components/LinkList';
import { usePageTitle } from '../utils/hooks/usePageTitle';
import NoPrint from '../components/NoPrint';
import Feedback from '../components/Feedback';

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
  const isTest = test?.type === 'test';

  const pageTitle = test?.name ? `${test.name}, ${rt('outcome')}` : undefined;

  usePageTitle({ title: pageTitle });

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
    goBackText: t('route.tests'),
    onGoBackClick: () => history.push(`/${path('tests')}`),
    showDownload: true,
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
      <Watermark right={-80} top={-40} showOnlyOnScreensAbove={1400} />
      <TestScore points={points} maxPoints={maximumPoints} stars={stars} />
      {visibleOutcomes.map(outcome => (
        <TestOutcome key={outcome.id} {...outcome} />
      ))}
      {!visibleOutcomes.length && (
        <Message content={t('view.test_outcome.no_matching_outcomes')} />
      )}
      {isTest && <Annotation text={t('annotation.test')} />}
      {linkList && (
        <NoPrint>
          <LinkList list={linkList} initialItemCount={5} />
        </NoPrint>
      )}

      {test?.feedback && test.feedback.showFeedback && (
        <>
          <Divider section hidden aria-hidden="true" />
          <Feedback
            pageId={test.id}
            feedback={test.feedback}
            slug={slug}
            contentType="test"
          />
        </>
      )}
    </Layout>
  );
});

export default TestOutcomes;
