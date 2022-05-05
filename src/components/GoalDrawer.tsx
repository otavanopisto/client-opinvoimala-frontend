import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { observer } from 'mobx-react-lite';
import { Goal as GoalType } from '../store/models';
import GoalForm from './GoalForm';
import Drawer from './Drawer';

const Header = styled.header`
  color: ${p => p.theme.color.secondary};
  ${p => p.theme.font.h3};
  font-weight: bold;
  font-family: ${p => p.theme.font.secondary};
`;

interface Props {
  goalObject?: GoalType;
  setGoalObject: React.Dispatch<React.SetStateAction<GoalType | undefined>>;
}

export const GoalDrawer: React.FC<Props> = observer(
  ({ goalObject, setGoalObject }) => {
    const { t } = useTranslation();

    const addingNewGoal = goalObject && goalObject?.id < 0;

    const titleKey = addingNewGoal ? 'add_goal' : 'edit_goal';
    const titleText = t(`view.user_goals.${titleKey}`);

    const closeDrawer = () => {
      setGoalObject(undefined);
    };

    return (
      <Drawer fullWidth open={!!goalObject} onClose={closeDrawer}>
        <Header>{titleText}</Header>
        <GoalForm setGoalObject={setGoalObject} goalObject={goalObject} />
      </Drawer>
    );
  }
);

export default GoalDrawer;
