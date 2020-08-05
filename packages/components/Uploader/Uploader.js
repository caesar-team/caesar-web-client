import React from 'react';
import styled from 'styled-components';
import Dropzone from 'react-dropzone';
import {
  filesToBase64,
  splitFilesToUniqAndDuplicates,
} from '@caesar/common/utils/file';
import { useMedia } from '@caesar/common/hooks';
import { TOTAL_MAX_UPLOADING_FILES_SIZES } from '@caesar/common/constants';
import { Icon } from '../Icon';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.color.snow};
  border: 1px dashed
    ${({ theme, isDragActive }) =>
      isDragActive ? theme.color.black : theme.color.gray};
  width: 100%;
  padding: 16px 5px;
  cursor: ${({ isDisabled }) => (isDisabled ? 'not-allowed' : 'pointer')};
  outline: none;
  transition: all 0.2s;

  ${({ isDisabled }) => isDisabled && `opacity: 0.3;`}
`;

const Text = styled.span`
  margin-bottom: 5px;
  font-size: 16px;
  text-align: center;
  color: ${({ theme }) => theme.color.emperor};
`;

const HintText = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.color.gray};
`;

const Link = styled.a`
  color: ${({ theme }) => theme.color.black};
`;

const StyledIcon = styled(Icon)`
  fill: ${({ theme, isDragActive }) =>
    isDragActive ? theme.color.gray : theme.color.black};
  transition: all 0.2s;
  margin-right: 15px;
`;

const Error = styled.div`
  margin-top: 8px;
  font-size: 14px;
  color: ${({ theme }) => theme.color.red};
`;

const getNotificationText = files =>
  files.length > 1
    ? `${files.map(({ name }) => name).join(', ')} have already added`
    : `The file with name ${files[0].name} has already added`;

const Uploader = ({
  name,
  multiple = false,
  accept,
  onChange,
  hintText = `Not more than ${TOTAL_MAX_UPLOADING_FILES_SIZES}`,
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
    const files = acceptedFiles.map(({ name: fileName }, index) => ({
      name: encodeURIComponent(fileName),
      raw: previews[index],
    }));

    const preparedFiles = splitFilesToUniqAndDuplicates([
      ...previousFiles,
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
            <Text>
              <StyledIcon
                name="download"
                width={16}
                height={16}
                isDragActive={isDragActive}
              />
              <Link>Upload files</Link>
              {!isWideMobile &&
                !isMobile &&
                ' or drag and drop your files here'}
            </Text>
            <HintText>{hintText}</HintText>
            {error && <Error>{error}</Error>}
          </Container>
        )
      }
    </Dropzone>
  );
};

export default Uploader;
