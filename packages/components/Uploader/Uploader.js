import React, { useMemo } from 'react';
import Dropzone from 'react-dropzone';
import {
  filesToBase64,
  splitFilesToUniqAndDuplicates,
} from '@caesar/common/utils/file';
import { makeAttachemntFromFile } from '@caesar/common/utils/attachment';
import { useMedia } from '@caesar/common/hooks';
import {
  TOTAL_MAX_UPLOADING_FILES_SIZES,
  MAX_UPLOADING_FILE_SIZE,
} from '@caesar/common/constants';
import { TextError } from '../Error';
import { Container, Text, HintText, Link, StyledIcon } from './styles';

const getNotificationText = files =>
  files.length > 1
    ? `${files.map(({ name }) => name).join(', ')} have been added before`
    : `The file "${files[0].name}" has been added before`;

const Uploader = ({
  name,
  multiple = false,
  accept,
  onChange,
  hintText = `${TOTAL_MAX_UPLOADING_FILES_SIZES} for all files, ${MAX_UPLOADING_FILE_SIZE} for one file`,
  error,
  files: previousFiles = [],
  notification,
  disabled,
  children,
  className,
  ...props
}) => {
  const { isWideMobile, isMobile } = useMedia();

  const handleDrop = async acceptedFiles => {
    const previews = await filesToBase64(acceptedFiles);
    const files = acceptedFiles.map(({ name: fileName }, index) =>
      makeAttachemntFromFile({
        name: fileName,
        raw: previews[index],
      }),
    );

    const preparedFiles = splitFilesToUniqAndDuplicates([
      ...(Array.isArray(previousFiles) ? previousFiles : [previousFiles]),
      ...files,
    ]);

    if (preparedFiles.duplicatedFiles.length && notification) {
      notification.show({
        text: getNotificationText(preparedFiles.duplicatedFiles),
      });
    }

    onChange(name, multiple ? preparedFiles.uniqFiles : files[0]);
  };

  return (
    <Dropzone
      multiple={multiple}
      accept={accept}
      disabled={disabled}
      onDrop={handleDrop}
      {...props}
    >
      {({ getRootProps, getInputProps, isDragActive, rejectedFiles }) =>
        children ? (
          children({ getRootProps, getInputProps, isDragActive, rejectedFiles })
        ) : (
          <Container
            {...getRootProps()}
            isDragActive={isDragActive}
            isDisabled={disabled}
            className={className}
          >
            <input {...getInputProps()} />
            <Text isDragActive={isDragActive}>
              <StyledIcon
                name="download"
                width={16}
                height={16}
                color={isDragActive ? 'lightGray' : 'black'}
              />
              <Link isDragActive={isDragActive}>Upload files</Link>
              {!isWideMobile &&
                !isMobile &&
                ' or drag and drop your files here'}
            </Text>
            {error ? (
              <TextError>{error}</TextError>
            ) : (
              <HintText isDragActive={isDragActive}>{hintText}</HintText>
            )}
          </Container>
        )
      }
    </Dropzone>
  );
};

export default Uploader;
