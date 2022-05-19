import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
import { Divider, Grid, Icon as SemanticIcon } from 'semantic-ui-react';
import { useTranslation } from 'react-i18next';
import { useStore } from '../store/storeContext';
import { useWindowDimensions } from '../utils/hooks';
import { Button } from './inputs';
import UserTagsModal from './UserTagsModal';
import { Carousel } from './Carousel';
import Card from './Card';
import UserTagsDrawer from './UserTagsDrawer';

export const UserInterests: React.FC = observer(() => {
  const {
    userInterests: { fetchUserInterests, state, userInterests },
    auth: { userData },
  } = useStore();

  const [tagsFormOpen, setTagsFormOpen] = useState(false);

  const { t } = useTranslation();

  useEffect(() => {
    if (!['FETCHED', 'FETCHING', 'ERROR'].includes(state)) {
      fetchUserInterests();
    }
  }, [fetchUserInterests, state]);

  useEffect(() => {
    fetchUserInterests();
  }, [userData, fetchUserInterests]);

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

  const openTagsModal = () => {
    setTagsFormOpen(true);
  };

  const { isTablet } = useWindowDimensions();

  const columns = isTablet ? 1 : 3;

  return (
    <section>
      <Carousel
        title={t('view.user_tags.title')}
        elements={carouselElements}
        columns={columns}
      />
      {userInterests.length === 0 && (
        <div>{t('view.user_tags.no_tags_chosen')}</div>
      )}

      <Divider hidden aria-hidden="true" />
      <Button
        id="user-interests__set-tags-button"
        text={t('view.user_tags.choose_tags')}
        color="primary"
        icon={<SemanticIcon name="plus square outline" size="large" />}
        onClick={openTagsModal}
      />
      {isTablet ? (
        <UserTagsDrawer
          tagsFormOpen={tagsFormOpen}
          setTagsFormOpen={setTagsFormOpen}
        />
      ) : (
        <UserTagsModal
          tagsFormOpen={tagsFormOpen}
          setTagsFormOpen={setTagsFormOpen}
        />
      )}
    </section>
  );
});
