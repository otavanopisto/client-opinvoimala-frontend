import React, { Dispatch, SetStateAction } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { observer } from 'mobx-react-lite';
import Drawer from '../../Drawer';
import { SpecialistIn } from '../../../store/models';
import EditAppointmentSpecialistForm from './EditAppointmentSpecialistForm';

const Header = styled.header`
  color: ${p => p.theme.color.secondary};
  ${p => p.theme.font.h3};
  font-weight: bold;
  font-family: ${p => p.theme.font.secondary};
`;

interface Props {
  specialist?: SpecialistIn;
  setSpecialist: Dispatch<SetStateAction<SpecialistIn | undefined>>;
}

export const EditSpecialistRolesDrawer: React.FC<Props> = observer(
  ({ specialist, setSpecialist }) => {
    const { t } = useTranslation();

    const addingNew = !specialist?.id || specialist.id <= 0;

    const closeDrawer = () => setSpecialist(undefined);

    const titleKey = addingNew ? 'add_title' : 'edit_title';
    const title = t(`view.admin.appointment_specialists.form.${titleKey}`);

    return (
      <Drawer fullWidth open={!!specialist} onClose={closeDrawer}>
        <Header>{title}</Header>
        <EditAppointmentSpecialistForm
          setSpecialist={setSpecialist}
          specialist={specialist}
          isAddingNew={addingNew}
        />
      </Drawer>
    );
  }
);

export default EditSpecialistRolesDrawer;
