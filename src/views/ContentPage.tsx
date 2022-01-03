import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { observer } from 'mobx-react-lite';
import styled from 'styled-components';
import Layout from '../components/Layout';
import { useParams } from '../routes/hooks';
import { useStore } from '../store/storeContext';
import Watermark from '../components/Layout/Watermark';
import LinkList from '../components/LinkList';
import InnerHtmlDiv from '../components/InnerHtmlDiv';
import { Divider } from 'semantic-ui-react';
import Cards from '../components/Cards';
import { usePageTitle } from '../utils/hooks/usePageTitle';

const StyledInnerHtmlDiv = styled(InnerHtmlDiv)`
  h1 {
    ${p => p.theme.font.h2};
  }
  h2 {
    ${p => p.theme.font.h3};
  }
  h3 {
    ${p => p.theme.font.h4};
  }
  h4 {
    ${p => p.theme.font.h5};
  }
`;

export const ContentPage = observer(() => {
  const { t } = useTranslation();
  const { slug } = useParams();
  const slugRef = useRef<string>();

  const [fetchFailCount, setFetchFailCount] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string>();

  const {
    auth: { openLoginModal, isLoggedIn },
    contentPages: { state, getPage, fetchPage },
  } = useStore();

  const page = getPage(slug);

  const isLoading = state === 'FETCHING';

  usePageTitle({ title: page?.title });

  const fetchPageFromApi = useCallback(
    async (slug: string) => {
      slugRef.current = slug;
      try {
        const pageId = Number(slug);
        if (pageId) {
          // If given slug was number, assume it's an page ID and fetch by it
          await fetchPage({ id: pageId });
        } else {
          // Otherwise fetch by slug
          await fetchPage({ slug });
        }
        setFetchFailCount(0);
      } catch (error: any) {
        setFetchFailCount(fetchFailCount + 1);
        if ([401, 403].includes(error?.statusCode)) {
          setErrorMsg(t('view.content_pages.unauthorized_info'));
          openLoginModal();
        }
      }
    },
    [fetchFailCount, fetchPage, openLoginModal, t]
  );

  useEffect(() => {
    if (fetchFailCount > 2) return;

    if (state === 'UNAUTHORIZED' && slugRef.current === slug) {
      if (isLoggedIn) {
        fetchPageFromApi(slug);
      }
    } else if (!page && slug.length && state !== 'FETCHING') {
      fetchPageFromApi(slug);
    }
  }, [fetchFailCount, fetchPageFromApi, isLoggedIn, page, slug, state]);

  const defaultTitle = errorMsg ? t('view.content_pages.error') : '';

  const hero = {
    title: page?.title ?? defaultTitle,
    lead: page?.lead ?? errorMsg,
  };

  return (
    <Layout wrapperSize="sm" hero={hero} isLoading={isLoading}>
      <Watermark right={-80} top={-40} />

      {page?.content && <StyledInnerHtmlDiv html={page.content} />}

      {page?.cards && (
        <>
          <Divider section hidden aria-hidden="true" />
          <Cards cards={page.cards} columns={3} />
        </>
      )}

      {page?.linkList && <LinkList list={page.linkList} />}
    </Layout>
  );
});
