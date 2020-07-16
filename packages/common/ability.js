/* eslint-disable camelcase */
import { defineAbility } from '@casl/ability';
import { PERMISSION, PERMISSION_ENTITY } from './constants';

const subjectName = subject => {
  if (!subject || typeof subject === 'string') {
    return subject;
  }

  return subject.__typename;
};

export const ability = defineAbility({ subjectName }, can => {
  can(PERMISSION.CREATE, PERMISSION_ENTITY.TEAM, {
    team_create: true,
  });
  can(PERMISSION.DELETE, PERMISSION_ENTITY.TEAM, {
    team_delete: true,
  });
  can(PERMISSION.ADD, PERMISSION_ENTITY.TEAM_MEMBER, {
    team_member_add: true,
  });
  can(PERMISSION.CREATE, PERMISSION_ENTITY.LIST, {
    list_create: true,
  });
  can(PERMISSION.EDIT, PERMISSION_ENTITY.LIST, {
    edit_list: true,
  });
  can(PERMISSION.SORT, PERMISSION_ENTITY.LIST, {
    sort_list: true,
  });
  can(PERMISSION.DELETE, PERMISSION_ENTITY.LIST, {
    delete_list: true,
  });
  can(PERMISSION.CREATE, PERMISSION_ENTITY.TEAM_LIST, {
    team_create_list: true,
  });
  can(PERMISSION.EDIT, PERMISSION_ENTITY.TEAM_LIST, {
    team_edit_list: true,
  });
  can(PERMISSION.SORT, PERMISSION_ENTITY.TEAM_LIST, {
    team_sort_list: true,
  });
  can(PERMISSION.DELETE, PERMISSION_ENTITY.TEAM_LIST, {
    team_delete_list: true,
  });
  can(PERMISSION.CREATE, PERMISSION_ENTITY.ITEM, {
    create_item: true,
  });
  can(PERMISSION.CREATE, PERMISSION_ENTITY.TEAM_ITEM, {
    team_create_item: true,
  });
});
