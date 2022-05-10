import React from 'react';
import Event from '../components/Event';
import { Event as EventType } from '../store/models';
import styled from 'styled-components';

const EventsContainer = styled.li`
  list-style-type: none;
  padding: 0;
  width: 100%;
  margin: ${p => p.theme.spacing.xl} 0;
`;

interface Props {
  isSimple?: boolean;
  events: EventType[];
}

const EventsList: React.FC<Props> = ({ events, isSimple }) => {
  return (
    <EventsContainer>
      {events.map(event => (
        <Event
          key={`${event.id}-${event.date}`}
          event={event}
          isSimple={isSimple}
        />
      ))}
    </EventsContainer>
  );
};

export default EventsList;
