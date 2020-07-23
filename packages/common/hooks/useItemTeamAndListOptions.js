import { useState } from 'react';
import { useEffectOnce, useUpdateEffect } from 'react-use';
import { useSelector } from 'react-redux';
import { TEAM_TYPE, TEAM_TEXT_TYPE } from '@caesar/common/constants';
import { sortByName } from '@caesar/common/utils/utils';
import { transformListTitle } from '@caesar/common/utils/string';
import { userDataSelector } from '@caesar/common/selectors/user';
import {
  teamListSelector,
  teamsByIdSelector,
} from '@caesar/common/selectors/entities/team';
import { getMovableLists } from '../api';

const getTeamTitle = (checkedTeamId, teams) => {
  switch (true) {
    case !!checkedTeamId &&
      teams[checkedTeamId]?.title.toLowerCase() === TEAM_TYPE.DEFAULT:
      return TEAM_TEXT_TYPE[TEAM_TYPE.DEFAULT];
    case !!checkedTeamId:
      return teams[checkedTeamId]?.title;
    case !checkedTeamId:
      return TEAM_TEXT_TYPE[TEAM_TYPE.PERSONAL];
    default:
      return '';
  }
};

const getListTitle = (listId, lists) =>
  transformListTitle(lists.find(list => list.id === listId)?.label);

export const useItemTeamAndListOptions = ({ teamId = null, listId }) => {
  const user = useSelector(userDataSelector);
  const teams = useSelector(teamListSelector);
  const teamsById = useSelector(teamsByIdSelector);
  const [lists, setLists] = useState([]);
  const [checkedTeamId, setCheckedTeamId] = useState(teamId);
  const [checkedListId, setCheckedListId] = useState(listId);

  useEffectOnce(() => {
    getMovableLists().then(({ data }) => {
      setLists(data);
    });

    if (teams[0].id !== null) {
      teams.splice(0, 0, {
        id: null,
        title: TEAM_TEXT_TYPE[TEAM_TYPE.PERSONAL],
        email: user.email,
      });
    }
  }, [teams]);

  useUpdateEffect(() => {
    const defaultTeamListId = lists.find(
      list => list.teamId === checkedTeamId && list.label === 'default',
    )?.id;

    setCheckedListId(defaultTeamListId);
  }, [checkedTeamId]);

  const teamOptions = teams
    .sort((a, b) => {
      if (a.title.toLowerCase() === TEAM_TYPE.PERSONAL) return -1;
      if (b.title.toLowerCase() === TEAM_TYPE.PERSONAL) return 1;

      if (a.title.toLowerCase() === TEAM_TYPE.DEFAULT) return 1;
      if (b.title.toLowerCase() === TEAM_TYPE.DEFAULT) return -1;

      return sortByName(a.title, b.title);
    })
    .map(team =>
      team.type === TEAM_TYPE.DEFAULT
        ? { ...team, title: TEAM_TEXT_TYPE[team.type] }
        : team,
    );

  const listOptions = lists
    .filter(list => list.teamId === checkedTeamId)
    .sort((a, b) => sortByName(a.label, b.label))
    .map(list => ({ ...list, label: transformListTitle(list.label) }));

  return {
    checkedTeamId,
    checkedTeamTitle: getTeamTitle(checkedTeamId, teamsById),
    checkedListId,
    checkedListLabel: getListTitle(checkedListId, lists),
    setCheckedTeamId,
    setCheckedListId,
    teamOptions,
    listOptions,
  };
};
