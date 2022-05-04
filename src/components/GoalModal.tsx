import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Loader } from 'semantic-ui-react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
// import { getApiErrorMessages } from '../utils/api';
import Modal, { Props as ModalProps } from './Modal';
// import Message from './Message';
// import { useStore } from '../store/storeContext';
import { Goal as GoalType } from '../store/models';
import { Button, TextArea } from './inputs';
import { useStore } from '../store/storeContext';

const Container = styled.div`
  textarea {
    margin: ${p => p.theme.spacing.md} 0;
  }
`;

const Buttons = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  > div {
    display: flex;
    justify-content: space-between;
  }

  button {
    :not(:last-child) {
      margin-right: ${p => p.theme.spacing.md};
    }
  }
`;

interface Props extends ModalProps {
  goalObject?: GoalType;
  setGoalObject: React.Dispatch<React.SetStateAction<GoalType | undefined>>;
}

export const GoalModal: React.FC<Props> = observer(
  ({ goalObject, setGoalObject, ...props }) => {
    const {
      goals: { addGoal, editGoal, markGoalDone, deleteGoal, goalState },
    } = useStore();
    const { t } = useTranslation();

    const addingNewGoal = goalObject && goalObject?.id < 0;

    const [goalDescription, setGoalDescription] = useState('');

    const isBusy = ['CREATING', 'EDITING', 'DELETING'].includes(goalState);

    useEffect(() => {
      setGoalDescription(goalObject?.description ?? '');
    }, [goalObject]);

    const titleKey = addingNewGoal ? 'add_goal' : 'edit_goal';
    const titleText = t(`view.user_goals.${titleKey}`);

    const buttonKey = addingNewGoal
      ? 'action.save'
      : 'view.user_goals.mark_done';
    const buttonText = t(`${buttonKey}`);

    const closeModal = () => {
      !isBusy && setGoalObject(undefined);
    };

    const handleClose = (
      event: React.MouseEvent<HTMLElement, MouseEvent>,
      data: ModalProps
    ) => {
      closeModal();
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (addingNewGoal) {
        await addGoal({ description: goalDescription });
      } else {
        goalObject && (await markGoalDone({ id: goalObject.id }));
      }
      closeModal();
    };

    const handleDelete = async () => {
      goalObject && (await deleteGoal({ id: goalObject.id }));
      closeModal();
    };

    const handleEdit = async () => {
      goalObject &&
        (await editGoal({ id: goalObject.id, description: goalDescription }));
      closeModal();
    };

    return (
      <Modal
        {...props}
        open={!!goalObject}
        onClose={handleClose}
        title={titleText}
        size="small"
        closeButtonType="both"
        closeButtonText={t('action.cancel')}
      >
        <Container>
          <Loader disabled={!isBusy} size="massive" />
          <form className="goals-modal-input" onSubmit={handleSubmit}>
            <TextArea
              id={goalObject?.id ?? -1}
              text={goalObject ? goalObject?.description : ''}
              onChange={(text: string) => setGoalDescription(text)}
              rows={6}
              autoFocus={true}
              placeholder={t('view.user_goals.description_placeholder')}
              variant="outlined"
              maxLength={160}
            />

            <Buttons>
              <div>
                {!addingNewGoal && (
                  <>
                    <Button
                      id="user-goals__edit-button"
                      text={t('view.user_goals.confirm_changes')}
                      type="button"
                      color="grey3"
                      negativeText
                      onClick={handleEdit}
                      disabled={isBusy}
                    />

                    <Button
                      id="user-goals__delete-button"
                      text={t('view.user_goals.delete_goal')}
                      type="button"
                      color="grey3"
                      negativeText
                      onClick={handleDelete}
                      disabled={isBusy}
                    />
                  </>
                )}
              </div>

              <Button
                id="user-goals__submit-button"
                text={buttonText}
                type="submit"
                noMargin
                disabled={isBusy}
              />
            </Buttons>
          </form>
        </Container>
      </Modal>
    );
  }
);

export default GoalModal;
