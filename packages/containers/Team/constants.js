import { TEAM_ROLES } from '@caesar/common/constants';

export const INVITE_MEMBER_MODAL = 'inviteMemberModal';
export const LEAVE_TEAM_MODAL = 'leaveTeamModal';
export const REMOVE_TEAM_MODAL = 'removeTeamModal';

export const ROLE_COLUMN_WIDTH = 125 + 48;
export const MENU_COLUMN_WIDTH = 16 + 48;
export const WIDTH_RATIO = {
  name: 0.5,
  email: 0.5,
};

export const OPTIONS = [
  {
    value: TEAM_ROLES.USER_ROLE_ADMIN,
    label: TEAM_ROLES.USER_ROLE_ADMIN,
  },
  {
    value: TEAM_ROLES.USER_ROLE_MEMBER,
    label: TEAM_ROLES.USER_ROLE_MEMBER,
  },
];
