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

    const isBusy = ['CREATING', 'EDITING', 'DELETING'].includes(goalState);

    useEffect(() => {
      setError(false);
      setGoalDescription(goalObject?.description ?? '');
    }, [goalObject]);

    const buttonKey = addingNewGoal
      ? 'action.save'
      : 'view.user_goals.mark_done';
    const buttonText = t(`${buttonKey}`);

    const handleActionResponse = ({ success }: { success: boolean }) => {
      if (success) closeForm();
      else setError(true);
    };

    const closeForm = () => {
      if (!isBusy) setGoalObject(undefined);
      setError(false);
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (addingNewGoal) {
        handleActionResponse(await addGoal({ description: goalDescription }));
      } else if (goalObject) {
        handleActionResponse(await markGoalDone({ id: goalObject.id }));
      }
    };

    const handleDelete = async () => {
      if (goalObject) {
        handleActionResponse(await deleteGoal({ id: goalObject.id }));
      }
    };

    const handleEdit = async () => {
      if (goalObject) {
        handleActionResponse(
          await editGoal({
            id: goalObject.id,
            description: goalDescription,
          })
        );
      }
    };

    const handleTextAreaChange = (text: string) => {
      setGoalDescription(text);
      if (text !== goalDescription) {
        setError(false);
      }
    };

    return (
      <Container>
        <Loader disabled={!isBusy} size="massive" />
        <form className="goals-modal-input" onSubmit={handleSubmit}>
          <TextArea
            id={goalObject?.id ?? -1}
            text={goalObject ? goalObject?.description : ''}
            onChange={handleTextAreaChange}
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
