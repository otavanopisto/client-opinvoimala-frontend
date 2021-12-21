import React from 'react';
import { useTranslation } from 'react-i18next';
import { Icon, Modal as SemanticModal, ModalProps } from 'semantic-ui-react';
import styled from 'styled-components';
import { Button } from './inputs';

const Container = styled.div`
  padding: ${p => p.theme.spacing.xl};
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;

  .modal {
    &__title-text {
      color: ${p => p.theme.color.secondary};
      ${p => p.theme.font.size.lg};
      font-weight: bold;
      font-family: ${p => p.theme.font.secondary};
    }
    &__close-button {
      display: flex;
      align-items: center;
    }
  }
`;

type CloseButtonType = 'icon' | 'text' | 'both' | 'none';

export interface Props extends ModalProps {
  title?: string;
  closeButtonType?: CloseButtonType;
  closeButtonText?: string;
}

const Modal: React.FC<Props> = ({
  title,
  closeButtonType = 'icon',
  closeButtonText,
  size = 'tiny',
  children,
  ...props
}) => {
  const { t } = useTranslation();

  const showIconButton = ['both', 'icon'].includes(closeButtonType);
  const showTextButton = ['both', 'text'].includes(closeButtonType);
  const showCloseButtons = (showIconButton || showTextButton) && props.onClose;

  const closeText = closeButtonText ?? t('action.close');

  const closeButtonProps = {
    negativeText: true,
    isSmall: true,
    noMargin: true,
    onClick: props.onClose as () => void,
  };

  return (
    <SemanticModal {...props} size={size}>
      <Container>
        {title && (
          <SemanticModal.Content>
            <Header>
              <div className="modal__title-text">{title}</div>
              {showCloseButtons && (
                <div className="modal__close-button">
                  {showTextButton && (
                    <Button
                      ariaLabel={t('aria.close')}
                      id="close-modal-text-button"
                      text={closeText}
                      color="background"
                      {...closeButtonProps}
                    />
                  )}
                  {showIconButton && (
                    <Button
                      ariaLabel={t('aria.close')}
                      id="close-modal-icon-button"
                      icon={<Icon name="close" size="large" />}
                      color="grey3"
                      {...closeButtonProps}
                    />
                  )}
                </div>
              )}
            </Header>
          </SemanticModal.Content>
        )}

        <SemanticModal.Content>
          <main>{children}</main>
        </SemanticModal.Content>
      </Container>
    </SemanticModal>
  );
};

export default Modal;
