import React from 'react';
import styled from 'styled-components';
import { File, Scrollbar } from '@caesar/components';
import { downloadFile } from '@caesar/common/utils/file';

const MessageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 620px;
  padding: 24px;
  background: ${({ theme }) => theme.color.darkGray};
`;

const Message = styled.div`
  width: 100%;
  height: 100%;
  max-height: 183px;
  font-size: inherit;
  color: ${({ theme }) => theme.color.white};
  background: transparent;
  user-select: text;
`;

const Attachments = styled.div`
  ${({ withText }) => withText && 'margin-top: 24px;'}
`;

const FileStyled = styled(File)`
  ${File.FileName} {
    color: ${({ theme }) => theme.color.white};
  }

  &:hover {
    ${File.FileName} {
      color: ${({ theme }) => theme.color.black};
    }
  }

  ${File.FileExt} {
    margin-bottom: 0;

    &:before {
      border-color: ${({ theme }) =>
        `${theme.color.darkGray} ${theme.color.darkGray} transparent transparent`};
    }
  }

  margin-bottom: 10px;

  &:last-child {
    margin-bottom: 0;
  }
`;

export const MessageStep = ({ decryptedMessage }) => {
  const shouldShowText = !!decryptedMessage.text;
  const shouldShowAttachments = decryptedMessage.attachments.length > 0;

  const handleClickDownloadFile = index => () => {
    const { raw, name } = decryptedMessage.attachments[index];

    downloadFile(raw, name);
  };

  const renderedAttachments = decryptedMessage.attachments.map(
    (attachment, index) => (
      <FileStyled
        key={index}
        onClickDownload={handleClickDownloadFile(index)}
        {...attachment}
      />
    ),
  );

  const text = String.raw`${decryptedMessage.text}`;
  const result = `${text.replace(/\n/g, '<br/>')}`;

  return (
    <MessageWrapper>
      {shouldShowText && (
        <Scrollbar autoHeight autoHeightMax={183}>
          <Message
            dangerouslySetInnerHTML={{
              __html: result,
            }}
          />
        </Scrollbar>
      )}
      {shouldShowAttachments && (
        <Attachments withText={shouldShowText}>
          <Scrollbar autoHeight autoHeightMax={235}>
            {renderedAttachments}
          </Scrollbar>
        </Attachments>
      )}
    </MessageWrapper>
  );
};
