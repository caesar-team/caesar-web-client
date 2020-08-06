import React, { useState } from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import copy from 'copy-text-to-clipboard';
import { Icon, Button, withNotification } from '@caesar/components';
import { downloadAsZip } from '@caesar/common/utils/file';
import { media } from '@caesar/assets/styles/media';
import { DOMAIN_SECURE_ROUTE } from '@caesar/common/constants';
import { MessageStep, PasswordStep } from './steps';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100%;
  min-height: 100vh;
  padding: 24px 16px;
  background-color: ${({ theme }) => theme.color.emperor};
`;

const Title = styled.div`
  font-size: 18px;
  color: ${({ theme }) => theme.color.lightGray};
  margin-bottom: 23px;
  margin-top: 50px;
`;

const StyledLogo = styled(Icon)`
  margin-top: auto;
  fill: ${({ theme }) => theme.color.white};
`;

const ButtonsWrapper = styled.div`
  display: flex;
  justify-content: center;
  padding: 0 24px;
  margin-top: 24px;

  ${media.mobile`
    flex-direction: column;
    width: 100%;
  `}
`;

const ButtonStyled = styled(Button)`
  ${media.mobile`
    width: 100%;
  `}

  &:not(:first-child) {
    margin-left: 24px;

    ${media.mobile`
    margin-left: 0;
    margin-top: 24px;
  `}
  }
`;

const Footer = styled.div`
  margin-top: auto;

  ${media.wideMobile`
    margin-top: 24px;
  `}
`;

const StyledLink = styled.a`
  font-size: ${({ theme }) => theme.font.size.small};
  color: ${({ theme }) => theme.color.white};
  text-decoration: none;
`;

const SecureMessageContainerComponent = ({
  notification,
  message,
  password,
}) => {
  const [decryptedMessage, setDecryptedMessage] = useState(null);
  const [decryptedRaws, setDecryptedRaws] = useState(null);

  const handleClickCopyText = () => {
    copy(decryptedMessage.text);

    notification.show({
      text: `The text has been copied.`,
    });
  };

  const handleClickDownloadFiles = () => {
    const attachments = decryptedMessage.attachments.map(
      (attachment, index) => {
        return {
          raw: decryptedRaws[index],
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
          decryptedRaws={decryptedRaws}
        />
      ) : (
        <PasswordStep
          message={message}
          password={password}
          setDecryptedMessage={setDecryptedMessage}
          setDecryptedRaws={setDecryptedRaws}
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
              Copy text
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
