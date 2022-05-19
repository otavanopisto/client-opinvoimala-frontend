import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { useStore } from '../store/storeContext';
import { Button } from './inputs';
import Tag from './Tag';

const Container = styled.div`
  h2 {
    ${p => p.theme.font.h6};
    margin-top: ${p => p.theme.spacing.lg};
  }

  .user-interests-form_submit-tags-button {
    margin-top: ${p => p.theme.spacing.lg};
  }
`;

const TagList = styled.ul`
  display: flex;
  list-style-type: none;
  padding: 0;
  margin: 0;
`;

interface Props {
  closeForm: () => void;
}

export const UserTagsForm: React.FC<Props> = observer(
  ({ closeForm, ...props }) => {
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
      closeForm();
    };

    const shownSelectedTags = tags
      .filter(tag => selectedTags.includes(tag.id))
      .map(tag => (
        <Tag
          key={tag.id}
          name={tag.name}
          handleRemove={() => handleRemoveTag(tag.id)}
        >
          {tag.name}
        </Tag>
      ));

    const tagButtons = tags
      .filter(tag => !selectedTags.includes(tag.id))
      .map(({ id, name }) => (
        <Tag key={id} name={name} handleClick={() => handleSelectTag(id)}>
          {name}
        </Tag>
      ));

    return (
      <Container>
        <form onSubmit={handleSubmit}>
          <h2>{t('view.user_tags.form.remove_tags')}</h2>

          {shownSelectedTags.length > 0 ? (
            <TagList>{shownSelectedTags}</TagList>
          ) : (
            <div>{t('view.user_tags.no_tags_chosen')}</div>
          )}

          <h2>{t('view.user_tags.form.add_tags')}</h2>

          {tagButtons.length > 0 ? (
            <TagList>{tagButtons}</TagList>
          ) : (
            <div>{t('view.user_tags.all_tags_chosen')}</div>
          )}

          <div className="user-interests-form_submit-tags-button">
            <Button
              id="user-interests-form_submit-tags-button"
              text={t('action.save')}
              type="submit"
              noMargin
            />
          </div>
        </form>
      </Container>
    );
  }
);

export default UserTagsForm;
