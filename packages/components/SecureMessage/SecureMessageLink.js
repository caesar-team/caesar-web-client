import React, { useState } from 'react';
import { useEffectOnce } from 'react-use';
import copy from 'copy-text-to-clipboard';
import { Button, Checkbox, withNotification } from '@caesar/components';
import { ContentEditableComponent } from '@caesar/components/Common/ContentEditable';
import { useMedia } from '@caesar/common/hooks';
import { generateMessageLink, getSecureMessageText, stripHtml } from './common';
import {
  ButtonsWrapper,
  CopyAllButton,
  CreateNewButton,
  Link,
  Text,
  Row, ContentEditableStyled,
} from './styles';

const SecureMessageLinkComponent = ({
  notification,
  messageId = '',
  password = '',
  seconds = 0,
  onClickReturn,
}) => {
  useEffectOnce(() => {
    notification.hide();
  });
  const { isMobile } = useMedia();
  const [isPasswordLessPassword, setIsPasswordLess] = useState(false);
  const handleChangeCustomPassword = () => {
    setIsPasswordLess(!isPasswordLessPassword);
  };
  const handleClickCopy = (data, notify) => {
    copy(data);

    notification.show({
      text: notify,
      options: {
        timeout: 1000,
      },
    });

    return false;
  };
  const handleCopyText = () => {
    handleClickCopy(
      stripHtml(
        getSecureMessageText(
          messageId,
          password,
          seconds,
          isPasswordLessPassword,
        ),
      ),
      'The text has been copied!',
    );
  };

  return (
    <>
      <Text>Use the temporary encrypted link below to retrieve the secret</Text>
      <Link>
        <ContentEditableStyled
          disabled={isMobile}
          content={getSecureMessageText(
            messageId,
            password,
            seconds,
            isPasswordLessPassword,
          )}
          handleClick={isMobile ? handleCopyText : Function.prototype}
        />
      </Link>
      <Row>
        <Checkbox
          checked={isPasswordLessPassword}
          value={isPasswordLessPassword}
          onChange={handleChangeCustomPassword}
        >
          Make a passwordless link
        </Checkbox>
      </Row>
      <ButtonsWrapper>
        <CopyAllButton icon="copy" onClick={handleCopyText}>
          Copy the text
        </CopyAllButton>
        <Button
          icon="link"
          color="white"
          onClick={() =>
            handleClickCopy(
              generateMessageLink(messageId, password, isPasswordLessPassword),
              'The link has been copied!',
            )
          }
        >
          Copy the {isPasswordLessPassword ? `passwordless` : ``} link
        </Button>
        <CreateNewButton color="transparent" onClick={onClickReturn}>
          Create New Secure Message
        </CreateNewButton>
      </ButtonsWrapper>
    </>
  );
};

export const SecureMessageLink = withNotification(SecureMessageLinkComponent);
