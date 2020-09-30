import { objectToArray } from './utils';

export const sortItemsByFavorites = items =>
  items.sort((a, b) => Number(b.favorite) - Number(a.favorite));
export const itemsByFavoritesSort = (a, b) =>
  Number(b.favorite) - Number(a.favorite);
export const getMembersIds = (itemsById, childItemsById) => [
  ...new Set([
    ...objectToArray(childItemsById).map(({ userId }) => userId),
    ...objectToArray(itemsById).map(({ ownerId }) => ownerId),
  ]),
];
