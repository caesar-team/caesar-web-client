import { uuid4 } from '@caesar/common/utils/uuid4';
import { LIST_TYPE } from '@caesar/common/constants';

export const getFavoritesList = (itemsById, trashListId) => {console.log(itemsById);
  const favoriteListId = uuid4();
  const favorites = Object.values(itemsById)
    .filter(({ favorite, listId }) => favorite && listId !== trashListId)
    .map(({ id }) => id);

  return {
    id: favoriteListId,
    type: LIST_TYPE.FAVORITES,
    label: 'Favorites',
    children: favorites,
  };
};
