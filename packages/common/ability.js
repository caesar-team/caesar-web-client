/* eslint-disable camelcase */
import { defineAbility } from '@casl/ability';

function subjectName(item) {
  if (!item || typeof item === 'string') {
    return item;
  }

  return item.__typename;
}

export const ability = defineAbility({ subjectName }, can => {
  can('create', 'team', {
    team_create: true,
  });
  can('delete', 'team', {
    team_delete: true,
  });
  // TODO: Implement team_edit feature
  // can('edit', 'team', {
  //   team_edit: true,
  // });
  // TODO: need to implement or not?: team_members
  // can('get_members', 'team', {
  //   team_members: true,
  // });
  can('add_member', 'team', {
    team_member_add: true,
  });
  // TODO: Implement on backend, then here PATCH edit_member_role https://dev.caesar.team/api/teams/5d7a16b1-7dd0-42e8-84d8-75ebfd392359/members/87730d88-fe96-4fa9-94ba-9d053435c3c7
  can('create', 'list', {
    list_create: true,
  });
});
