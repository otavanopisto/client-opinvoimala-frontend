import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Loader } from 'semantic-ui-react';
import { AppointmentsList } from '../../components/appointments';
import DropdownMenu from '../../components/DropdownMenu';
import Layout from '../../components/Layout';
import { useAdminStore } from '../../store/admin/adminStoreContext';
import { AppointmentStatus } from '../../store/models';

type StatusFilter = AppointmentStatus | 'show_all';

const AdminAppointments: React.FC = observer(() => {
  const { t } = useTranslation();

  const [statusFilter, setStatusFilter] = useState<StatusFilter>('show_all');

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

  const handleFilterChange = (filter: StatusFilter) => {
    setStatusFilter(filter);
  };

  const filterByStatus = ({ status }: { status: AppointmentStatus }) => {
    return statusFilter === 'show_all' || status === statusFilter;
  };

  const renderStatusFilter = () => {
    const options: StatusFilter[] = [
      'show_all',
      ...Object.values(AppointmentStatus),
    ];

    return (
      <DropdownMenu
        showArrow
        align="right"
        menuWidth={180}
        triggerButton={{
          label: t(`view.appointments.status.${statusFilter}`),
        }}
        items={options.map(status => ({
          id: `admin_appointments_filter_${status}`,
          label: t(`view.appointments.status.${status}`),
          type: 'button',
          onClick: () => handleFilterChange(status),
        }))}
      />
    );
  };

  const renderListTools = () => {
    return <>{renderStatusFilter()}</>;
  };

  return (
    <Layout admin hero={hero} isLoading={state === 'FETCHING'}>
      <Loader active={isBusy} size="massive" />

      <AppointmentsList
        title={t('view.admin.appointments.list_title')}
        tools={renderListTools()}
        items={appointments.filter(filterByStatus)}
        onCancel={handleCancel}
        onJoin={handleJoin}
        onEdit={handleEdit}
        showStatus
      />
    </Layout>
  );
});

export default AdminAppointments;
