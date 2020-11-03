import { createSelector } from 'reselect';
import {
  TEAM_TYPE,
  LIST_TYPE,
  NOT_SELECTABLE_LIST_TYPES,
} from '@caesar/common/constants';
import { currentTeamIdSelector } from '../currentUser';
import { teamListSelector } from './team';
import { itemListSelector } from './item';

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

export const favoritesListSelector = createSelector(
  itemListSelector,
  currentTeamIdSelector,
  trashListSelector,
  (itemList, currentTeamId, trashList) => ({
    id: LIST_TYPE.FAVORITES,
    label: LIST_TYPE.FAVORITES,
    type: LIST_TYPE.FAVORITES,
    children: itemList.flatMap(item =>
      item.favorite &&
      item.teamId === currentTeamId &&
      item.listId !== trashList.id
        ? item.id
        : [],
    ),
  }),
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
  favoritesListSelector,
  trashListSelector,
  (inbox, lists, favorites, trash) => ({
    inbox,
    list: lists,
    favorites,
    trash,
  }),
);

export const teamIdsListSelector = createSelector(
  listsSelector,
  lists => lists.filter(list => list.teamId),
);

export const teamsTrashListsSelector = createSelector(
  teamIdsListSelector,
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
  teamIdsListSelector,
  currentTeamIdSelector,
  (lists, currentTeamId) =>
    lists.find(
      ({ teamId, label }) =>
        teamId === currentTeamId && label === LIST_TYPE.DEFAULT,
    ) || {},
);

export const currentTeamTrashListSelector = createSelector(
  teamIdsListSelector,
  currentTeamIdSelector,
  (lists, currentTeamId) =>
    lists.find(
      ({ teamId, label }) =>
        teamId === currentTeamId && label === LIST_TYPE.TRASH,
    ) || {},
);

export const currentTeamListsSelector = createSelector(
  teamIdsListSelector,
  currentTeamIdSelector,
  favoritesListSelector,
  currentTeamTrashListSelector,
  (teamLists, currentTeamId, favorites, trash) => ({
    list: teamLists
      .filter(
        list =>
          list.teamId === currentTeamId &&
          !NOT_SELECTABLE_LIST_TYPES.includes(list.type),
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

export const teamListsSelector = createSelector(
  listsSelector,
  teamIdPropSelector,
  (lists, teamId) => {
    return lists.filter(list => list.teamId === teamId) || [];
  },
);

export const teamDefaultListSelector = createSelector(
  listsSelector,
  teamIdPropSelector,
  (lists, teamId) => {
    return (
      lists.find(
        list => list.teamId === teamId && list.type === LIST_TYPE.DEFAULT,
      ) || []
    );
  },
);

export const selectableTeamsListsSelector = createSelector(
  teamListSelector,
  teamIdsListSelector,
  (teams, teamLists) => {
    const filterLists = lists =>
      lists.filter(({ type }) => !NOT_SELECTABLE_LIST_TYPES.includes(type));

    return teams.map(team => ({
      id: team.id,
      name: team.title,
      icon: team.icon,
      lists: filterLists(teamLists.filter(list => list.teamId === team.id)),
    }));
  },
);
