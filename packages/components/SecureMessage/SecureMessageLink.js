import React, { useState, memo } from 'react';
import { useEffectOnce } from 'react-use';
import copy from 'copy-text-to-clipboard';
import { Checkbox } from '@caesar/components';
import {
  useMedia,
  useShare as canShare,
  useNotification,
} from '@caesar/common/hooks';
import {
  generateMessageLink,
  getSecureMessageText,
  stripHtml,
  getShareData,
  dummyShareData,
} from './common';
import {
  ButtonsWrapper,
  ActionButton,
  CreateNewButton,
  Link,
  Text,
  Row,
  ContentEditableStyled,
} from './styles';

const SecureMessageLinkComponent = ({
  messageId = '',
  password = '',
  seconds = 0,
  onClickReturn,
}) => {
  const notification = useNotification();

  useEffectOnce(() => {
    notification.hide();
  });

  const { isMobile } = useMedia();
  const [isPasswordLess, setPasswordLess] = useState(false);
  const handleChangePasswordless = () => {
    setPasswordLess(!isPasswordLess);
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
        getSecureMessageText({
          messageId,
          password,
          seconds,
          isPasswordLess,
        }),
      ),
      'The text has been copied!',
    );
  };

  const handleShareClick = () => {
    const shareData = getShareData({
      messageId,
      password,
      seconds,
      isPasswordLess,
    });
    if (canShare(shareData)) {
      navigator
        .share(shareData)
        .then(() =>
          notification.show({
            text: 'The message has been shared!',
            options: {
              timeout: 1000,
            },
          }),
        )
        // eslint-disable-next-line no-console
        .catch(error => console.error('Sharing failed', error));
    } else {
      // eslint-disable-next-line no-console
      console.error(`Your system doesn't support sharing files.`);
    }
  };

  return (
    <>
      <Text>Use the temporary encrypted link below to retrieve the secret</Text>
      <Link>
        <ContentEditableStyled
          disabled={isMobile}
          content={getSecureMessageText({
            messageId,
            password,
            seconds,
            isPasswordLess,
          })}
          handleClick={isMobile ? handleCopyText : Function.prototype}
        />
      </Link>
      <Row>
        <Checkbox
          checked={isPasswordLess}
          value={isPasswordLess}
          onChange={handleChangePasswordless}
        >
          Make a passwordless link
        </Checkbox>
      </Row>
      <ButtonsWrapper>
        <ActionButton icon="copy" onClick={handleCopyText}>
          Copy the text
        </ActionButton>
        <ActionButton
          icon="link"
          color="white"
          onClick={() =>
            handleClickCopy(
              generateMessageLink({
                messageId,
                password,
                isPasswordLess,
              }),
              'The link has been copied!',
            )
          }
        >
          Copy the {isPasswordLess ? `passwordless` : ``} link
        </ActionButton>
        {canShare(dummyShareData) && (
          <ActionButton color="white" icon="share" onClick={handleShareClick} />
        )}
        <CreateNewButton color="transparent" onClick={onClickReturn}>
          Create New Secure Message
        </CreateNewButton>
      </ButtonsWrapper>
    </>
  );
};

export const SecureMessageLink = memo(SecureMessageLinkComponent);
