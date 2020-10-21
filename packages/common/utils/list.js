import { useSelector } from 'react-redux';
import { generalItemsBatchSelector } from '../selectors/entities/item';

export const listItemCount = children => {
  return (
    useSelector(state =>
      generalItemsBatchSelector(state, {
        itemIds: children,
      }),
    )?.length || 0
  );
};
