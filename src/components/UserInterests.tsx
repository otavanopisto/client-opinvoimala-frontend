import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import { Divider, Grid, Icon as SemanticIcon } from 'semantic-ui-react';
import { useTranslation } from 'react-i18next';
import { useStore } from '../store/storeContext';
import { Button } from './inputs';
import { Carousel } from './Carousel';
import Card from './Card';

export const UserInterests: React.FC = observer(() => {
  const {
    userInterests: { fetchUserInterests, state, userInterests },
  } = useStore();

  const { t } = useTranslation();

  useEffect(() => {
    if (!['FETCHED', 'FETCHING', 'ERROR'].includes(state)) {
      fetchUserInterests();
    }
  }, [fetchUserInterests, state]);

  const carouselElements = userInterests.map(interest => (
    <Grid.Column key={`interest-${interest.type}-${interest.id}`}>
      <Card
        title={interest.title}
        text={interest.description}
        tags={interest.tags}
        link={interest.link}
      />
    </Grid.Column>
  ));

  const handleSetTags = () => {};

  return (
    <section>
      <Carousel
        title={t('view.user_interests.title')}
        elements={carouselElements}
      />
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
