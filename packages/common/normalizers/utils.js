import { uuid4 } from '@caesar/common/utils/uuid4';
import { TEAM_TYPE, LIST_TYPE } from '@caesar/common/constants';

export const getFavoritesList = ({
  favoriteListId = uuid4(),
  itemsById,
  trashListId,
  teamId,
}) => {
  const favorites = Object.values(itemsById)
    .filter(({ favorite, listId }) => favorite && listId !== trashListId)
    .map(({ id }) => id);

  return {
    id: favoriteListId,
    type: LIST_TYPE.FAVORITES,
    label: 'Favorites',
    children: favorites,
    teamId: teamId === TEAM_TYPE.PERSONAL ? null : teamId,
  };
};
