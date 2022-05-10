import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import Layout from '../components/Layout';
import { useStore } from '../store/storeContext';
import { today } from '../utils/date';
import { Grid } from 'semantic-ui-react';
import { Button } from '../components/inputs';
import Icon from '../components/Icon';
import EventsList from './EventsList';

const SHOW_NEXT = 5;
const PAST_DAYS = 30;

export const Events: React.FC = observer(() => {
  const { t } = useTranslation();

  const [eventsShown, setEventsShown] = useState(SHOW_NEXT);

  const {
    events: { state, getUpcomingEvents, getPastEvents, fetchEvents },
  } = useStore();

  const upcomingEvents = getUpcomingEvents();
  const shownUpcomingEvents = upcomingEvents.slice(0, eventsShown);
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
        <EventsList events={shownUpcomingEvents} />
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
          <EventsList events={pastEvents} isSimple />
        </section>
      )}
    </Layout>
  );
});

export default Events;
