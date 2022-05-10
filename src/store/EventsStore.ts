import { DateTime } from 'luxon';
import { Instance, types, flow, cast, getSnapshot } from 'mobx-state-tree';
import api from '../services/api/Api';
import { isPastDate, localizedDate, today } from '../utils/date';
import { repeatEvent } from '../utils/events';
import { byDate } from '../utils/sort';
import { EventModel } from './models/EventModel';

const States = [
  'NOT_FETCHED' as const,
  'FETCHING' as const,
  'FETCHED' as const,
  'ERROR' as const,
];

export const EventsStore = types
  .model({
    state: types.enumeration('State', States),
    data: types.array(EventModel),
  })
  .views(self => ({
    get events() {
      return self.data ? getSnapshot(self.data) : [];
    },
    getUpcomingEvents(until?: DateTime) {
      const events = self.data ? getSnapshot(self.data) : [];
      const repeatedEvents = events.map(event =>
        repeatEvent(event, {
          from: today(),
          until:
            until?.endOf('day') ??
            localizedDate(event.repeatUntil ?? event.date).endOf('day'),
        })
      );

      return repeatedEvents.flat().sort(byDate);
    },
    getPastEvents(from: DateTime) {
      const events = self.data ? getSnapshot(self.data) : [];
      const pastEvents = events.filter(({ date }) => isPastDate(date));
      const repeatedEvents = pastEvents.map(event =>
        repeatEvent(event, {
          from: from.startOf('day'),
          until: today().minus({ minutes: event.duration ?? 0 }),
        })
      );

      return repeatedEvents.flat().sort(byDate).reverse();
    },
  }))
  .actions(self => {
    const fetchEvents = flow(function* (params: API.GetEvents = {}) {
      self.state = 'FETCHING';

      const response: API.GeneralResponse<API.RES.GetEvents> =
        yield api.getEvents(params);

      if (response.kind === 'ok') {
        self.data = cast(response.data);
        self.state = 'FETCHED';
      } else {
        self.state = 'ERROR';
      }
    });

    return {
      fetchEvents,
    };
  });

export interface IEventsStore extends Instance<typeof EventsStore> {}
