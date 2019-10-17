import { AbilityBuilder } from '@casl/ability';
import {
  COMMANDS_ROLES,
  DOMAIN_ROLES,
  PERMISSIONS,
  ENTITIES,
  EXTRA_ACTIONS,
  LIST_TYPE,
} from './constants';

const { TEAM_ENTITY_TYPE, ITEM_ENTITY_TYPE, LIST_ENTITY_TYPE } = ENTITIES;

const {
  CRUD_PERMISSION,
  CREATE_PERMISSION,
  READ_PERMISSION,
  UPDATE_PERMISSION,
  DELETE_PERMISSION,
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
  can(CRUD_PERMISSION, LIST_ENTITY_TYPE, { type: { $eq: LIST_TYPE } });
  can(CRUD_PERMISSION, ITEM_ENTITY_TYPE);
  can(CRUD_PERMISSION, TEAM_ENTITY_TYPE);
};

const defineCommandSubjectRules = (user, can) => {
  // command admin rules
  can('change_team_member_role', TEAM_ENTITY_TYPE, {
    userRole: COMMANDS_ROLES.USER_ROLE_ADMIN,
  });

  can(CRUD_PERMISSION, LIST_ENTITY_TYPE, {
    teamId: { $ne: null },
    type: LIST_TYPE,
    userRole: COMMANDS_ROLES.USER_ROLE_ADMIN,
  });

  can(CRUD_PERMISSION, ITEM_ENTITY_TYPE, {
    teamId: { $ne: null },
    userRole: COMMANDS_ROLES.USER_ROLE_ADMIN,
  });

  // command member rules
  can(READ_PERMISSION, TEAM_ENTITY_TYPE, {
    teamId: { $ne: null },
    userRole: COMMANDS_ROLES.USER_ROLE_MEMBER,
  });

  can(READ_PERMISSION, LIST_ENTITY_TYPE, {
    teamId: { $ne: null },
    userRole: COMMANDS_ROLES.USER_ROLE_MEMBER,
  });

  can(READ_PERMISSION, ITEM_ENTITY_TYPE, {
    teamId: { $ne: null },
    userRole: COMMANDS_ROLES.USER_ROLE_MEMBER,
  });
};

const definePersonalSubjectRules = (user, can) => {
  can(CRUD_PERMISSION, LIST_ENTITY_TYPE, {
    teamId: null,
    type: LIST_TYPE,
  });

  can(CREATE_PERMISSION, ITEM_ENTITY_TYPE, { teamId: null });
  can(UPDATE_PERMISSION, ITEM_ENTITY_TYPE, {
    teamId: null,
    ownerId: user.id,
  });
  can(DELETE_PERMISSION, ITEM_ENTITY_TYPE, { teamId: null });
};

export const createAbility = user => {
  if (!user) {
    return AbilityBuilder.define(defineRulesForUnknownUser);
  }

  if (user.roles.includes(DOMAIN_ROLES.ROLE_ADMIN)) {
    return AbilityBuilder.define(defineRulesForAdminUser);
  }

  return AbilityBuilder.define({ subjectName }, can => {
    definePersonalSubjectRules(user, can);
    defineCommandSubjectRules(user, can);
  });
};
