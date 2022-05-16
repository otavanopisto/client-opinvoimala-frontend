import React, { RefObject, useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Loader, Transition } from 'semantic-ui-react';
import { useStore } from '../../store/storeContext';
import { today } from '../../utils/date';
import { Button } from '../inputs';
import { Appointment } from '../../store/models';
import { getApiErrorMessages } from '../../utils/api';

import MakeAppointmentPhase1 from './MakeAppointmentPhase1';
import MakeAppointmentPhase2 from './MakeAppointmentPhase2';
import MakeAppointmentPhase3Confirm from './MakeAppointmentPhase3Confirm';
import MakeAppointmentPhase4Summary from './MakeAppointmentPhase4Summary';
import MakeAppointmentNoAppointments from './MakeAppointmentNoAppointments';
import Message from '../Message';

const Container = styled.div`
  h1 {
    ${p => p.theme.font.h2};

    .make-appointment__title--current-phase {
      ${p => p.theme.font.h6};
      margin-left: ${p => p.theme.spacing.lg};
    }
  }

  .make-appointment__control-buttons {
    margin-top: ${p => p.theme.spacing.lg};
    display: flex;
    justify-content: space-between;
    align-items: center;

    &--right,
    &--left {
      display: flex;
      > button {
        :not(:last-child) {
          margin-right: ${p => p.theme.spacing.lg};
        }
      }
    }

    &--right {
      justify-content: right;
    }

    @media ${p => p.theme.breakpoint.mobile} {
      flex-direction: column;
      align-items: stretch;
      &--right,
      &--left {
        flex-direction: column-reverse;
        > button {
          margin-right: 0 !important;
        }
      }
    }
  }
`;

const startingDate = () => today().plus({ days: 1 }).startOf('day');

export interface Role {
  id: number;
  role: string;
}

interface Props {
  onGoBack: () => void;
  containerRef?: RefObject<HTMLDivElement>;
}

export const MakeAppointmentContainer: React.FC<Props> = observer(
  ({ onGoBack, containerRef }) => {
    const { t } = useTranslation();

    const [phase, setPhase] = useState(1);

    const [specialistRole, setSpecialistRole] = useState<Role>();
    const [selectedDate, setSelectedDate] = useState<Date>(
      startingDate().toJSDate()
    );
    const [appointment, setAppointment] = useState<Appointment>();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    const [errorMsgs, setErrorMsgs] = useState<string[]>([]);

    const okPhase1 = phase >= 1 && !!specialistRole;
    const okPhase2 = phase >= 2 && !!appointment;
    const continueDisabled =
      (phase === 1 && !okPhase1) || (phase === 2 && !okPhase2);

    const {
      appointments: {
        allAppointments,
        appointmentsByRole,
        roles,
        fetchAppointments,
        appointmentsState,
        appointmentState,
        makeAppointment,
      },
    } = useStore();

    const isBusy =
      appointmentState === 'BOOKING' || appointmentsState === 'FETCHING';

    // Change date when role is changed (select first date that have appointment(s))
    useEffect(() => {
      if (specialistRole) {
        const roleAppointments = appointmentsByRole(specialistRole.id);
        if (roleAppointments.length) {
          const date = roleAppointments[0].startTime;
          setSelectedDate(date ? new Date(date) : startingDate().toJSDate());
        }
      }
    }, [appointmentsByRole, specialistRole]);

    // Fetch available appointments always on mount
    useEffect(() => {
      fetchAppointments({
        status: 'available',
        start_time_gte: startingDate().toISO(),
      });
    }, [fetchAppointments]);

    // Show no available appointments phase if no appointments found:
    useEffect(() => {
      if (!allAppointments.length && appointmentsState === 'FETCHED') {
        setPhase(5);
      } else {
        setPhase(1);
      }
    }, [allAppointments, appointmentsState]);

    // Clear appointment if role was changed
    useEffect(() => {
      const roleChanged = specialistRole;
      if (roleChanged) setAppointment(undefined);
    }, [specialistRole]);

    const handlePhaseChange = (step: number) => () => {
      setErrorMsgs([]);
      const newPhase = phase + step;
      if (newPhase > 0 && newPhase <= phases.length) {
        setPhase(newPhase);

        if (containerRef?.current) {
          // Scroll to top each time phase changes
          containerRef.current.scrollTop = 0;
        }
      }
    };

    const handleMakeAppointment = async () => {
      setErrorMsgs([]);
      const id = appointment?.id;
      if (appointmentState !== 'BOOKING' && id) {
        const { success, error } = await makeAppointment({ id, name, email });
        if (success) {
          handlePhaseChange(1)();
        } else {
          setErrorMsgs(getApiErrorMessages(error.data));
        }
      }
    };

    const phases = [
      {
        title: t('view.appointments.make_new.choose_specialist'),
        controlButtons: ['next'],
        trackProgress: true,
        component: (
          <MakeAppointmentPhase1
            roles={roles}
            setRole={setSpecialistRole}
            selectedRole={specialistRole}
          />
        ),
      },
      {
        title: t('view.appointments.make_new.choose_appointment'),
        controlButtons: ['back', 'next'],
        trackProgress: true,
        component: (
          <MakeAppointmentPhase2
            appointments={appointmentsByRole(specialistRole?.id)}
            setAppointment={setAppointment}
            selectedAppointment={appointment}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
          />
        ),
      },
      {
        title: t('view.appointments.make_new.confirm'),
        controlButtons: ['back', 'confirm'],
        trackProgress: true,
        component: (
          <MakeAppointmentPhase3Confirm
            appointment={appointment}
            name={name}
            setName={setName}
            email={email}
            setEmail={setEmail}
          />
        ),
      },
      {
        title: t('view.appointments.make_new.summary_title'),
        controlButtons: ['back_to_appointments'],
        trackProgress: false,
        component: <MakeAppointmentPhase4Summary appointment={appointment} />,
      },
      {
        title: t('view.appointments.make_new.no_available_appointments'),
        controlButtons: ['back_to_appointments'],
        trackProgress: false,
        component: <MakeAppointmentNoAppointments />,
      },
    ];

    const currentPhase = phases[phase - 1];

    const trackablePhases = phases.filter(({ trackProgress }) => trackProgress);
    const progressText = `${phase}/${trackablePhases.length}`;

    const showBackButton = currentPhase.controlButtons.includes('back');
    const showNextButton = currentPhase.controlButtons.includes('next');
    const showConfirmButton = currentPhase.controlButtons.includes('confirm');
    const showBackAppointmentsButton = currentPhase.controlButtons.includes(
      'back_to_appointments'
    );

    return (
      <Container>
        <Loader disabled={!isBusy} active size="large" />

        <h1>
          {currentPhase.title}
          {currentPhase.trackProgress && (
            <span className="make-appointment__title--current-phase">
              {progressText}
            </span>
          )}
        </h1>

        <div>{currentPhase.component}</div>

        <Transition.Group>
          {!!errorMsgs.length && (
            <div>
              <Message
                error
                icon="warning sign"
                header={t('view.appointments.make_new.error_message_header')}
                list={errorMsgs}
              />
            </div>
          )}
        </Transition.Group>

        <div className="make-appointment__control-buttons">
          <div className="make-appointment__control-buttons--left">
            {showBackAppointmentsButton && (
              <Button
                id="make-appointment__back-to-appointments-button"
                text={t(
                  'view.appointments.make_new.action.back_to_appointments'
                )}
                onClick={onGoBack}
              />
            )}
          </div>

          <div className="make-appointment__control-buttons--right">
            {showBackButton && (
              <Button
                id="make-appointment__back-button"
                text={t('view.appointments.make_new.action.back')}
                onClick={handlePhaseChange(-1)}
                color="grey3"
                negativeText
              />
            )}
            {showNextButton && (
              <Button
                id="make-appointment__continue-button"
                text={t('view.appointments.make_new.action.continue')}
                onClick={handlePhaseChange(1)}
                disabled={continueDisabled}
              />
            )}
            {showConfirmButton && (
              <Button
                id="make-appointment__confirm-button"
                text={t('view.appointments.make_new.action.confirm')}
                onClick={handleMakeAppointment}
              />
            )}
          </div>
        </div>
      </Container>
    );
  }
);

export default MakeAppointmentContainer;
