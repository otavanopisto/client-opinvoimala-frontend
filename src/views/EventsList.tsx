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
  isSimple?: boolean;
  events: EventType[];
}

const EventsList: React.FC<Props> = ({ events, isSimple }) => {
  const { t } = useTranslation();

  return (
    <EventsContainer>
      {!isSimple && (
        <>
          <h2>{t('view.events.title.upcoming')}</h2>
          {!events.length && <Message content={t('view.events.no_events')} />}
        </>
      )}

      {isSimple && <h2>{t('view.events.title.past')}</h2>}

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
