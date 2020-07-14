import { useState } from 'react';
import { useEffectOnce } from 'react-use';
import { useSelector } from 'react-redux';
import { TEAM_TYPE, TEAM_TEXT_TYPE, LIST_TYPE } from '@caesar/common/constants';
import { sortByName } from '@caesar/common/utils/utils';
import { userDataSelector } from '@caesar/common/selectors/user';
import { teamListSelector } from '@caesar/common/selectors/entities/team';
import { listsSelector } from '@caesar/common/selectors/entities/list';

const LIST_TYPES_ARRAY = [
  LIST_TYPE.ROOT,
  LIST_TYPE.INBOX,
  LIST_TYPE.TRASH,
  LIST_TYPE.FAVORITES,
];

export const useItemTeamAndListOptions = ({ teamId = null, listId }) => {
  const user = useSelector(userDataSelector);
  const teams = useSelector(teamListSelector);
  const lists = useSelector(listsSelector);

  const [checkedTeamId, setCheckedTeamId] = useState(teamId);
  const [checkedListId, setCheckedListId] = useState(listId);

  useEffectOnce(() => {
    if (teams[0].id !== null) {
      teams.splice(0, 0, {
        id: null,
        title: TEAM_TEXT_TYPE[TEAM_TYPE.PERSONAL],
        email: user.email,
      });
    }
  }, [teams]);

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
    .filter(list => !LIST_TYPES_ARRAY.includes(list.type))
    .filter(list => list.teamId === checkedTeamId)
    .sort((a, b) => sortByName(a.label, b.label));

  return {
    checkedTeamId,
    checkedListId,
    setCheckedTeamId,
    setCheckedListId,
    teamOptions,
    listOptions,
  };
};
