import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import Layout from '../components/Layout';
import Message from '../components/Message';
import { useStore } from '../store/storeContext';
import { today } from '../utils/date';

const UPCOMING_WEEKS = 1;
const PAST_WEEKS = 2;

export const Events: React.FC = observer(() => {
  const { t } = useTranslation();

  const [weeksShown, setWeeksShown] = useState(UPCOMING_WEEKS);

  const {
    events: { state, getUpcomingEvents, getPastEvents, fetchEvents },
  } = useStore();

  const upcomingEvents = getUpcomingEvents(today().plus({ weeks: weeksShown }));
  const pastEvents = getPastEvents(today().minus({ weeks: PAST_WEEKS }));

  const isBusy = state === 'FETCHING';

  useEffect(() => {
    if (state === 'NOT_FETCHED') {
      fetchEvents();
    }
  }, [fetchEvents, state]);

  const handleLoadMoreEvents = () => {
    setWeeksShown(weeksShown + UPCOMING_WEEKS);
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
