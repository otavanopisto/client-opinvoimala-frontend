import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Transition } from 'semantic-ui-react';
import {
  MakeAppointmentDrawer,
  MakeAppointmentModal,
  AppointmentsList,
} from '../components/appointments';
import Layout from '../components/Layout';
import Message from '../components/Message';
import NoPrint from '../components/NoPrint';
import { useStore } from '../store/storeContext';
import { getApiErrorMessages } from '../utils/api';
import useWindowDimensions from '../utils/hooks';

export const UserAppointments: React.FC = observer(() => {
  const { t } = useTranslation();
  const { isTablet } = useWindowDimensions();

  const [errorMsgs, setErrorMsgs] = useState<string[]>([]);
  const [successMsg, setSuccessMsg] = useState<string>();

  const {
    appointments: {
      userAppointmentsState,
      upcomingAppointments,
      pastAppointments,
      fetchUserAppointments,
      cancelAppointment,
    },
  } = useStore();

  const isLoading = userAppointmentsState === 'FETCHING';

  const noAppointments =
    !upcomingAppointments.length && !pastAppointments.length;

  useEffect(() => {
    if (userAppointmentsState === 'NOT_FETCHED') {
      fetchUserAppointments();
    }
  }, [fetchUserAppointments, userAppointmentsState]);

  const clearMessages = () => {
    setErrorMsgs([]);
    setSuccessMsg(undefined);
  };

  const handleCancel = async (id: number) => {
    clearMessages();
    if (window.confirm(t('view.appointments.cancel_confirmation_text'))) {
      const { success, error } = await cancelAppointment({ id });
      if (success) {
        setSuccessMsg(t('view.appointments.appointment_cancelled'));
      } else {
        setErrorMsgs(getApiErrorMessages(error.data));
      }
    }
  };

  const handleJoinMeeting = (link: string) => {
    window.open(link, '_newtab');
  };

  const hero = {
    title: t('route.appointments'),
    lead: isTablet ? (
      <NoPrint>
        <MakeAppointmentDrawer />
      </NoPrint>
    ) : (
      <NoPrint>
        <MakeAppointmentModal />
      </NoPrint>
    ),
  };

  return (
    <Layout hero={hero} isLoading={isLoading}>
      {noAppointments && (
        <Message content={t('view.appointments.no_appointments')} />
      )}

      <Transition.Group>
        {!!successMsg && (
          <div>
            <Message
              success
              icon="check circle"
              content={successMsg}
              onDismiss={() => setSuccessMsg(undefined)}
            />
          </div>
        )}
        {!!errorMsgs.length && (
          <div>
            <Message
              error
              icon="warning sign"
              header={t('view.appointments.title.cancel_error')}
              list={errorMsgs}
              onDismiss={() => setErrorMsgs([])}
            />
          </div>
        )}
      </Transition.Group>

      {!!upcomingAppointments.length && (
        <AppointmentsList
          title={t('view.appointments.title.upcoming')}
          items={upcomingAppointments}
          onCancel={handleCancel}
          onJoin={handleJoinMeeting}
        />
      )}

      {!!pastAppointments.length && (
        <AppointmentsList
          title={t('view.appointments.title.past')}
          items={pastAppointments}
        />
      )}
    </Layout>
  );
});
