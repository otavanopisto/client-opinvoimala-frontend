import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import Layout from '../components/Layout';
import Message from '../components/Message';
import { useStore } from '../store/storeContext';
import { today } from '../utils/date';
import Event from '../components/Event';
import styled from 'styled-components';

const UPCOMING_DAYS = 7;
const PAST_DAYS = 30;

const EventsList = styled.ul`
  list-style-type: none;
  padding: 0;
  width: 100%;
`;

export const Events: React.FC = observer(() => {
  const { t } = useTranslation();

  const [daysShown, setDaysShown] = useState(UPCOMING_DAYS);

  const {
    events: { state, getUpcomingEvents, getPastEvents, fetchEvents },
  } = useStore();

  const upcomingEvents = getUpcomingEvents(today().plus({ days: daysShown }));
  const pastEvents = getPastEvents(today().minus({ days: PAST_DAYS }));

  const isBusy = state === 'FETCHING';

  useEffect(() => {
    if (state === 'NOT_FETCHED') {
      fetchEvents();
    }
  }, [fetchEvents, state]);

  const handleLoadMoreEvents = () => {
    setDaysShown(daysShown + UPCOMING_DAYS);
  };

  const hero = {
    title: t('route.events'),
  };

  console.log(upcomingEvents);

  return (
    <Layout hero={hero} isLoading={isBusy}>
      <section>
        <h2>{t('view.events.title.upcoming')}</h2>
        {!upcomingEvents.length && (
          <Message content={t('view.events.no_events')} />
        )}
        <EventsList>
          {pastEvents.map(event => (
            <Event key={`${event.id}-${event.date}`} event={event} />
          ))}
        </EventsList>
        <button onClick={handleLoadMoreEvents}>Lataa lisää</button>
      </section>

      {!!pastEvents.length && (
        <section>
          <h2>{t('view.events.title.past')}</h2>
          <EventsList>
            {pastEvents.map(event => (
              <Event
                key={`${event.id}-${event.date}`}
                event={event}
                isSimple={true}
              ></Event>
            ))}
          </EventsList>
        </section>
      )}
    </Layout>
  );
});

export default Events;
