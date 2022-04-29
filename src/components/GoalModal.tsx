import React from 'react';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
// import { Loader, Transition } from 'semantic-ui-react';
import styled from 'styled-components';
// import { getApiErrorMessages } from '../utils/api';
import Modal, { Props as ModalProps } from './Modal';
// import Message from './Message';
// import { useStore } from '../store/storeContext';
import { Goal as GoalType } from '../store/models';
import { Button, Input } from './inputs';

const Container = styled.div``;

interface Props extends ModalProps {
  goalObject?: GoalType;
  setGoalObject: React.Dispatch<React.SetStateAction<GoalType | undefined>>;
}

export const GoalModal: React.FC<Props> = observer(
  ({ goalObject, setGoalObject, ...props }) => {
    const { t } = useTranslation();

    const addingNewGoal = goalObject && goalObject?.id < 0;

    const titleText = addingNewGoal
      ? t('view.user_goals.modal_title_add_goal')
      : t('view.user_goals.modal_title_edit_goal');

    const buttonText = addingNewGoal
      ? t('view.user_goals.modal_button_add_goal_save')
      : t('view.user_goals.modal_button_edit_goal_save');

    const inputValue = addingNewGoal ? '' : goalObject?.description;

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

    const handleClose = (
      event: React.MouseEvent<HTMLElement, MouseEvent>,
      data: ModalProps
    ) => {
      setGoalObject(undefined);
    };

    const handleSubmit = () => {};

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
          <form onSubmit={handleSubmit}>
            <Input value={inputValue} />
          </form>

          <Button
            id="login-modal__login-button"
            text={buttonText}
            type="submit"
            noMargin
          />

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
