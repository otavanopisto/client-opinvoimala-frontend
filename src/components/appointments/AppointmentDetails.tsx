import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Appointment } from '../../store/models';
import { formatDateTime } from '../../utils/date';

type Direction = 'row' | 'column';

const Container = styled.div<{ direction: Direction }>`
  display: flex;
  flex-direction: column;
  margin-top: ${p => p.theme.spacing.lg};
  margin-bottom: ${p => p.theme.spacing.lg};

  ${p => p.theme.font.size.xs};
  h2 {
    ${p => p.theme.font.h5};
    margin-bottom: 0;
  }

  > div {
    :not(:last-child) {
      margin-bottom: ${p => p.theme.spacing.md};
    }
  }

  @media ${p => p.theme.breakpoint.mobile} {
    flex-direction: ${p => p.direction};
    > div {
      :not(:last-child) {
        margin-right: ${p => (p.direction === 'row' ? p.theme.spacing.xl : 0)};
        margin-bottom: ${p => (p.direction === 'row' ? 0 : p.theme.spacing.lg)};
      }
    }
  }
`;

const formatDates = ({ startTime, endTime }: Appointment) => {
  const start = formatDateTime(startTime);
  const end = formatDateTime(endTime, { format: 'T' });
  return `${start}\u2013${end}`;
};

interface Props {
  appointment: Appointment;
  direction?: Direction;
}

export const AppointmentDetails: React.FC<Props> = ({
  appointment,
  direction = 'column',
}) => {
  const { t } = useTranslation();

  return (
    <Container direction={direction}>
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
    </Container>
  );
};

export default AppointmentDetails;
