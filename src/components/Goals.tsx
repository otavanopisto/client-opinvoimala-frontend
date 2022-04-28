import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import { Divider, Icon } from 'semantic-ui-react';
import styled from 'styled-components';
import { useStore } from '../store/storeContext';
import { Button } from './inputs';
import LoadingPlaceholder from './LoadingPlaceholder';
import { useTranslation } from 'react-i18next';

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
    div {
      margin-right: ${p => p.theme.spacing.lg};
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

const Goal = styled.div<{ done?: boolean }>`
  ${p => p.theme.shadows[0]};
  color: ${p => (p.done ? p.theme.color.grey : p.theme.color.secondary)};
  background-color: ${p => (p.done ? p.theme.color.primaryLightest : 'none')};
  border-radius: ${p => p.theme.borderRadius.sm};
  font-family: ${p => p.theme.font.secondary};
  ${p => p.theme.font.size.lg};
  font-weight: 700;
  line-height: 28px;
  margin-top: ${p => p.theme.spacing.lg};
  margin-bottom: ${p => p.theme.spacing.md};
  margin-left: 0;
  padding: ${p => p.theme.spacing.xl};
`;

export const Goals: React.FC = observer(() => {
  const {
    goals: {
      goals,
      goalsInfo,
      fetchGoals,
      // addGoal,
      // editGoal,
      // markGoalDone,
      // deleteGoal,
      state,
    },
  } = useStore();

  const { t } = useTranslation();

  useEffect(() => {
    if (!['FETCHED', 'FETCHING'].includes(state)) {
      fetchGoals();
    }
  }, [fetchGoals, state]);

  if (state === 'FETCHING') {
    return <LoadingPlaceholder.Content />;
  }

  return (
    <>
      <Header>
        <div>
          <h2>{goalsInfo?.title}</h2>
          <GoalInfoText>{goalsInfo?.infoText}</GoalInfoText>
        </div>

        <div className="goals-accomplished-container">
          <div>
            {t('view.user_goals.accomplished', { count: goalsInfo?.doneTotal })}
          </div>
          {goalsInfo && (
            <img
              src={goalsInfo.image.url}
              alt={goalsInfo.image.alternativeText ?? ''}
            />
          )}
        </div>
      </Header>

      <Divider section hidden aria-hidden="true" />

      <GoalsList>
        {goals.map(({ id, description, done }) => (
          <Goal key={id} done={done}>
            {description}
          </Goal>
        ))}
      </GoalsList>

      <Divider section hidden aria-hidden="true" />

      <Button
        id="user-goals__add-goals-button"
        text={t('view.user_goals.add')}
        color="primary"
        icon={<Icon name="plus square outline" size="large" />}
      />
    </>
  );
});
