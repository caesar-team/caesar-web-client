import { createSelector } from 'reselect';
import {
  FAVORITES_TYPE,
  INBOX_TYPE,
  LIST_TYPE,
  TRASH_TYPE,
} from 'common/constants';
import { itemsByIdSelector } from './item';
import { childItemsByIdSelector } from './childItem';

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

export const favoriteListSelector = createSelector(
  listsSelector,
  lists =>
    lists.find(({ label }) => label.toLocaleLowerCase() === 'favorites') || {},
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
    ...lists.filter(list => list.type === LIST_TYPE),
  ],
);

export const selectableListsWithoutChildrenSelector = createSelector(
  selectableListsSelector,
  lists => lists.map(({ children, ...rest }) => rest),
);

export const customizableListsSelector = createSelector(
  listsSelector,
  lists =>
    lists.filter(list => list.type === LIST_TYPE && list.label !== 'default'),
);

export const sortedCustomizableListsSelector = createSelector(
  customizableListsSelector,
  lists => lists.sort((a, b) => a.sort - b.sort),
);

export const extendedSortedCustomizableListsSelector = createSelector(
  sortedCustomizableListsSelector,
  itemsByIdSelector,
  childItemsByIdSelector,
  (lists, itemsById, childItemsById) =>
    lists.map(({ children, ...data }) => ({
      ...data,
      count: children.length,
      invited: [
        ...new Set(
          children.reduce(
            (accumulator, itemId) =>
              itemsById[itemId]
                ? [
                    ...accumulator,
                    ...itemsById[itemId].invited.map(
                      childItemId => childItemsById[childItemId],
                    ),
                  ]
                : accumulator,
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

const trashSelector = createSelector(
  listsSelector,
  lists => lists.find(({ type }) => type === TRASH_TYPE) || {},
);

export const favoritesSelector = createSelector(
  listsSelector,
  lists => lists.find(({ type }) => type === FAVORITES_TYPE) || {},
);

const nestedListsSelector = createSelector(
  listsSelector,
  lists =>
    lists.filter(
      ({ type }) => ![INBOX_TYPE, FAVORITES_TYPE, TRASH_TYPE].includes(type),
    ),
);

export const listsByTypeSelector = createSelector(
  inboxSelector,
  nestedListsSelector,
  favoritesSelector,
  trashSelector,
  (inbox, lists, favorites, trash) => ({
    inbox,
    list: lists,
    favorites,
    trash,
  }),
);

const listIdPropSelector = (_, props) => props.listId;

export const listSelector = createSelector(
  listsByIdSelector,
  listIdPropSelector,
  (listsById, listId) => listsById[listId],
);
