import React, { ChangeEvent, Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Appointment } from '../../store/AppointmentsStore';
import { formatDateTime } from '../../utils/date';
import { Input } from '../inputs';

const formatDates = ({ startTime, endTime }: Appointment) => {
  const start = formatDateTime(startTime);
  const end = formatDateTime(endTime, { format: 'T' });
  return `${start}\u2013${end}`;
};

const Container = styled.div`
  ${p => p.theme.font.size.sm};
  h2 {
    ${p => p.theme.font.h5};
    margin-bottom: 0;
  }
  .confirm-appointment__details {
    display: flex;
    gap: ${p => p.theme.spacing.xl};
    margin-bottom: ${p => p.theme.spacing.xl};
  }
`;

interface Props {
  appointment?: Appointment;
  name: string;
  setName: Dispatch<SetStateAction<string>>;
  email: string;
  setEmail: Dispatch<SetStateAction<string>>;
}

const MakeAppointmentPhase3: React.FC<Props> = ({
  appointment,
  name,
  setName,
  email,
  setEmail,
}) => {
  const { t } = useTranslation();

  const handleChange =
    (setter: Dispatch<SetStateAction<string>>) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      setter(event.currentTarget.value);
    };

  if (!appointment) {
    return t('error.appointment.make.appointment_not_selected');
  }

  return (
    <Container>
      <div className="confirm-appointment__details">
        <div>
          <h2>{t('label.specialist')}</h2>
          {appointment.appointmentSpecialist?.role ?? ''}
          <br />
          {appointment.appointmentSpecialist?.name ?? ''}
        </div>

        <div>
          <h2>{t('label.date')}</h2>
          {formatDates(appointment)}
        </div>
      </div>

      <h2>{t('view.appointments.make_new.contact_data_title')}</h2>
      <p>{t('view.appointments.make_new.contact_data_info')}</p>

      <Input
        label={t('label.name')}
        id="make_appointment__name-input"
        name="name"
        value={name}
        onChange={handleChange(setName)}
        size="large"
      />
      <Input
        label={t('label.email')}
        id="email-input"
        name="email"
        value={email}
        onChange={handleChange(setEmail)}
        size="large"
      />
    </Container>
  );
};

export default MakeAppointmentPhase3;
