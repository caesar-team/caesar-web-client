import { createSelector } from 'reselect';
import { DOMAIN_ROLES } from '../../constants';
import { usersByIdSelector } from './user';
import { teamsByIdSelector, teamIdPropSelector } from './team';

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

const memberIdsPropSelector = (_, props) => props.memberIds;

export const membersBatchSelector = createSelector(
  membersByIdSelector,
  memberIdsPropSelector,
  (membersById, memberIds) => memberIds.map(memberId => membersById[memberId]),
);

export const memberAdminsSelector = createSelector(
  memberListSelector,
  membersList =>
    membersList.filter(({ domainRoles }) =>
      domainRoles?.includes(DOMAIN_ROLES.ROLE_ADMIN),
    ),
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
