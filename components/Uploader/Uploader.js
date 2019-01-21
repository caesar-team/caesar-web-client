import React from 'react';
import styled from 'styled-components';
import Dropzone from 'react-dropzone';
import { filesToBase64 } from 'common/utils/file';
import { Icon } from '../Icon';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme, isDragActive }) =>
    isDragActive ? theme.lightBlue : theme.snow};
  border: 1px dashed
    ${({ theme, isDragActive }) => (isDragActive ? theme.blue : theme.gray)};
  width: 100%;
  padding: 24px 0;
  cursor: pointer;
  outline: none;
`;

const Text = styled.span`
  font-size: 18px;
  letter-spacing: 0.6px;
  text-align: center;
  color: ${({ theme }) => theme.emperor};
`;

const ExtText = styled.div`
  font-size: 16px;
  letter-spacing: 0.5px;
  color: ${({ theme }) => theme.gray};
`;

const Link = styled.a`
  color: ${({ theme }) => theme.blue};
`;

const StyledIcon = styled(Icon)`
  fill: ${({ theme, isDragActive }) =>
    isDragActive ? theme.blue : theme.gray};
`;

const Uploader = ({
  name,
  multiple,
  accept,
  onChange,
  files: previousFiles,
}) => {
  const handleDrop = async acceptedFiles => {
    const previews = await filesToBase64(acceptedFiles);
    const files = acceptedFiles.map(({ name: fileName }, index) => ({
      name: fileName,
      raw: previews[index],
    }));

    onChange(name, [...previousFiles, ...files]);
  };

  return (
    <Dropzone multiple={multiple} accept={accept} onDrop={handleDrop}>
      {({ getRootProps, getInputProps, isDragActive }) => (
        <Container {...getRootProps()} isDragActive={isDragActive}>
          <input {...getInputProps()} />
          <StyledIcon
            name="inbox"
            width={40}
            height={36}
            isDragActive={isDragActive}
          />
          <Text>
            Drag and drop your file here or <Link>upload</Link>.
          </Text>
          <ExtText>.rar .zip .doc .docx .pdf .jpg...</ExtText>
        </Container>
      )}
    </Dropzone>
  );
};

export default Uploader;
