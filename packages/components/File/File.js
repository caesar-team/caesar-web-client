import React from 'react';
import { useHover } from 'react-use';
import styled from 'styled-components';
import DownloadIconSvg from '@caesar/assets/icons/svg/icon-download-white.svg';
import { media } from '@caesar/assets/styles/media';
import { PERMISSION } from '@caesar/common/constants';
import { humanizeSize } from '@caesar/common/utils/file';
import { Can } from '../Ability';
import { Icon } from '../Icon';

const FileIcon = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 40px;
  width: 40px;
  height: 40px;
  border-radius: 3px 0 3px 3px;
  transition: all 0.2s;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    display: block;
    width: 0;
    border-style: solid;
    border-width: 4px;
    border-radius: 0 0 0 3px;
    border-color: ${({ theme }) =>
      `${theme.color.white} ${theme.color.white} transparent transparent`};
  }
`;

const FileExt = styled(FileIcon)`
  font-size: ${({ theme }) => theme.font.size.small};
  color: ${({ theme }) => theme.color.white};
  background-color: ${({ theme }) => theme.color.black};

  &::before {
    background: ${({ theme }) => theme.color.gray};
  }
`;

const ErrorStatus = styled(FileIcon)`
  color: ${({ theme }) => theme.color.red};
  background-color: ${({ theme }) => theme.color.gallery};

  &::before {
    background: ${({ theme }) => theme.color.lightGray};
  }
`;

const Details = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 16px;
  overflow: hidden;
`;

const FileName = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const FileSize = styled.div`
  font-size: ${({ theme }) => theme.font.size.small};
  color: ${({ isError, theme }) =>
    isError ? theme.color.red : theme.color.gray};

  ${media.tablet`
    ${({ isError }) => isError && 'display: none;'}
  `}
`;

const Error = styled.div`
  display: none;
  font-size: ${({ theme }) => theme.font.size.small};
  color: ${({ theme }) => theme.color.red};

  ${media.tablet`
    display: block;
  `}
`;

const ErrorWrapper = styled.div`
  &:hover {
    ${FileSize} {
      display: none;
    }

    ${Error} {
      display: block;
    }
  }
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

  ${media.tablet`
    opacity: 1;
  `}
`;

const UploadedWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  padding: 8px 28px 8px 8px;
  border-radius: 4px;
  cursor: pointer;
  transition: color 0.2s, background-color 0.2s;

  &:hover {
    background-color: ${({ theme }) => theme.color.snow};

    ${FileIcon} {
      &::before {
        border-color: ${({ theme }) =>
          `${theme.color.snow} ${theme.color.snow} transparent transparent`};
      }
    }

    ${FileExt} {
      ${({ isHoveringCloseIcon, theme }) =>
        !isHoveringCloseIcon &&
        `
          font-size: 0;
          background: url(${DownloadIconSvg})
            no-repeat center ${theme.color.black};
        `}

      ${media.tablet`
        font-size: ${({ theme }) => theme.font.size.small};
        background: ${({ theme }) => theme.color.black};
      `}
    }

    ${CloseIcon} {
      opacity: 1;
    }
  }
`;

const File = ({
  size,
  name,
  ext,
  error,
  itemSubject,
  onClickRemove,
  onClickDownload,
  ...props
}) => {
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

  if (error) {
    return (
      <ErrorWrapper>
        <UploadedWrapper isHoveringCloseIcon={isHoveringCloseIcon}>
          <ErrorStatus>!</ErrorStatus>
          <Details>
            <FileName>{name}</FileName>
            <FileSize isError>{humanizeSize(size)}</FileSize>
            <Error>{error}</Error>
          </Details>
          {onClickRemove && hoverableCloseIcon}
        </UploadedWrapper>
      </ErrorWrapper>
    );
  }

  return (
    <UploadedWrapper
      isHoveringCloseIcon={isHoveringCloseIcon}
      onClick={onClickDownload}
      {...props}
    >
      <FileExt>
        <img alt="kitten" src="https://placekitten.com/50/50" />
      </FileExt>
      <Details>
        <FileName>{name}</FileName>
        <FileSize>{humanizeSize(size)}</FileSize>
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
