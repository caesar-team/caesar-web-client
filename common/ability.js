import { AbilityBuilder } from '@casl/ability';
import {
  COMMANDS_ROLES,
  DOMAIN_ROLES,

  CHILD_ITEM_ENTITY_TYPE,
  ITEM_ENTITY_TYPE,
  LIST_ENTITY_TYPE,
  TEAM_ENTITY_TYPE,
  MEMBER_ENTITY_TYPE,
} from './constants';

function subjectName(item) {
  if (!item || typeof item === 'string') {
    return item;
  }

  return item.__type;
}

export const createAbility = user => {
  if (!user) {
    return AbilityBuilder.define({ subjectName }, can => {});
  }

  const { id: userId, roles } = user;

  return AbilityBuilder.define({ subjectName }, can => {
    // TODO: add rules
  });
};
