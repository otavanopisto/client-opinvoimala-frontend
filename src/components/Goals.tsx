import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import { Divider, Icon } from 'semantic-ui-react';
import styled from 'styled-components';
import { useStore } from '../store/storeContext';
import { Button } from './inputs';

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
  }
`;
const GoalInfoText = styled.div`
  font-family: ${p => p.theme.font.secondary};
  ${p => p.theme.font.size.lg};
`;

const Goal = styled.div<{ done?: boolean }>`
  background-color: ${p => (p.done ? p.theme.color.primaryLightest : 'none')};
  border-radius: 4px;
  ${p => p.theme.shadows[0]};
  ${p => p.theme.font.h4};
  line-height: 28px;
  margin-top: ${p => p.theme.spacing.lg};
  margin-bottom: ${p => p.theme.spacing.md};
  margin-left: 0;
  padding: 32px;
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
    },
  } = useStore();

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);
  return (
    <>
      <Header>
        <div>
          <h2>{goalsInfo?.title}</h2>
          <GoalInfoText>{goalsInfo?.infoText}</GoalInfoText>
        </div>

        <div className="goals-accomplished-container">
          <div style={{ marginRight: '24px' }}>Tavoitteita saavutettu X</div>
          <img src={goalsInfo?.image.url} alt="new" />
        </div>
      </Header>

      <Divider section hidden aria-hidden="true" />

      {goals.map(({ id, description, done }) => (
        <ul style={{ margin: 0 }}>
          <Goal key={id} done={done}>
            <h4>{description}</h4>
          </Goal>
        </ul>
      ))}

      <Divider section hidden aria-hidden="true" />

      <Button
        id="appointments__make-new-appointment-button"
        text={'Uusi tavoite'}
        color="primary"
        icon={<Icon name="plus square outline" size="large" />}
      />
    </>
  );
});
