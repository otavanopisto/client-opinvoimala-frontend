import { useTranslation } from 'react-i18next';
import React from 'react';
import Event from '../components/Event';
import { Event as EventType } from '../store/models';
import styled from 'styled-components';
import Message from '../components/Message';

const EventsContainer = styled.li`
  list-style-type: none;
  padding: 0;
  width: 100%;
  margin: ${p => p.theme.spacing.xl} 0;
`;

interface Props {
  title: string;
  isSimple?: boolean;
  events: EventType[];
}

const EventsList: React.FC<Props> = ({ title, events, isSimple }) => {
  const { t } = useTranslation();

  return (
    <EventsContainer>
      <h2>{title}</h2>
      {!events.length && <Message content={t('view.events.no_events')} />}
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
