import { DateTime } from 'luxon';

export function formatDate(date, dateFormatTo = 'LLL dd, yyyy hh:mm a') {
  return DateTime.fromISO(date).toFormat(dateFormatTo);
}
