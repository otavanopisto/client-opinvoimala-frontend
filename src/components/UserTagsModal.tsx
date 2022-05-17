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

export const UserTagsModal: React.FC<Props> = observer(
  ({ tagsModalOpen, setTagsModalOpen, ...props }) => {
    const {
      settings: { tags },
      auth: { user, setUserTags },
    } = useStore();

    const { t } = useTranslation();

    const initialUserTagIds = user ? user.tags.map(tag => tag.id) : [];

    const [selectedTags, setSelectedTags] = useState(initialUserTagIds);

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
      // await fetchUserInterests();
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
          handleRemove={() => handleRemoveTag(tag.id)}
        >
          {tag.name}
        </Tag>
      ));

    const tagButtons = tags
      .filter(tag => !selectedTags.includes(tag.id))
      .map(({ id, name }) => (
        <Tag
          key={id}
          id={id}
          name={name}
          handleClick={() => handleSelectTag(id)}
        >
          {name}
        </Tag>
      ));

    return (
      <Modal
        {...props}
        open={tagsModalOpen}
        onClose={closeModal}
        title={t('view.user_tags.form.title')}
        size="small"
        closeButtonType="both"
        closeButtonText={t('action.cancel')}
      >
        <Container>
          <form onSubmit={handleSubmit}>
            <h2>{t('view.user_tags.form.remove_tags')}</h2>
            <TagList>{shownSelectedTags}</TagList>

            <h2>{t('view.user_tags.form.add_tags')}</h2>
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

export default UserTagsModal;
