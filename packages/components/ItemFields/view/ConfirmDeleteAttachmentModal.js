import React from 'react';
import { ConfirmModal } from '../../ConfirmModal';

export const ConfirmDeleteAttachmentModal = ({
  isOpened,
  fileName,
  onDeleteFile,
  handleCloseModal,
}) => (
  <ConfirmModal
    isOpened={isOpened}
    title="You are going to delete the attachment"
    description={`Are sure you want to delete "${fileName}"?`}
    icon="trash"
    confirmBtnText="Delete"
    onClickConfirm={onDeleteFile}
    onClickCancel={handleCloseModal}
  />
);
