import React from 'react';
import { ConfirmModal } from './ConfirmModal';

export const ConfirmRemoveMemberModal = ({
  isOpened,
  memberName,
  onClickConfirm,
  onClickCancel,
}) => (
  <ConfirmModal
    isOpened={isOpened}
    title={`You're going to remove ${memberName} from the team`}
    description={`${memberName} will lose access to the team items. Are you sure?`}
    confirmBtnText="Remove"
    onClickConfirm={onClickConfirm}
    onClickCancel={onClickCancel}
  />
);
