import { schema } from 'normalizr';

const isNeedToChangeListId = ({
  currentUserId = null,
  listId = null,
  entity,
}) => {
  if (!currentUserId || !listId) {
    return false;
  }
  if (entity.isShared && entity.ownerId !== currentUserId) {
    return true;
  }

  return false;
};

const shareItemSchema = (
  { currentUserId = null, listId = null } = {
    currentUserId: null,
    listId: null,
  },
) =>
  new schema.Entity(
    'shareItemById',
    {},
    {
      processStrategy: entity => ({
        ...entity,
        listId: isNeedToChangeListId({
          currentUserId,
          listId,
          entity,
        })
          ? listId
          : entity.listId,
      }),
    },
  );

export default shareItemSchema;
