import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Loader } from 'semantic-ui-react';
import { AppointmentsList } from '../../components/appointments';
import Layout from '../../components/Layout';
import { useAdminStore } from '../../store/admin/adminStoreContext';

const AdminAppointments: React.FC = observer(() => {
  const { t } = useTranslation();

  const {
    auth: { adminFullName },
    appointments: {
      state,
      appointmentState,
      appointments,
      fetchAppointments,
      cancelAppointment,
    },
    specialists: { state: specialistsState, fetchSpecialists },
  } = useAdminStore();

  const isBusy = ['PROCESSING'].includes(appointmentState);

  useEffect(() => {
    if (!['FETCHED', 'FETCHING'].includes(state)) {
      fetchAppointments();
    }
  }, [fetchAppointments, state]);

  useEffect(() => {
    if (!['FETCHED', 'FETCHING', 'ERROR'].includes(specialistsState)) {
      fetchSpecialists();
    }
  }, [fetchSpecialists, specialistsState]);

  const handleEdit = () => {
    console.log('TODO: Edit appointment');
  };

  const handleCancel = (id: number) => {
    cancelAppointment({ id });
  };

  const handleJoin = (link: string) => {
    window.open(link, '_newtab');
  };

  const hero = {
    title: t('route.admin.appointments'),
    lead: (
      <>
        {adminFullName}
        <div>TODO: Add appointment button</div>
      </>
    ),
  };

  return (
    <Layout admin hero={hero} isLoading={state === 'FETCHING'}>
      <Loader active={isBusy} size="massive" />

      <AppointmentsList
        title={t('view.admin.appointments.list_title')}
        items={appointments}
        onCancel={handleCancel}
        onJoin={handleJoin}
        onEdit={handleEdit}
        showStatus
      />
    </Layout>
  );
});

export default AdminAppointments;
