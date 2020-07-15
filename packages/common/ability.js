/* eslint-disable camelcase */
import { defineAbility } from '@casl/ability';

function subjectName(item) {
  if (!item || typeof item === 'string') {
    return item;
  }

  return item.__typename;
}

export const ability = defineAbility({ subjectName }, can => {
  can('create', 'list', {
    list_create: true,
  });
  can('create', 'team', {
    team_create: true,
  });
});
