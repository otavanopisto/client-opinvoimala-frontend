import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Icon, Loader } from 'semantic-ui-react';
import EditAppointmentModal from '../../components/admin/appointments/EditAppointmentModal';
import { AppointmentsList } from '../../components/appointments';
import DropdownMenu from '../../components/DropdownMenu';
import { Button } from '../../components/inputs';
import Layout from '../../components/Layout';
import { useAdminStore } from '../../store/admin/adminStoreContext';
import {
  Appointment,
  AppointmentIn,
  AppointmentStatus,
} from '../../store/models';
import { formatDateTime, today } from '../../utils/date';

type StatusFilter = AppointmentStatus | 'show_all';

const AdminAppointments: React.FC = observer(() => {
  const { t } = useTranslation();

  const [appointment, setAppointment] = useState<AppointmentIn>();
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
    if (!['FETCHED', 'FETCHING', 'ERROR'].includes(state)) {
      fetchAppointments();
    }
  }, [fetchAppointments, state]);

  useEffect(() => {
    if (!['FETCHED', 'FETCHING', 'ERROR'].includes(specialistsState)) {
      fetchSpecialists();
    }
  }, [fetchSpecialists, specialistsState]);

  const getAppointment = (id: number) => {
    return appointments.find(appointment => appointment.id === id);
  };

  const getAppointmentTime = ({ startTime, endTime }: Appointment) => {
    const start = formatDateTime(startTime);
    const end = formatDateTime(endTime, { format: 'T' });
    return `${start}\u2013${end}`;
  };

  const handleEdit = (id: number) => {
    const appointment = getAppointment(id);
    if (appointment) setAppointment(appointment);
  };

  const handleAddNew = () => {
    const startDateTime = today()
      .plus({ days: 1 })
      .startOf('day')
      .set({ hour: 12 });

    setAppointment({
      id: -1,
      status: AppointmentStatus.available,
      startTime: startDateTime.toISO(),
      endTime: startDateTime.plus({ hours: 1 }).toISO(),
      meetingLink: '',
    });
  };

  const handleCancel = (id: number) => {
    const appointment = getAppointment(id);
    if (appointment?.status === 'booked') {
      const confirmText = t(
        'view.admin.appointments.cancel_confirmation_text',
        { date: getAppointmentTime(appointment) }
      );
      window.confirm(confirmText) && cancelAppointment({ id });
    } else {
      cancelAppointment({ id });
    }
  };

  const handleJoin = (link: string) => {
    window.open(link, '_newtab');
  };

  const hero = {
    title: t('route.admin.appointments'),
    lead: (
      <>
        <div style={{ marginBottom: 24 }}>{adminFullName}</div>
        <Button
          id="admin-appointments__make-new-appointment-button"
          text={t('view.admin.appointments.create_new')}
          color="primary"
          icon={<Icon name="plus square outline" size="large" />}
          onClick={handleAddNew}
        />
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

      <EditAppointmentModal
        appointment={appointment}
        setAppointment={setAppointment}
      />
    </Layout>
  );
});

export default AdminAppointments;
