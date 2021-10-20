import React, { Dispatch, SetStateAction, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Appointment } from '../../store/AppointmentsStore';
import { formatDateTime, isSameDay, today } from '../../utils/date';
import DatePicker from '../inputs/DatePicker';
import OptionToggleButton from '../inputs/OptionToggleButton';

const Container = styled.div`
  display: flex;
  gap: ${p => p.theme.spacing.lg};
  & > div {
    border: 1px solid ${p => p.theme.color.grey3};
    padding: ${p => p.theme.spacing.md};
  }

  @media ${p => p.theme.breakpoint.mobile} {
    flex-direction: column;
  }
`;

const TimePickerContainer = styled.div`
  flex: 1;
  ul {
    list-style-type: none;
    padding: 0;
    font-family: ${p => p.theme.font.secondary};
    font-size: 16px;
    li {
      margin: ${p => p.theme.spacing.md} 0;
      .appointment-time {
        display: flex;
        &__time {
          min-width: 90px;
        }
      }
    }
  }

  .appointment-times__no-appointments {
    margin: ${p => p.theme.spacing.lg} 0;
    text-align: center;
  }
`;

const getAllDates = (appointments: Appointment[]) => {
  const dateStrings = appointments.map(({ startTime }) => startTime);
  return dateStrings.map(dateISO => new Date(dateISO));
};

const formatTime = ({ startTime, endTime }: Appointment) => {
  const start = formatDateTime(startTime, { format: 'HH:mm' });
  const end = formatDateTime(endTime, { format: 'HH:mm' });
  return `${start}-${end}`;
};

interface Props {
  appointments: Appointment[];
  defaultDate?: Date;
  setAppointment: Dispatch<SetStateAction<Appointment | undefined>>;
  selectedAppointment?: Appointment;
}

const MakeAppointmentPhase2: React.FC<Props> = ({
  appointments,
  defaultDate = today().toJSDate(),
  setAppointment,
  selectedAppointment,
}) => {
  const { t } = useTranslation();
  const [selectedDate, setSelectedDate] = useState(defaultDate);

  const bySelectedDate = ({ startTime }: Appointment) => {
    return isSameDay(startTime, selectedDate.toISOString());
  };

  const handleDateChange = (
    newDate: Date | [Date | null, Date | null] | null
  ) => {
    if (newDate && !Array.isArray(newDate)) {
      setSelectedDate(newDate);
    }
  };

  const handleAppointmentClick = (appointment: Appointment) => () => {
    if (appointment.id === selectedAppointment?.id) {
      setAppointment(undefined);
    } else {
      setAppointment(appointment);
    }
  };

  const isSelected = (appointment: Appointment) => {
    return appointment.id === selectedAppointment?.id;
  };

  const getDayClass = (date: Date) => {
    let className = 'react-datepicker__day';
    if (selectedDate === date) {
      className += '--selected';
    }
    return className;
  };

  const renderAppointmentContent = (appointment: Appointment) => (
    <div className="appointment-time">
      <div aria-label="Appointment time" className="appointment-time__time">
        {formatTime(appointment)}
      </div>
      <div aria-label="Appointment specialist">
        {appointment.appointmentSpecialist?.name ?? ''}
      </div>
    </div>
  );

  const appointmentsByDate = appointments.filter(bySelectedDate);

  return (
    <Container>
      <DatePicker
        selected={selectedDate}
        onChange={handleDateChange}
        dayClassName={getDayClass}
        highlightDates={getAllDates(appointments)}
        inline
      />

      <TimePickerContainer>
        {!!appointmentsByDate.length && (
          <ul>
            {appointmentsByDate.map((appointment, i) => (
              <li key={appointment.id}>
                <OptionToggleButton
                  aria-label="Appointment option"
                  isSelected={isSelected(appointment)}
                  autoFocus={i === 0}
                  size="sm"
                  onClick={handleAppointmentClick(appointment)}
                >
                  {renderAppointmentContent(appointment)}
                </OptionToggleButton>
              </li>
            ))}
          </ul>
        )}
        {!appointmentsByDate.length && (
          <div className="appointment-times__no-appointments">
            {t('view.appointments.make_new.no_available_appointments')}
          </div>
        )}
      </TimePickerContainer>
    </Container>
  );
};

export default MakeAppointmentPhase2;
