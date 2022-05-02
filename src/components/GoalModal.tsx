import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
// import { Loader, Transition } from 'semantic-ui-react';
import styled from 'styled-components';
// import { getApiErrorMessages } from '../utils/api';
import Modal, { Props as ModalProps } from './Modal';
// import Message from './Message';
// import { useStore } from '../store/storeContext';
import { Goal as GoalType } from '../store/models';
import { Button, TextArea } from './inputs';
import { useStore } from '../store/storeContext';

const Container = styled.div`
  display: flex;
  .goals-modal-input {
  }
`;

interface Props extends ModalProps {
  goalObject?: GoalType;
  setGoalObject: React.Dispatch<React.SetStateAction<GoalType | undefined>>;
}

export const GoalModal: React.FC<Props> = observer(
  ({ goalObject, setGoalObject, ...props }) => {
    const {
      goals: {
        // addGoal,
        // editGoal,
        markGoalDone,
        // deleteGoal,
        // state,
      },
    } = useStore();
    const { t } = useTranslation();

    const addingNewGoal = goalObject && goalObject?.id < 0;

    const [goalDescription, setGoalDescription] = useState('');

    useEffect(() => {
      goalObject &&
        !addingNewGoal &&
        setGoalDescription(goalObject?.description);
    }, [addingNewGoal, goalObject]);

    const titleKey = addingNewGoal ? 'add_goal' : 'edit_goal';
    const titleText = t(`view.user_goals.${titleKey}`);

    const buttonKey = addingNewGoal
      ? 'action.save'
      : 'view.user_goals.mark_done';
    const buttonText = t(`${buttonKey}`);

    // const {
    //   auth: { state },
    // } = useStore();

    // const [errorMsgs, setErrorMsgs] = useState<string[]>([]);
    // const [success, setSuccess] = useState<boolean>();

    // const isBusy = state === 'PROCESSING';

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

    const closeModal = () => {
      setGoalObject(undefined);
    };

    const handleClose = (
      event: React.MouseEvent<HTMLElement, MouseEvent>,
      data: ModalProps
    ) => {
      closeModal();
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (goalObject) {
        markGoalDone({ id: goalObject.id });
        closeModal();
      }
    };

    return (
      <Container>
        <Modal
          {...props}
          open={!!goalObject}
          onClose={handleClose}
          closeButtonType="icon"
          title={titleText}
          size="small"
        >
          <div className="goals-modal-input">
            <form className="goals-modal-input" onSubmit={handleSubmit}>
              <TextArea
                id={goalObject?.id ?? -1}
                text={goalDescription}
                onChange={(text: string) => setGoalDescription(text)}
                rows={10}
              />

              <Button
                id={'user-goals__submit-button'}
                text={buttonText}
                type="submit"
                noMargin
              />
            </form>
          </div>

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
        </Modal>
      </Container>
    );
  }
);

export default GoalModal;
