import React, { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import Modal from '../../Modal';
import { SpecialistIn } from '../../../store/models';
import EditAppointmentSpecialistForm from './EditAppointmentSpecialistForm';

interface Props {
  specialist?: SpecialistIn;
  setSpecialist: Dispatch<SetStateAction<SpecialistIn | undefined>>;
}

export const EditSpecialistRolesModal: React.FC<Props> = ({
  specialist,
  setSpecialist,
}) => {
  const { t } = useTranslation();

  const addingNew = !!specialist?.id && specialist.id <= 0;

  const closeModal = () => setSpecialist(undefined);

  const titleKey = addingNew ? 'add_title' : 'edit_title';
  const title = t(`view.admin.appointment_specialists.form.${titleKey}`);

  return (
    <Modal
      title={title}
      open={!!specialist}
      onClose={closeModal}
      size="small"
      closeOnDimmerClick={false}
    >
      <EditAppointmentSpecialistForm
        specialist={specialist}
        setSpecialist={setSpecialist}
        isAddingNew={addingNew}
      />
    </Modal>
  );
};

export default EditSpecialistRolesModal;
