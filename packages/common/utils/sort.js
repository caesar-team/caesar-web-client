import { sortByDate } from './dateUtils';
import { sortByName } from './utils';

export { sortByDate } from './dateUtils';
export { sortByName } from './utils';

export const sortItems = (a, b) =>
  sortByDate(a.lastUpdated, b.lastUpdated, 'DESC') || sortByName(a.id, b.id);
