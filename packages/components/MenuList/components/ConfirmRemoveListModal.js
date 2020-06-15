import React from 'react';
import { useDispatch } from 'react-redux';
import { removeListRequest } from '@caesar/common/actions/entities/list';
import { ConfirmModal } from '@caesar/components';

export const ConfirmRemoveListModal = ({
  item,
  isOpenedPopup,
  setIsOpenedPopup,
}) => {
  const dispatch = useDispatch();
  const { id, label, children = [] } = item;

  const handleClickConfirmRemove = () => {
    dispatch(removeListRequest(id));
    setIsOpenedPopup(false);
  };

  return (
    <ConfirmModal
      isOpen={!!isOpenedPopup}
      title={`You are going to remove «${label}» list`}
      // TODO: Full text when share list will be implemented
      // 'You delete 20 items and 15 people lose access'
      description={`You will delete ${children?.length} item${
        children?.length === 1 ? '' : 's'
      }`}
      icon="trash"
      confirmBtnText="Remove"
      onClickOk={handleClickConfirmRemove}
      onClickCancel={() => setIsOpenedPopup(false)}
    />
  );
};
