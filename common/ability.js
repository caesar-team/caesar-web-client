import { AbilityBuilder } from '@casl/ability';
import {
  COMMANDS_ROLES,
  DOMAIN_ROLES,

  CHILD_ITEM_ENTITY_TYPE,
  ITEM_ENTITY_TYPE,
  LIST_ENTITY_TYPE,
  TEAM_ENTITY_TYPE,
  MEMBER_ENTITY_TYPE,

  INBOX_TYPE,
  FAVORITES_TYPE,
  TRASH_TYPE,
  DEFAULT_LIST_TYPE,
} from './constants';

function subjectName(subject) {
  console.log('subject', subject);
  if (!subject || typeof subject === 'string') {
    return subject;
  }

  return subject.__type;
}

const defineCommandRules = (user, can) => {
  const { roles } = user;

  if (roles.includes(DOMAIN_ROLES.ROLE_ADMIN)) {
    can('crud', TEAM_ENTITY_TYPE);
  } else {
    can('update', TEAM_ENTITY_TYPE, { userRole: 'admin' });
    can('read', TEAM_ENTITY_TYPE);
  }
};

const defineDomainRules = (user, can) => {
  const { id: userId, roles } = user;

  if (roles.includes(DOMAIN_ROLES.USER_ROLE_ADMIN)) {
    can('crud', ITEM_ENTITY_TYPE);
  }


};

export const createAbility = user => {
  if (!user) {
    return AbilityBuilder.define({ subjectName }, can => {
      // TODO: figure out about disable all actions for unknown user
    });
  }

  return AbilityBuilder.define({ subjectName }, can => {
    defineCommandRules(user, can);
    defineDomainRules(user, can);
  });
};
