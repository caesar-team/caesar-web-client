import { AbilityBuilder } from '@casl/ability';
import {
  USER_ROLE,
  READ_ONLY_USER_ROLE,
  ANONYMOUS_USER_ROLE,
} from './constants';

function subjectName(item) {
  if (!item || typeof item === 'string') {
    return item;
  }

  return item.__type;
}

export const createAbility = ({ id: userId, roles }) => {
  return AbilityBuilder.define({ subjectName }, can => {
    if (roles.includes(USER_ROLE)) {
      can('read', 'Item');
      can(['create', 'update', 'delete'], 'Item', { ownerId: userId });
      can('share', 'Item', { ownerId: userId });
    }
  });
};
