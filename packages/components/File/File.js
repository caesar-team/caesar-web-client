import React from 'react';
import styled from 'styled-components';
import DownloadIcon from '@caesar/assets/icons/svg/icon-download-white.svg';
import { Icon } from '../Icon';

const FileExt = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 40px;
  width: 40px;
  height: 40px;
  font-size: 14px;
  color: ${({ theme }) => theme.color.white};
  background-color: ${({ theme }) => theme.color.black};
  border-radius: 3px 0 3px 3px;
  cursor: pointer;
  transition: all 0.2s;

  &:before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    display: block;
    width: 0;
    background: ${({ theme }) => theme.color.gray};
    border-style: solid;
    border-width: 4px;
    border-color: ${({ theme }) =>
      `${theme.color.white} ${theme.color.white} transparent transparent`};
    border-radius: 0 0 0 3px;
  }
`;

const ErrorStatus = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border: 3px solid ${({ theme }) => theme.color.red};
  border-radius: 50%;
  width: 40px;
  height: 40px;

  &:after {
    content: '!';
    position: absolute;
    color: ${({ theme }) => theme.color.red};
  }
`;

const Details = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 16px;
`;

const FileName = styled.div`
  font-size: 16px;
  line-height: 18px;
  color: ${({ theme }) => theme.color.black};
  margin-bottom: 5px;
`;

const FileSize = styled.div`
  font-size: 14px;
  line-height: 14px;
  color: ${({ theme }) => theme.color.gray};
`;

const ErrorWrapper = styled.div`
  display: flex;
`;

const CloseIcon = styled(Icon)`
  position: absolute;
  top: 8px;
  right: 8px;
  color: ${({ theme }) => theme.color.gray};
  cursor: pointer;
`;

const UploadedWrapper = styled.div`
  position: relative;
  display: flex;
  padding: 8px;
  border-radius: 4px;
  transition: color, background-color 0.2s;

  &:hover {
    background-color: ${({ theme }) => theme.color.snow};

    ${FileExt} {
      background: ${({ theme }) => theme.color.black};
      color: ${({ theme }) => theme.color.white};
      font-size: 0;
      background: url(${DownloadIcon}) no-repeat center
        ${({ theme }) => theme.color.black};

      &:before {
        background: ${({ theme }) => theme.color.black};
      }
    }

    ${CloseIcon} {
      color: ${({ theme }) => theme.color.black};
    }
  }
`;

const units = ['bytes', 'KB', 'MB'];

const formatBytes = x => {
  let l = 0;
  let n = parseInt(x, 10) || 0;

  while (n >= 1024 && ++l) n /= 1024;

  return `${n.toFixed(n < 10 && l > 0 ? 1 : 0)} ${units[l]}`;
};

const UPLOADED_STATUS = 'uploaded';
const ERROR_STATUS = 'error';

const File = ({
  status = UPLOADED_STATUS,
  name,
  raw,
  onClickRemove,
  onClickDownload,
  ...props
}) => {
  const ext = name.split('.').pop();
  const filename = name.replace(/\.[^/.]+$/, '');
  const size = formatBytes(Math.round((raw.length * 3) / 4));

  if (status === ERROR_STATUS) {
    return (
      <ErrorWrapper>
        <ErrorStatus />
        <Details>
          <FileName>{filename}</FileName>
          <FileSize>{size}</FileSize>
        </Details>
        <CloseIcon
          name="close"
          width={12}
          height={12}
          onClick={onClickRemove}
        />
      </ErrorWrapper>
    );
  }

  return (
    <UploadedWrapper {...props}>
      <FileExt onClick={onClickDownload}>{ext}</FileExt>
      <Details>
        <FileName>{filename}</FileName>
        <FileSize>{size}</FileSize>
      </Details>
      {onClickRemove && (
        <CloseIcon
          name="close"
          width={12}
          height={12}
          onClick={onClickRemove}
        />
      )}
    </UploadedWrapper>
  );
};

File.FileName = FileName;
File.FileExt = FileExt;

export default File;
