import { useSelector } from 'react-redux';
import { generalItemsBatchSelector } from '../selectors/entities/item';

export const useListItemCounter = children => {
  const count =
    useSelector(state =>
      generalItemsBatchSelector(state, {
        itemIds: children,
      }),
    )?.length || 0;

  return count;
};
