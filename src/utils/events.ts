import { DateTime } from 'luxon';
import { Event } from '../store/models';
import { isHoliday as getIsHoliday } from './date';

const mergeDateAndTime = (date: DateTime, time: DateTime) => {
  return time.set({
    year: date.year,
    month: date.month,
    day: date.day,
  });
};

interface RepeatEventOptions {
  from: DateTime;
  until: DateTime;
}

export const repeatEvent = (
  event: Event,
  { from, until }: RepeatEventOptions
): Event[] => {
  const { date, repeat, repeatUntil, duration } = event;

  const eventDate = DateTime.fromISO(date);
  const eventEndDate = repeatUntil ? DateTime.fromISO(repeatUntil) : undefined;

  const startDate = from > eventDate ? from : eventDate;
  const endDate =
    eventEndDate && eventEndDate < until ? eventEndDate.endOf('day') : until;

  let currentDate = startDate;
  const repeatedEvents: Event[] = [];

  if (repeat === 'none') {
    if (eventDate > from && eventDate < until) {
      repeatedEvents.push(event);
    }
  } else {
    // Repeat event based on given rules (daily/weekly/etc):
    while (currentDate <= endDate) {
      const isWeekend = currentDate.weekday >= 6;
      const isHoliday = getIsHoliday(currentDate);

      const currentEventDate = mergeDateAndTime(currentDate, eventDate);

      const wasEarlierOnStartDay =
        currentEventDate.plus({ minutes: duration ?? 0 }) < from;

      const currentEvent = {
        ...event,
        date: currentEventDate.toISO(),
      };

      switch (repeat) {
        case 'daily':
          if (!isWeekend && !isHoliday && !wasEarlierOnStartDay) {
            repeatedEvents.push(currentEvent);
          }
          break;
        case 'weekly':
          if (currentDate.weekday === eventDate.weekday) {
            if (!isHoliday && !wasEarlierOnStartDay) {
              repeatedEvents.push(currentEvent);
            }
          }
          break;
        default:
        // Do nothing
      }
      currentDate = currentDate.plus({ days: 1 });
    }
  }

  return repeatedEvents;
};
