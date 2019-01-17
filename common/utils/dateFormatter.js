import { DateTime } from 'luxon';

export function formatDate(date) {
  return DateTime.fromFormat(date, 'LLL dd, yyyy hh:mm a').toFormat(
    'LLL dd, yyyy hh:mm a',
  );
}
