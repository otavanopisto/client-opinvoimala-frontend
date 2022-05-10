import { DateTime } from 'luxon';
import finnishholidays from 'finnish-holidays-js';

const LOCALE = 'fi-FI';
const TIMEZONE = 'Europe/Helsinki';

interface DateOptions {
  format?: string;
  timezone?: string;
  locale?: string;
}

export const localizedDate = (
  isoDate: string,
  { timezone = TIMEZONE, locale = LOCALE }: DateOptions = {}
) => {
  return DateTime.fromISO(isoDate).setZone(timezone).setLocale(locale);
};

export const today = () => {
  const nowISO = DateTime.now().toISO();
  return localizedDate(nowISO);
};

export const formatDateTime = (isoDate: string, options: DateOptions = {}) => {
  const { format = 'ccc f' } = options;
  return localizedDate(isoDate, options).toFormat(format);
};

export const isFutureDate = (isoDate: string, options: DateOptions = {}) => {
  return today() < localizedDate(isoDate, options);
};

export const isPastDate = (isoDate: string, options: DateOptions = {}) => {
  return today() >= localizedDate(isoDate, options);
};

export const isSameDay = (
  isoDate1: string,
  isoDate2: string,
  options: DateOptions = {}
) => {
  const date1 = localizedDate(isoDate1, options);
  const date2 = localizedDate(isoDate2, options);
  return date1.startOf('day').toMillis() === date2.startOf('day').toMillis();
};

export const isHoliday = (date: DateTime) => {
  const holidays = finnishholidays.month(date.month, date.year);
  return !!holidays.find(({ day }) => day === date.day);
};
