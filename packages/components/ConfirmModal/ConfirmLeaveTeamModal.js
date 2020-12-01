import React from 'react';
import { ConfirmModal } from './ConfirmModal';

export const ConfirmLeaveTeamModal = ({
  isOpened,
  teamTitle,
  onClickConfirm,
  onClickCancel,
}) => (
  <ConfirmModal
    isOpened={isOpened}
    title={`You are going to leave "${teamTitle}" team`}
    description="You will lose access to the team items. Are you sure?"
    confirmBtnText="Yes, leave team"
    onClickConfirm={onClickConfirm}
    onClickCancel={onClickCancel}
  />
);
