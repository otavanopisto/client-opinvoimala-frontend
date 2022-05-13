import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Button, Props as ButtonProps } from './inputs';
import Modal from './Modal';

const ConfirmButtons = styled.div`
  margin-top: ${p => p.theme.spacing.lg};
  display: flex;
  align-items: center;
  > button {
    :not(:last-child) {
      margin-right: ${p => p.theme.spacing.lg};
    }
  }
`;

interface Props {
  buttonProps: ButtonProps;
  title?: string;
  onSubmit: () => void;
  submitLabel?: string;
  cancelLabel?: string;
}

const ConfirmDialog: React.FC<Props> = ({
  buttonProps,
  title,
  onSubmit,
  submitLabel,
  cancelLabel,
  children,
}) => {
  const { t } = useTranslation();

  const [isOpen, setIsOpen] = useState(false);

  const toggleDialog = () => setIsOpen(!isOpen);

  return (
    <div>
      <Button {...buttonProps} onClick={toggleDialog} />

      <Modal
        title={title}
        open={isOpen}
        onClose={toggleDialog}
        size="tiny"
        closeOnDimmerClick={false}
      >
        {children}

        <ConfirmButtons>
          <Button
            id="confirm__submit-button"
            text={submitLabel ?? t('action.delete')}
            onClick={onSubmit}
          />
          <Button
            id="confirm__cancel-button"
            text={cancelLabel ?? t('action.cancel')}
            onClick={toggleDialog}
            color="grey3"
            negativeText
          />
        </ConfirmButtons>
      </Modal>
    </div>
  );
};

export default ConfirmDialog;
