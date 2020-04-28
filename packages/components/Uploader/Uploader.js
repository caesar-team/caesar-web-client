import React from 'react';
import styled from 'styled-components';
import Dropzone from 'react-dropzone';
import { filesToBase64 } from '@caesar/common/utils/file';
import { Icon } from '../Icon';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme, isDragActive }) =>
    isDragActive ? theme.color.lightBlueUploader : theme.color.snow};
  border: 1px dashed
    ${({ theme, isDragActive }) =>
      isDragActive ? theme.color.blue : theme.color.gray};
  width: 100%;
  padding: 24px 0;
  cursor: pointer;
  outline: none;
  transition: all 0.2s;
`;

const Text = styled.span`
  margin-bottom: 3px;
  font-size: 16px;
  letter-spacing: 0.6px;
  text-align: center;
  color: ${({ theme }) => theme.color.emperor};
`;

const HintText = styled.div`
  font-size: 14px;
  letter-spacing: 0.5px;
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
  letter-spacing: 0.4px;
  color: ${({ theme }) => theme.color.red};
`;

const splitFilesToUniqAndDuplicates = files => {
  const uniqFiles = [];
  const duplicatedFiles = [];

  const map = new Map();

  // eslint-disable-next-line
  for (const file of files) {
    const checkLabel = `${file.name}_${file.raw.length}`;

    if (!map.has(checkLabel)) {
      map.set(checkLabel, true);
      uniqFiles.push(file);
    } else {
      duplicatedFiles.push(file);
    }
  }

  return { uniqFiles, duplicatedFiles };
};

const getNotificationText = files =>
  files.length > 1
    ? `${files.map(({ name }) => name).join(', ')} have already added`
    : `The file with name ${files[0].name} has already added`;

const Uploader = ({
  name,
  multiple = false,
  accept,
  onChange,
  hintText = 'Not more than 25 MB',
  error,
  files: previousFiles = [],
  notification,
  children,
  ...props
}) => {
  const handleDrop = async acceptedFiles => {
    const previews = await filesToBase64(acceptedFiles);
    const files = acceptedFiles.map(({ name: fileName }, index) => ({
      name: fileName,
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
      onDrop={handleDrop}
      {...props}
    >
      {({ getRootProps, getInputProps, isDragActive }) =>
        children ? (
          children({ getRootProps, getInputProps, isDragActive })
        ) : (
          <Container {...getRootProps()} isDragActive={isDragActive}>
            <input {...getInputProps()} />
            <Text>
              <StyledIcon
                name="download"
                width={16}
                height={16}
                isDragActive={isDragActive}
              />
              <Link>Upload File</Link> or drag and drop your file here
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
