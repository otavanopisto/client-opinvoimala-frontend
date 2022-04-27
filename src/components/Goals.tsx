import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import { Divider, Grid } from 'semantic-ui-react';
import styled from 'styled-components';
import { useStore } from '../store/storeContext';

const Goal = styled.div<{ done?: boolean }>`
  background-color: ${p => (p.done ? p.theme.color.primaryLightest : 'none')};

  border-radius: 4px;
  ${p => p.theme.shadows[0]};
  ${p => p.theme.font.h4};
  line-height: 28px;
  margin-top: ${p => p.theme.spacing.lg};
  margin-bottom: ${p => p.theme.spacing.md};
  padding: 32px;
`;

const GoalInfoText = styled.div`
  font-family: 'Urbanist', sans-serif;
  font-size: 24px;
`;

const StyledGrid = styled(Grid)`
  @media ${p => p.theme.breakpoint.mobile} {
    &.ui.grid > .column:not(.row) {
      padding-left: 0 !important;
      padding-right: 0 !important;
    }
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
      // markGoalDone,
      // deleteGoal,
    },
  } = useStore();

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);
  return (
    <>
      <StyledGrid columns={2}>
        <h2>{goalsInfo?.title}</h2>
        <img src={goalsInfo?.image.url} alt="new" />
      </StyledGrid>

      <GoalInfoText>{goalsInfo?.infoText}</GoalInfoText>

      <Divider section hidden aria-hidden="true" />

      {goals.map(({ id, description, done }) => (
        <ul>
          <Goal key={id} done={done}>
            <h4>{description}</h4>
          </Goal>
        </ul>
      ))}
    </>
  );
});
