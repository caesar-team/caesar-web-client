import { DateTime } from 'luxon';

export function formatDate(date, dateFormatTo = 'LLL dd, yyyy hh:mm a') {
  return DateTime.fromISO(date).toFormat(dateFormatTo);
}

export function datesDiff(first, second) {
  const firstISO = DateTime.fromISO(first);
  const secondISO = DateTime.fromISO(second);

  return secondISO.diff(firstISO, ['hours']);
}

export function dateDiffNow(date) {
  return DateTime.fromISO(date).diffNow('hours');
}
