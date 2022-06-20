import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Icon } from 'semantic-ui-react';
import AppointmentSpecialistList from '../../components/admin/appointment-specialists/AppointmentSpecialistList';
import EditSpecialistRoleDrawer from '../../components/admin/appointment-specialists/EditAppointmentSpecialistDrawer';
import EditSpecialistRoleModal from '../../components/admin/appointment-specialists/EditAppointmentSpecialistModal';
import { Button } from '../../components/inputs';
import Layout from '../../components/Layout';
import { useAdminStore } from '../../store/admin/adminStoreContext';
import { SpecialistIn } from '../../store/models';
import { useWindowDimensions } from '../../utils/hooks';

const AdminSpecialistRoles: React.FC = observer(() => {
  const { t } = useTranslation();
  const { isTablet } = useWindowDimensions();

  const [appointmentSpecialist, setAppointmentSpecialist] =
    useState<SpecialistIn>();

  const {
    auth: { adminFullName },
    specialists: {
      state: specialistsState,
      specialists,
      fetchSpecialists,
      getSpecialist,
    },
    specialistRoles: { state: rolesState, fetchSpecialistRoles },
  } = useAdminStore();

  const isBusy = ['FETCHING'].includes(specialistsState);

  /**
   * Fetch appointment specialists
   */
  useEffect(() => {
    if (!['FETCHED', 'FETCHING', 'ERROR'].includes(specialistsState)) {
      fetchSpecialists();
    }
  }, [fetchSpecialists, specialistsState]);

  /**
   * Fetch specialist roles
   */
  useEffect(() => {
    if (!['FETCHED', 'FETCHING', 'ERROR'].includes(rolesState)) {
      fetchSpecialistRoles();
    }
  }, [fetchSpecialistRoles, rolesState]);

  const handleEdit = (id: number | null) => {
    const appointment = getSpecialist(id);
    if (appointment) setAppointmentSpecialist(appointment);
  };

  const handleAddNew = () => {
    setAppointmentSpecialist({
      id: -1,
      name: '',
      role: '',
      meetingLink: '',
      email: '',
    });
  };

  const hero = {
    title: t('view.admin.appointment_specialists.title'),
    lead: (
      <>
        <div style={{ marginBottom: 24 }}>{adminFullName}</div>
        <Button
          id="admin-appointment_specialists__make-new-appointment-button"
          text={t('view.admin.appointment_specialists.create_new')}
          color="primary"
          icon={<Icon name="plus square outline" size="large" />}
          onClick={handleAddNew}
        />
      </>
    ),
  };

  return (
    <Layout admin hero={hero} isLoading={isBusy}>
      <AppointmentSpecialistList items={specialists} onEdit={handleEdit} />

      {isTablet ? (
        <EditSpecialistRoleDrawer
          specialist={appointmentSpecialist}
          setSpecialist={setAppointmentSpecialist}
        />
      ) : (
        <EditSpecialistRoleModal
          specialist={appointmentSpecialist}
          setSpecialist={setAppointmentSpecialist}
        />
      )}
    </Layout>
  );
});

export default AdminSpecialistRoles;
