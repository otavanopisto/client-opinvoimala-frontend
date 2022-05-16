import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { useStore } from '../store/storeContext';
import Modal, { Props as ModalProps } from './Modal';
import { Button } from './inputs';
import Tag from './Tag';

const Container = styled.div`
  h2 {
    ${p => p.theme.font.h6};
    margin-top: ${p => p.theme.spacing.lg};
  }

  .user-interests-modal_submit-tags-button {
    margin-top: ${p => p.theme.spacing.lg};
  }
`;

const TagList = styled.ul`
  display: flex;
  list-style-type: none;
  padding: 0;
  margin: 0;
`;

interface Props extends ModalProps {}

export const UserInterestsModal: React.FC<Props> = observer(
  ({ tagsModalOpen, setTagsModalOpen, ...props }) => {
    const {
      userInterests: { userInterests, setUserTags },
    } = useStore();

    const { t } = useTranslation();

    const { settings } = useStore();

    const { tags } = settings;

    const initialUserInterestIds = userInterests.map(tag => tag.id);

    const [selectedTags, setSelectedTags] = useState(initialUserInterestIds);

    const handleSelectTag = (id: number) => {
      setSelectedTags(prev => [...prev, id]);
    };

    const handleRemoveTag = (id: number) => {
      setSelectedTags(prev =>
        prev.filter(selectedTagId => id !== selectedTagId)
      );
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      await setUserTags({ tags: selectedTags });
      closeModal();
    };

    const closeModal = () => {
      setTagsModalOpen(false);
    };

    const shownSelectedTags = tags
      .filter(tag => selectedTags.includes(tag.id))
      .map(tag => (
        <Tag
          key={tag.id}
          id={tag.id}
          name={tag.name}
          handleRemove={handleRemoveTag}
        >
          {tag.name}
        </Tag>
      ));

    const tagButtons = tags
      .filter(tag => !selectedTags.includes(tag.id))
      .map(({ id, name }) => (
        <Tag key={id} id={id} name={name} handleClick={handleSelectTag}>
          {name}
        </Tag>
      ));

    return (
      <Modal
        {...props}
        open={tagsModalOpen}
        onClose={closeModal}
        title={t('view.user_interests.form.title')}
        size="small"
        closeButtonType="both"
        closeButtonText={t('action.cancel')}
      >
        <Container>
          <form onSubmit={handleSubmit}>
            <h2>{t('view.user_interests.form.remove_selected_tags')}</h2>
            <TagList>{shownSelectedTags}</TagList>

            <h2>{t('view.user_interests.form.select_more_tags')}</h2>
            <TagList>{tagButtons}</TagList>

            <div className="user-interests-modal_submit-tags-button">
              <Button
                id="user-interests-modal_submit-tags-button"
                text={t('action.save')}
                type="submit"
                noMargin
              />
            </div>
          </form>
        </Container>
      </Modal>
    );
  }
);

export default UserInterestsModal;
