import { DateTime } from 'luxon';

export const getCurrentUnixtime = () => Math.round(+new Date() / 1000);

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

export function sortByDate(first, second, flow = 'ASC') {
  const firstTimeStamp = DateTime.fromISO(first).ts;
  const secondTimeStamp = DateTime.fromISO(second).ts;

  if (flow === 'ASC') {
    if (firstTimeStamp < secondTimeStamp) {
      return -1;
    }
    if (firstTimeStamp > secondTimeStamp) {
      return 1;
    }
  }

  if (firstTimeStamp < secondTimeStamp) {
    return 1;
  }

  if (firstTimeStamp > secondTimeStamp) {
    return -1;
  }

  return 0;
}
