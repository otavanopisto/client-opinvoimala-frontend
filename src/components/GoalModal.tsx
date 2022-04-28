import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
// import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
// import { Loader, Transition } from 'semantic-ui-react';
import styled from 'styled-components';
// import { getApiErrorMessages } from '../utils/api';
// import { Button } from './inputs';
import Modal, { Props as ModalProps } from './Modal';
// import Message from './Message';
import { useStore } from '../store/storeContext';
import { Goal as GoalType } from '../store/models';

// const LOGOUT_TIMER = 3; // seconds

const Container = styled.div`
  .delete-account {
    &__info-text {
      margin: ${p => p.theme.spacing.xl} 0;
    }
  }

  button {
    width: 100%;
  }
`;

interface Props extends ModalProps {
  goalObject: GoalType;
}

export const GoalModal: React.FC<Props> = observer(
  ({ goalObject, setGoalObject, ...props }) => {
    const [openModal, setOpenModal] = useState<boolean>(false);
    useEffect(() => {
      if (goalObject) setOpenModal(true);
    }, [goalObject]);

    // const { t } = useTranslation();
    // // const history = useHistory();

    // const {
    //   auth: { state },
    // } = useStore();

    // const [errorMsgs, setErrorMsgs] = useState<string[]>([]);
    // const [success, setSuccess] = useState<boolean>();

    // const isBusy = state === 'PROCESSING';

    /** Start logout timer when account was successfully deleted */

    // const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    //   event.preventDefault();
    //   if (!isBusy) {
    //     setErrorMsgs([]);

    //     const { success, error } = await deleteAccount();

    //     if (success) {
    //       setSuccess(true);
    //       setTimeout(() => {
    //         // Logout after showing success message to user:
    //         logout();
    //         history.push('/');
    //       }, LOGOUT_TIMER * 1000 + 500);
    //     } else {
    //       setErrorMsgs(getApiErrorMessages(error?.data));
    //     }
    //   }
    // };

    const handleClose = (
      event: React.MouseEvent<HTMLElement, MouseEvent>,
      data: ModalProps
    ) => {
      setGoalObject();
      setOpenModal(false);

      // Modal should not close if account was just deleted .
      // A success message is show for the user for a few seconds
      // and user is automatically logged out after that.
      //   if (!success) {
      //     setErrorMsgs([]);
      //     if (onClose) onClose(event, data);
      //   }
    };

    return (
      <Modal
        {...props}
        open={openModal}
        onClose={handleClose}
        closeButtonType="icon"
        title={'Muokkaa tavoitetta'}
        size="small"
      >
        <Container>
          {goalObject.description}
          {/* <form onSubmit={handleSubmit}>
            <Loader disabled={!isBusy} size="massive" />

            {!success && <p>{t('view.delete_account.info_text')}</p>}

            <Transition.Group>
              {!!errorMsgs.length && (
                <div>
                  <Message
                    error
                    header={t('view.delete_account.error_message_header')}
                    list={errorMsgs}
                  />
                </div>
              )}
            </Transition.Group>

            <Transition.Group>
              {success && (
                <div>
                  <Message
                    success
                    header={t('view.delete_account.success_message')}
                    list={[
                      t('view.delete_account.logging_out', {
                        seconds: logoutTimer,
                      }),
                    ]}
                  />
                </div>
              )}
            </Transition.Group>

            {!success && (
              <Button
                id="delete-account__delete-button"
                text={t('view.delete_account.title')}
                type="submit"
                color="accent"
                disabled={isBusy}
                autoFocus
                noMargin
              />
            )}
          </form> */}
        </Container>
      </Modal>
    );
  }
);

export default GoalModal;
