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
  can(PERMISSION.EDIT, PERMISSION_ENTITY.TEAM_MEMBER, {
    team_member_edit: true,
  });
  can(PERMISSION.DELETE, PERMISSION_ENTITY.TEAM_MEMBER, {
    team_member_remove: true,
  });
  can(PERMISSION.CREATE, PERMISSION_ENTITY.LIST, {
    create_list: true,
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
  can(PERMISSION.EDIT, PERMISSION_ENTITY.ITEM, {
    edit_item: true,
  });
  can(PERMISSION.MOVE, PERMISSION_ENTITY.ITEM, {
    move_item: true,
  });
  can(PERMISSION.SHARE, PERMISSION_ENTITY.ITEM, {
    batch_share_item: true,
  });
  can(PERMISSION.FAVORITE, PERMISSION_ENTITY.ITEM, {
    favorite_item_toggle: true,
  });
  can([PERMISSION.TRASH, PERMISSION.RESTORE], PERMISSION_ENTITY.ITEM, {
    move_item: true,
    delete_item: true,
  });
  can(PERMISSION.DELETE, PERMISSION_ENTITY.ITEM, {
    delete_item: true,
  });
  can(PERMISSION.MULTISELECT, PERMISSION_ENTITY.ITEM, {
    batch_share_item: true,
    move_item: true,
    delete_item: true,
  });
  can(PERMISSION.CREATE, PERMISSION_ENTITY.TEAM_ITEM, {
    team_create_item: true,
  });
  can(PERMISSION.EDIT, PERMISSION_ENTITY.TEAM_ITEM, {
    team_edit_item: true,
  });
  can(PERMISSION.MOVE, PERMISSION_ENTITY.TEAM_ITEM, {
    team_move_item: true,
  });
  can(PERMISSION.SHARE, PERMISSION_ENTITY.TEAM_ITEM, {
    team_batch_share_item: true,
  });
  can(PERMISSION.FAVORITE, PERMISSION_ENTITY.TEAM_ITEM, {
    team_favorite_item_toggle: true,
  });
  can([PERMISSION.TRASH, PERMISSION.RESTORE], PERMISSION_ENTITY.TEAM_ITEM, {
    team_move_item: true,
    team_delete_item: true,
  });
  can(PERMISSION.DELETE, PERMISSION_ENTITY.TEAM_ITEM, {
    team_delete_item: true,
  });
  can(PERMISSION.MULTISELECT, PERMISSION_ENTITY.TEAM_ITEM, {
    team_batch_share_item: true,
    team_move_item: true,
    team_delete_item: true,
  });
});
