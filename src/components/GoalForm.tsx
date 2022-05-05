import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Loader, Transition } from 'semantic-ui-react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Goal as GoalType } from '../store/models';
import { Button, TextArea } from './inputs';
import { useStore } from '../store/storeContext';
import Message from './Message';

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

  @media ${p => p.theme.breakpoint.mobile} {
    flex-direction: column;
    div {
      width: 100%;
      flex-direction: column;
    }

    button {
      width: 100%;
      margin-right: 0;
      margin: ${p => p.theme.spacing.sm} 0;
    }
  }
`;

interface Props {
  goalObject?: GoalType;
  setGoalObject: React.Dispatch<React.SetStateAction<GoalType | undefined>>;
}

export const GoalForm: React.FC<Props> = observer(
  ({ goalObject, setGoalObject, ...props }) => {
    const {
      goals: { addGoal, editGoal, markGoalDone, deleteGoal, goalState },
    } = useStore();
    const { t } = useTranslation();

    const addingNewGoal = goalObject && goalObject?.id < 0;

    const [goalDescription, setGoalDescription] = useState('');
    const [error, setError] = useState(false);

    const isBusy = ['CREATING', 'EDITING', 'DELETING', 'PROCESSING'].includes(
      goalState
    );

    useEffect(() => {
      setGoalDescription(goalObject?.description ?? '');
      goalObject === undefined && setError(false);
    }, [goalObject]);

    useEffect(() => {
      if (goalState === 'ERROR') setError(true);
    }, [goalState]);

    const buttonKey = addingNewGoal
      ? 'action.save'
      : 'view.user_goals.mark_done';
    const buttonText = t(`${buttonKey}`);

    const closeForm = () => {
      if (!isBusy) setGoalObject(undefined);
      setError(false);
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (addingNewGoal) {
        await addGoal({ description: goalDescription });
      } else if (goalObject) {
        const { success } = await markGoalDone({ id: goalObject.id });
        if (success) closeForm();
      }
    };

    const handleDelete = async () => {
      if (goalObject) {
        const { success } = await deleteGoal({ id: goalObject.id });
        if (success) closeForm();
      }
    };

    const handleEdit = async () => {
      if (goalObject) {
        const { success } = await editGoal({
          id: goalObject.id,
          description: goalDescription,
        });
        if (success) closeForm();
      }
    };

    return (
      <Container>
        <Loader disabled={!isBusy} size="massive" />
        <form className="goals-modal-input" onSubmit={handleSubmit}>
          <TextArea
            id={goalObject?.id ?? -1}
            text={goalObject ? goalObject?.description : ''}
            onChange={(text: string) => {
              setGoalDescription(text);
            }}
            rows={6}
            autoFocus={true}
            placeholder={t('view.user_goals.description_placeholder')}
            variant="outlined"
            maxLength={160}
          />
          <Transition.Group>
            {error && (
              <div>
                <Message
                  error
                  icon="warning sign"
                  header={t('error.unknown_error')}
                />
              </div>
            )}
          </Transition.Group>
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
    );
  }
);

export default GoalForm;
