import React from 'react';
import styled from 'styled-components';
import { Appointment } from '../../store/models';
import AppointmentsListItem from './AppointmentsListItem';

const Container = styled.section`
  margin-bottom: ${p => p.theme.spacing.xl};

  h1 {
    ${p => p.theme.font.h2};
  }

  ul {
    list-style-type: none;
    padding: 0;
  }
`;

interface Props {
  title?: string;
  items: Appointment[];
  onEdit?: (id: number) => void;
  onCancel?: (id: number) => void;
  onJoin?: (link: string) => void;
  showStatus?: boolean;
}

export const AppointmentsList: React.FC<Props> = ({
  title,
  items,
  onEdit,
  onCancel,
  onJoin,
  showStatus,
}) => (
  <Container>
    {title && <h1>{title}</h1>}

    <ul>
      {items.map(appointment => (
        <AppointmentsListItem
          key={appointment.id}
          onEdit={onEdit}
          onCancel={onCancel}
          onJoin={onJoin}
          showStatus={showStatus}
          {...appointment}
        />
      ))}
    </ul>
  </Container>
);

export default AppointmentsList;
