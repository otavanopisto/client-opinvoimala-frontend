import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import Modal, { Props as ModalProps } from './Modal';
import styled from 'styled-components';
import { Button } from './inputs';
import { useStore } from '../store/storeContext';

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
  list-style-type: none;
  padding: 0;
  margin: 0;

  button {
    padding: 0 ${p => p.theme.spacing.md};
    background-color: ${p => p.theme.color.grey3};
    border-radius: ${p => p.theme.borderRadius.sm};
    margin-bottom: ${p => p.theme.spacing.md};
    color: ${p => p.theme.color.secondary};
    font-family: ${p => p.theme.font.secondary};
    ${p => p.theme.font.size.xs};
    cursor: pointer;
    border: 1px solid transparent;
    :hover {
      border: 1px solid ${p => p.theme.color.secondary};
    }

    :not(:last-child) {
      margin-right: ${p => p.theme.spacing.sm};
    }
  }
`;

// useEffect(() => {}, []);

interface Props extends ModalProps {
  tagsModalOpen: boolean;
}

export const UserInterestsModal: React.FC<Props> = observer(
  ({ tagsModalOpen, setTagsModalOpen, ...props }) => {
    const { t } = useTranslation();

    const { settings } = useStore();

    const { tags } = settings;

    const [selectedTags, setSelectedTags] = useState<number[]>();

    const isBusy = false;

    // const handleSelectTag = tag => {
    //   setSelectedTags(prev => [...prev, tag]);
    // };

    const handleClose = (
      event: React.MouseEvent<HTMLElement, MouseEvent>,
      data: ModalProps
    ) => {
      setTagsModalOpen(false);
    };

    return (
      <Modal
        {...props}
        open={tagsModalOpen}
        onClose={handleClose}
        title={t('view.user_interests.form.title')}
        size="small"
        closeButtonType="both"
        closeButtonText={t('action.cancel')}
      >
        <Container>
          <h2>{t('view.user_interests.form.select_more_tags')}</h2>

          <h2>{t('view.user_interests.form.remove_selected_tags')}</h2>
          <TagList>
            {tags.map(({ id, name }) => (
              <button key={id}>{name}</button>
            ))}
          </TagList>
          <div className="user-interests-modal_submit-tags-button">
            <Button
              id="user-interests-modal_submit-tags-button"
              text={t('action.save')}
              type="submit"
              noMargin
              disabled={isBusy}
              //  onClick={handleSubmit}
            />
          </div>
        </Container>
      </Modal>
    );
  }
);

export default UserInterestsModal;
