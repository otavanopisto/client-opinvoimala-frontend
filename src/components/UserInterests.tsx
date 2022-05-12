import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
import { Divider, Icon as SemanticIcon } from 'semantic-ui-react';
import { Grid } from 'semantic-ui-react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { useStore } from '../store/storeContext';
import { Button } from './inputs';
import Card from './Card';

const StyledGrid = styled(Grid)`
  @media ${p => p.theme.breakpoint.mobile} {
    &.ui.grid > .column:not(.row) {
      padding-left: 0 !important;
      padding-right: 0 !important;
    }
  }
`;

export const UserInterests: React.FC = observer(() => {
  const {
    userInterests: { fetchUserInterests, state, userInterests },
  } = useStore();

  const { t } = useTranslation();

  const [firstItem, setFirstItem] = useState(0);
  const [lastItem, setLastItem] = useState(3);

  useEffect(() => {
    if (!['FETCHED', 'FETCHING', 'ERROR'].includes(state)) {
      fetchUserInterests();
    }
  }, [fetchUserInterests, state]);

  const visibleItems = userInterests.slice(firstItem, lastItem);

  const handleShowPrevious = () => {
    setFirstItem(prev => prev - 3);
    setLastItem(prev => prev - 3);
  };

  const handleShowNext = () => {
    setFirstItem(prev => prev + 3);
    setLastItem(prev => prev + 3);
  };

  const handleSetTags = () => {};

  return (
    <section>
      <h2>{t('view.user_interests.title')}</h2>
      <Button
        id="user-interests__show-previous-button"
        text={'<-'}
        color="primary"
        onClick={handleShowPrevious}
      />
      <Button
        id="user-interests__show-next-button"
        text={'->'}
        color="primary"
        onClick={handleShowNext}
      />
      <StyledGrid columns={3} stackable doubling stretched>
        {visibleItems.map(interest => (
          <Grid.Column key={interest.id}>
            <Card
              title={interest.title}
              text={interest.description}
              tags={interest.tags}
            />
          </Grid.Column>
        ))}
      </StyledGrid>
      <Divider hidden aria-hidden="true" />
      <Button
        id="user-interests__set-tags-button"
        text={t('view.user_interests.set_tags')}
        color="primary"
        icon={<SemanticIcon name="plus square outline" size="large" />}
        onClick={handleSetTags}
      />
    </section>
  );
});
