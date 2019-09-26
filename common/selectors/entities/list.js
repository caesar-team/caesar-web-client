import { createSelector } from 'reselect';
import {
  FAVORITES_TYPE,
  INBOX_TYPE,
  LIST_TYPE,
  TRASH_TYPE,
} from 'common/constants';
import { itemsByIdSelector } from 'common/selectors/entities/item';
import { childItemsByIdSelector } from 'common/selectors/entities/childItem';
import { teamListSelector } from 'common/selectors/entities/team';
import { currentTeamIdSelector } from 'common/selectors/user';

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

export const personalListsSelector = createSelector(
  listsSelector,
  lists => lists.filter(list => !list.teamId),
);

export const teamListsSelector = createSelector(
  listsSelector,
  lists => lists.filter(list => list.teamId),
);

export const currentTeamListsSelector = createSelector(
  teamListsSelector,
  currentTeamIdSelector,
  (teamLists, currentTeamId) =>
    teamLists.filter(list => list.teamId === currentTeamId),
);

export const favoriteListSelector = createSelector(
  personalListsSelector,
  lists =>
    lists.find(({ label }) => label.toLocaleLowerCase() === 'favorites') || {},
);

export const trashListSelector = createSelector(
  personalListsSelector,
  lists => lists.find(list => list.type === TRASH_TYPE),
);

export const selectableListsSelector = createSelector(
  personalListsSelector,
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
  personalListsSelector,
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

export const inboxSelector = createSelector(
  personalListsSelector,
  lists => lists.find(({ type }) => type === INBOX_TYPE) || {},
);

const trashSelector = createSelector(
  personalListsSelector,
  lists => lists.find(({ type }) => type === TRASH_TYPE) || {},
);

export const favoritesSelector = createSelector(
  personalListsSelector,
  lists => lists.find(({ type }) => type === FAVORITES_TYPE) || {},
);

const nestedListsSelector = createSelector(
  personalListsSelector,
  lists =>
    lists.filter(
      ({ type }) => ![INBOX_TYPE, FAVORITES_TYPE, TRASH_TYPE].includes(type),
    ),
);

export const personalListsByTypeSelector = createSelector(
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

export const teamTrashListSelector = createSelector(
  teamListsSelector,
  lists => lists.find(({ type }) => type === TRASH_TYPE) || {},
);

const listIdPropSelector = (_, props) => props.listId;

export const listSelector = createSelector(
  listsByIdSelector,
  listIdPropSelector,
  (listsById, listId) => listsById[listId],
);

export const selectableTeamsListsSelector = createSelector(
  teamListSelector,
  personalListsSelector,
  teamListsSelector,
  (teamList, personalLists, teamLists) => {
    const filterLists = lists =>
      lists.filter(
        ({ type }) => ![INBOX_TYPE, FAVORITES_TYPE, TRASH_TYPE].includes(type),
      );

    return [
      {
        id: 'personal',
        name: 'personal',
        icon: null,
        lists: filterLists(personalLists),
      },
      ...teamList.map(team => ({
        id: team.id,
        name: team.title,
        icon: team.icon,
        lists: filterLists(teamLists.filter(list => list.teamId === team.id)),
      })),
    ];
  },
);
