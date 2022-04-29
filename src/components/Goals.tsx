import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
import { Divider, Icon } from 'semantic-ui-react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { useStore } from '../store/storeContext';
import { Button } from './inputs';
import LoadingPlaceholder from './LoadingPlaceholder';
import { Goal as GoalType } from '../store/models';
import { GoalModal } from './GoalModal';

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;

  .goals-accomplished-container {
    display: flex;
    justify: flex-end;
    align-items: center;
    font-family: ${p => p.theme.font.secondary};
    color: ${p => p.theme.color.secondary};
    ${p => p.theme.font.size.md};
    font-weight: 600;
    > div {
      margin-right: ${p => p.theme.spacing.lg};
    }
  }

  @media ${p => p.theme.breakpoint.mobile} {
    flex-direction: column;
    align-items: flex-start;

    .goals-accomplished-container {
      margin-top: ${p => p.theme.spacing.md};
      flex-direction: row-reverse;
      > div {
        margin-left: ${p => p.theme.spacing.md};
      }
    }
  }
`;

const GoalInfoText = styled.div`
  font-family: ${p => p.theme.font.secondary};
  ${p => p.theme.font.size.lg};
`;

const GoalsList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const Goal = styled.li<{ done?: boolean }>`
  ${p => p.theme.shadows[0]};
  background-color: ${p => (p.done ? p.theme.color.primaryLightest : 'none')};
  border-radius: ${p => p.theme.borderRadius.sm};
  margin-top: ${p => p.theme.spacing.lg};
  margin-bottom: ${p => p.theme.spacing.md};
  margin-left: 0;

  > button {
    width: 100%;
    text-align: left;
    padding: ${p => p.theme.spacing.xl};
    color: ${p => p.theme.color[p.done ? 'grey' : 'secondary']};
    font-family: ${p => p.theme.font.secondary};
    ${p => p.theme.font.size.lg};
    font-weight: 700;
    line-height: 28px;
  }

  @media ${p => p.theme.breakpoint.mobile} {
    padding: ${p => p.theme.spacing.lg};
  }
`;

export const Goals: React.FC = observer(() => {
  const {
    goals: {
      goals,
      goalsInfo,
      fetchGoals,
      // addGoal,
      // editGoal,
      markGoalDone,
      // deleteGoal,
      state,
    },
  } = useStore();

  const [goalObject, setGoalObject] = useState<GoalType>();

  const { t } = useTranslation();

  const handleEditGoal = (goal: GoalType) => {
    setGoalObject(goal);
  };

  useEffect(() => {
    if (!['FETCHED', 'FETCHING'].includes(state)) {
      fetchGoals();
    }
  }, [fetchGoals, state]);

  if (state === 'FETCHING') {
    return <LoadingPlaceholder.Content />;
  }

  return (
    <section>
      {goalsInfo && (
        <Header>
          <div>
            <h2>{goalsInfo.title}</h2>
            <GoalInfoText>{goalsInfo.infoText}</GoalInfoText>
          </div>

          <div className="goals-accomplished-container">
            <div>
              {t('view.user_goals.accomplished', {
                count: goalsInfo.doneTotal,
              })}
            </div>

            <img
              src={goalsInfo.image.url}
              alt={goalsInfo.image.alternativeText ?? ''}
            />
          </div>
        </Header>
      )}

      <Divider hidden aria-hidden="true" />

      <GoalsList>
        {goals.map(goal => (
          <Goal key={goal.id} done={goal.done}>
            <button onClick={() => handleEditGoal(goal)}>
              {goal.description}
            </button>
          </Goal>
        ))}
      </GoalsList>

      <Divider hidden aria-hidden="true" />

      <Button
        id="user-goals__add-goals-button"
        text={t('view.user_goals.add')}
        color="primary"
        icon={<Icon name="plus square outline" size="large" />}
      />

      <GoalModal
        goalObject={goalObject}
        setGoalObject={setGoalObject}
        markGoalDone={markGoalDone}
      />
    </section>
  );
});
