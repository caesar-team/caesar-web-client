import React from 'react';
import { useHover } from 'react-use';
import styled from 'styled-components';
import DownloadIconSvg from '@caesar/assets/icons/svg/icon-download-white.svg';
import CloseIconSvg from '@caesar/assets/icons/svg/icon-close-white.svg';
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
  flex: 0 0 40px;
  width: 40px;
  height: 40px;
  border: 3px solid ${({ theme }) => theme.color.red};
  border-radius: 50%;

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
  overflow: hidden;
`;

const FileName = styled.div`
  font-size: 16px;
  line-height: 18px;
  color: ${({ theme }) => theme.color.black};
  margin-bottom: 5px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const FileSize = styled.div`
  font-size: 14px;
  line-height: 14px;
  color: ${({ theme }) => theme.color.gray};
`;

const ErrorWrapper = styled.div`
  position: relative;
  display: flex;
  padding-right: 28px;
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
  padding: 8px 28px 8px 8px;
  border-radius: 4px;
  cursor: pointer;
  transition: color 0.2s, background-color 0.2s;

  &:hover {
    background-color: ${({ theme }) => theme.color.snow};

    ${FileExt} {
      ${({ isHoveringCloseIcon, theme }) =>
        !isHoveringCloseIcon &&
        `
          background: ${theme.color.black};
          color: ${theme.color.white};
          font-size: 0;
          background: url(${DownloadIconSvg})
            no-repeat center ${theme.color.black};

          &:before {
            background: ${theme.color.black};
          }
        `}
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

  const handleClickCloseIcon = e => {
    e.stopPropagation();
    onClickRemove();
  };

  const closeIconComponent = (
    <CloseIcon
      name="close"
      width={16}
      height={16}
      onClick={handleClickCloseIcon}
    />
  );

  const [hoverableCloseIcon, isHoveringCloseIcon] = useHover(
    closeIconComponent,
  );

  if (status === ERROR_STATUS) {
    return (
      <ErrorWrapper>
        <ErrorStatus />
        <Details>
          <FileName>{filename}</FileName>
          <FileSize>{size}</FileSize>
        </Details>
        {onClickRemove && hoverableCloseIcon}
      </ErrorWrapper>
    );
  }

  return (
    <UploadedWrapper
      isHoveringCloseIcon={isHoveringCloseIcon}
      onClick={onClickDownload}
      {...props}
    >
      <FileExt>{ext}</FileExt>
      <Details>
        <FileName>{filename}</FileName>
        <FileSize>{size}</FileSize>
      </Details>
      {onClickRemove && hoverableCloseIcon}
    </UploadedWrapper>
  );
};

File.FileName = FileName;
File.FileExt = FileExt;

export default File;
