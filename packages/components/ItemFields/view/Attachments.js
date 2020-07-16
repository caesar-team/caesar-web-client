import React, { useState } from 'react';
import styled from 'styled-components';
import {
  downloadFile,
  downloadAsZip,
  splitFilesToUniqAndDuplicates,
} from '@caesar/common/utils/file';
import { PERMISSION } from '@caesar/common/constants';
import { Can } from '../../Ability';
import { Icon } from '../../Icon';
import { File } from '../../File';
import { Uploader } from '../../Uploader';
import { NewFilesModal } from './NewFilesModal';

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
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr);
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
  border-radius: 3px;
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

export const Attachments = ({
  attachments,
  itemSubject,
  onClickAcceptEdit,
}) => {
  const [newFiles, setNewFiles] = useState([]);
  const [isModalOpened, setModalOpened] = useState(false);

  const handleClickDownloadFile = attachment => {
    const { raw, name } = attachment;

    downloadFile(raw, name);
  };

  const handleClickDownloadAll = () => {
    downloadAsZip(attachments);
  };

  const onClickRemove = raw => {
    const updatedAttachments = attachments.filter(file => file.raw !== raw);

    onClickAcceptEdit({ name: 'attachments', value: updatedAttachments });
  };

  const handleChange = (name, files) => {
    const { uniqFiles, duplicatedFiles } = splitFilesToUniqAndDuplicates([
      ...attachments,
      ...files,
    ]);

    const mappedFiles = files.map(file => {
      for (let i = 0; i < duplicatedFiles.length; i++) {
        if (
          file.name === duplicatedFiles[i].name &&
          file.raw === duplicatedFiles[i].raw
        ) {
          return {
            ...file,
            error: 'The file was already added',
          };
        }
      }

      return file;
    });

    setNewFiles(mappedFiles);
    setModalOpened(true);

    onClickAcceptEdit({ name, value: uniqFiles });
  };

  const AttachmentsComponent = () => (
    <Wrapper>
      <Title>
        Attachments ({attachments.length})
        {attachments.length > 0 && (
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
        {attachments.map(attach => (
          <File
            key={attach.name}
            itemSubject={itemSubject}
            onClickDownload={() => handleClickDownloadFile(attach)}
            onClickRemove={
              onClickAcceptEdit && (() => onClickRemove(attach.raw))
            }
            {...attach}
          />
        ))}
        <Can I={PERMISSION.EDIT} an={itemSubject}>
          {onClickAcceptEdit && (
            <Uploader
              multiple
              asPreview
              name="attachments"
              onChange={handleChange}
            >
              {({ getRootProps, getInputProps, isDragActive }) => (
                <AddNewAttach {...getRootProps()} isDragActive={isDragActive}>
                  <input {...getInputProps()} />
                  <PlusIcon name="plus" width={16} height={16} color="gray" />
                </AddNewAttach>
              )}
            </Uploader>
          )}
        </Can>
      </Inner>
      {isModalOpened && (
        <NewFilesModal
          files={newFiles}
          closeModal={() => setModalOpened(false)}
        />
      )}
    </Wrapper>
  );

  return attachments.length === 0 ? (
    <Can I={PERMISSION.EDIT} an={itemSubject}>
      <AttachmentsComponent />
    </Can>
  ) : (
    <AttachmentsComponent />
  );
};
