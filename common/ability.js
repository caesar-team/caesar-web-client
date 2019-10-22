import { AbilityBuilder } from '@casl/ability';
import {
  COMMANDS_ROLES,
  DOMAIN_ROLES,
  PERMISSIONS,
  ENTITIES,
  LIST_TYPE,
} from './constants';

const { TEAM_ENTITY_TYPE, ITEM_ENTITY_TYPE, LIST_ENTITY_TYPE } = ENTITIES;

const {
  CRUD_PERMISSION,
  CREATE_PERMISSION,
  UPDATE_PERMISSION,
  DELETE_PERMISSION,
  CHANGE_TEAM_MEMBER_ROLE_PERMISSION,
  JOIN_MEMBER_TO_TEAM,
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
  can(CRUD_PERMISSION, TEAM_ENTITY_TYPE);
  can(CRUD_PERMISSION, LIST_ENTITY_TYPE, { type: LIST_TYPE });
  can(CRUD_PERMISSION, ITEM_ENTITY_TYPE);
  can(CRUD_PERMISSION, TEAM_ENTITY_TYPE);

  can(CHANGE_TEAM_MEMBER_ROLE_PERMISSION, TEAM_ENTITY_TYPE);
  can(JOIN_MEMBER_TO_TEAM, TEAM_ENTITY_TYPE);
  can(MOVE_ITEM_PERMISSION, ITEM_ENTITY_TYPE);
  can(SHARE_ITEM_PERMISSION, ITEM_ENTITY_TYPE);
};

const defineCommandSubjectRules = (user, can) => {
  // command admin rules
  can(CHANGE_TEAM_MEMBER_ROLE_PERMISSION, TEAM_ENTITY_TYPE, {
    userRole: COMMANDS_ROLES.USER_ROLE_ADMIN,
  });

  can(JOIN_MEMBER_TO_TEAM, TEAM_ENTITY_TYPE, {
    userRole: COMMANDS_ROLES.USER_ROLE_ADMIN,
  });

  can(CRUD_PERMISSION, ITEM_ENTITY_TYPE, {
    userRole: COMMANDS_ROLES.USER_ROLE_ADMIN,
    teamId: { $ne: null },
    listType: LIST_TYPE,
  });

  can(SHARE_ITEM_PERMISSION, ITEM_ENTITY_TYPE, {
    userRole: COMMANDS_ROLES.USER_ROLE_ADMIN,
    teamId: { $ne: null },
  });

  can(MOVE_ITEM_PERMISSION, ITEM_ENTITY_TYPE, {
    userRole: COMMANDS_ROLES.USER_ROLE_ADMIN,
    teamId: { $ne: null },
  });
};

const definePersonalSubjectRules = (user, can) => {
  can(MOVE_ITEM_PERMISSION, ITEM_ENTITY_TYPE, {
    teamId: null,
  });

  can(CREATE_PERMISSION, ITEM_ENTITY_TYPE, {
    teamId: null,
    listType: LIST_TYPE,
  });

  can(UPDATE_PERMISSION, ITEM_ENTITY_TYPE, {
    teamId: null,
    ownerId: user.id,
  });

  can(DELETE_PERMISSION, ITEM_ENTITY_TYPE, {
    teamId: null,
  });

  can(SHARE_ITEM_PERMISSION, ITEM_ENTITY_TYPE, {
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
