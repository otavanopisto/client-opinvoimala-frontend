import React from 'react';
import styled from 'styled-components';
import { Appointment } from '../../store/models';
import AppointmentsListItem from './AppointmentsListItem';

const Container = styled.section`
  margin-bottom: ${p => p.theme.spacing.xl};

  > header {
    flex-direction: column;
    align-items: flex-start;
    button {
      margin-left: 0 !important;
      margin-right: 0 !important;
    }
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  @media ${p => p.theme.breakpoint.mobile} {
    > header {
      display: flex;
      justify-content: space-between;
      align-items: center;

      h1 {
        ${p => p.theme.font.h2};
      }
    }
  }
`;

interface Props {
  title?: string;
  items: Appointment[];
  onEdit?: (id: number) => void;
  onCancel?: (id: number) => void;
  onJoin?: (link: string) => void;
  showStatus?: boolean;
  tools?: JSX.Element;
}

export const AppointmentsList: React.FC<Props> = ({
  title,
  items,
  onEdit,
  onCancel,
  onJoin,
  showStatus,
  tools,
}) => (
  <Container>
    <header>
      {title && <h1>{title}</h1>}
      <div>{tools}</div>
    </header>

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
