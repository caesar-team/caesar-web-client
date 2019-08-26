import { uuid4 } from 'common/utils/uuid4';
import { FAVORITES_TYPE } from 'common/constants';

export const getFavoritesList = itemsById => {
  const favoriteListId = uuid4();
  const favorites = Object.values(itemsById)
    .filter(({ favorite }) => favorite)
    .map(({ id }) => id);

  return {
    id: favoriteListId,
    type: FAVORITES_TYPE,
    label: 'Favorites',
    children: favorites,
  };
};
