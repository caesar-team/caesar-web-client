import { DateTime } from 'luxon';

export function formatDate(date) {
  const dateFormat = 'LLL dd, yyyy hh:mm a';

  return DateTime.fromFormat(date, dateFormat).toFormat(dateFormat);
}
