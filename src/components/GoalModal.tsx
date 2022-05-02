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
  textarea {resize: none}
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
      if (addingNewGoal) {
        addGoal({ description: goalDescription });
      } else {
        addingNewGoal && markGoalDone({ id: goalObject.id });
        closeModal();
      }
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
          closeButtonType="icon"
          title={titleText}
          size="small"
        >
          <div className="goals-modal-textarea">
            <form className="goals-modal-input" onSubmit={handleSubmit}>
              <TextArea
                id={goalObject?.id ?? -1}
                text={goalObject ? goalObject?.description : ''}
                onChange={(text: string) => setGoalDescription(text)}
                rows={10}
                autoFocus={true}
              />
              {!addingNewGoal && (
                <>
                  <Button
                    id={'user-goals__edit-button'}
                    text={t('view.user_goals.confirm_changes')}
                    type="button"
                    color="grey3"
                    negativeText
                    onClick={handleEdit}
                  />

                  <Button
                    id={'user-goals__delete-button'}
                    text={t('view.user_goals.delete_goal')}
                    type="button"
                    color="grey3"
                    negativeText
                    onClick={handleDelete}
                  />
                </>
              )}

              <Button
                id={'user-goals__submit-button'}
                text={buttonText}
                type="submit"
                noMargin
              />
            </form>
          </div>
        </Modal>
      </Container>
    );
  }
);

export default GoalModal;
