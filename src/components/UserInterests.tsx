import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
import { Divider, Grid, Icon as SemanticIcon } from 'semantic-ui-react';
import { useTranslation } from 'react-i18next';
import { useStore } from '../store/storeContext';
import { Button } from './inputs';
import UserTagsModal from './UserTagsModal';
import { Carousel } from './Carousel';
import Card from './Card';

export const UserInterests: React.FC = observer(() => {
  const {
    userInterests: { fetchUserInterests, state, userInterests },
  } = useStore();

  const [tagsModalOpen, setTagsModalOpen] = useState(false);

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

  const openTagsModal = () => {
    setTagsModalOpen(true);
  };

  return (
    <section>
      <Carousel title={t('view.user_tags.title')} elements={carouselElements} />
      {userInterests.length === 0 && (
        <div>{t('view.user_interests.no_tags_chosen')}</div>
      )}
      <Divider hidden aria-hidden="true" />
      <Button
        id="user-interests__set-tags-button"
        text={t('view.user_tags.choose_tags')}
        color="primary"
        icon={<SemanticIcon name="plus square outline" size="large" />}
        onClick={openTagsModal}
      />
      <UserTagsModal
        tagsModalOpen={tagsModalOpen}
        setTagsModalOpen={setTagsModalOpen}
      />
    </section>
  );
});
