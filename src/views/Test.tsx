import React, { useCallback, useEffect, useRef, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import Layout from '../components/Layout';
import { useParams } from '../routes/hooks';
import { useStore } from '../store/storeContext';

export const Test: React.FC = observer(() => {
  const { t } = useTranslation();
  const { slug } = useParams();
  const slugRef = useRef<string>();

  const [fetchFailCount, setFetchFailCount] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string>();

  const {
    auth: { openLoginModal, isLoggedIn },
    tests: { testState, getTest, fetchTest },
  } = useStore();

  const test = getTest(slug);

  const isBusy = testState === 'FETCHING';

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

  const defaultTitle = errorMsg ? t('view.tests.error') : '';

  const hero = {
    title: test?.name ?? defaultTitle,
    lead: test?.description ?? errorMsg,
  };

  return (
    <Layout wrapperSize="sm" hero={hero} isLoading={isBusy}>
      <div>TODO</div>
    </Layout>
  );
});
