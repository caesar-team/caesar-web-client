import React, { useState } from 'react';
import Link from 'next/link';
import copy from 'copy-text-to-clipboard';
import { withNotification } from '@caesar/components';
import {
  downloadAsZip,
  downloadFile,
  makeFileFromAttachment,
} from '@caesar/common/utils/file';
import { DOMAIN_SECURE_ROUTE } from '@caesar/common/constants';
import { decryptSecretRaws } from '@caesar/common/utils/secret';
import { MessageStep, PasswordStep } from './steps';

import {
  Wrapper,
  StyledLogo,
  Title,
  ButtonsWrapper,
  ButtonStyled,
  Footer,
  StyledLink,
} from './styles';

const SecureMessageContainerComponent = ({
  notification,
  message,
  password,
}) => {
  const [decryptedMessage, setDecryptedMessage] = useState(null);
  // const [encryptedRaws, setEncryptedRaws] = useState(null);
  const [decryptedRaws, setDecryptedRaws] = useState(null);

  const getRaws = () => {
    const raws = decryptedRaws || decryptSecretRaws(message, password);
    if (!decryptedRaws) setDecryptedRaws(raws);

    return raws;
  };

  const handleClickCopyText = () => {
    copy(decryptedMessage.text);

    notification.show({
      text: `The text has been copied.`,
    });
  };

  const handleClickDownloadFile = index => async () => {
    const raws = await getRaws();

    const file = makeFileFromAttachment({
      ...decryptedMessage.attachments[index],
      raw: raws[index],
    });

    downloadFile(file.raw, file.name);
  };

  const handleClickDownloadFiles = async () => {
    const raws = await getRaws();
    const attachments = decryptedMessage.attachments.map(
      (attachment, index) => {
        return {
          raw: raws[index],
          name: `${attachment.name}.${attachment.ext}`,
        };
      },
    );
    downloadAsZip(attachments);
  };

  const title = decryptedMessage
    ? 'It’s your secret'
    : 'Enter the password to access the message';
  const shouldShowButtons = !!decryptedMessage;
  const shouldShowDownloadButton =
    decryptedMessage &&
    decryptedMessage.attachments &&
    decryptedMessage.attachments.length > 0;

  const shouldShowTextButton =
    decryptedMessage &&
    decryptedMessage.text &&
    decryptedMessage.text.length > 0;

  return (
    <Wrapper>
      <StyledLogo name="logo-secure-message" width={214} height={60} />
      <Title>{title}</Title>
      {decryptedMessage ? (
        <MessageStep
          decryptedMessage={decryptedMessage}
          onFileClick={handleClickDownloadFile}
        />
      ) : (
        <PasswordStep
          message={message}
          password={password}
          setDecryptedMessage={setDecryptedMessage}
        />
      )}
      {shouldShowButtons && (
        <ButtonsWrapper>
          {shouldShowTextButton && (
            <ButtonStyled
              color="white"
              icon="copy"
              onClick={handleClickCopyText}
            >
              Copy the message
            </ButtonStyled>
          )}
          {shouldShowDownloadButton && (
            <ButtonStyled
              color="white"
              icon="download"
              onClick={handleClickDownloadFiles}
            >
              Download all files
            </ButtonStyled>
          )}
        </ButtonsWrapper>
      )}
      <Footer>
        {shouldShowButtons && (
          <Link passHref href={DOMAIN_SECURE_ROUTE}>
            <StyledLink>Create Your Own Secure Message</StyledLink>
          </Link>
        )}
      </Footer>
    </Wrapper>
  );
};

export const SecureMessageContainer = withNotification(
  SecureMessageContainerComponent,
);
