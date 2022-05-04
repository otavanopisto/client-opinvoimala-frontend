import React from 'react';
import { observer } from 'mobx-react-lite';
import { Goal as GoalType } from '../store/models';
import GoalForm from './GoalForm';
import Drawer from './Drawer';

interface Props {
  goalObject?: GoalType;
  setGoalObject: React.Dispatch<React.SetStateAction<GoalType | undefined>>;
}

export const GoalDrawer: React.FC<Props> = observer(
  ({ goalObject, setGoalObject, ...props }) => {
    const closeModal = () => {
      setGoalObject(undefined);
    };

    const handleClose = () => {
      closeModal();
    };

    return (
      <Drawer fullWidth open={!!goalObject} onClose={handleClose}>
        <GoalForm setGoalObject={setGoalObject} goalObject={goalObject} />
      </Drawer>
    );
  }
);

export default GoalDrawer;
