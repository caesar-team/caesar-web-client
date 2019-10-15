import { AbilityBuilder } from '@casl/ability';
import {
  COMMANDS_ROLES,
  DOMAIN_ROLES,
  CHILD_ITEM_ENTITY_TYPE,
  ITEM_ENTITY_TYPE,
  LIST_ENTITY_TYPE,
  TEAM_ENTITY_TYPE,
  MEMBER_ENTITY_TYPE,
  LIST_TYPE,
} from './constants';

function subjectName(subject) {
  console.log('subject', subject);
  if (!subject || typeof subject === 'string') {
    return subject;
  }

  return subject.__type;
}

const defineRulesForUnknownUser = cannot => {
  cannot('crud', TEAM_ENTITY_TYPE);
  cannot('crud', LIST_ENTITY_TYPE);
  cannot('crud', ITEM_ENTITY_TYPE);
  cannot('crud', CHILD_ITEM_ENTITY_TYPE);
  cannot('crud', MEMBER_ENTITY_TYPE);
};

const defineAdminRules = can => {
  can('crud', TEAM_ENTITY_TYPE);
  can('crud', LIST_ENTITY_TYPE);
  can('crud', ITEM_ENTITY_TYPE);
  can('crud', CHILD_ITEM_ENTITY_TYPE);
  can('crud', MEMBER_ENTITY_TYPE);
};

const defineCommandSubjectRules = (user, can) => {
  // command admin rules
  can('update', TEAM_ENTITY_TYPE, {
    userRole: COMMANDS_ROLES.USER_ROLE_ADMIN,
  });
  can('crud', LIST_ENTITY_TYPE, {
    teamId: { $ne: null },
    type: { $eq: LIST_TYPE },
    userRole: COMMANDS_ROLES.USER_ROLE_ADMIN,
  });
  can('crud', ITEM_ENTITY_TYPE, {
    teamId: { $ne: null },
    userRole: COMMANDS_ROLES.USER_ROLE_ADMIN,
  });

  // command member rules
  can('read', TEAM_ENTITY_TYPE, {
    teamId: { $ne: null },
    userRole: COMMANDS_ROLES.USER_ROLE_MEMBER,
  });
  can('read', LIST_ENTITY_TYPE, {
    teamId: { $ne: null },
    userRole: COMMANDS_ROLES.USER_ROLE_MEMBER,
  });
  can('read', ITEM_ENTITY_TYPE, {
    teamId: { $ne: null },
    userRole: COMMANDS_ROLES.USER_ROLE_MEMBER,
  });
};

const definePersonalSubjectRules = (user, can) => {
  can('crud', LIST_ENTITY_TYPE, {
    teamId: { $eq: null },
    type: { $eq: LIST_TYPE },
  });
  can('crud', ITEM_ENTITY_TYPE, { teamId: { $eq: null } });
};

export const createAbility = user => {
  if (!user) {
    return AbilityBuilder.define(defineRulesForUnknownUser);
  }

  if (user.roles.includes(DOMAIN_ROLES.ROLE_ADMIN)) {
    return AbilityBuilder.define(defineAdminRules);
  }

  return AbilityBuilder.define({ subjectName }, can => {
    definePersonalSubjectRules(user, can);
    defineCommandSubjectRules(user, can);
  });
};
