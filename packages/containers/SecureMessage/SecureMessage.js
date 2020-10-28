import React, { useState, memo } from 'react';
import Link from 'next/link';
import copy from 'copy-text-to-clipboard';
import {
  downloadAsZip,
  downloadFile,
  makeFileFromAttachment,
} from '@caesar/common/utils/file';
import { DOMAIN_SECURE_ROUTE } from '@caesar/common/constants';
import { useNotification } from '@caesar/common/hooks';
import { decryptSecretRaws } from '@caesar/common/utils/secret';
import { MessageStep, PasswordStep } from './steps';
import {
  Wrapper,
  Header,
  StyledLogo,
  Content,
  Title,
  AdaptiveTitle,
  ButtonsWrapper,
  ButtonStyled,
  Footer,
  StyledLink,
} from './styles';

const SecureMessageContainerComponent = ({ message, password }) => {
  const notification = useNotification();
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
      text: `The text has been copied`,
    });
  };

  const handleClickDownloadFile = index => async () => {
    const raws = await getRaws();
    const attachment = decryptedMessage.attachments[index];
    if (attachment) {
      const file = makeFileFromAttachment({
        ...attachment,
        raw: raws[attachment.id],
      });

      downloadFile(file.raw, file.name);
    }
  };

  const handleClickDownloadFiles = async () => {
    const raws = await getRaws();
    const attachments = decryptedMessage.attachments.map(attachment => ({
      ...makeFileFromAttachment(attachment),
      raw: raws[attachment.id],
    }));

    downloadAsZip(attachments);
  };

  const title = decryptedMessage
    ? <Title>It’s your secret</Title>
    : <AdaptiveTitle>Enter the password to access the message</AdaptiveTitle>;
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
      <Header>
        <StyledLogo name="logo-secure-message" width={114} height={32} />  
      </Header>
      <Content>
        {title}
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
      </Content>
    </Wrapper>
  );
};

export const SecureMessageContainer = memo(SecureMessageContainerComponent);
