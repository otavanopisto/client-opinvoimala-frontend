import React, { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import Modal from '../../Modal';
import { AppointmentIn } from '../../../store/models';
import EditAppointmentForm from './EditAppointmentForm';

interface Props {
  appointment?: AppointmentIn;
  setAppointment: Dispatch<SetStateAction<AppointmentIn | undefined>>;
}

export const EditAppointmentModal: React.FC<Props> = ({
  appointment,
  setAppointment,
}) => {
  const { t } = useTranslation();

  const addingNew = !!appointment && appointment?.id <= 0;

  const closeModal = () => setAppointment(undefined);

  const titleKey = addingNew ? 'add_title' : 'edit_title';
  const title = t(`view.admin.appointments.form.${titleKey}`);

  return (
    <Modal
      title={title}
      open={!!appointment}
      onClose={closeModal}
      size="large"
      closeOnDimmerClick={false}
    >
      <EditAppointmentForm
        appointment={appointment}
        setAppointment={setAppointment}
        isAddingNew={addingNew}
      />
    </Modal>
  );
};

export default EditAppointmentModal;
