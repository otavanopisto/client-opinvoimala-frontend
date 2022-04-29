import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import Layout from '../components/Layout';
import Message from '../components/Message';
import { useStore } from '../store/storeContext';
import { today } from '../utils/date';

const UPCOMING_DAYS = 7;
const PAST_DAYS = 30;

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

  const handleJoinMeeting = (link: string) => {
    window.open(link, '_newtab');
  };

  const hero = {
    title: t('route.events'),
  };

  return (
    <Layout hero={hero} isLoading={isBusy}>
      <section>
        <h2>{t('view.events.title.upcoming')}</h2>
        {!upcomingEvents.length && (
          <Message content={t('view.events.no_events')} />
        )}
        <ul>
          {upcomingEvents.map(({ id, date, title }) => (
            <li key={`${id}-${date}`}>{`${date} ${title}`}</li>
          ))}
        </ul>
        <button onClick={handleLoadMoreEvents}>Lataa lisää</button>
      </section>

      {!!pastEvents.length && (
        <section>
          <h2>{t('view.events.title.past')}</h2>
          <ul>
            {pastEvents.map(({ id, date, title }) => (
              <li key={`${id}-${date}`}>{`${date} ${title}`}</li>
            ))}
          </ul>
        </section>
      )}
    </Layout>
  );
});

export default Events;
