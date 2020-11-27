import { TEAM_ROLES, TEAM_ROLES_LABELS } from '@caesar/common/constants';

export const MODAL = {
  NEW_TEAM = 'newTeamModal'
  INVITE_MEMBER: 'inviteMemberModal',
  REMOVE_MEMBER: 'removeMemberModal',
  LEAVE_TEAM: 'leaveTeamModal',
  REMOVE_TEAM: 'removeTeamModal',
};

export const ROLE_COLUMN_WIDTH = 140 + 48;
export const MENU_COLUMN_WIDTH = 16 + 48;
export const WIDTH_RATIO = {
  name: 0.5,
  email: 0.5,
};

export const OPTIONS = [
  {
    value: TEAM_ROLES.ROLE_ADMIN,
    label: TEAM_ROLES_LABELS.ROLE_ADMIN,
  },
  {
    value: TEAM_ROLES.ROLE_MEMBER,
    label: TEAM_ROLES_LABELS.ROLE_MEMBER,
  },
];
