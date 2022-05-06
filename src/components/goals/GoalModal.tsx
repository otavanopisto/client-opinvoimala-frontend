import React from 'react';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import Modal, { Props as ModalProps } from '../Modal';
import { Goal as GoalType } from '../../store/models';
import GoalForm from './GoalForm';
interface Props extends ModalProps {
  goalObject?: GoalType;
  setGoalObject: React.Dispatch<React.SetStateAction<GoalType | undefined>>;
}

export const GoalModal: React.FC<Props> = observer(
  ({ goalObject, setGoalObject, ...props }) => {
    const { t } = useTranslation();

    const addingNewGoal = goalObject && goalObject?.id < 0;

    const titleKey = addingNewGoal ? 'add_goal' : 'edit_goal';
    const titleText = t(`view.user_goals.${titleKey}`);

    const closeModal = () => {
      setGoalObject(undefined);
    };

    const handleClose = (
      event: React.MouseEvent<HTMLElement, MouseEvent>,
      data: ModalProps
    ) => {
      closeModal();
    };

    return (
      <Modal
        {...props}
        open={!!goalObject}
        onClose={handleClose}
        title={titleText}
        size="small"
        closeButtonType="both"
        closeButtonText={t('action.cancel')}
      >
        <GoalForm setGoalObject={setGoalObject} goalObject={goalObject} />
      </Modal>
    );
  }
);

export default GoalModal;
