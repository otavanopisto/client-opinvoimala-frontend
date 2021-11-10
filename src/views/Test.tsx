import React, { useCallback, useEffect, useRef, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import Layout from '../components/Layout';
import { useParams } from '../routes/hooks';
import { useStore } from '../store/storeContext';
import { useHistory } from 'react-router';
import { path } from '../routes/routes';
import Annotation from '../components/Annotation';
import { PointOption, Question, SuitabilityOption } from '../store/models';
import TestQuestion from '../components/tests/TestQuestion';
import { Button } from '../components/inputs';
import Storage from '../services/storage';
import useWindowDimensions from '../utils/hooks';

const TestControls = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: ${p => p.theme.spacing.lg} 0;

  @media ${p => p.theme.breakpoint.mobile} {
    flex-direction: column-reverse;
    button {
      width: 100%;
    }
  }
`;

interface TestAnswer {
  question: Question;
  answer?: PointOption | SuitabilityOption | null;
}

interface TestProgress {
  slug: string;
  currentQuestion?: number;
  answers: TestAnswer[];
}

const getStorageTests = () => Storage.read({ key: 'TESTS_IN_PROGRESS' });

const getTestFromStorage = (slug?: string | null): TestProgress | undefined => {
  const storageTests = getStorageTests();
  return storageTests && slug ? storageTests[slug] : undefined;
};

const saveTestToStorage = (newTest: TestProgress) => {
  const storageTests = getStorageTests();
  Storage.write({
    key: 'TESTS_IN_PROGRESS',
    value: { ...storageTests, [newTest.slug]: newTest },
  });
};

const clearTestFromStorage = (slug: string) => {
  const storageTests = getStorageTests();
  delete storageTests[slug];
  Storage.write({ key: 'TESTS_IN_PROGRESS', value: storageTests });
};

const getInitialAnswersArray = (questions?: Question[] | null) => {
  return questions?.map(question => ({ question, answer: null })) ?? [];
};

export const Test: React.FC = observer(() => {
  const { t } = useTranslation();
  const history = useHistory();
  const { slug } = useParams();
  const slugRef = useRef<string>();
  const { isMobile } = useWindowDimensions();

  const {
    auth: { openLoginModal, isLoggedIn },
    tests: { testState, getTest, fetchTest },
  } = useStore();

  const test = getTest(slug);

  const { name, description, categories = [] } = test ?? {};

  const isBusy = testState === 'FETCHING';

  const [fetchFailCount, setFetchFailCount] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string>();

  const [testProgress, setTestProgress] = useState<TestProgress>({
    slug,
    currentQuestion: undefined,
    answers: [],
  });

  /**
   * Set new test progress when test changed.
   * Checks is test is already stored in session storage,
   * and if not, sets initial state to start test from the begin.
   */
  useEffect(() => {
    if (test) {
      const testFromStorage = getTestFromStorage(test.slug);
      if (testFromStorage) {
        setTestProgress(testFromStorage);
      } else {
        setTestProgress(currentProgress => ({
          ...currentProgress,
          currentQuestion: 0,
          answers: getInitialAnswersArray(test.questions),
        }));
      }
    }
  }, [test]);

  const fetchTestFromApi = useCallback(
    async (slug: string) => {
      slugRef.current = slug;
      try {
        const testId = Number(slug);
        if (testId) {
          // If given slug was number, assume it's an test ID and fetch by it
          await fetchTest({ id: testId });
        } else {
          // Otherwise fetch by slug
          await fetchTest({ slug });
        }
        setFetchFailCount(0);
      } catch (error: any) {
        setFetchFailCount(fetchFailCount + 1);
        if ([401, 403].includes(error?.statusCode)) {
          setErrorMsg(t('view.tests.unauthorized_info'));
          openLoginModal();
        }
      }
    },
    [fetchFailCount, fetchTest, openLoginModal, t]
  );

  /**
   * Fetch test from API when slug (etc) did change (and test not found from store)
   */
  useEffect(() => {
    if (fetchFailCount > 2) return;

    if (testState === 'UNAUTHORIZED' && slugRef.current === slug) {
      if (isLoggedIn) {
        fetchTestFromApi(slug);
      }
    } else if (!test && slug.length && testState !== 'FETCHING') {
      fetchTestFromApi(slug);
    }
  }, [fetchFailCount, fetchTestFromApi, isLoggedIn, test, slug, testState]);

  const handleTestCompleted = () => {
    console.log('TODO: Test is now completed, show results!');
    clearTestFromStorage(testProgress.slug);
  };

  const setCurrentQuestion = (currentQuestion: number) => {
    const updatedTestProgress = { ...testProgress, currentQuestion };
    setTestProgress(updatedTestProgress);
    saveTestToStorage(updatedTestProgress);
  };

  const changeQuestion = (direction: 'previous' | 'next') => {
    const { currentQuestion } = testProgress;

    if (currentQuestion === undefined) return;

    switch (direction) {
      case 'previous':
        if (currentQuestion > 0) setCurrentQuestion(currentQuestion - 1);
        return;
      case 'next':
        if (currentQuestion + 1 < testProgress.answers.length)
          setCurrentQuestion(currentQuestion + 1);
        return;
      default:
        return;
    }
  };

  const defaultTitle = errorMsg ? t('view.tests.error') : '';

  const hero = {
    title: name ?? defaultTitle,
    lead: description ?? errorMsg,
    goBackText: t('route.tests'),
    onGoBackClick: () => history.push(`/${path('tests')}`),
    image: categories[0]?.image,
    smallImage: true,
  };

  const getCurrentQuestion = (index?: number) => {
    if (index !== undefined && index < testProgress.answers.length)
      return testProgress.answers[index].question;
  };

  const getProgressText = () => {
    const current = (testProgress.currentQuestion ?? 0) + 1;
    const total = testProgress.answers.length;
    return t('view.test.progressText', { current, total });
  };

  const currentQuestion = getCurrentQuestion(testProgress.currentQuestion);

  const isFinalQuestion =
    testProgress.currentQuestion !== undefined &&
    testProgress.currentQuestion >= testProgress.answers.length - 1;

  return (
    <Layout wrapperSize="sm" hero={hero} isLoading={isBusy}>
      {currentQuestion && <TestQuestion question={currentQuestion} />}

      <TestControls>
        <Button
          id="test-controls__back-button"
          text={t('action.previous')}
          color="grey3"
          negativeText
          onClick={() => changeQuestion('previous')}
          hidden={!testProgress.currentQuestion}
        />
        {!isMobile && <div>{getProgressText()}</div>}
        {isFinalQuestion ? (
          <Button
            id="test-controls__submit-button"
            text={t('action.show_result')}
            onClick={handleTestCompleted}
          />
        ) : (
          <Button
            id="test-controls__next-button"
            text={t('action.continue')}
            onClick={() => changeQuestion('next')}
          />
        )}
        {isMobile && <div>{getProgressText()}</div>}
      </TestControls>

      <Annotation text={t('annotation.test')} />
    </Layout>
  );
});
