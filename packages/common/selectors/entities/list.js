import { createSelector } from 'reselect';
import { LIST_TYPE, TEAM_TYPE } from '@caesar/common/constants';
import { itemsByIdSelector } from '@caesar/common/selectors/entities/item';
import { childItemsByIdSelector } from '@caesar/common/selectors/entities/childItem';
import { teamListSelector } from '@caesar/common/selectors/entities/team';
import { currentTeamIdSelector } from '@caesar/common/selectors/user';

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
const listIdPropSelector = (_, props) => props.listId;

export const listSelector = createSelector(
  listsByIdSelector,
  listIdPropSelector,
  (listsById, listId) => listsById[listId],
);

export const personalListsSelector = createSelector(
  listsSelector,
  lists => lists.filter(list => list.teamId === TEAM_TYPE.PERSONAL),
);

export const selectableListsSelector = createSelector(
  personalListsSelector,
  lists => [
    ...lists.filter(list => list.type === LIST_TYPE.INBOX),
    ...lists.filter(list => list.type === LIST_TYPE.TRASH),
    ...lists.filter(list => list.type === LIST_TYPE.LIST),
  ],
);

export const selectableListsWithoutChildrenSelector = createSelector(
  selectableListsSelector,
  lists => lists.map(({ children, ...rest }) => rest),
);

export const inboxListSelector = createSelector(
  personalListsSelector,
  lists => lists.find(({ type }) => type === LIST_TYPE.INBOX) || {},
);

export const defaultListSelector = createSelector(
  personalListsSelector,
  lists => lists.find(({ label }) => label === LIST_TYPE.DEFAULT) || {},
);

export const trashListSelector = createSelector(
  personalListsSelector,
  lists => lists.find(({ type }) => type === LIST_TYPE.TRASH) || {},
);

export const favoriteListSelector = createSelector(
  personalListsSelector,
  trashListSelector,
  itemsByIdSelector,
  (lists, trash, items) => {
    const favoriteList =
      lists.find(({ type }) => type === LIST_TYPE.FAVORITES) || {};

    return {
      ...favoriteList,
      children:
        favoriteList?.children?.filter(
          itemId => items[itemId]?.listId !== trash.id,
        ) || [],
    };
  },
);

const nestedListsSelector = createSelector(
  personalListsSelector,
  lists =>
    lists
      .filter(
        ({ type }) =>
          ![LIST_TYPE.INBOX, LIST_TYPE.FAVORITES, LIST_TYPE.TRASH].includes(
            type,
          ),
      )
      .sort((a, b) => a.sort - b.sort),
);

export const personalListsByTypeSelector = createSelector(
  inboxListSelector,
  nestedListsSelector,
  favoriteListSelector,
  trashListSelector,
  (inbox, lists, favorites, trash) => ({
    inbox,
    list: lists,
    favorites,
    trash,
  }),
);

export const teamListsSelector = createSelector(
  listsSelector,
  lists => lists.filter(list => list.teamId),
);

export const teamsTrashListsSelector = createSelector(
  teamListsSelector,
  lists => lists.filter(({ type }) => type === LIST_TYPE.TRASH) || [],
);

export const allTrashListIdsSelector = createSelector(
  trashListSelector,
  teamsTrashListsSelector,
  (trashList, teamsTrashLists) => [
    trashList.id,
    ...teamsTrashLists.map(({ id }) => id),
  ],
);

export const currentTeamDefaultListSelector = createSelector(
  teamListsSelector,
  lists => lists.find(({ type }) => type === LIST_TYPE.DEFAULT) || {},
);

export const currentTeamTrashListSelector = createSelector(
  teamListsSelector,
  currentTeamIdSelector,
  (lists, currentTeamId) =>
    lists.find(
      ({ teamId, label }) =>
        teamId === currentTeamId && label === LIST_TYPE.TRASH,
    ) || {},
);

export const currentTeamFavoriteListSelector = createSelector(
  teamListsSelector,
  currentTeamIdSelector,
  currentTeamTrashListSelector,
  itemsByIdSelector,
  (lists, currentTeamId, trash, items) => {
    const favoriteList =
      lists.find(
        ({ type, teamId }) =>
          teamId === currentTeamId && type === LIST_TYPE.FAVORITES,
      ) || {};

    return {
      ...favoriteList,
      children:
        favoriteList.children?.filter(
          itemId => items[itemId]?.listId !== trash.id,
        ) || [],
    };
  },
);

export const currentTeamListsSelector = createSelector(
  teamListsSelector,
  currentTeamIdSelector,
  currentTeamFavoriteListSelector,
  currentTeamTrashListSelector,
  (teamLists, currentTeamId, favorites, trash) => ({
    list: teamLists
      .filter(
        list =>
          list.teamId === currentTeamId &&
          ![LIST_TYPE.FAVORITES, LIST_TYPE.TRASH].includes(list.type),
      )
      .sort((a, b) => a.sort - b.sort),
    favorites,
    trash,
  }),
);

const teamIdPropSelector = (_, props) => props?.teamId;
export const listsIdTeamSelector = createSelector(
  listsSelector,
  teamIdPropSelector,
  (lists, teamId) =>
    lists.filter(list => list.teamId === teamId).map(list => list.id),
);

export const listsTeamSelector = createSelector(
  listsSelector,
  teamIdPropSelector,
  (lists, teamId) => lists.filter(list => list.teamId === teamId) || [],
);

export const teamDefaultListSelector = createSelector(
  listsSelector,
  teamIdPropSelector,
  (lists, teamId) =>
    lists.find(
      list => list.teamId === teamId && list.type === LIST_TYPE.DEFAULT,
    ) || null,
);

export const selectableTeamsListsSelector = createSelector(
  teamListSelector,
  personalListsSelector,
  teamListsSelector,
  (teamList, personalLists, teamLists) => {
    const filterLists = lists =>
      lists.filter(
        ({ type }) => ![LIST_TYPE.FAVORITES, LIST_TYPE.TRASH].includes(type),
      );

    return [
      {
        id: TEAM_TYPE.PERSONAL,
        name: TEAM_TYPE.PERSONAL,
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

export const customizableListsSelector = createSelector(
  personalListsSelector,
  currentTeamListsSelector,
  (personalLists, teamLists) => {
    const lists = personalLists.length ? personalLists : teamLists.list;

    return lists.filter(
      list => list.type === LIST_TYPE.LIST && list.label !== 'default',
    );
  },
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
                    ...itemsById[itemId].invited.reduce(
                      (acc, childItemId) =>
                        childItemsById[childItemId]
                          ? [...acc, childItemsById[childItemId]]
                          : acc,
                      [],
                    ),
                  ]
                : accumulator,
            [],
          ),
        ),
      ],
    })),
);
