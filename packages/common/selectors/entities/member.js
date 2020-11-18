import { createSelector } from 'reselect';
import { usersByIdSelector, userIdPropSelector } from './user';
import {
  teamsByIdSelector,
  teamIdPropSelector,
  teamIdsPropSelector,
} from './team';

export const entitiesSelector = state => state.entities;

export const memberEntitySelector = createSelector(
  entitiesSelector,
  entities => entities?.member || {},
);

export const membersByIdSelector = createSelector(
  memberEntitySelector,
  memberEntity => memberEntity.byId || {},
);

export const memberIdPropSelector = (_, props) => props.memberId;

export const memberSelector = createSelector(
  membersByIdSelector,
  memberIdPropSelector,
  (membersById, memberId) => membersById[memberId],
);

export const memberListSelector = createSelector(
  membersByIdSelector,
  byId => Object.values(byId) || [],
);

export const memberByUserIdAndTeamIdSelector = createSelector(
  memberListSelector,
  userIdPropSelector,
  teamIdPropSelector,
  (members, userId, teamId) =>
    members.find(
      member => member.userId === userId && member.teamId === teamId,
    ),
);

const memberIdsPropSelector = (_, props) => props.memberIds;

export const membersBatchSelector = createSelector(
  membersByIdSelector,
  memberIdsPropSelector,
  (membersById, memberIds) => memberIds.map(memberId => membersById[memberId]),
);

export const membersWithInfoBatchSelector = createSelector(
  usersByIdSelector,
  membersByIdSelector,
  memberIdsPropSelector,
  (membersById, memberIds) => memberIds.map(memberId => membersById[memberId]),
);

export const teamMembersShortViewSelector = createSelector(
  membersByIdSelector,
  teamsByIdSelector,
  teamIdPropSelector,
  (members, team, teamId) =>
    team[teamId]?.members?.reduce((acc, memberId) => {
      const member = members[memberId];

      return [...acc, member];
    }, []) || [],
);

export const teamMembersFullViewSelector = createSelector(
  usersByIdSelector,
  membersByIdSelector,
  teamsByIdSelector,
  teamIdPropSelector,
  (users, members, team, teamId) =>
    team[teamId]?.members?.reduce((acc, memberId) => {
      const member = members[memberId];

      if (!member) return acc;

      const { avatar, email, id, name, publicKey } = users[member.userId];
      const user = { ...member, avatar, email, userId: id, name, publicKey };

      return [...acc, user];
    }, []) || [],
);

export const teamsMembersFullViewSelector = createSelector(
  usersByIdSelector,
  membersByIdSelector,
  teamsByIdSelector,
  teamIdsPropSelector,
  (users, members, teams, teamIds) => teamIds.reduce((acc, teamId) => {
    const membersIds = teams[teamId]?.members || [];
    
    const userMembers = membersIds.map(memberId => {
      const { id, email } = users[members[memberId]?.userId];
      return { id, email };
    });
    
    return [...acc, ...userMembers];
    
  }, []) || [],
);
