import { createSelector } from 'reselect';
import {
  FAVORITES_TYPE,
  INBOX_TYPE,
  LIST_TYPE,
  TRASH_TYPE,
} from 'common/constants';
import { itemsByIdSelector, itemsSelector } from './item';

export const entitiesSelector = state => state.entities;

export const listEntitySelector = createSelector(
  entitiesSelector,
  entities => entities.list,
);

export const listsByIdSelector = createSelector(
  listEntitySelector,
  listEntity => listEntity.byId,
);

export const listsSelector = createSelector(
  listsByIdSelector,
  listsById => Object.values(listsById) || [],
);

export const userListsSelector = createSelector(
  listsSelector,
  lists => lists.filter(list => list.type === LIST_TYPE && list.parentId),
);

export const defaultListSelector = createSelector(
  listsSelector,
  lists =>
    lists.find(({ label }) => label.toLocaleLowerCase() === 'default') || {},
);

export const favoriteListSelector = createSelector(
  listsSelector,
  lists =>
    lists.find(({ label }) => label.toLocaleLowerCase() === 'favorites') || {},
);

export const itemsInListsSelector = createSelector(
  listsSelector,
  lists => lists.find(list => list.type === TRASH_TYPE) || [],
);

export const favoriteItemsSelector = createSelector(
  itemsSelector,
  items => items.filter(({ favorite }) => !!favorite),
);

export const trashListSelector = createSelector(
  listsSelector,
  lists => lists.find(list => list.type === TRASH_TYPE),
);

export const selectableListsSelector = createSelector(
  listsSelector,
  lists => [
    ...lists.filter(list => list.type === INBOX_TYPE),
    ...lists.filter(list => list.type === TRASH_TYPE),
    ...lists.filter(list => list.type === LIST_TYPE && list.parentId),
  ],
);

export const selectableListsWithoutChildrenSelector = createSelector(
  selectableListsSelector,
  lists => lists.map(({ children, ...rest }) => rest),
);

export const customizableListsSelector = createSelector(
  listsSelector,
  lists =>
    lists.filter(
      list =>
        list.type === LIST_TYPE && list.parentId && list.label !== 'default',
    ),
);

export const sortedCustomizableListsSelector = createSelector(
  customizableListsSelector,
  lists => lists.sort((a, b) => a.sort - b.sort),
);

export const extendedSortedCustomizableListsSelector = createSelector(
  sortedCustomizableListsSelector,
  itemsByIdSelector,
  (lists, itemsById) =>
    lists.map(({ children, ...data }) => ({
      ...data,
      count: children.length,
      invited: [
        ...new Set(
          children.reduce(
            (acc, item) =>
              itemsById[item.id]
                ? [...acc, ...itemsById[item.id].invited]
                : acc,
            [],
          ),
        ),
      ],
    })),
);

export const parentListSelector = createSelector(
  listsSelector,
  lists => lists.find(({ type, parentId }) => type === LIST_TYPE && !parentId),
);

export const inboxSelector = createSelector(
  listsSelector,
  lists => lists.find(({ type }) => type === INBOX_TYPE) || {},
);

const listSelector = createSelector(
  listsSelector,
  lists =>
    lists.filter(({ type, parentId }) => type === LIST_TYPE && parentId) || [],
);

const trashSelector = createSelector(
  listsSelector,
  lists => lists.find(({ type }) => type === TRASH_TYPE) || {},
);

export const favoritesSelector = createSelector(
  listsSelector,
  lists => lists.find(({ type }) => type === FAVORITES_TYPE) || {},
);

export const listsByTypeSelector = createSelector(
  inboxSelector,
  listSelector,
  favoritesSelector,
  trashSelector,
  (inbox, list, favorites, trash) => ({ inbox, list, favorites, trash }),
);

