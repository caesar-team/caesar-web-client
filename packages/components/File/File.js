import React from 'react';
import { useHover } from 'react-use';
import styled from 'styled-components';
import DownloadIconSvg from '@caesar/assets/icons/svg/icon-download-white.svg';
import { PERMISSION } from '@caesar/common/constants';
import {
  extactExtFromFilename,
  getFilenameWithoutExt,
  getRealFileSizeForBase64enc,
  humanizeSize,
} from '@caesar/common/utils/file';
import { Can } from '../Ability';
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

const ErrorWrapper = styled.div``;

const ErrorInner = styled.div`
  position: relative;
  display: flex;
  padding-right: 28px;
`;

const Error = styled.div`
  font-size: ${({ theme }) => theme.font.size.small};
  color: ${({ theme }) => theme.color.red};
`;

const CloseIcon = styled(Icon)`
  position: absolute;
  top: 8px;
  right: 8px;
  color: ${({ theme }) => theme.color.gray};
  opacity: 0;
  transition: color 0.2s, opacity 0.2s;
  cursor: pointer;

  &:hover {
    color: ${({ theme }) => theme.color.black};
  }
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
      opacity: 1;
    }
  }
`;

const UPLOADED_STATUS = 'uploaded';
const ERROR_STATUS = 'error';

const File = ({
  status = UPLOADED_STATUS,
  name,
  raw,
  error,
  itemSubject,
  onClickRemove,
  onClickDownload,
  ...props
}) => {
  const ext = extactExtFromFilename(name);
  const filename = decodeURIComponent(getFilenameWithoutExt(name));
  const size = humanizeSize(getRealFileSizeForBase64enc(raw.length), true);

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

  if (status === ERROR_STATUS || error) {
    return (
      <ErrorWrapper>
        <ErrorInner>
          <ErrorStatus />
          <Details>
            <FileName>{filename}</FileName>
            <FileSize>{size}</FileSize>
          </Details>
          {onClickRemove && hoverableCloseIcon}
        </ErrorInner>
        <Error>{error}</Error>
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
      {itemSubject ? (
        <Can I={PERMISSION.EDIT} an={itemSubject}>
          {onClickRemove && hoverableCloseIcon}
        </Can>
      ) : (
        onClickRemove && hoverableCloseIcon
      )}
    </UploadedWrapper>
  );
};

File.FileName = FileName;
File.FileExt = FileExt;

export default File;
