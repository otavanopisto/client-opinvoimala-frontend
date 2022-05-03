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

const Container = styled.div``;

const Buttons = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  div {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-top: ${p => p.theme.spacing.md};
  }
`;

interface Props extends ModalProps {
  goalObject?: GoalType;
  setGoalObject: React.Dispatch<React.SetStateAction<GoalType | undefined>>;
}

export const GoalModal: React.FC<Props> = observer(
  ({ goalObject, setGoalObject, ...props }) => {
    const {
      goals: { addGoal, editGoal, markGoalDone, deleteGoal },
    } = useStore();
    const { t } = useTranslation();

    const addingNewGoal = goalObject && goalObject?.id < 0;

    const [goalDescription, setGoalDescription] = useState('');

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
      if (addingNewGoal) {
        addGoal({ description: goalDescription });
      } else {
        goalObject && markGoalDone({ id: goalObject.id });
      }
      closeModal();
    };

    const handleDelete = () => {
      goalObject && deleteGoal({ id: goalObject.id });
      closeModal();
    };

    const handleEdit = () => {
      goalObject &&
        editGoal({ id: goalObject.id, description: goalDescription });
      closeModal();
    };

    return (
      <Container>
        <Modal
          {...props}
          open={!!goalObject}
          onClose={handleClose}
          title={titleText}
          size="small"
          closeButtonType="both"
          closeButtonText={t('action.cancel')}
        >
          <div className="goals-modal-textarea">
            <form className="goals-modal-input" onSubmit={handleSubmit}>
              <TextArea
                id={goalObject?.id ?? -1}
                text={goalObject ? goalObject?.description : ''}
                onChange={(text: string) => setGoalDescription(text)}
                rows={10}
                autoFocus={true}
                placeholder={t('view.user_goals.description_placeholder')}
                variant="outlined"
              />

              <Buttons>
                <div>
                  {!addingNewGoal && (
                    <div>
                      <Button
                        id="user-goals__edit-button"
                        text={t('view.user_goals.confirm_changes')}
                        type="button"
                        color="grey3"
                        negativeText
                        onClick={handleEdit}
                      />

                      <Button
                        id="user-goals__delete-button"
                        text={t('view.user_goals.delete_goal')}
                        type="button"
                        color="grey3"
                        negativeText
                        onClick={handleDelete}
                      />
                    </div>
                  )}
                </div>

                <Button
                  id="user-goals__submit-button"
                  text={buttonText}
                  type="submit"
                  noMargin
                />
              </Buttons>
            </form>
          </div>
        </Modal>
      </Container>
    );
  }
);

export default GoalModal;
