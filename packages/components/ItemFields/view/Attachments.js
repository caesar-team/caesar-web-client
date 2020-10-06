import React, { useState, useEffect } from 'react';
import { useUpdateEffect } from 'react-use';
import equal from 'fast-deep-equal';
import styled from 'styled-components';
import {
  downloadFile,
  downloadAsZip,
  getUniqueAndDublicates,
} from '@caesar/common/utils/file';
import { PERMISSION } from '@caesar/common/constants';
import { isIterable } from '@caesar/common/utils/utils';
import { processUploadedFiles } from '@caesar/common/utils/attachment';
import { Can } from '../../Ability';
import { Icon } from '../../Icon';
import { File } from '../../File';
import { Uploader } from '../../Uploader';
import { NewFilesModal } from './NewFilesModal';
import { ConfirmDeleteAttachmentModal } from './ConfirmDeleteAttachmentModal';
import { ItemDragZone } from '../common';

const Wrapper = styled.div``;

const Title = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  font-weight: 600;
`;

const DownloadIcon = styled(Icon)`
  margin-left: 16px;
  cursor: pointer;

  &:hover {
    color: ${({ theme }) => theme.color.black};
  }
`;

const Inner = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  grid-gap: 16px 40px;
`;

const PlusIcon = styled(Icon)``;

const AddNewAttach = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  align-self: center;
  height: 40px;
  border: 1px dashed ${({ theme }) => theme.color.gallery};
  border-radius: ${({ theme }) => theme.borderRadius};
  cursor: pointer;
  transition: border-color 0.2s;

  ${({ isDragActive, theme }) =>
    isDragActive &&
    `border-color: ${theme.color.black};

    ${PlusIcon} {
      color: ${theme.color.black};
    }
  `}

  &:hover {
    border-color: ${({ theme }) => theme.color.black};

    ${PlusIcon} {
      color: ${({ theme }) => theme.color.black};
    }
  }
`;

const MODAL = {
  NEW_FILES: 'new_files',
  DELETE_FILE: 'delete_file',
};

export const Attachments = ({
  attachments = [],
  raws = {},
  itemSubject,
  onClickAcceptEdit,
  isVisibleDragZone,
}) => {
  const [newFiles, setNewFiles] = useState([]);
  const [itemRaws, setItemRaws] = useState(raws);
  const [itemAttachments, setItemAttachments] = useState(attachments);
  const [openedModal, setOpenedModal] = useState(null);

  const syncStateWithServer = newItemData => {
    onClickAcceptEdit(newItemData);
  };

  useUpdateEffect(() => {
    if (!equal(attachments, itemAttachments)) {
      setItemAttachments(attachments);
    }
  }, [attachments]);

  useEffect(() => {
    if (raws && Object.keys(raws)?.length > 0) {
      setItemRaws(raws);
    }
  }, [raws, setItemRaws]); // This will only run when one of those variables change

  // TODO: Add loader if raws are not ready
  const handleClickDownloadFile = attachment => {
    const { name, ext } = attachment;
    const raw = itemRaws[attachment.id];

    return typeof raw !== 'undefined'
      ? downloadFile(raw, `${name}.${ext}`)
      : false;
  };

  const handleClickDownloadAll = () => {
    const files = itemAttachments.map(attachment => ({
      raw: raws[attachment.id],
      name: `${attachment.name}.${attachment.ext}`,
    }));

    downloadAsZip(files);
  };

  const onClickRemove = handleAttachment => {
    const attachmentIndex = itemAttachments.findIndex(
      attachment => attachment.id === handleAttachment.id,
    );

    itemAttachments.splice(attachmentIndex, 1);
    delete itemRaws[handleAttachment.id];

    setItemAttachments(itemAttachments);
    setItemRaws(itemRaws);
    syncStateWithServer({
      attachments: itemAttachments,
      raws: itemRaws,
    });
  };

  const handleChange = (name, files) => {
    const splitedFiles = processUploadedFiles(files);

    const { uniqNewFiles, duplicatedFiles } = getUniqueAndDublicates(
      [...splitedFiles.attachments],
      [...itemAttachments],
    );

    const uploadedDuplicatedFiles = duplicatedFiles.map(file => ({
      ...file,
      error: 'The file already exists',
    }));

    const uniqNewRaws = Object.fromEntries(
      uniqNewFiles.map(file => [file.id, splitedFiles.raws[file.id]]),
    );

    const allAttachments = [...itemAttachments, ...uniqNewFiles];
    const allRaws = { ...itemRaws, ...uniqNewRaws };

    setNewFiles([...uploadedDuplicatedFiles, ...uniqNewFiles]);

    setItemRaws(allRaws);
    setItemAttachments(allAttachments);

    setOpenedModal(MODAL.NEW_FILES);
    syncStateWithServer({
      attachments: allAttachments,
      raws: allRaws,
    });
  };

  const AttachmentsComponent = () => (
    <Wrapper>
      <Title>
        Attachments ({attachments?.length ? attachments.length : 0})
        {(attachments?.length ? attachments.length : 0) > 0 && (
          <DownloadIcon
            name="download"
            width={16}
            height={16}
            color="gray"
            onClick={handleClickDownloadAll}
          />
        )}
      </Title>
      <Inner>
        {isIterable(itemAttachments) &&
          itemAttachments.map(attachment => (
            <div key={attachment.name}>
              <File
                key={attachment.name}
                itemSubject={itemSubject}
                onClickDownload={() => handleClickDownloadFile(attachment)}
                onClickRemove={
                  onClickAcceptEdit && (() => setOpenedModal(MODAL.DELETE_FILE))
                }
                {...attachment}
              />
              {openedModal === MODAL.DELETE_FILE && (
                <ConfirmDeleteAttachmentModal
                  isOpened
                  fileName={attachment.name}
                  onDeleteFile={() => {
                    onClickRemove(attachment);
                    setOpenedModal(null);
                  }}
                  handleCloseModal={() => setOpenedModal(null)}
                />
              )}
            </div>
          ))}
        <Can I={PERMISSION.EDIT} an={itemSubject}>
          {onClickAcceptEdit && (
            <Uploader multiple name="attachments" onChange={handleChange}>
              {({ getRootProps, getInputProps }) => {
                const {
                  onClick,
                  onKeyDown,
                  onFocus,
                  onBlur,
                  ...dragAndDropRootProps
                } = getRootProps();

                return (
                  <>
                    {isVisibleDragZone && (
                      <ItemDragZone {...dragAndDropRootProps} />
                    )}
                    <AddNewAttach
                      onClick={onClick}
                      onFocus={onFocus}
                      onBlur={onBlur}
                      onKeyDown={onKeyDown}
                    >
                      <input {...getInputProps()} />
                      <PlusIcon
                        name="plus"
                        width={16}
                        height={16}
                        color="gray"
                      />
                    </AddNewAttach>
                  </>
                );
              }}
            </Uploader>
          )}
        </Can>
      </Inner>
      {openedModal === MODAL.NEW_FILES && (
        <NewFilesModal
          files={newFiles}
          closeModal={() => setOpenedModal(null)}
        />
      )}
    </Wrapper>
  );

  return Array.isArray(itemAttachments) && itemAttachments.length === 0 ? (
    <Can I={PERMISSION.EDIT} an={itemSubject}>
      <AttachmentsComponent />
    </Can>
  ) : (
    <AttachmentsComponent />
  );
};
