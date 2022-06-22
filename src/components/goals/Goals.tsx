import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
import { Divider } from 'semantic-ui-react';
import { Icon as SemanticIcon } from 'semantic-ui-react';
import Icon from '../Icon';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { useStore } from '../../store/storeContext';
import { useWindowDimensions } from '../../utils/hooks';
import { Button } from '../inputs';
import LoadingPlaceholder from '../LoadingPlaceholder';
import { Goal as GoalType } from '../../store/models';
import { GoalModal } from './GoalModal';
import GoalDrawer from './GoalDrawer';

const MAX_ACTIVE_GOALS = 4;

const Header = styled.header<{ hasImage: boolean }>`
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
      margin-right: ${p => (p.hasImage ? p.theme.spacing.lg : 0)};
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
  font-family: ${p => p.theme.font.secondary};
  font-weight: 700;
  line-height: 28px;

  .user-goals__done-goal-container,
  .user-goals__goal-item-button {
    width: 100%;
    text-align: left;
    padding: ${p => p.theme.spacing.lg};
    font-family: inherit;
    ${p => p.theme.font.size.lg};
    font-weight: inherit;
    line-height: inherit;
  }

  .user-goals__done-goal-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: ${p => p.theme.color.grey};

    .user-goals__done-text {
      display: flex;
      justify-content: space-between;
      align-items: center;
      ${p => p.theme.font.size.xs};

      svg {
        margin-left: ${p => p.theme.spacing.sm};
      }
    }
  }

  .user-goals__goal-item-button {
    color: ${p => p.theme.color.secondary};
    cursor: pointer;
    border: 1px solid transparent;

    :hover {
      border: 1px solid ${p => p.theme.color.grey};
      border-radius: inherit;
    }
  }

  @media ${p => p.theme.breakpoint.mobile} {
    padding: ${p => p.theme.spacing.sm};
  }
`;

const AddGoalButton = styled.div`
  display: flex;
`;

export const Goals: React.FC = observer(() => {
  const {
    goals: { goals, goalsInfo, fetchGoals, state, goalState },
  } = useStore();

  const [goalObject, setGoalObject] = useState<GoalType>();

  const { t } = useTranslation();

  const { isTablet } = useWindowDimensions();

  const handleEditGoal = (goal: GoalType) => {
    !goal.done && setGoalObject(goal);
  };

  const handleNewGoal = () => {
    setGoalObject({ id: -1, description: '', done: false });
  };

  useEffect(() => {
    if (!['FETCHED', 'FETCHING', 'ERROR'].includes(state)) {
      fetchGoals();
    }
  }, [fetchGoals, state]);

  if (state === 'FETCHING') {
    return <LoadingPlaceholder.Content />;
  }

  const activeGoals = goals.filter(({ done }) => !done);
  const canAddGoals = activeGoals.length < MAX_ACTIVE_GOALS;

  const hasImage = !!goalsInfo?.image;

  const tooltipText = canAddGoals
    ? undefined
    : `${t('view.user_goals.max_goals_added')}`;

  return (
    <section>
      {goalsInfo && (
        <Header hasImage={hasImage}>
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

            {hasImage && (
              <img
                src={goalsInfo.image.url}
                alt={goalsInfo.image.alternativeText ?? ''}
              />
            )}
          </div>
        </Header>
      )}

      <Divider hidden aria-hidden="true" />

      <GoalsList>
        {goals.map(goal => (
          <Goal key={goal.id} done={goal.done}>
            {goal.done ? (
              <div className="user-goals__done-goal-container">
                {goal.description}
                <div className="user-goals__done-text">
                  {t('action.done')}

                  <Icon type="Check" width={16} color="none" />
                </div>
              </div>
            ) : (
              <button
                className="user-goals__goal-item-button"
                onClick={() => handleEditGoal(goal)}
              >
                {goal.description}
              </button>
            )}
          </Goal>
        ))}
      </GoalsList>

      <Divider hidden aria-hidden="true" />

      <AddGoalButton>
        <Button
          id="user-goals__add-goal-button"
          text={t('view.user_goals.add')}
          color="primary"
          icon={<SemanticIcon name="plus square outline" size="large" />}
          onClick={handleNewGoal}
          tooltip={tooltipText}
          disabled={!canAddGoals}
        />
      </AddGoalButton>

      {isTablet ? (
        <GoalDrawer goalObject={goalObject} setGoalObject={setGoalObject} />
      ) : (
        <GoalModal goalObject={goalObject} setGoalObject={setGoalObject} />
      )}
    </section>
  );
});
