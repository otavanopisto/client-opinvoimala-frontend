import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import Layout from '../components/Layout';
import Message from '../components/Message';
import { useStore } from '../store/storeContext';
import { today } from '../utils/date';
import Event from '../components/Event';
import styled from 'styled-components';
import { Grid } from 'semantic-ui-react';
import { Button } from '../components/inputs';
import Icon from '../components/Icon';

const SHOW_NEXT = 5;
const PAST_DAYS = 30;

const EventsList = styled.li`
  list-style-type: none;
  padding: 0;
  width: 100%;
  margin-top: ${p => p.theme.spacing.xl};
  margin-bottom: ${p => p.theme.spacing.xl};
`;

export const Events: React.FC = observer(() => {
  const { t } = useTranslation();

  const [eventsShown, setEventsShown] = useState(SHOW_NEXT);

  const {
    events: { state, getUpcomingEvents, getPastEvents, fetchEvents },
  } = useStore();

  const upcomingEvents = getUpcomingEvents();
  const shownUpcomingEvents = [...upcomingEvents].slice(0, eventsShown);
  const pastEvents = getPastEvents(today().minus({ days: PAST_DAYS }));

  const isBusy = state === 'FETCHING';

  useEffect(() => {
    if (state === 'NOT_FETCHED') {
      fetchEvents();
    }
  }, [fetchEvents, state]);

  const handleLoadMoreEvents = () => {
    setEventsShown(eventsShown + SHOW_NEXT);
  };

  const hero = {
    title: t('route.events'),
  };

  return (
    <Layout hero={hero} isLoading={isBusy}>
      <section>
        <EventsList>
          <h2>{t('view.events.title.upcoming')}</h2>
          {!shownUpcomingEvents.length && (
            <Message content={t('view.events.no_events')} />
          )}

          {shownUpcomingEvents.map(event => (
            <Event key={`${event.id}-${event.date}`} event={event} />
          ))}
        </EventsList>
        {eventsShown < upcomingEvents.length && (
          <Grid centered>
            <Button
              id={`events-show-more-button`}
              text={t('action.show_more')}
              variant="link"
              icon={<Icon type="ChevronDown" color="none" width={24} />}
              onClick={handleLoadMoreEvents}
            />
          </Grid>
        )}
      </section>
      {!!pastEvents.length && (
        <section>
          <EventsList>
            <h2>{t('view.events.title.past')}</h2>

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
