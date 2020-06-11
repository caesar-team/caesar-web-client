import React from 'react';
import { useDispatch } from 'react-redux';
import { removeListRequest } from '@caesar/common/actions/entities/list';
import { ConfirmModal } from '@caesar/components';

export const ConfirmRemoveListModal = ({
  id,
  isOpenedPopup,
  setIsOpenedPopup,
}) => {
  const dispatch = useDispatch();

  const handleClickConfirmRemove = () => {
    dispatch(removeListRequest(id));
    setIsOpenedPopup(false);
  };

  return (
    <ConfirmModal
      isOpen={!!isOpenedPopup}
      description="Are you sure you want to delete the list?"
      onClickOk={handleClickConfirmRemove}
      onClickCancel={() => setIsOpenedPopup(false)}
    />
  );
};
