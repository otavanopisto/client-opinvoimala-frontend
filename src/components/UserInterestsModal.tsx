import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import Modal, { Props as ModalProps } from './Modal';
import styled from 'styled-components';
import { Button } from './inputs';

const Container = styled.div`
  h1 {
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
    :hover {
      text-decoration: underline;
    }
    :not(:last-child) {
      margin-right: ${p => p.theme.spacing.sm};
    }
  }
`;

// useEffect(() => {}, []);

interface Props extends ModalProps {}

export const UserInterestsModal: React.FC<Props> = observer(({ ...props }) => {
  const { t } = useTranslation();

  const [selectedTags, setSelectedTags] = useState([]);

  const isOpen = true;
  const isBusy = false;
  const tags = [
    'tagi',
    'tagi',
    'tagi',
    'tagi',
    'tagi',
    'tagi',
    'tagi',
    'tagi',
    'tagi',
    'tagi',
    'tagi',
    'tagi',
    'tagi',
    'tagi',
    'tagi',
    'tagi',
    'tagi',
    'tagi',
    'tagi',
    'tagi',
    'tagi',
    'tagi',
    'tagi',
    'tagi',
    'tagi',
    'tagi',
  ];

  const handleSelectTag = tag => {
    setSelectedTags(prev => [...prev, tag]);
  };

  const closeModal = () => {};

  const handleClose = (
    event: React.MouseEvent<HTMLElement, MouseEvent>,
    data: ModalProps
  ) => {
    closeModal();
  };

  return (
    <Modal
      {...props}
      open={isOpen}
      onClose={handleClose}
      title="Kiinnostuksen kohteet"
      size="small"
      closeButtonType="both"
      closeButtonText={t('action.cancel')}
    >
      <Container>
        <h1>Poista valittuja</h1>

        <h1>Valitse lisää aihepiirejä</h1>
        <TagList>
          {tags.map((tag, i) => (
            <button key={`${tag}-${i}`}>{tag}</button>
          ))}
        </TagList>
        <div className="user-interests-modal_submit-tags-button">
          <Button
            id="user-interests-modal_submit-tags-button"
            text={t('action.save')}
            type="submit"
            noMargin
            disabled={isBusy}
            onClick={handleSelectTag}
          />
        </div>
      </Container>
    </Modal>
  );
});

export default UserInterestsModal;
