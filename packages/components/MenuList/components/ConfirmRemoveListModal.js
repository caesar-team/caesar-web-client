import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getPlural } from '@caesar/common/utils/string';
import { itemsByListIdSelector } from '@caesar/common/selectors/entities/item';
import { removeListRequest } from '@caesar/common/actions/entities/list';
import { ConfirmModal } from '@caesar/components';

export const ConfirmRemoveListModal = ({
  currentTeam,
  list,
  isOpenedPopup,
  setOpenedPopup,
}) => {
  const dispatch = useDispatch();
  const { id, label } = list;

  const listItemsCounter =
    useSelector(state => itemsByListIdSelector(state, { listId: id }))
      ?.length || 0;

  const handleClickConfirmRemove = () => {
    dispatch(removeListRequest(currentTeam?.id || null, id));
    setOpenedPopup(false);
  };

  return (
    <ConfirmModal
      isOpened={!!isOpenedPopup}
      title={`You are going to remove «${label}» list`}
      // TODO: Full text when share list will be implemented
      // 'You delete 20 items and 15 people lose access'
      description={`Are you sure you want to move ${listItemsCounter} ${getPlural(
        listItemsCounter,
        ['item', 'items'],
      )} to the trash?`}
      icon="trash"
      confirmBtnText="Remove"
      onClickConfirm={handleClickConfirmRemove}
      onClickCancel={() => setOpenedPopup(false)}
    />
  );
};
