import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import styled from 'styled-components';
import { useStore } from '../store/storeContext';
import Layout from '../components/Layout';
import Card from '../components/Card';
import { Divider, Grid } from 'semantic-ui-react';
import Watermark from '../components/Layout/Watermark';
import InnerHtmlDiv from '../components/InnerHtmlDiv';

const Details = styled(InnerHtmlDiv)`
  p {
    ${p => p.theme.font.size.md}
  }
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

export const FrontPage: React.FC = observer(() => {
  const {
    frontPage: { state, frontPage, fetchFrontPage },
  } = useStore();

  const { details, detailsImage, cards } = frontPage ?? {};

  const isLoading = state === 'NOT_FETCHED' || state === 'FETCHING';

  const hero = {
    title: frontPage?.title,
    lead: frontPage?.lead,
    image: frontPage?.image,
    align: 'center',
  };

  useEffect(() => {
    if (!frontPage && state === 'NOT_FETCHED') {
      fetchFrontPage();
    }
  }, [fetchFrontPage, frontPage, state]);

  return (
    <Layout hero={hero} isLoading={isLoading}>
      <Divider section hidden />

      <Grid columns={4} stackable doubling centered stretched>
        {cards?.map(card => (
          <Grid.Column key={card.id}>
            <Card key={card.id} {...card} />
          </Grid.Column>
        ))}
      </Grid>

      <Divider section hidden />

      <Grid
        stackable
        centered
        reversed="computer tablet mobile"
        style={{ position: 'relative' }}
      >
        <Watermark right={-80} />
        <Watermark bottom={-10} left={-80} />
        <Grid.Row columns={2}>
          {details && (
            <Grid.Column>
              <Details html={details} />
            </Grid.Column>
          )}
          {detailsImage && (
            <Grid.Column>
              <img src={detailsImage.url} alt="" />
            </Grid.Column>
          )}
        </Grid.Row>
      </Grid>
    </Layout>
  );
});
