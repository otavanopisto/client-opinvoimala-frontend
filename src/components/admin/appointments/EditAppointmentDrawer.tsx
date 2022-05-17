import React, { Dispatch, SetStateAction } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { observer } from 'mobx-react-lite';
import Drawer from '../../Drawer';
import { AppointmentIn } from '../../../store/models';
import EditAppointmentForm from './EditAppointmentForm';

const Header = styled.header`
  color: ${p => p.theme.color.secondary};
  ${p => p.theme.font.h3};
  font-weight: bold;
  font-family: ${p => p.theme.font.secondary};
`;

interface Props {
  appointment?: AppointmentIn;
  setAppointment: Dispatch<SetStateAction<AppointmentIn | undefined>>;
}

export const EditAppointmentDrawer: React.FC<Props> = observer(
  ({ appointment, setAppointment }) => {
    const { t } = useTranslation();

    const addingNew = !!appointment && appointment.id <= 0;

    const closeDrawer = () => setAppointment(undefined);

    const titleKey = addingNew ? 'add_title' : 'edit_title';
    const title = t(`view.admin.appointments.form.${titleKey}`);

    return (
      <Drawer fullWidth open={!!appointment} onClose={closeDrawer}>
        <Header>{title}</Header>
        <EditAppointmentForm
          setAppointment={setAppointment}
          appointment={appointment}
          isAddingNew={addingNew}
        />
      </Drawer>
    );
  }
);

export default EditAppointmentDrawer;
