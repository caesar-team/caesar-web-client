import { AbilityBuilder } from '@casl/ability';
import {
  COMMANDS_ROLES,
  DOMAIN_ROLES,
  PERMISSIONS,
  ENTITY_TYPE,
  LIST_TYPE,
} from './constants';

const {
  CRUD_PERMISSION,
  CREATE_PERMISSION,
  READ_PERMISSION,
  UPDATE_PERMISSION,
  DELETE_PERMISSION,
  CHANGE_TEAM_MEMBER_ROLE_PERMISSION,
  JOIN_MEMBER_TO_TEAM,
  LEAVE_MEMBER_FROM_TEAM,
  MOVE_ITEM_PERMISSION,
  SHARE_ITEM_PERMISSION,
} = PERMISSIONS;

const ALL = 'all';

function subjectName(subject) {
  // console.log('subject', subject);
  if (!subject || typeof subject === 'string') {
    return subject;
  }

  return subject.__type;
}

const defineRulesForUnknownUser = cannot => cannot(CRUD_PERMISSION, ALL);

const defineRulesForAdminUser = can => {
  can(CRUD_PERMISSION, ENTITY_TYPE.TEAM);
  can(CRUD_PERMISSION, ENTITY_TYPE.LIST, { type: LIST_TYPE.LIST });
  can(
    [READ_PERMISSION, UPDATE_PERMISSION, DELETE_PERMISSION],
    ENTITY_TYPE.ITEM,
  );
  can(CREATE_PERMISSION, ENTITY_TYPE.ITEM, { listType: LIST_TYPE.LIST });
  can(CRUD_PERMISSION, ENTITY_TYPE.TEAM);

  can(CHANGE_TEAM_MEMBER_ROLE_PERMISSION, ENTITY_TYPE.TEAM);
  can(JOIN_MEMBER_TO_TEAM, ENTITY_TYPE.TEAM);
  can(LEAVE_MEMBER_FROM_TEAM, ENTITY_TYPE.TEAM);
  can(MOVE_ITEM_PERMISSION, ENTITY_TYPE.ITEM);
  can(SHARE_ITEM_PERMISSION, ENTITY_TYPE.ITEM);
};

const defineCommandSubjectRules = (user, can) => {
  // command admin rules
  can(CHANGE_TEAM_MEMBER_ROLE_PERMISSION, ENTITY_TYPE.TEAM, {
    userRole: COMMANDS_ROLES.USER_ROLE_ADMIN,
  });

  can(JOIN_MEMBER_TO_TEAM, ENTITY_TYPE.TEAM, {
    userRole: COMMANDS_ROLES.USER_ROLE_ADMIN,
  });

  can(LEAVE_MEMBER_FROM_TEAM, ENTITY_TYPE.TEAM, {
    userRole: COMMANDS_ROLES.USER_ROLE_ADMIN,
  });

  can(CRUD_PERMISSION, ENTITY_TYPE.ITEM, {
    userRole: COMMANDS_ROLES.USER_ROLE_ADMIN,
    teamId: { $ne: null },
    listType: LIST_TYPE.LIST,
  });

  can(SHARE_ITEM_PERMISSION, ENTITY_TYPE.ITEM, {
    userRole: COMMANDS_ROLES.USER_ROLE_ADMIN,
    teamId: { $ne: null },
  });

  can(MOVE_ITEM_PERMISSION, ENTITY_TYPE.ITEM, {
    userRole: COMMANDS_ROLES.USER_ROLE_ADMIN,
    teamId: { $ne: null },
  });
};

const definePersonalSubjectRules = (user, can) => {
  can(MOVE_ITEM_PERMISSION, ENTITY_TYPE.ITEM, {
    teamId: null,
  });

  can(CREATE_PERMISSION, ENTITY_TYPE.ITEM, {
    teamId: null,
    listType: LIST_TYPE.LIST,
  });

  can(UPDATE_PERMISSION, ENTITY_TYPE.ITEM, {
    teamId: null,
    ownerId: user.id,
  });

  can(DELETE_PERMISSION, ENTITY_TYPE.ITEM, {
    teamId: null,
  });

  can(SHARE_ITEM_PERMISSION, ENTITY_TYPE.ITEM, {
    teamId: null,
    ownerId: user.id,
  });
};

export const createAbility = user => {
  if (!user) {
    return AbilityBuilder.define(defineRulesForUnknownUser);
  }

  if (user.roles.includes(DOMAIN_ROLES.ROLE_ADMIN)) {
    return AbilityBuilder.define({ subjectName }, defineRulesForAdminUser);
  }

  return AbilityBuilder.define({ subjectName }, can => {
    definePersonalSubjectRules(user, can);
    defineCommandSubjectRules(user, can);
  });
};
