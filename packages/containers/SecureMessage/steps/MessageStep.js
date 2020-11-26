import React from 'react';
import { Scrollbar } from '@caesar/components';
import { escapeHTML } from '@caesar/common/utils/string';
import {
  FileStyled,
  MessageWrapper,
  Message,
  Separator,
  Attachments,
} from './styles';

export const MessageStep = ({ decryptedMessage, onFileClick = () => {} }) => {
  const shouldShowText = !!decryptedMessage.text;
  const shouldShowAttachments = decryptedMessage.attachments.length > 0;

  const renderedAttachments = decryptedMessage.attachments.map(
    (attachment, index) => {
      return (
        <FileStyled
          key={index}
          onClickDownload={onFileClick(index)}
          {...attachment}
        />
      );
    },
  );

  const text = String.raw`${decryptedMessage.text}`;
  const result = escapeHTML(decodeURIComponent(text));

  return (
    <MessageWrapper>
      {shouldShowText && (
        <Scrollbar autoHeight autoHeightMax={183}>
          <Message
            withAttach={shouldShowAttachments}
            content={result}
            disabled
          />
        </Scrollbar>
      )}
      {shouldShowText && shouldShowAttachments && <Separator />}
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
