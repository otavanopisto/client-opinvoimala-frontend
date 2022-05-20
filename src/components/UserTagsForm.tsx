import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import styled from 'styled-components';
import { Loader, Transition } from 'semantic-ui-react';
import { useTranslation } from 'react-i18next';
import { useStore } from '../store/storeContext';
import { Button } from './inputs';
import Tag from './Tag';
import Message from './Message';

const Container = styled.div`
  h2 {
    ${p => p.theme.font.h6};
    margin-top: ${p => p.theme.spacing.lg};
  }

  .user-interests-form_submit-tags-button {
    margin-top: ${p => p.theme.spacing.md};
  }

  .error-message {
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
  tagsFormOpen: boolean;
}

export const UserTagsForm: React.FC<Props> = observer(
  ({ closeForm, tagsFormOpen, ...props }) => {
    const {
      settings: { tags },
      auth: { user, setUserTags, state },
    } = useStore();

    const { t } = useTranslation();

    const initialUserTagIds = user ? user.tags.map(tag => tag.id) : [];

    const [selectedTags, setSelectedTags] = useState(initialUserTagIds);
    const [error, setError] = useState(false);

    const isBusy = ['PROCESSING'].includes(state);

    useEffect(() => setError(false), [tagsFormOpen]);

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
      handleActionResponse(await setUserTags({ tags: selectedTags }));
    };

    const handleActionResponse = ({ success }: { success: boolean }) => {
      if (success) closeForm();
      else setError(true);
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
        <Loader disabled={!isBusy} size="massive" />
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

          <Transition.Group>
            {error && (
              <div className="error-message">
                <Message
                  error
                  icon="warning sign"
                  header={t('error.unknown_error')}
                />
              </div>
            )}
          </Transition.Group>

          <div className="user-interests-form_submit-tags-button">
            <Button
              id="user-interests-form_submit-tags-button"
              text={t('action.save')}
              type="submit"
              disabled={isBusy}
              noMargin
            />
          </div>
        </form>
      </Container>
    );
  }
);

export default UserTagsForm;
