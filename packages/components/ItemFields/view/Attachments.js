import React, { useState, useEffect, memo } from 'react';
import { useUpdateEffect } from 'react-use';
import { useDispatch } from 'react-redux';
import equal from 'fast-deep-equal';
import { omit } from 'lodash';
import { getUniqueAndDublicates } from '@caesar/common/utils/file';
import { PERMISSION } from '@caesar/common/constants';
import { SCHEMA } from '@caesar/common/validation';
import { isIterable } from '@caesar/common/utils/utils';
import { processUploadedFiles } from '@caesar/common/utils/attachment';
import {
  downloadItemAttachment,
  downloadItemAttachments,
} from '@caesar/common/actions/workflow';
import { Can } from '../../Ability';
import { File } from '../../File';
import { Uploader } from '../../Uploader';
import { NewFilesModal } from './NewFilesModal';
import { ConfirmDeleteAttachmentModal } from './ConfirmDeleteAttachmentModal';
import { ItemDragZone } from '../common';
import {
  Wrapper,
  Title,
  DownloadIcon,
  Inner,
  AddNewAttach,
  PlusIcon,
} from './styles';

const MODAL = {
  NEW_FILES: 'new_files',
  DELETE_FILE: 'delete_file',
};

const AttachmentsComponent = memo(
  ({
    attachments,
    itemAttachments,
    newFiles,
    itemSubject,
    isVisibleDragZone,
    newFilesModalError,
    setNewFilesModalError,
    openedModal,
    setOpenedModal,
    handleChange,
    handleClickDownloadAll,
    handleClickDownloadFile,
    onClickAcceptEdit,
    onClickRemove,
  }) => (
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
          error={newFilesModalError}
          closeModal={() => {
            setOpenedModal(null);
            setNewFilesModalError(null);
          }}
        />
      )}
    </Wrapper>
  ),
);

export const Attachments = ({
  itemId,
  attachments = [],
  raws = {},
  itemSubject,
  singleAttachmentSchema,
  allAttachmentsSchema,
  onClickAcceptEdit,
  isVisibleDragZone,
}) => {
  const dispatch = useDispatch();
  const [newFiles, setNewFiles] = useState([]);
  const [itemRaws, setItemRaws] = useState(raws);
  const [itemAttachments, setItemAttachments] = useState(attachments);
  const [openedModal, setOpenedModal] = useState(null);
  const [newFilesModalError, setNewFilesModalError] = useState(null);

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
    dispatch(downloadItemAttachment({ itemId, attachment }));
  };

  const handleClickDownloadAll = () => {
    dispatch(downloadItemAttachments({ itemId }));
  };

  const onClickRemove = handleAttachment => {
    const updatedItemAttachments = itemAttachments.filter(
      attach => attach.id !== handleAttachment.id,
    );
    const updatedItemRaws = omit(itemRaws, [[handleAttachment.id]]);

    setItemAttachments(updatedItemAttachments);
    setItemRaws(updatedItemRaws);
    syncStateWithServer({
      attachments: updatedItemAttachments,
      raws: updatedItemRaws,
    });
  };

  const handleChange = (name, files) => {
    try {
      setNewFilesModalError(null);

      if (allAttachmentsSchema) {
        allAttachmentsSchema.validateSync([...attachments, ...files]);
      }

      const splitedFiles = processUploadedFiles(files);

      const {
        validated: validatedFiles,
        errored: erroredFiles,
      } = splitedFiles.attachments.reduce(
        (acc, file) => {
          try {
            if (singleAttachmentSchema) {
              SCHEMA.SINGLE_ATTACHMENT.validateSync(splitedFiles.raws[file.id]);
            }
          } catch (error) {
            // eslint-disable-next-line no-param-reassign
            file.error = error.message;
          }

          if (file.error) {
            return {
              ...acc,
              errored: [...acc.errored, file],
            };
          }

          return {
            ...acc,
            validated: [...acc.validated, file],
          };
        },
        {
          validated: [],
          errored: [],
        },
      );

      const { uniqNewFiles, duplicatedFiles } = getUniqueAndDublicates(
        validatedFiles,
        itemAttachments,
      );

      const processedDuplicatedFiles = duplicatedFiles.map(file => ({
        ...file,
        error: 'The file already exists',
      }));

      const uniqNewRaws = Object.fromEntries(
        uniqNewFiles.map(file => [file.id, splitedFiles.raws[file.id]]),
      );

      setNewFiles([
        ...erroredFiles,
        ...processedDuplicatedFiles,
        ...uniqNewFiles,
      ]);

      setOpenedModal(MODAL.NEW_FILES);

      if (uniqNewFiles.length || uniqNewRaws.length) {
        const allAttachments = [...itemAttachments, ...uniqNewFiles];
        const allRaws = { ...itemRaws, ...uniqNewRaws };

        syncStateWithServer({
          attachments: allAttachments,
          raws: allRaws,
        });
      }
    } catch (error) {
      setNewFiles(files);
      setNewFilesModalError(error.message);
      setOpenedModal(MODAL.NEW_FILES);
    }
  };

  const attachmentsComponentProps = {
    attachments,
    itemAttachments,
    newFiles,
    itemSubject,
    isVisibleDragZone,
    newFilesModalError,
    setNewFilesModalError,
    openedModal,
    setOpenedModal,
    handleChange,
    handleClickDownloadAll,
    handleClickDownloadFile,
    onClickAcceptEdit,
    onClickRemove,
  };

  return Array.isArray(itemAttachments) && itemAttachments.length === 0 ? (
    <Can I={PERMISSION.EDIT} an={itemSubject}>
      <AttachmentsComponent {...attachmentsComponentProps} />
    </Can>
  ) : (
    <AttachmentsComponent {...attachmentsComponentProps} />
  );
};
